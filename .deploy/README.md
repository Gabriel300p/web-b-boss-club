# 🚀 Frontend Deployment Guide - AWS S3 + CloudFront

## 📋 Overview

Deploy do frontend React/Vite usando **AWS S3 (storage) + CloudFront (CDN)** com CI/CD automático via GitHub Actions.

### Arquitetura

```
┌─────────────┐
│   GitHub    │
│    (main)   │
└──────┬──────┘
       │ push
       ▼
┌─────────────────┐
│ GitHub Actions  │
│  1. Build       │
│  2. Deploy S3   │
│  3. Invalidate  │
└──────┬──────────┘
       │
       ▼
┌──────────────┐        ┌──────────────┐
│   S3 Bucket  │◄───────│  CloudFront  │
│ bboss-web-   │        │  (CDN HTTPS) │
│    prod      │        └───────┬──────┘
└──────────────┘                │
                                ▼
                         👤 Usuários
                      (Global, HTTPS)
```

---

## 🎯 Por que S3 + CloudFront?

| Feature | AWS Amplify | S3 + CloudFront | Elastic Beanstalk |
|---------|-------------|-----------------|-------------------|
| **Automação CLI** | ❌ Console web | ✅ 100% scriptável | ✅ Scriptável |
| **Free Tier Bandwidth** | 15GB/mês | **1TB/mês** | ❌ Sem free tier |
| **HTTPS** | ✅ Grátis | ✅ Grátis | ⚠️ Requer ALB |
| **CI/CD** | ✅ Built-in | ✅ GitHub Actions | ✅ GitHub Actions |
| **Custo** | $0.023/GB | $0.023/GB | ~$10/mês |
| **Setup** | Fácil (GUI) | Médio (CLI) | Complexo |

**Escolhemos S3 + CloudFront:** Máximo bandwidth grátis + total controle via CLI.

---

## 🔧 Pré-requisitos

### 1. AWS CLI Instalado

```powershell
# Verificar instalação
aws --version

# Se não tiver, instalar:
# https://aws.amazon.com/cli/
```

### 2. AWS Credentials Configuradas

```powershell
# Usar mesmas credenciais do backend (IAM user: github-actions-deploy)
aws configure
# AWS Access Key ID: [Sua access key do IAM user]
# AWS Secret Access Key: [Sua secret key do IAM user]
# Default region: us-east-1
# Default output format: json
```

### 3. PNPM Instalado

```powershell
# Verificar
pnpm --version

# Se não tiver
npm install -g pnpm
```

---

## 🚀 Deploy Manual (Primeira vez)

### Passo 1: Setup Inicial (Criar recursos AWS)

```powershell
# Na pasta web-b-boss-club
cd "C:\Desenvolvimento\Pessoal\B-Boss Club\web-b-boss-club"

# Executar setup (cria S3 + CloudFront)
.\.deploy\aws\deploy-frontend-aws.ps1 -SetupOnly
```

**O que esse comando faz:**
1. ✅ Cria bucket S3: `bboss-web-prod`
2. ✅ Configura static website hosting
3. ✅ Define bucket policy (public read)
4. ✅ Cria distribuição CloudFront (HTTPS + CDN)
5. ✅ Salva Distribution ID em `.cloudfront-distribution-id.txt`

**Tempo:** ~10-15 minutos (CloudFront deployment global)

**Saída esperada:**
```
========================================
✓ SETUP COMPLETE!
========================================

AWS resources are configured:
  • S3 Bucket: bboss-web-prod
  • CloudFront ID: E1ABCDEFGHIJ2K
  • CloudFront URL: https://d123abc456def.cloudfront.net
```

⚠️ **ANOTE O CLOUDFRONT DISTRIBUTION ID!** Você vai precisar para o GitHub Actions.

---

### Passo 2: Configurar Variáveis de Ambiente

Criar arquivo `.env.production` (já criado):

```bash
VITE_API_URL=http://52.3.163.218
VITE_SUPABASE_URL=https://lhsmivjozemhghmzjxrg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

### Passo 3: Deploy Completo (Build + Upload)

```powershell
# Build e deploy
.\.deploy\aws\deploy-frontend-aws.ps1
```

**O que esse comando faz:**
1. ✅ Instala dependências (`pnpm install`)
2. ✅ Build da aplicação (`pnpm build`)
3. ✅ Upload para S3 com cache headers corretos
4. ✅ Invalidate CloudFront cache
5. ✅ Mostra URL final

**Tempo:** ~3-5 minutos

**Saída esperada:**
```
========================================
✓ DEPLOYMENT SUCCESSFUL!
========================================

