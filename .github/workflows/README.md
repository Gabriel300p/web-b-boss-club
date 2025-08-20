# 🚀 CI/CD Pipeline Configuration

Este diretório contém a configuração completa do pipeline de CI/CD para o projeto Centro Educacional Alfa.

## 📋 Overview

### 🔍 Workflows Disponíveis

1. **`ci.yml`** - Continuous Integration
2. **`deploy.yml`** - Continuous Deployment
3. **`cleanup.yml`** - Manutenção e limpeza

---

## 🔍 **CI - Quality Assurance**

### ✅ **Verificações Automáticas**

- **Lint**: ESLint + regras de código
- **Format**: Prettier para formatação
- **Type Check**: TypeScript verification
- **Tests**: Vitest com coverage
- **Build**: Verificação de build
- **Security**: Audit de dependências
- **Performance**: Lighthouse CI (em PRs)

### 🎯 **Quando Executa**

- Push para `main` ou `develop`
- Pull Requests para `main` ou `develop`

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
