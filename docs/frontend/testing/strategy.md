# 🧪 Estratégia de Testes - Centro Educacional Alfa

## 📊 Status Atual dos Testes

### Cobertura Atual

- **Arquivos de Teste**: 6 arquivos configurados
- **Testes Aprovados**: 30/35 (85.7% taxa de sucesso)
- **Testes Falhando**: 5/35 (14.3% necessitam correção)

### Distribuição por Funcionalidade

| Categoria      | Arquivo                           | Testes | Status | Cobertura               |
| -------------- | --------------------------------- | ------ | ------ | ----------------------- |
| **Schemas**    | `comunicacao.schemas.test.ts`     | 8/8 ✅ | 100%   | Validação Zod completa  |
| **Hooks**      | `useSearch.test.tsx`              | 9/9 ✅ | 100%   | Filtros e busca         |
| **Hooks**      | `useComunicacoes.test.tsx`        | 4/6 ⚠️ | 67%    | Mutations com problemas |
| **Components** | `LoadingSpinner.test.tsx`         | 3/3 ✅ | 100%   | UI simples              |
| **Components** | `CommunicationSkeletons.test.tsx` | 2/2 ✅ | 100%   | Skeletons               |
| **Components** | `DataTable.test.tsx`              | 4/7 ⚠️ | 57%    | Tabela complexa         |

## 🚨 Problemas Identificados

### 1. Testes de DataTable

**Problemas:**

- Texto "Nenhuma comunicação encontrada" não encontrado (esperado: "Nenhum resultado encontrado")
- Botões de sorting não localizados corretamente
- Componente Pagination não renderiza texto "Próxima" (usa ícone ChevronRight)

### 2. Testes de useComunicacoes Hook

**Problemas:**

- Estados de loading não sincronizados com mutations
- Mocks de erro não configurados adequadamente
- Timing issues com React Query

### 3. Configuração de Mocks

**Necessita:**

- Mocks mais robustos para React Query
- Simulação de estados de rede
- Melhor isolamento entre testes

## 🎯 Estratégia de Organização Proposta

### Estrutura de Diretórios Recomendada

```
src/
├── test/
│   ├── __mocks__/           # Mocks globais
│   │   ├── react-query.ts
│   │   ├── zustand.ts
│   │   └── api.ts
│   ├── fixtures/            # Dados de teste
│   │   ├── comunicacoes.ts
│   │   ├── users.ts
│   │   └── common.ts
│   ├── helpers/             # Utilitários de teste
│   │   ├── render.tsx       # Custom render com providers
│   │   ├── queries.ts       # Helpers para React Query
│   │   ├── assertions.ts    # Assertions customizadas
│   │   └── wait.ts          # Helpers para timing
│   ├── setup/               # Configuração global
│   │   ├── global.ts        # Setup global do Vitest
│   │   ├── dom.ts           # Configuração do DOM
│   │   └── matchers.ts      # Custom matchers
│   └── utils.tsx            # Re-exports principais
│
└── features/
    └── comunicacoes/
        ├── __tests__/           # Pasta dedicada aos testes
        │   ├── unit/            # Testes unitários
        │   │   ├── hooks/
        │   │   ├── schemas/
        │   │   └── utils/
        │   ├── integration/     # Testes de integração
        │   │   ├── components/
        │   │   └── flows/
        │   └── e2e/             # Testes end-to-end
        │       └── comunicacoes.e2e.ts
        └── [feature files...]
```

### Convenções de Nomenclatura

#### Arquivos de Teste

- **Unit Tests**: `*.test.ts` / `*.test.tsx`
- **Integration Tests**: `*.integration.test.tsx`
- **E2E Tests**: `*.e2e.test.ts`
- **Stories**: `*.stories.tsx` (Storybook)

#### Grupos de Teste

```typescript
// ✅ Bom: Agrupamento por funcionalidade
describe("useSearch Hook", () => {
  describe("filtering", () => {
    describe("by title", () => {});
    describe("by author", () => {});
  });

  describe("search behavior", () => {
    describe("case sensitivity", () => {});
    describe("empty states", () => {});
  });
});

// ❌ Evitar: Agrupamento sem contexto
describe("tests", () => {
  it("should work", () => {});
});
```

## 🔧 Padrões de Teste Recomendados

### 1. Estrutura AAA (Arrange-Act-Assert)

