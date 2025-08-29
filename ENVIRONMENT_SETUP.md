# 🌐 Configuração de Ambiente - B-Boss Club

## 🔧 Como Configurar o Ambiente

### 📁 Arquivo de Configuração

O ambiente é configurado no arquivo: `src/shared/config/environment.ts`

### 🎯 Detecção Automática

**✅ O ambiente é detectado automaticamente!**

- **Em desenvolvimento** (localhost): Usa `http://localhost:3002`
- **Em produção**: Usa `https://lhsmivjozemhghmzjxrg.supabase.co`

### 🔧 Forçar Ambiente Específico (Opcional)

Se quiser forçar um ambiente específico, edite o arquivo:

```typescript
// 🔧 FORÇAR AMBIENTE ESPECÍFICO (opcional):
export const FORCE_ENVIRONMENT = "local" as const; // "local" ou "production"
```

## 🚀 Como Funciona

### Detecção Automática

O sistema detecta o ambiente baseado na URL:

- `localhost` → **AMBIENTE LOCAL**
- `127.0.0.1` → **AMBIENTE LOCAL**
- Qualquer outro domínio → **AMBIENTE PRODUÇÃO**

### Fallback Seguro

Se não conseguir detectar, usa **PRODUÇÃO** por padrão (mais seguro).

## 📝 Logs de Confirmação

Ao recarregar a página, você verá no console:

```
🌐 Ambiente selecionado: local
🔗 API URL: http://localhost:3002
✅ Usando backend LOCAL (localhost:3002)
```

## ⚠️ Importante

- **Sempre recarregue a página** após mudar o ambiente
- **Verifique o console** para confirmar qual URL está sendo usada
- **Para desenvolvimento local**: Certifique-se de que o backend está rodando na porta 3002

## 🔍 Verificação

Para verificar se está funcionando:

1. Abra o console do navegador (F12)
2. Recarregue a página
3. Tente fazer login
4. Verifique os logs de request/response

## 🆘 Problemas Comuns

### ❌ "Cannot connect to localhost:3002"

- **Solução**: Inicie o backend local na porta 3002
- **Comando**: `cd ../api-b-boss-club && npm run dev`

### ❌ "Using production instead of local"

- **Solução**: Verifique se salvou o arquivo `environment.ts`
- **Solução**: Recarregue a página após salvar

### ❌ "Login button not working"

- **Solução**: Verifique o console para erros de conexão
- **Solução**: Confirme se a URL está correta nos logs
