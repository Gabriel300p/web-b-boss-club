# 🛠️ Scripts de Desenvolvimento

Este diretório contém scripts úteis para acelerar o desenvolvimento.

## 📁 Scripts Disponíveis

### `create-feature.ps1`
Cria uma nova feature baseada no template `_template`.

```bash
# Windows (PowerShell)
.\scripts\create-feature.ps1 -FeatureName "minha-feature"

# Alternativo
node scripts/create-feature.js minha-feature
```

### `fix-imports.ps1`
Corrige imports relativos para usar aliases.

```bash
.\scripts\fix-imports.ps1
```

### `check-types.ps1`
Verifica tipos TypeScript em todos os arquivos.

```bash
.\scripts\check-types.ps1
```

### `analyze-bundle.ps1`
Analisa o bundle de produção.

```bash
.\scripts\analyze-bundle.ps1
```

## 🎯 Uso Recomendado

1. **Nova Feature**: Use `create-feature.ps1`
2. **Após mover arquivos**: Use `fix-imports.ps1`
3. **Antes de commit**: Use `check-types.ps1`
4. **Otimização**: Use `analyze-bundle.ps1`
