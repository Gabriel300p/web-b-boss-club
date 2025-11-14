# 🛠️ TableSettings Component

Componente completo para configuração de tabelas com reordenação por drag-and-drop, controle de visibilidade de colunas e persistência em localStorage.

## ✨ Funcionalidades

- **🔄 Reordenação de colunas** - Arrastar e soltar com mouse/touch
- **👁️ Controle de visibilidade** - Mostrar/ocultar colunas individualmente
- **💾 Persistência** - Salvar configurações no localStorage por tableId
- **🔍 Busca** - Filtrar colunas por nome quando há muitas opções
- **🔒 Colunas fixas** - Suporte a colunas que não podem ser alteradas
- **♿ Acessibilidade** - Navegação por teclado e ARIA labels
- **🎨 Animações** - Transições suaves com Framer Motion

## 📦 Instalação

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## 🚀 Uso Básico

```tsx
import { TableSettings } from "@shared/components/table/TableSettings";
import type { TableColumn } from "@shared/types/table.types";

function MyDataTable() {
  const columnsFromApi: TableColumn[] = [
    { id: "name", label: "Nome", defaultVisible: true },
    { id: "email", label: "Email", defaultVisible: true },
    { id: "phone", label: "Telefone", defaultVisible: false },
    { id: "actions", label: "Ações", fixed: true },
  ];

  const handleSettingsChange = (settings) => {
    console.log("Nova configuração:", settings);
    // Aplicar configurações na tabela
  };

  return (
    <div className="flex items-center gap-2">
      {/* Seus filtros existentes */}
      <FilterSimple {...filterProps} />
      
      {/* Componente TableSettings */}
      <TableSettings
        tableId="my-table"
        columnsFromApi={columnsFromApi}
        onChange={handleSettingsChange}
      />
    </div>
  );
}
```

## 🔧 Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `tableId` | `string` | ✅ | ID único da tabela para localStorage |
| `columnsFromApi` | `TableColumn[]` | ✅ | Array de colunas vindas da API |
| `onChange` | `(settings) => void` | ✅ | Callback chamado quando configurações mudam |
| `className` | `string` | ❌ | Classes CSS adicionais |

## 📝 Tipos TypeScript

```tsx
interface TableColumn {
  id: string;              // ID único da coluna
  label: string;           // Nome exibido da coluna
  defaultVisible?: boolean; // Visível por padrão (default: primeiro 5)
  fixed?: boolean;         // Coluna fixa (não pode ser alterada)
}

interface TableSettingsConfig {
  order: string[];                    // Ordem das colunas
  visibility: Record<string, boolean>; // Visibilidade das colunas
}
```

## 🎯 Integração com TanStack Table

```tsx
import { applyTableSettings } from "@shared/utils/table-settings.utils";

function DataTableWithSettings() {
  const [tableSettings, setTableSettings] = useState();
  
  // Aplicar configurações nas colunas
  const processedColumns = useMemo(() => {
    return applyTableSettings(baseColumns, tableSettings);
  }, [baseColumns, tableSettings]);

  return (
    <div>
      <TableSettings
        tableId="users"
        columnsFromApi={columnsFromApi}
        onChange={setTableSettings}
      />
      
      <DataTable columns={processedColumns} data={data} />
    </div>
  );
}
```

## 💾 Formato do localStorage

```json
{
  "order": ["name", "email", "status"],
  "visibility": {
    "name": true,
    "email": true,
    "phone": false,
    "status": true
  },
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

Chave: `table-settings:{tableId}`

## ♿ Acessibilidade

- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys
- **Screen Reader**: ARIA labels e roles apropriados
- **Focus Management**: Trap focus no popover
- **Drag and Drop**: Suporte a keyboard para reordenação

### Teclas de Atalho

| Tecla | Ação |
|-------|------|
| `Tab` | Navegar entre elementos |
| `Enter/Space` | Abrir popover, ativar botões |
| `Escape` | Fechar popover |
| `Ctrl + ↑/↓` | Mover item selecionado (em desenvolvimento) |

## 🧪 Testes

```bash
# Testes unitários
npm test useTableSettings.test.ts

# Testes de componente
npm test TableSettings.test.tsx

# Testes E2E
npm run test:e2e table-settings.spec.ts
```

## 📱 Responsividade

- **Mobile**: Botão compacto, touch drag-and-drop
- **Desktop**: Texto completo, mouse drag-and-drop
- **Tablet**: Híbrido touch + cursor

## 🎨 Customização

```tsx
// Customizar estilos
<TableSettings
  className="custom-table-settings"
  tableId="custom-table"
  columnsFromApi={columns}
  onChange={handleChange}
/>
```

```css
/* Customizar aparência */
.custom-table-settings {
  /* Seus estilos */
}
```

## 🔄 Migração de Tabelas Existentes

1. **Adicionar tipos**: Importe `TableColumn` e `TableSettingsConfig`
2. **Definir colunas**: Crie array `columnsFromApi` com IDs das colunas
3. **Adicionar componente**: Coloque `TableSettings` ao lado dos filtros
4. **Aplicar configurações**: Use `applyTableSettings` nas colunas da tabela

## 🐛 Troubleshooting

### Erro: "Cannot find module @dnd-kit"
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Colunas não reordenam
- Verifique se `column.id` está definido
- Confirme que `onChange` está sendo chamado
- Use `applyTableSettings` nas colunas

### localStorage não funciona
- Verifique se `tableId` é único
- Confirme que está chamando `saveSettings()`
- Verifique quotas do localStorage

## 📚 Exemplos Completos

Veja `docs/examples/table-settings-integration.example.tsx` para exemplos completos de integração.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch
3. Adicione testes
4. Faça commit das mudanças
5. Abra um Pull Request

## 📄 Licença

MIT License - veja LICENSE.md para detalhes.
