# Records

> Documentação da feature records

**Última atualização:** 11/08/2025

📊 **Estatísticas:**
- Componentes: 6
- Páginas: 0
- Hooks: 3

---

## Visão Geral

A feature records fornece funcionalidades essenciais para o sistema.

### Objetivo
Gerenciar e organizar funcionalidades específicas do sistema.

## Componentes

Esta feature contém 6 componente(s).

### RecordDeleteModal

**Tipo:** react

Componente react com 4 propriedade(s) e 2 hook(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| isOpen | boolean | Não | - |
| onClose | () => void | Não | - |
| onConfirm | () => Promise<void> | Não | - |
| record | BaseRecord | null | Não | - |

**Elementos UI detectados:**
- button: high% de confiança
- modal: high% de confiança
- alert: low% de confiança

### RecordModal

**Tipo:** react

Componente react com 5 propriedade(s) e 3 hook(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| isOpen | boolean | Não | - |
| onClose | () => void | Não | - |
| onSave | (data: RecordForm) => Promise<void> | Não | - |
| record | BaseRecord | null | Não | - |
| isEditing | boolean | Não | - |

**Elementos UI detectados:**
- button: high% de confiança
- modal: high% de confiança
- form: high% de confiança
- table: medium% de confiança
- input: high% de confiança
- select: high% de confiança
- alert: high% de confiança
- modal-form: high% de confiança
- action-table: medium% de confiança
- crud-interface: medium% de confiança

### RecordSkeletons

**Tipo:** react

Componente react.

**Elementos UI detectados:**
- filter: very-low% de confiança
- modal: low% de confiança
- table: high% de confiança
- filterable-table: high% de confiança

### recordColumns

**Tipo:** react

Componente react com 2 propriedade(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| onEdit | (record: BaseRecord) => void | Não | - |
| onDelete | (record: BaseRecord) => void | Não | - |

**Elementos UI detectados:**
- button: high% de confiança
- form: low% de confiança
- table: high% de confiança
- action-table: medium% de confiança
- crud-interface: medium% de confiança

### RecordDataTable

**Tipo:** react

Componente react e 3 hook(s).

**Elementos UI detectados:**
- table: high% de confiança

### RecordsToolbar

**Tipo:** react

Componente react com 2 propriedade(s) e 3 hook(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| autores | string[] | Não | - |
| totalCount | number | Não | - |

**Elementos UI detectados:**
- filter: high% de confiança
- form: low% de confiança
- table: very-low% de confiança
- input: medium% de confiança
- filterable-table: high% de confiança