```typescript
it("should filter communications by title", () => {
  // 🔧 Arrange
  const mockData = createMockComunicacoes(5);
  const searchTerm = "projeto";

  // ⚡ Act
  const result = useSearch(mockData, searchTerm, "titulo");

  // ✅ Assert
  expect(result.filteredData).toHaveLength(1);
  expect(result.filteredData[0].titulo).toContain(searchTerm);
});
```

### 2. Custom Render Helper

```typescript
// test/helpers/render.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderOptions = {}
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryProvider client={queryClient}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </QueryProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
```

### 3. Fixtures Tipadas

```typescript
// test/fixtures/comunicacoes.ts
export const createMockComunicacao = (
  overrides: Partial<Comunicacao> = {},
): Comunicacao => ({
  id: faker.string.uuid(),
  titulo: faker.lorem.sentence(),
  autor: faker.person.fullName(),
  tipo: faker.helpers.arrayElement(["Comunicado", "Aviso", "Notícia"]),
  descricao: faker.lorem.paragraph(),
  dataPublicacao: faker.date.recent().toISOString(),
  ...overrides,
});
```

### 4. Mocks Configuráveis

```typescript
// test/__mocks__/react-query.ts
export const createMockMutation = <T, E = Error>(
  mockImplementation?: () => Promise<T>,
) => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn(mockImplementation || (() => Promise.resolve({} as T))),
  isPending: false,
  isError: false,
  error: null,
  reset: vi.fn(),
  isSuccess: false,
  data: undefined,
});
```

## 📋 Plano de Correção Imediata

### Fase 1: Correção dos Testes Falhos (2-3 horas)

1. **DataTable.test.tsx**
   - [ ] Corrigir texto esperado: "Nenhum resultado encontrado"
   - [ ] Implementar testes de sorting por aria-labels
   - [ ] Corrigir expectativas de paginação (usar aria-labels ao invés de texto)

2. **useComunicacoes.test.tsx**
   - [ ] Configurar mocks de erro adequados
   - [ ] Corrigir timing dos testes de loading states
   - [ ] Adicionar testes de retry e cache

### Fase 2: Reestruturação (3-4 horas)

1. **Migrar para nova estrutura de pastas**
2. **Criar helpers e fixtures**
3. **Padronizar nomenclatura**
4. **Adicionar custom matchers**

### Fase 3: Expansão da Cobertura (4-5 horas)

1. **Testes de integração para fluxos completos**
2. **Testes de componentes complexos (Modals, Forms)**
3. **Testes de performance e acessibilidade**
4. **Setup de visual regression testing**

## 🎮 Comandos de Teste Recomendados

```bash
# Desenvolvimento
pnpm test:watch          # Watch mode
pnpm test:ui             # Vitest UI
pnpm test:coverage       # Cobertura completa

# CI/CD
pnpm test:ci             # Testes para CI
pnpm test:e2e            # End-to-end
pnpm test:visual         # Visual regression

# Debugging
pnpm test:debug          # Debug mode
pnpm test:verbose        # Output verboso
```

## 📊 Métricas de Qualidade Desejadas

| Métrica                   | Meta | Atual |
| ------------------------- | ---- | ----- |
| **Cobertura de Linhas**   | >90% | ~60%  |
| **Cobertura de Branches** | >85% | ~45%  |
| **Cobertura de Funções**  | >95% | ~70%  |
| **Tempo de Execução**     | <30s | ~15s  |
| **Flakiness Rate**        | <2%  | ~14%  |

## 🔄 Integração com Desenvolvimento

### Pre-commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
pnpm test:related        # Testa apenas arquivos alterados
pnpm test:types          # Type checking
pnpm lint:fix            # Correção automática de linting
```

### CI/CD Pipeline

```yaml
test:
  - unit-tests # Paralelo
  - integration-tests # Paralelo
  - e2e-tests # Sequencial
  - coverage-report # Após unit/integration
  - performance-tests # Opcional
```

## 📚 Recursos e Documentação

### Ferramentas Utilizadas

- **Vitest**: Framework de testes principal
- **Testing Library**: Utilities para DOM testing
- **MSW**: Mocking de APIs
- **Faker.js**: Geração de dados de teste
- **Playwright**: E2E testing (futuro)

### Referências

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [React Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

_📝 Documento criado em: Agosto 2025_  
_🔄 Última atualização: Em desenvolvimento_  
_👤 Responsável: Equipe de Desenvolvimento_
