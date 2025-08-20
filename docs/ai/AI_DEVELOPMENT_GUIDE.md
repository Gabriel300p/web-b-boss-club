# 🤖 Guia de Desenvolvimento para IA

> **Guia especializado para assistentes de IA** trabalhando com o Template Default

---

## 🎯 **Objetivo Deste Guia**

Este template foi **especialmente preparado** para ser usado por assistentes de IA (como ChatGPT, Claude, etc.) para desenvolvimento eficiente e consistente. Todos os padrões, estruturas e convenções foram pensados para **máxima compreensibilidade** por sistemas de IA.

---

## 🧠 **Princípios para IA**

### ✅ **O que Este Template Oferece para IA**

1. **📁 Estrutura Previsível**
   - Padrões de naming consistentes
   - Organização hierárquica clara
   - Convenções bem documentadas

2. **🎯 Padrões Bem Definidos**
   - Cada tipo de arquivo tem localização específica
   - Templates de código reutilizáveis
   - Exemplos práticos abundantes

3. **🔍 Contexto Rico**
   - Comentários explicativos em código
   - Documentação inline
   - Tipos TypeScript descritivos

4. **⚡ Feedback Imediato**
   - TypeScript strict para validação
   - Testes automatizados
   - Linting rigoroso

---

## 🗺️ **Mapa Mental do Sistema**

### 🏗️ **Arquitetura Conceptual**
```
Template Default
├── 🎨 Frontend (React + TypeScript)
│   ├── 📦 Features (Modularização por domínio)
│   ├── 🔗 Shared (Recursos compartilhados)
│   ├── 🛣️ Routes (Roteamento declarativo)
│   └── 🌐 i18n (Internacionalização)
├── ⚙️ Backend (NestJS + TypeScript - Opcional)
├── 🤖 Automation (Scripts e ferramentas)
└── 📚 Documentation (Guias estruturados)
```

### 🎯 **Flow de Desenvolvimento para IA**
```
1. 📋 ANÁLISE → Entender o contexto e requisitos
2. 🎯 PLANEJAMENTO → Definir estrutura e abordagem
3. 🏗️ IMPLEMENTAÇÃO → Seguir padrões estabelecidos
4. ✅ VALIDAÇÃO → Testar e verificar funcionamento
5. 📝 DOCUMENTAÇÃO → Atualizar docs se necessário
```

---

## 🛠️ **Workflow Detalhado para IA**

### 📋 **FASE 1: Análise de Contexto**

#### **1.1 Identificar Tipo de Tarefa**
```typescript
// Tipos comuns de tarefa:
type TaskType = 
  | 'create_feature'      // Nova funcionalidade
  | 'modify_component'    // Alterar componente existente
  | 'fix_bug'            // Correção de erro
  | 'add_page'           // Nova página/rota
  | 'update_styling'     // Mudanças visuais
  | 'refactor'           // Reestruturação de código
  | 'add_tests';         // Adicionar testes
```

#### **1.2 Mapear Arquivos Relevantes**
```bash
# Para features → src/features/{feature-name}/
# Para componentes shared → src/shared/components/
# Para hooks → src/shared/hooks/ ou src/features/{feature}/hooks/
# Para utilitários → src/shared/lib/
# Para rotas → src/routes/
# Para testes → adjacente ao arquivo com .test.tsx
```

### 🎯 **FASE 2: Planejamento da Implementação**

#### **2.1 Escolher Padrão Apropriado**
```typescript
// Exemplo: Criando nova feature
interface FeatureStructure {
  name: string;              // Nome da feature (kebab-case)
  components: string[];      // Lista de componentes necessários
  hooks: string[];          // Hooks customizados
  services: string[];       // Serviços de API
  schemas: string[];        // Schemas de validação
  pages: string[];          // Páginas/rotas
}

// Exemplo concreto:
const productFeature: FeatureStructure = {
  name: 'products',
  components: ['ProductList', 'ProductCard', 'ProductModal'],
  hooks: ['useProducts', 'useProductFilters'],
  services: ['product.service.ts'],
  schemas: ['product.schemas.ts'],
  pages: ['ProductsPage.tsx']
};
```

#### **2.2 Verificar Dependências**
```typescript
// Sempre verificar se existe:
// ✅ Tipos TypeScript necessários
// ✅ Componentes base necessários  
// ✅ Hooks de suporte
// ✅ Schemas de validação
// ✅ Serviços de API
```

### 🏗️ **FASE 3: Implementação**

#### **3.1 Seguir Convenções de Naming**
```typescript
// ✅ Correto: PascalCase para componentes
export function ProductCard() {}

// ✅ Correto: camelCase para hooks
export function useProducts() {}

// ✅ Correto: camelCase para services  
export const productService = {}

// ✅ Correto: kebab-case para arquivos
// product-card.tsx, use-products.ts, product.service.ts
```

