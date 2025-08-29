# � GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para o projeto B-Boss Club.

## 📋 Workflows Ativos

### 🔍 CI - Quality Assurance (`ci.yml`)

Executa verificações de qualidade a cada push e pull request:

- **🧪 Quality Checks**: Lint, formatação, type check e testes
- **🏗️ Build Verification**: Verificação de build da aplicação
- **🔒 Security Audit**: Auditoria de dependências
- **🚦 Lighthouse Audit**: Análise de performance (apenas em PRs)

### ✅ O que está funcionando:
- ✅ Testes automatizados
- ✅ Verificação de lint e formatação
- ✅ Type checking
- ✅ Build verification
- ✅ Security audit
- ✅ Coverage reports

## 🚀 Deploy

### Vercel (Ativo)
O deploy é feito automaticamente pela Vercel quando há push para:
- `main` → Produção
- `develop` → Preview

### AWS (Preparado mas Desabilitado)
Há uma estrutura preparada no `ci.yml` para deploy em AWS S3 + CloudFront.

#### Para ativar o deploy AWS:

1. **Descomente** a seção `deploy-aws` no arquivo `ci.yml`
2. **Configure os secrets** no GitHub:
   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION (opcional, padrão: us-east-1)
   AWS_S3_BUCKET
   AWS_CLOUDFRONT_DISTRIBUTION_ID (opcional)
   ```
3. **Certifique-se** que o bucket S3 e CloudFront estão configurados

## 🗑️ Arquivos Removidos

- `deploy.yml` - Removido por conflitos com deploy automático da Vercel
- `cleanup.yml` - Removido por dependências do Vercel CLI

## 🔧 Scripts Ajustados

- `pnpm format --check` → `pnpm format:check`
- Removido `pnpm build:analyze` (não disponível)
- Simplificado audit de vulnerabilidades

## 📊 Monitoring

- **Coverage**: Upload para Codecov
- **Artifacts**: Build artifacts mantidos por 7 dias
- **Cache**: Dependencies e build cache otimizado

### 📊 **Métricas**

- **Test Coverage**: Upload para Codecov
- **Bundle Analysis**: Análise de tamanho
- **Performance Score**: Lighthouse metrics

---

## 🚀 **CD - Deployment**

### 🌍 **Ambientes**

#### 🔍 **Preview (Homolog)**

- **Branch**: `develop`
- **URL**: Dinâmica (Vercel preview)
- **Objetivo**: Testes e validação

#### 🌟 **Production**

- **Branch**: `main`
- **URL**: Fixa (seu domínio)
- **Objetivo**: Release final

### 🔄 **Processo de Deploy**

1. **Aguarda CI passar**
2. **Build otimizado**
3. **Deploy para Vercel**
4. **Comentários automáticos** (PRs)
5. **Release notes** (produção)
6. **Rollback automático** (se falhar)

---

## 🧹 **Cleanup - Manutenção**

### 🗑️ **Limpeza Automática**

- **Deployments antigos**: >7 dias
- **Artifacts**: >7 dias
- **Health checks**: Produção

### ⏰ **Agendamento**

- **Frequência**: Semanal (domingo 02:00 UTC)
- **Manual**: Via workflow_dispatch

---

## ⚙️ **Setup Necessário**

### 🔐 **GitHub Secrets**

Configure estes secrets no seu repositório:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Optional: Para coverage reports
CODECOV_TOKEN=your_codecov_token
```

### 🌐 **Vercel Setup**

1. **Conecte o repositório** ao Vercel
2. **Configure os ambientes**:
   - `preview` para develop branch
   - `production` para main branch
3. **Obtenha os IDs** necessários

### 📝 **URLs para Configurar**

Atualize nos workflows:

```yaml
# deploy.yml - linha 54
url: https://your-production-domain.vercel.app

# cleanup.yml - linhas com health check
PROD_URL="https://your-production-domain.vercel.app"
```

---

## 🔧 **Configurações Personalizáveis**

### 📊 **Lighthouse Thresholds**

Arquivo: `lighthouserc.json`

```json
{
  "assert": {
    "assertions": {
      "categories:performance": ["warn", { "minScore": 0.85 }],
      "categories:accessibility": ["error", { "minScore": 0.9 }]
    }
  }
}
```

### ⏱️ **Timeouts**

- **Quality Checks**: 15min
- **Build**: 10min
- **Deploy**: 15min
- **Cleanup**: 10min

### 🎯 **Node.js Version**

Padrão: **Node 20.x** com **pnpm 9**

---

## 🚦 **Status Badges**

Adicione ao README.md:

```markdown
[![CI](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/workflows/🔍%20CI%20-%20Quality%20Assurance/badge.svg)](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/actions)
[![Deploy](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/workflows/🚀%20CD%20-%20Deploy/badge.svg)](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/actions)
```

---

## 🐛 **Troubleshooting**

### ❌ **Build Failing**

1. Verifique os logs no Actions
2. Execute localmente: `pnpm build`
3. Confirme todas as dependências

### 🚫 **Deploy Failing**

1. Verifique os secrets do Vercel
2. Confirme conexão repo ↔ Vercel
3. Teste deploy manual

### ⚠️ **Tests Failing**

1. Execute localmente: `pnpm test:run`
2. Verifique coverage: `pnpm test:coverage`
3. Atualize snapshots se necessário

---

## 📈 **Próximos Passos**

1. **Configure os secrets** no GitHub
2. **Conecte ao Vercel**
3. **Teste o primeiro deploy**
4. **Personalize as URLs**
5. **Monitore os workflows**

---

_📝 Documentação atualizada em: August 5, 2025_  
_🔄 Versão: 1.0_  
_👤 Preparado para: Centro Educacional Alfa_
