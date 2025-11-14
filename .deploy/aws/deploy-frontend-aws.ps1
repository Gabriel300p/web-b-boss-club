# ============================================================================
# B-BOSS CLUB - Frontend AWS S3 + CloudFront Deployment Script
# ============================================================================
# 
# Purpose: Deploy React/Vite frontend to AWS S3 with CloudFront CDN
# Author: GitHub Copilot
# Date: 2025-01-14
# 
# Prerequisites:
# - AWS CLI installed and configured
# - PNPM installed
# - Bucket name: bboss-web-prod
# 
# Usage:
#   .\deploy-frontend-aws.ps1              # Full deployment
#   .\deploy-frontend-aws.ps1 -SkipBuild   # Deploy without building
#   .\deploy-frontend-aws.ps1 -SetupOnly   # Only create AWS resources
# 
# ============================================================================

param(
    [switch]$SkipBuild,
    [switch]$SetupOnly,
    [string]$BucketName = "bboss-web-prod",
    [string]$Region = "us-east-1"
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ErrorActionPreference = "Stop"
$BUILD_DIR = "dist"
$CLOUDFRONT_CONFIG_FILE = ".cloudfront-distribution-id.txt"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green $args }
function Write-Info { Write-ColorOutput Cyan $args }
function Write-Warning { Write-ColorOutput Yellow $args }
function Write-ErrorMsg { Write-ColorOutput Red $args }

# ============================================================================
# STEP 1: VALIDATE PREREQUISITES
# ============================================================================

Write-Info "`n========================================`n VALIDATING PREREQUISITES`n========================================"

# Check AWS CLI
Write-Info "`nChecking AWS CLI..."
try {
    $awsVersion = aws --version 2>&1
    Write-Success "✓ AWS CLI found: $awsVersion"
} catch {
    Write-ErrorMsg "✗ AWS CLI not found. Please install: https://aws.amazon.com/cli/"
    exit 1
}

# Check AWS credentials
Write-Info "`nChecking AWS credentials..."
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Success "✓ AWS credentials configured"
    Write-Info "  Account: $($identity.Account)"
    Write-Info "  User: $($identity.Arn)"
} catch {
    Write-ErrorMsg "✗ AWS credentials not configured. Run: aws configure"
    exit 1
}

# Check PNPM (only if not skipping build)
if (-not $SkipBuild -and -not $SetupOnly) {
    Write-Info "`nChecking PNPM..."
    try {
        $pnpmVersion = pnpm --version 2>&1
        Write-Success "✓ PNPM found: v$pnpmVersion"
    } catch {
        Write-ErrorMsg "✗ PNPM not found. Please install: npm install -g pnpm"
        exit 1
    }
}

# ============================================================================
# STEP 2: CREATE S3 BUCKET (if doesn't exist)
# ============================================================================

Write-Info "`n========================================`n CONFIGURING S3 BUCKET`n========================================"

Write-Info "`nChecking if bucket '$BucketName' exists..."
$bucketExists = $false
try {
    aws s3api head-bucket --bucket $BucketName --region $Region 2>&1 | Out-Null
    $bucketExists = $true
    Write-Success "✓ Bucket already exists: $BucketName"
} catch {
    Write-Info "Bucket does not exist. Creating..."
}

if (-not $bucketExists) {
    Write-Info "`nCreating S3 bucket '$BucketName'..."
    
    if ($Region -eq "us-east-1") {
        # us-east-1 doesn't need LocationConstraint
        aws s3api create-bucket --bucket $BucketName --region $Region
    } else {
        aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration LocationConstraint=$Region
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Bucket created successfully"
    } else {
        Write-ErrorMsg "✗ Failed to create bucket"
        exit 1
    }
}

# Configure bucket for static website hosting
Write-Info "`nConfiguring static website hosting..."
$websiteConfig = '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'

$websiteConfig | Out-File -FilePath "website-config.json" -Encoding utf8
aws s3api put-bucket-website --bucket $BucketName --website-configuration file://website-config.json
Remove-Item "website-config.json"

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ Static website hosting configured"
} else {
    Write-ErrorMsg "✗ Failed to configure website hosting"
    exit 1
}