#### **3.2 Usar Templates Estabelecidos**

**Template para Componente:**
```tsx
/**
 * 🎯 {ComponentName} - {Breve descrição}
 */
import { cn } from '@shared/lib/utils';
import type { ComponentProps } from 'react';

interface {ComponentName}Props extends ComponentProps<'div'> {
  // Props específicas aqui
}

export function {ComponentName}({ 
  className, 
  ...props 
}: {ComponentName}Props) {
  return (
    <div className={cn('default-classes', className)} {...props}>
      {/* Implementação aqui */}
    </div>
  );
}
```

**Template para Hook:**
```tsx
/**
 * 🪝 use{HookName} - {Descrição da funcionalidade}
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { {service} } from '../services/{service}';
import type { {Type} } from '../schemas/{schema}';

export function use{HookName}() {
  // Query para buscar dados
  const query = useQuery({
    queryKey: ['{query-key}'],
    queryFn: {service}.getAll
  });

  // Mutation para criar/editar
  const createMutation = useMutation({
    mutationFn: {service}.create,
    onSuccess: () => {
      // Invalidar cache
      queryClient.invalidateQueries(['{query-key}']);
    }
  });

  return {
    // Estado
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    
    // Ações
    create: createMutation.mutate,
    isCreating: createMutation.isLoading
  };
}
```

**Template para Service:**
```tsx
/**
 * 🔌 {Service}Service - API integration for {entity}
 */
import type { {Entity}, Create{Entity}Data } from '../schemas/{entity}.schemas';

const API_BASE = '/api/{entities}';

export const {entity}Service = {
  async getAll(): Promise<{Entity}[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch {entities}');
    return response.json();
  },

  async getById(id: string): Promise<{Entity}> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch {entity} ${id}`);
    return response.json();
  },

  async create(data: Create{Entity}Data): Promise<{Entity}> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create {entity}');
    return response.json();
  },

  async update(id: string, data: Partial<{Entity}>): Promise<{Entity}> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Failed to update {entity} ${id}`);
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete {entity} ${id}`);
  }
};
```

#### **3.3 Implementar Validação TypeScript**
```typescript
// Sempre definir schemas Zod primeiro
import { z } from 'zod';

export const {entity}Schema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Inferir tipos do schema
export type {Entity} = z.infer<typeof {entity}Schema>;
export type Create{Entity}Data = Omit<{Entity}, 'id' | 'createdAt' | 'updatedAt'>;
export type Update{Entity}Data = Partial<Create{Entity}Data>;
```

### ✅ **FASE 4: Validação**

#### **4.1 Checklist de Validação**
```bash
# ✅ Executar type checking
npm run type-check

# ✅ Executar testes
npm run test

# ✅ Executar linting
npm run lint

# ✅ Verificar build
npm run build
```

#### **4.2 Teste Visual**
```bash
# ✅ Iniciar dev server
npm run dev

# ✅ Navegar para a funcionalidade
# ✅ Testar todas as interações
# ✅ Verificar responsividade
# ✅ Testar estados de erro
```

---

## 🎯 **Casos de Uso Comuns para IA**

### 🆕 **Caso 1: Criar Nova Feature**

**Input típico do usuário:**
> "Crie uma feature de produtos com listagem, criação e edição"

**Abordagem da IA:**
1. **Analisar** → Feature de CRUD completo
2. **Planejar** → Usar padrão Records como base
3. **Implementar** → Seguir estrutura de features existente
4. **Validar** → Testar todas as funcionalidades

**Estrutura a criar:**
```
src/features/products/
├── components/
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── ProductList.tsx
│   └── index.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProductFilters.ts
│   └── index.ts
├── services/
│   └── product.service.ts
├── schemas/
│   └── product.schemas.ts
├── pages/
│   └── ProductsPage.tsx
└── index.ts (barrel export)
```

### 🔧 **Caso 2: Modificar Componente Existente**

**Input típico do usuário:**
> "Adicione um filtro por categoria no ModernCalendar"

**Abordagem da IA:**
1. **Localizar** → src/shared/components/filters/ModernCalendar.tsx
2. **Analisar** → Props interface e funcionalidade atual
3. **Planejar** → Adicionar nova prop categories e lógica de filtro
4. **Implementar** → Seguir padrões existentes do componente
5. **Validar** → Testar novo filtro e backward compatibility

### 🐛 **Caso 3: Corrigir Bug**

**Input típico do usuário:**
> "O calendário não está mostrando as datas selecionadas corretamente"

**Abordagem da IA:**
1. **Reproduzir** → Identificar o problema no código
2. **Localizar** → Encontrar a função de seleção de datas
3. **Diagnosticar** → Analisar lógica de state e props
4. **Corrigir** → Implementar fix mantendo funcionalidade
5. **Validar** → Testar cenários diversos

---

## 🔍 **Debugging para IA**

### 🚨 **Problemas Comuns e Soluções**

#### **Problema: Erro de TypeScript**
```typescript
// ❌ Erro comum: Property 'x' does not exist on type 'Y'

