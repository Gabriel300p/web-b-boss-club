# Comunicacoes

> Documentação da feature comunicacoes

**Última atualização:** 11/08/2025

📊 **Estatísticas:**
- Componentes: 10
- Páginas: 0
- Hooks: 7

---

## Visão Geral

A feature comunicacoes fornece funcionalidades essenciais para o sistema.

### Objetivo
Gerenciar e organizar funcionalidades específicas do sistema.

## Componentes

Esta feature contém 10 componente(s).

### ModalComunicacao

**Tipo:** react

Componente react com 5 propriedade(s) e 2 hook(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| isOpen | boolean | Não | - |
| onClose | () => void | Não | - |
| onSave | (data: ComunicacaoForm) => Promise<void> | Não | - |
| comunicacao | Comunicacao | null | Não | - |
| isEditing | boolean | Não | - |

**Elementos UI detectados:**
- button: high% de confiança
- modal: high% de confiança
- form: high% de confiança
- table: low% de confiança
- input: high% de confiança
- select: high% de confiança
- alert: medium% de confiança
- modal-form: high% de confiança
- action-table: medium% de confiança
- crud-interface: medium% de confiança

### ModalDeleteConfirm

**Tipo:** react

Componente react com 4 propriedade(s) e 2 hook(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| isOpen | boolean | Não | - |
| onClose | () => void | Não | - |
| onConfirm | () => Promise<void> | Não | - |
| comunicacao | Comunicacao | null | Não | - |

**Elementos UI detectados:**
- button: medium% de confiança
- modal: high% de confiança
- loading: high% de confiança
- alert: high% de confiança

### LanguageSwitchRecords.test

**Tipo:** react

Componente react.

**Elementos UI detectados:**
- table: high% de confiança

### CommunicationSkeletons.test

**Tipo:** react

Componente react.

### CommunicationSkeletons

**Tipo:** react

Componente react.

**Elementos UI detectados:**
- modal: low% de confiança
- table: medium% de confiança

### columns

**Tipo:** react

Componente react com 2 propriedade(s).

**Props:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|------------|
| onEdit | (comunicacao: Comunicacao) => void | Não | - |
| onDelete | (comunicacao: Comunicacao) => void | Não | - |

**Elementos UI detectados:**
- button: high% de confiança
- form: low% de confiança
- table: high% de confiança
- action-table: medium% de confiança
- crud-interface: medium% de confiança

### DataTable.test

**Tipo:** react

Componente react.

**Elementos UI detectados:**
- button: medium% de confiança
- table: high% de confiança
- action-table: medium% de confiança

### DataTable

**Tipo:** react

Componente react e 3 hook(s).

**Elementos UI detectados:**
- table: high% de confiança

### LazyDataTable

**Tipo:** react

Componente react.

**Elementos UI detectados:**
- table: low% de confiança

### ComunicacoesToolbar

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