Deployment Details:
  • S3 Bucket: bboss-web-prod
  • CloudFront URL: https://d123abc456def.cloudfront.net
  • Build Size: 2.5 MB

Next Steps:
  1. Wait 1-5 minutes for cache invalidation
  2. Access your site: https://d123abc456def.cloudfront.net
```

---

## 🤖 CI/CD Automático (GitHub Actions)

### Passo 1: Configurar GitHub Secrets

1. Ir para: `https://github.com/Gabriel300p/web-b-boss-club/settings/secrets/actions`

2. Adicionar **Secrets** (clique em "New repository secret"):

| Name | Value | Onde pegar |
|------|-------|------------|
| `AWS_ACCESS_KEY_ID` | `[Sua AWS Access Key]` | Mesmas do backend (IAM user) |
| `AWS_SECRET_ACCESS_KEY` | `[Sua AWS Secret Key]` | Mesmas do backend (IAM user) |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E1ABCDEFGHIJ2K` | Do setup inicial (exemplo) |
| `VITE_API_URL` | `http://52.3.163.218` | Backend AWS |
| `VITE_SUPABASE_URL` | `https://lhs...` | Do .env |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Do .env |


⚠️ **IMPORTANTE:** Os valores VITE_* são públicos (vão para o bundle do browser), mas é boa prática usar secrets.

---

### Passo 2: Commit e Push

Agora, **todo push na branch main** dispara deploy automático:

```powershell
# Fazer mudanças no código
git add .
git commit -m "feat: add new feature"
git push origin main
```

**GitHub Actions vai:**
1. ✅ Checkout do código
2. ✅ Setup Node.js 18 + PNPM
3. ✅ Instalar dependências
4. ✅ Build com variáveis injetadas
5. ✅ Upload para S3
6. ✅ Invalidar cache CloudFront
7. ✅ Mostrar URL no Summary

**Tempo:** ~5-8 minutos

---

### Monitorar Deploy

1. GitHub → `web-b-boss-club` → **Actions**
2. Clicar no workflow rodando
3. Ver logs em tempo real
4. Summary final mostra CloudFront URL

---

## 🔗 Passo 4: Configurar CORS no Backend

Depois do primeiro deploy, adicionar URL CloudFront no backend:

1. **AWS Console** → **Elastic Beanstalk**
2. Environment: `bboss-api-prod`
3. **Configuration** → **Software** → **Edit**
4. Variável: `FRONTEND_URLS`

**Valor atual:**
```
(vazio ou http://localhost:5173)
```

**Novo valor:**
```
http://localhost:5173,https://d123abc456def.cloudfront.net
```

⚠️ Substituir pela URL real do CloudFront!

5. **Apply** → Aguardar restart (~2min)

---

## 🧪 Testes Pós-Deploy

### 1. Acessar Frontend

```
https://d123abc456def.cloudfront.net
```

**Verificar:**
- ✅ Site carrega
- ✅ Assets (CSS, JS, imagens) funcionam
- ✅ HTTPS funciona
- ✅ Console sem erros

---

### 2. Testar API Integration

1. Abrir **DevTools** (F12)
2. Ir para **Network** tab
3. Fazer login
4. **Verificar:**
   - ✅ Requests vão para `http://52.3.163.218`
   - ✅ CORS não bloqueia (status 200, não 403)
   - ✅ Auth funciona

---

### 3. Testar Navegação SPA

1. Navegar para `/barbershop-staff`
2. **Recarregar página (F5)**
3. **Verificar:**
   - ✅ Não dá 404
   - ✅ Página carrega corretamente

(CloudFront redirect 404 → index.html configurado automaticamente)

---

## 📊 Comandos Úteis

### Ver status do bucket S3

```powershell
aws s3 ls s3://bboss-web-prod/ --recursive
```

### Ver tamanho do bucket

```powershell
aws s3 ls s3://bboss-web-prod/ --recursive --summarize --human-readable
```

### Ver distribuições CloudFront

```powershell
aws cloudfront list-distributions --query 'DistributionList.Items[].{ID:Id,Domain:DomainName,Status:Status}' --output table
```

### Invalidar cache manualmente