// 🔍 Debug: Verificar tipos
// 1. Verificar interface/type definition
// 2. Verificar se propriedade existe no objeto
// 3. Verificar se import está correto

// ✅ Solução: Corrigir tipo ou adicionar propriedade
interface User {
  id: string;
  name: string;
  email: string; // ← Adicionar propriedade faltante
}
```

#### **Problema: Hook não funciona**
```typescript
// ❌ Erro: Hook is called conditionally

// 🔍 Debug: Verificar regras dos hooks
// 1. Hooks devem ser chamados sempre na mesma ordem
// 2. Não podem estar dentro de condições, loops ou funções aninhadas
// 3. Só podem ser chamados em componentes ou outros hooks

// ✅ Solução: Mover hook para o topo
function MyComponent() {
  // ✅ Correto: Hook no topo
  const { data, isLoading } = useQuery(...);
  
  if (someCondition) {
    // Lógica condicional aqui, não hooks
  }
}
```

### 📊 **Ferramentas de Debug**

#### **1. Console.log Estruturado**
```typescript
// ✅ Use logging estruturado para debug
console.log('🔍 Debug:', {
  component: 'ProductList',
  props: { products, isLoading },
  state: { selectedProduct },
  action: 'handleProductClick'
});
```

#### **2. React Query Devtools**
```typescript
// ✅ Já configurado no template
// Abra as DevTools do browser → aba "React Query"
// Visualize queries, mutations, cache state
```

#### **3. Network Tab**
```typescript
// ✅ Para debug de APIs
// Browser DevTools → Network → Ver requests/responses
// Verificar status codes, payloads, timing
```

---

## 📚 **Recursos de Referência para IA**

### 🔗 **Arquivos-chave para Consulta**

1. **Estrutura de Features**
   - `src/features/records/` - Exemplo completo de feature
   - `src/shared/components/` - Componentes reutilizáveis

2. **Padrões de Código**
   - `src/shared/hooks/` - Hooks customizados exemplares
   - `src/shared/lib/` - Utilitários e helpers

3. **Configurações**
   - `tsconfig.json` - Configuração TypeScript
   - `vite.config.ts` - Build e dev server
   - `tailwind.config.js` - Styling system

### 📖 **Documentação Externa**

- [TanStack Query](https://tanstack.com/query) - State management
- [TanStack Router](https://tanstack.com/router) - Routing
- [Framer Motion](https://framer.com/motion) - Animations  
- [Zod](https://zod.dev) - Schema validation
- [React Hook Form](https://react-hook-form.com) - Forms
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

## ⚡ **Otimizações para IA**

### 🎯 **Estratégias de Eficiência**

#### **1. Reutilização de Código**
```typescript
// ✅ Sempre procure por padrões similares existentes
// Exemplo: Criando nova feature → copie estrutura de records/
// Exemplo: Novo componente → adapte componente similar
// Exemplo: Novo hook → siga padrões de hooks existentes
```

#### **2. Batch Operations**
```typescript
// ✅ Agrupe mudanças relacionadas
// Exemplo: Nova feature = componente + hook + service + schema + route
// Implemente tudo junto para consistência
```

#### **3. Testing Strategy**
```typescript
// ✅ Sempre teste após implementação
// 1. Type check (npm run type-check)
// 2. Unit tests (npm run test)
// 3. Visual testing (npm run dev)
```

### 🔄 **Feedback Loop**

1. **Implementar** mudança
2. **Testar** funcionamento
3. **Ajustar** se necessário  
4. **Documentar** se relevante
5. **Repetir** até satisfatório

---

## 🎉 **Conclusão para IA**

Este template foi meticulosamente preparado para **maximizar a produtividade** de assistentes de IA. Todos os padrões, estruturas e documentações foram pensados para:

### ✅ **Vantagens para IA:**
- 🎯 **Previsibilidade** - Padrões consistentes
- 🔍 **Contexto Rico** - Documentação abundante  
- ⚡ **Feedback Rápido** - Validação automatizada
- 🧩 **Modularidade** - Componentes independentes
- 🔒 **Type Safety** - Segurança de tipos rigorosa

### 🚀 **Resultado Esperado:**
- Desenvolvimento **5x mais rápido** 
- **Menor taxa de erro**
- **Código consistente** e maintível  
- **Fácil extensibilidade**
- **Onboarding simplificado**

---

<div align="center">
  <p><strong>🤖 Template otimizado para IA + 👨‍💻 Friendly para humanos</strong></p>
  <p><em>Construído para maximizar produtividade de assistentes de IA</em></p>
</div>
