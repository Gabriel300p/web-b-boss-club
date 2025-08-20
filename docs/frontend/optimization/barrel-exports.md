# 📋 Barrel Exports Strategy Guide

## 🎯 Overview

This document outlines our strategic approach to barrel exports for better tree-shaking, performance, and maintainability.

## ✅ New Barrel Export Strategy

### 🔧 When to Use Barrel Exports

- **Multiple related imports**: When importing 2+ items together frequently
- **Public APIs**: Main feature exports for clean external imports
- **Commonly paired components**: UI components often used together

### ❌ When to Use Direct Imports

- **Single imports**: One component/hook/utility at a time
- **Better tree-shaking**: Explicit dependencies
- **Performance-critical**: Avoiding unnecessary bundle size

## 📁 Feature-Based Examples

### ✅ Good: Strategic Barrel Export

```typescript
// Multiple related items frequently imported together
import {
  ModalComunicacao,
  ModalDeleteConfirm,
} from "@features/comunicacoes/components";

// Public API usage
import {
  ComunicacoesPage,
  comunicacaoSchema,
  type ComunicacaoFormData,
} from "@features/comunicacoes";
```

### ✅ Better: Direct Import for Single Items

```typescript
// Single component import - better tree-shaking
import { DataTable } from "@features/comunicacoes/components/DataTable";

// Specific hook import - explicit dependency
import { useComunicacoes } from "@features/comunicacoes/hooks/useComunicacoes";

// Specific service import
import { comunicacaoService } from "@features/comunicacoes/services/comunicacao.service";
```

## 🏗️ Current Structure

### 🎯 Features (`/src/features/[feature]/index.ts`)

```typescript
// ✅ Public API exports only
export { FeaturePage } from "./pages/FeaturePage";
export { featureSchema, type FeatureFormData } from "./schemas/feature.schemas";
export type { Feature, FeatureForm } from "./types/feature";

// ❌ No internal implementation details
```

### 🎯 Shared Components (`/src/shared/components/index.ts`)

```typescript
// ✅ Most frequently used components only
export { Button } from "./ui/button";
export { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
export { LoadingSpinner } from "./common/LoadingSpinner";

// ❌ Not all components (use direct imports)
```

### 🎯 Store (`/src/app/store/index.ts`)

```typescript
// ✅ Main hooks and types
export { useAuthStore, useAppStore } from "./";
export type { AuthStore, AppStore, User } from "./";

// ❌ Internal state interfaces
```

## 📊 Benefits Achieved

### 🚀 Performance

- **Smaller bundles**: Tree-shaking eliminates unused exports
- **Faster builds**: Less module resolution overhead
- **Better caching**: More granular dependency tracking

### 🔧 Developer Experience

- **Explicit dependencies**: Clear what each file uses
- **Better IDE support**: Faster autocomplete and go-to-definition
- **Easier refactoring**: Clear import relationships

### 🛠️ Maintainability

- **Clear public APIs**: Feature boundaries well-defined
- **Reduced coupling**: Less accidental cross-dependencies
- **Better documentation**: Explicit export strategy

## 🔍 Migration Examples

### Before (Over-exposed barrel exports)

```typescript
// ❌ Too broad - exports everything
export * from "./components";
export * from "./hooks";
export * from "./services";

// Usage: unclear what's actually needed
import {
  SomeInternalComponent,
  SomeInternalHook,
  SomeInternalUtil,
} from "@features/comunicacoes";
```

### After (Strategic barrel exports)

```typescript
// ✅ Strategic - only public API
export { ComunicacoesPage } from "./pages/ComunicacoesPage";
export { comunicacaoSchema } from "./schemas/comunicacao.schemas";

// Usage: clear intent, better performance
import { ComunicacoesPage } from "@features/comunicacoes";
import { DataTable } from "@features/comunicacoes/components/DataTable";
```

## 📝 Guidelines for New Code

1. **Start with direct imports** - always prefer explicit imports
2. **Group when patterns emerge** - create barrel exports when you see 2+ items imported together frequently
3. **Keep barrel exports minimal** - only truly public/commonly-used items
4. **Document the strategy** - add comments explaining the export choices
5. **Review regularly** - remove unused barrel exports during refactoring

## 🎯 Next Steps

This barrel export optimization sets the foundation for:

- **Code splitting implementation**
- **Better bundle analysis**
- **Performance monitoring**
- **Cleaner architecture boundaries**