```powershell
$DIST_ID = Get-Content .cloudfront-distribution-id.txt
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

### Fazer deploy sem rebuild

```powershell
.\.deploy\aws\deploy-frontend-aws.ps1 -SkipBuild
```

---

## 🔧 Troubleshooting

### Erro: "Bucket already exists"

**Causa:** Bucket com esse nome já existe (global na AWS).

**Solução:**
```powershell
# Tentar nome diferente
.\.deploy\aws\deploy-frontend-aws.ps1 -BucketName "bboss-web-prod-v2"
```

---

### Erro: "Access Denied" ao criar CloudFront

**Causa:** IAM user sem permissão CloudFront.

**Solução:**
```powershell
# Adicionar policy ao IAM user github-actions-deploy
aws iam attach-user-policy --user-name github-actions-deploy --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess
```

---

### Site mostra versão antiga após deploy

**Causa:** Cache do CloudFront não invalidado.

**Solução:**
```powershell
# Invalidar cache
$DIST_ID = Get-Content .cloudfront-distribution-id.txt
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"

# Aguardar 1-5 minutos
```

---

### CORS Error no browser

**Sintoma:**
```
Access to fetch at 'http://52.3.163.218/auth/login' from origin 'https://d123abc.cloudfront.net' has been blocked by CORS policy
```

**Causa:** CloudFront URL não está em `FRONTEND_URLS` do backend.

**Solução:**
1. Elastic Beanstalk → `bboss-api-prod` → Configuration
2. Adicionar URL CloudFront em `FRONTEND_URLS`
3. Apply e aguardar restart

---

### Build falha com "out of memory"

**Causa:** Build Vite muito pesado.

**Solução (local):**
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
pnpm run build
```

**Solução (GitHub Actions):**
Já configurado no workflow com `NODE_OPTIONS`.

---

## 💰 Custos e Free Tier

### AWS Free Tier (12 meses)

**S3:**
- ✅ 5GB storage
- ✅ 20,000 GET requests/mês
- ✅ 2,000 PUT requests/mês

**CloudFront:**
- ✅ 1TB data transfer out/mês
- ✅ 10,000,000 HTTPS requests/mês

### Após Free Tier

**S3:**
- Storage: $0.023/GB/mês
- GET requests: $0.0004 por 1,000
- PUT requests: $0.005 por 1,000

**CloudFront:**
- Data transfer: $0.085/GB (primeiros 10TB)
- HTTPS requests: $0.0100 por 10,000

**Estimativa mensal (após free tier):**
- Site pequeno (2GB storage, 50GB bandwidth): ~$5/mês
- Site médio (5GB storage, 200GB bandwidth): ~$20/mês

---

## 🎯 Próximos Passos

### 1. Domínio Customizado (Opcional)

**Comprar domínio:**
- Registro.br: `bboss.com.br` ou similar
- Route 53: Gerenciamento DNS

**Configurar:**
1. Route 53 → Create Hosted Zone
2. Adicionar registro CNAME: `app.bboss.com.br` → CloudFront domain
3. CloudFront → Add custom domain
4. AWS Certificate Manager → Request SSL cert (grátis)

**Resultado:** `https://app.bboss.com.br` em vez de CloudFront domain.

---

### 2. SSL na API (Recomendado)

**Problema atual:**
- Frontend: HTTPS (CloudFront)
- Backend: HTTP (Elastic Beanstalk)
- Browsers mostram warning "Mixed Content"

**Solução:**
1. Criar Application Load Balancer
2. Adicionar certificado SSL (ACM)
3. ALB → Elastic Beanstalk
4. Resultado: `https://api.bboss.com.br`

---

### 3. Ambientes Múltiplos (Dev/Stage/Prod)

**Criar buckets adicionais:**
- `bboss-web-dev` → branch develop
- `bboss-web-stage` → branch stage
- `bboss-web-prod` → branch main

**GitHub Actions workflows:**
- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-stage.yml`
- `.github/workflows/deploy-production.yml`

---

### 4. Monitoramento

**CloudWatch:**
- CloudFront logs
- S3 access logs
- Alertas de erro

**Sentry:**
- Error tracking no frontend
- Performance monitoring

---

## 📚 Referências

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Developer Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [GitHub Actions AWS](https://github.com/aws-actions)

---

## ✅ Checklist de Deploy

Antes de considerar deploy completo:

- [ ] AWS CLI configurado
- [ ] S3 bucket criado (`bboss-web-prod`)
- [ ] CloudFront distribution criada
- [ ] Distribution ID salvo em `.cloudfront-distribution-id.txt`
- [ ] Build local funciona (`pnpm build`)
- [ ] Deploy manual testado e funcionando
- [ ] GitHub Secrets configurados (6 secrets)
- [ ] CI/CD testado (push main → deploy automático)
- [ ] CORS configurado no backend
- [ ] Frontend acessível via CloudFront URL
- [ ] Login funciona (API integration OK)
- [ ] Navegação SPA funciona (reload não dá 404)
- [ ] Console sem erros críticos

---

**Status:** ✅ Deploy infrastructure ready  
**Última atualização:** 2025-01-14
