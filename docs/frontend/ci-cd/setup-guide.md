# 🔧 CI/CD Setup Guide

## ✅ **CI/CD Pipeline Criado com Sucesso!**

O pipeline completo de CI/CD foi configurado com:

- ✅ **GitHub Actions** para validação e deployment
- ✅ **Vercel** para hosting e preview deploys
- ✅ **Lighthouse** para performance monitoring
- ✅ **Security audits** automáticos
- ✅ **Rollback** automático em falhas

---

## 🚀 **Próximos Passos para Ativação**

### 1️⃣ **Setup do Vercel**

1. **Conecte o repositório** ao Vercel:
   - Vá para [vercel.com](https://vercel.com)
   - Import o repositório `Gabriel300p/challenge-3-centro-educacional-alfa`
   - Configure o projeto

2. **Obtenha as credenciais** necessárias:

   ```bash
   # No terminal, após instalar Vercel CLI:
   npm i -g vercel
   vercel login
   vercel link

   # Isso vai mostrar:
   # - VERCEL_ORG_ID
   # - VERCEL_PROJECT_ID
   ```

3. **Configure os ambientes** no Vercel:
   - **Preview**: Branch `develop`
   - **Production**: Branch `main`

### 2️⃣ **GitHub Secrets Configuration**

Vá para: **Settings → Secrets and variables → Actions**

Configure estes secrets:

```bash
VERCEL_TOKEN=your_vercel_token          # Vercel → Settings → Tokens
VERCEL_ORG_ID=your_org_id              # Obtido com vercel link
VERCEL_PROJECT_ID=your_project_id      # Obtido com vercel link
```

**Opcional (para coverage reports):**

```bash
CODECOV_TOKEN=your_codecov_token       # codecov.io
```

### 3️⃣ **Teste o Pipeline**

1. **Faça um commit** em uma branch:

   ```bash
   git checkout -b test/ci-setup
   git add .
   git commit -m "🚀 CI/CD: Setup inicial do pipeline"
   git push origin test/ci-setup
   ```

2. **Crie um Pull Request** para `develop`

3. **Verifique se roda**:
   - ✅ CI checks passando
   - ✅ Preview deploy criado
   - ✅ Comentário automático no PR

### 4️⃣ **Atualize URLs de Produção**

Edite estes arquivos após obter a URL do Vercel:

**`.github/workflows/deploy.yml` (linha 54):**

```yaml
url: https://seu-projeto.vercel.app
```

**`.github/workflows/cleanup.yml` (linhas de health check):**

```bash
PROD_URL="https://seu-projeto.vercel.app"
```

---

## 📊 **Como Funciona**

### 🔍 **CI Pipeline (Qualidade)**

```
Push/PR → Lint → Tests → Build → Security → Lighthouse → ✅
```

### 🚀 **CD Pipeline (Deploy)**

```
develop → Preview Deploy → Comment in PR
main → Production Deploy → Release Notes → Health Check
```

### 🧹 **Manutenção**

```
Weekly → Cleanup old deployments → Health checks
```

---

## 🎯 **Branch Strategy**

```
main (produção) ← merge de develop
↑
develop (homolog) ← merge de feature branches
↑
feature/sua-feature
```

### 📝 **Workflow Recomendado**

1. **Desenvolva** em `feature/nome-da-feature`
2. **Abra PR** para `develop` → Deploy automático para preview
3. **Teste** o preview, ajuste se necessário
4. **Merge** para `develop` quando aprovado
5. **Merge** `develop` → `main` para release em produção

---

## 🔧 **Comandos Disponíveis**

Foram adicionados ao `package.json`:

```json
{
  "scripts": {
    "format:check": "prettier --check .", // Para CI
    "build:analyze": "cross-env ANALYZE=true tsc -b && vite build" // Bundle analysis
  }
}
```

---

## 🚦 **Status Badges**

Adicione ao README principal:

```markdown
[![CI](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/workflows/🔍%20CI%20-%20Quality%20Assurance/badge.svg)](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/actions)

[![Deploy](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/workflows/🚀%20CD%20-%20Deploy/badge.svg)](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa/actions)
```

---

## 🐛 **Troubleshooting**

### ❌ **"Error: Vercel token not found"**

- Configure o secret `VERCEL_TOKEN` no GitHub

### ❌ **"Build failed"**

- Execute `pnpm build` localmente
- Verifique se todos os testes passam: `pnpm test:run`

### ❌ **"Deployment not found"**

- Confirme que o projeto está conectado no Vercel
- Verifique se `VERCEL_PROJECT_ID` está correto

---

## ✨ **Features Inclusas**

- 🔍 **Análise de qualidade** completa
- 📊 **Performance monitoring** com Lighthouse
- 🛡️ **Security headers** otimizados
- 📦 **Bundle analysis** automática
- 🔄 **Rollback automático** em falhas
- 💬 **Comentários automáticos** em PRs
- 🏷️ **Release notes** automáticas
- 🧹 **Cleanup** de deployments antigos

---

## 🎉 **Pronto para o Próximo Passo!**

Uma vez que o CI/CD estiver funcionando, podemos partir para a **implementação do Sistema de Toast**!

O pipeline garantirá que todas as mudanças sejam validadas automaticamente. 🚀

---

_📝 Setup guide criado em: August 5, 2025_  
_🎯 Status: CI/CD Pipeline configurado e pronto para uso_