# Configure bucket policy for public read access
Write-Info "`nConfiguring bucket policy for public access..."
$bucketPolicy = "{`"Version`":`"2012-10-17`",`"Statement`":[{`"Sid`":`"PublicReadGetObject`",`"Effect`":`"Allow`",`"Principal`":`"*`",`"Action`":`"s3:GetObject`",`"Resource`":`"arn:aws:s3:::$BucketName/*`"}]}"

$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding utf8
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
Remove-Item "bucket-policy.json"

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ Bucket policy configured (public read access)"
} else {
    Write-ErrorMsg "✗ Failed to configure bucket policy"
    exit 1
}

# Disable Block Public Access (required for public website)
Write-Info "`nDisabling Block Public Access..."
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ Public access enabled"
} else {
    Write-Warning "⚠ Failed to disable block public access (may already be disabled)"
}

# ============================================================================
# STEP 3: CREATE CLOUDFRONT DISTRIBUTION (if doesn't exist)
# ============================================================================

Write-Info "`n========================================`n CONFIGURING CLOUDFRONT CDN`n========================================"

$distributionId = $null

# Check if distribution ID is already saved
if (Test-Path $CLOUDFRONT_CONFIG_FILE) {
    $distributionId = Get-Content $CLOUDFRONT_CONFIG_FILE -Raw
    $distributionId = $distributionId.Trim()
    Write-Info "`nFound existing CloudFront distribution ID: $distributionId"
    
    # Verify it still exists
    try {
        $distInfo = aws cloudfront get-distribution --id $distributionId 2>&1 | ConvertFrom-Json
        Write-Success "✓ CloudFront distribution verified"
    } catch {
        Write-Warning "⚠ Saved distribution ID is invalid. Will create new one."
        $distributionId = $null
    }
}

if (-not $distributionId) {
    Write-Info "`nCreating CloudFront distribution (this may take 10-15 minutes)..."
    
    $originDomain = "$BucketName.s3-website-$Region.amazonaws.com"
    
    # Create CloudFront config as PowerShell object
    $timestamp = Get-Date -Format 'yyyyMMddHHmmss'
    $cloudfrontConfig = @{
        CallerReference = "bboss-web-$timestamp"
        Comment = "B-BOSS Club Frontend CDN"
        Enabled = $true
        Origins = @{
            Quantity = 1
            Items = @(
                @{
                    Id = "S3-$BucketName"
                    DomainName = $originDomain
                    CustomOriginConfig = @{
                        HTTPPort = 80
                        HTTPSPort = 443
                        OriginProtocolPolicy = "http-only"
                    }
                }
            )
        }
        DefaultRootObject = "index.html"
        DefaultCacheBehavior = @{
            TargetOriginId = "S3-$BucketName"
            ViewerProtocolPolicy = "redirect-to-https"
            AllowedMethods = @{
                Quantity = 2
                Items = @("GET", "HEAD")
                CachedMethods = @{
                    Quantity = 2
                    Items = @("GET", "HEAD")
                }
            }
            Compress = $true
            ForwardedValues = @{
                QueryString = $false
                Cookies = @{
                    Forward = "none"
                }
            }
            MinTTL = 0
            DefaultTTL = 86400
            MaxTTL = 31536000
        }
        CustomErrorResponses = @{
            Quantity = 1
            Items = @(
                @{
                    ErrorCode = 404
                    ResponsePagePath = "/index.html"
                    ResponseCode = "200"
                    ErrorCachingMinTTL = 300
                }
            )
        }
        PriceClass = "PriceClass_100"
    }
    
    # Convert to JSON and save
    $cloudfrontConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath "cloudfront-config.json" -Encoding utf8
    $result = aws cloudfront create-distribution --distribution-config file://cloudfront-config.json 2>&1 | ConvertFrom-Json
    Remove-Item "cloudfront-config.json"
    
    if ($result.Distribution.Id) {
        $distributionId = $result.Distribution.Id
        $cloudfrontDomain = $result.Distribution.DomainName
        
        # Save distribution ID for future use
        $distributionId | Out-File -FilePath $CLOUDFRONT_CONFIG_FILE -Encoding utf8
        
        Write-Success "✓ CloudFront distribution created!"
        Write-Info "  Distribution ID: $distributionId"
        Write-Info "  Domain: https://$cloudfrontDomain"
        Write-Warning "`n  ⚠ CloudFront is being deployed globally. This takes 10-15 minutes."
        Write-Warning "  ⚠ The site will be accessible at: https://$cloudfrontDomain"
    } else {
        Write-ErrorMsg "✗ Failed to create CloudFront distribution"
        Write-ErrorMsg $result
        exit 1
    }
} else {
    # Get existing distribution info
    $distInfo = aws cloudfront get-distribution --id $distributionId 2>&1 | ConvertFrom-Json
    $cloudfrontDomain = $distInfo.Distribution.DomainName
    $status = $distInfo.Distribution.Status
    
    Write-Info "  Domain: https://$cloudfrontDomain"
    Write-Info "  Status: $status"
}

# Exit if setup only
if ($SetupOnly) {
    Write-Success "`n========================================`nSETUP COMPLETE!`n========================================"
    Write-Info "`nAWS resources are configured:"
    Write-Info "  • S3 Bucket: $BucketName"
    Write-Info "  • CloudFront ID: $distributionId"
    Write-Info "  • CloudFront URL: https://$cloudfrontDomain"
    Write-Info "`nNext steps:"
    Write-Info "  1. Run deployment: .\deploy-frontend-aws.ps1"
    Write-Info "  2. Configure GitHub secrets with distribution ID"
    Write-Info "  3. Update backend CORS with CloudFront URL"
    exit 0
}

# ============================================================================
# STEP 4: BUILD APPLICATION
# ============================================================================

if (-not $SkipBuild) {
    Write-Info "`n========================================`n BUILDING APPLICATION`n========================================"
    
    Write-Info "`nInstalling dependencies..."
    pnpm install --frozen-lockfile
    
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "✗ Failed to install dependencies"
        exit 1
    }
    
    Write-Success "✓ Dependencies installed"
    
    Write-Info "`nBuilding application for production..."
    Write-Info "  Environment: production"
    Write-Info "  API URL: $env:VITE_API_URL (from environment)"
    
    pnpm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "✗ Build failed"
        exit 1
    }
    
    Write-Success "✓ Build completed successfully"
    
    # Check build output
    if (-not (Test-Path $BUILD_DIR)) {
        Write-ErrorMsg "✗ Build directory '$BUILD_DIR' not found"
        exit 1
    }
    
    $buildSize = (Get-ChildItem $BUILD_DIR -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Info "  Build size: $([math]::Round($buildSize, 2)) MB"
} else {
    Write-Warning "`nSkipping build (using existing build in '$BUILD_DIR')"
    
    if (-not (Test-Path $BUILD_DIR)) {
        Write-ErrorMsg "✗ Build directory '$BUILD_DIR' not found. Cannot skip build."
        exit 1
    }
}

# ============================================================================
# STEP 5: DEPLOY TO S3
# ============================================================================

Write-Info "`n========================================`n DEPLOYING TO S3`n========================================"

Write-Info "`nSyncing files to S3 bucket..."
Write-Info "  Bucket: s3://$BucketName"
Write-Info "  Source: $BUILD_DIR"

# Sync with cache control headers
aws s3 sync $BUILD_DIR s3://$BucketName/ `
    --delete `
    --cache-control "public, max-age=31536000" `
    --exclude "index.html" `
    --region $Region

# Upload index.html with no-cache (always fetch fresh)
aws s3 cp "$BUILD_DIR/index.html" "s3://$BucketName/index.html" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html" `
    --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ Files deployed to S3"
} else {
    Write-ErrorMsg "✗ Failed to deploy files"
    exit 1
}

# ============================================================================
# STEP 6: INVALIDATE CLOUDFRONT CACHE
# ============================================================================

Write-Info "`n========================================`n INVALIDATING CLOUDFRONT CACHE`n========================================"

Write-Info "`nCreating cache invalidation..."
Write-Info "  Distribution: $distributionId"

$invalidationResult = aws cloudfront create-invalidation `
    --distribution-id $distributionId `
    --paths "/*" 2>&1 | ConvertFrom-Json

if ($invalidationResult.Invalidation.Id) {
    Write-Success "✓ Cache invalidation created"
    Write-Info "  Invalidation ID: $($invalidationResult.Invalidation.Id)"
    Write-Info "  Status: $($invalidationResult.Invalidation.Status)"
    Write-Warning "  ⚠ Invalidation takes 1-5 minutes to complete"
} else {
    Write-ErrorMsg "✗ Failed to create invalidation"
    Write-ErrorMsg $invalidationResult
    exit 1
}

# ============================================================================
# DEPLOYMENT COMPLETE
# ============================================================================

Write-Success "`n========================================`n✓ DEPLOYMENT SUCCESSFUL!`n========================================"

Write-Info "`nDeployment Details:"
Write-Info "  • S3 Bucket: $BucketName"
Write-Info "  • Region: $Region"
Write-Info "  • CloudFront ID: $distributionId"
Write-Info "  • CloudFront URL: https://$cloudfrontDomain"
Write-Info "  • Build Size: $([math]::Round($buildSize, 2)) MB"

Write-Info "`nNext Steps:"
Write-Info "  1. Wait 1-5 minutes for cache invalidation"
Write-Info "  2. Access your site: https://$cloudfrontDomain"
Write-Info "  3. Update backend CORS (FRONTEND_URLS) with CloudFront URL"

Write-Warning "`n⚠ IMPORTANT:"
Write-Warning "  • Save CloudFront Distribution ID: $distributionId"
Write-Warning "  • Add to GitHub Secrets: CLOUDFRONT_DISTRIBUTION_ID"
Write-Warning "  • Add CloudFront URL to backend FRONTEND_URLS environment variable"

Write-Info "`nHealthcheck URLs:"
Write-Info "  • Frontend: https://$cloudfrontDomain"
Write-Info "  • Backend API: http://52.3.163.218/health"

Write-Success "`n🚀 Frontend is now live!`n"
