# 🚀 TableSettings - Instruções de Instalação e Uso

## 1. 📦 Instalar Dependências

```bash
cd web-b-boss-club
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## 2. 📁 Arquivos Criados

```
src/
├── shared/
│   ├── components/
│   │   ├── table/
│   │   │   ├── TableSettings.tsx         # Componente principal
│   │   │   ├── SortableItem.tsx          # Item arrastável
│   │   │   └── __tests__/
│   │   │       └── TableSettings.test.tsx
│   │   └── ui/
│   │       └── drag-handle.tsx           # Handle para drag & drop
│   ├── hooks/
│   │   ├── useTableSettings.ts           # Hook principal
│   │   └── __tests__/
│   │       └── useTableSettings.test.ts
│   ├── types/
│   │   └── table.types.ts               # Tipagens TypeScript
│   └── utils/
│       └── table-settings.utils.ts     # Funções utilitárias
└── docs/
    ├── TABLE_SETTINGS.md               # Documentação completa
    └── examples/
        └── table-settings-integration.example.tsx
```

## 3. 🧪 Rodar Testes

```bash
# Todos os testes
npm test

# Testes específicos do TableSettings
npm test useTableSettings.test.ts
npm test TableSettings.test.tsx

# Com coverage
npm run test:coverage

# Watch mode durante desenvolvimento
npm test -- --watch
```

## 4. 🛠️ Comandos de Build

```bash
# Verificar tipos TypeScript
npm run type-check

# Lint + fix
npm run lint:fix

# Build de produção
npm run build

# Verificar tudo
npm run check-all
```

## 5. 📋 Como Usar (Passo a Passo)

### Passo 1: Importe o componente
```tsx
import { TableSettings } from "@shared/components/table/TableSettings";
import type { TableColumn } from "@shared/types/table.types";
```

### Passo 2: Defina as colunas da API
```tsx
const columnsFromApi: TableColumn[] = [
  { id: "name", label: "Nome", defaultVisible: true },
  { id: "email", label: "Email", defaultVisible: true },
  { id: "phone", label: "Telefone", defaultVisible: false },
  { id: "actions", label: "Ações", fixed: true },
];
```

### Passo 3: Adicione o componente ao lado dos filtros
```tsx
<div className="flex items-center gap-2">
  {/* Seus filtros existentes */}
  <FilterSimple {...filterProps} />
  
  {/* Novo componente TableSettings */}
  <TableSettings
    tableId="users-table"
    columnsFromApi={columnsFromApi}
    onChange={handleSettingsChange}
  />
</div>
```

### Passo 4: Implemente o handler
```tsx
const handleSettingsChange = (settings) => {
  // Aplicar configurações na sua tabela
  console.log("Settings:", settings);
  // settings = { order: string[], visibility: Record<string, boolean> }
};
```

### Passo 5: Aplicar configurações na tabela (opcional)
```tsx
import { applyTableSettings } from "@shared/utils/table-settings.utils";

const processedColumns = useMemo(() => {
  return applyTableSettings(originalColumns, tableSettings);
}, [originalColumns, tableSettings]);
```

## 6. 🔧 Integração com Tabelas Existentes

### Para RecordDataTable:
```tsx
// Em RecordsPage.tsx ou similar
const recordColumns: TableColumn[] = [
  { id: "tipo", label: "Tipo", defaultVisible: true },
  { id: "descricao", label: "Descrição", defaultVisible: true },
  { id: "valor", label: "Valor", defaultVisible: true },
  { id: "dataCriacao", label: "Data Criação", defaultVisible: false },
  { id: "actions", label: "Ações", fixed: true },
];

// Adicionar ao toolbar
<RecordsToolbar>
  {/* Filtros existentes */}
  <TableSettings
    tableId="records-table"
    columnsFromApi={recordColumns}
    onChange={handleRecordSettingsChange}
  />
</RecordsToolbar>
```

### Para BarbershopStaffDataTable:
```tsx
const staffColumns: TableColumn[] = [
  { id: "nome", label: "Nome", defaultVisible: true },
  { id: "email", label: "Email", defaultVisible: true },
  { id: "telefone", label: "Telefone", defaultVisible: false },
  { id: "especialidades", label: "Especialidades", defaultVisible: true },
  { id: "disponibilidade", label: "Disponível", defaultVisible: true },
  { id: "actions", label: "Ações", fixed: true },
];
```

## 7. 🎯 Boas Práticas

### ✅ Recomendadas:
- Use tableId único para cada tabela
- Marque colunas de ações como `fixed: true`
- Defina `defaultVisible` nas colunas mais importantes
- Teste a navegação por teclado
- Verifique a responsividade mobile

### ❌ Evitar:
- tableId duplicados
- Muitas colunas visíveis por padrão (máx 5-7)
- Colunas sem ID definido
- Labels de colunas muito longos

## 8. 🐛 Solução de Problemas

### Erro de compilação TypeScript:
```bash
npm run type-check
```

### Dependências @dnd-kit não encontradas:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Testes falhando:
```bash
npm test -- --verbose
```

### localStorage não persiste:
- Verifique se tableId é único
- Confirme que está chamando o handler onChange
- Teste em ambiente de produção (não incógnito)

## 9. 📱 Testando no Ambiente

### Desktop:
1. Abra uma tabela existente
2. Clique no ícone de engrenagem
3. Teste drag & drop das colunas
4. Toggle visibilidade
5. Salve e recarregue a página

### Mobile:
1. Acesse via device/emulador mobile
2. Teste touch drag & drop
3. Verifique responsividade do popover
4. Teste navegação por toque

### Teclado:
1. Use Tab para navegar
2. Enter/Space para abrir popover
3. Tab dentro do popover
4. Escape para fechar

## 10. 🔄 Deploy e Monitoramento

### Antes do Deploy:
```bash
npm run check-all  # TypeScript + lint + tests
npm run build     # Build de produção
```

### Após Deploy:
- Teste localStorage em produção
- Verifique console por erros
- Teste performance com tabelas grandes
- Validar acessibilidade com screen reader

## 📞 Suporte

Se encontrar problemas:
1. Verifique a documentação em `docs/TABLE_SETTINGS.md`
2. Execute os testes para reproduzir o problema
3. Consulte os exemplos em `docs/examples/`
4. Abra uma issue com logs e passos para reproduzir
