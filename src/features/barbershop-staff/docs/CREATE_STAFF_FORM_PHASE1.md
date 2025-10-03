# 🎯 Formulário de Criação de Staff - FASE 1 (MVP)

## ✅ O que foi implementado

### 1. **Utilitários de CPF** (`src/shared/utils/cpf.utils.ts`)

- ✅ `cleanCPF()` - Remove formatação do CPF
- ✅ `formatCPF()` - Formata CPF para XXX.XXX.XXX-XX
- ✅ `validateCPF()` - Valida CPF com algoritmo oficial brasileiro
- ✅ `maskCPF()` - Aplica máscara progressivamente enquanto usuário digita
- ✅ `isValidCPFFormat()` - Verifica se CPF está no formato correto

**Validações implementadas:**

- Verifica se tem 11 dígitos
- Rejeita CPFs inválidos conhecidos (111.111.111-11, etc.)
- Valida ambos os dígitos verificadores
- Baseado na mesma lógica do backend (`UniqueDataValidator`)

---

### 2. **Schema de Validação** (`barbershop-staff.schemas.ts`)

- ✅ `createStaffMinimalFormSchema` - Schema Zod para formulário MVP
- ✅ `CreateStaffMinimalFormData` - Type para o formulário
- ✅ `CreateStaffMinimalData` - Type para o hook

**Campos validados:**

- **Nome Completo** (full_name): obrigatório, 1-100 caracteres, apenas letras e espaços
- **CPF**: obrigatório, validação completa com algoritmo oficial
- **Email**: opcional, se preenchido valida formato

---

### 3. **Componente Modal** (`CreateStaffModal.tsx`)

Modal responsivo com formulário usando:

- ✅ **Dialog** do shadcn/ui
- ✅ **react-hook-form** para gerenciamento do formulário
- ✅ **Zod resolver** para validação
- ✅ Máscara automática de CPF enquanto digita
- ✅ Validação em tempo real (`mode: "onChange"`)
- ✅ Loading states
- ✅ Acessibilidade completa (ARIA labels, error IDs, etc.)
- ✅ i18n (suporte pt-BR e en)

**Campos do formulário:**

1. **Nome Completo** - Input de texto, obrigatório
2. **CPF** - Input com máscara automática XXX.XXX.XXX-XX, obrigatório
3. **Email** - Input opcional (se preenchido, cria usuário com senha auto-gerada)

**Funcionalidades:**

- Auto-split do nome completo em `first_name` e `last_name`
- CPF limpo enviado para o backend (sem formatação)
- Email trimmed ou `undefined` se vazio
- Status default: `ACTIVE`
- Role default: `BARBER`
- Fecha modal automaticamente após sucesso
- Toast de sucesso/erro via `useBarbershopStaffCreate`

---

### 4. **Integração com a Página**

- ✅ State `isCreateModalOpen` no `BarbershopStaffPage`
- ✅ Prop `onCreateClick` no `BarbershopStaffPageHeader`
- ✅ Botão atualizado para "Adicionar novo" (em vez de "Novo")
- ✅ Modal renderizada condicionalmente
- ✅ Atualização automática da lista após criação (via `queryClient.invalidateQueries`)

---

### 5. **Traduções (i18n)**

Adicionadas em `pt.json` e `en.json`:

**Português:**

```json
"actions": {
  "addNew": "Adicionar novo",
  "cancel": "Cancelar",
  "create": "Adicionar",
  "creating": "Adicionando..."
},
"modals": {
  "createStaff": {
    "title": "Adicionar novo barbeiro",
    "fields": {
      "fullName": "Nome Completo",
      "cpf": "CPF",
      "email": "Email"
    },
    "placeholders": { ... },
    "hints": { ... },
    "optional": "opcional"
  }
}
```

**Inglês:**

```json
"actions": {
  "addNew": "Add new",
  "cancel": "Cancel",
  "create": "Add",
  "creating": "Adding..."
},
"modals": {
  "createStaff": {
    "title": "Add new barber",
    ...
  }
}
```

---

## 🔄 Fluxo Completo

1. **Usuário clica** em "Adicionar novo" no header
2. **Modal abre** com formulário vazio
3. **Usuário preenche**:
   - Nome Completo (validação em tempo real)
   - CPF (máscara aplicada automaticamente)
   - Email (opcional)
4. **Validação acontece** em tempo real
5. **Ao clicar em "Adicionar"**:
   - Nome é dividido em `first_name` e `last_name`
   - CPF é limpo (remove formatação)
   - Email é trimmed ou `undefined`
   - Dados enviados para backend via `useBarbershopStaffCreate`
6. **Backend processa**:
   - Valida CPF (unicidade e formato)
   - Se email preenchido: cria usuário com senha auto-gerada
   - Se email vazio: cria staff sem usuário
   - Retorna staff criado + senha gerada (se aplicável)
7. **Se SUCESSO**:
   - ✅ Toast de sucesso com senha (se gerada)
   - ✅ Modal fecha automaticamente via callback
   - ✅ Lista de staff é atualizada automaticamente
8. **Se ERRO**:
   - ❌ Toast de erro com mensagem específica do backend
   - ❌ **Modal PERMANECE ABERTA** para usuário corrigir
   - ❌ Formulário mantém os dados preenchidos
   - ✅ Usuário pode corrigir e tentar novamente

---

## 🎯 Validações Implementadas

### Frontend (Zod + React Hook Form)

- ✅ Nome completo: min 1 char, max 100, apenas letras e espaços
- ✅ CPF: formato válido, 11 dígitos, algoritmo validado
- ✅ Email: formato válido (se preenchido)

### Backend (já existente)

- ✅ CPF único no sistema
- ✅ CPF válido (algoritmo oficial)
- ✅ Email único (se fornecido)
- ✅ Email formato válido

---

## 📊 Campos Enviados ao Backend

```typescript
{
  barbershop_id: string, // Inferido do token JWT (TODO)
  user: {
    first_name: string,      // Do split de full_name
    last_name: string,       // Do split de full_name (ou undefined)
    cpf: string,             // Limpo, sem formatação
    email: string | undefined // Trimmed ou undefined
  },
  role_in_shop: "BARBER",    // Default
  status: "ACTIVE",          // Default
  is_available: true         // Default
}
```

---

## ⚠️ Pendências / TODOs

### 1. **Barbershop ID**

Atualmente usando placeholder no hook:

```typescript
const barbershop_id = "placeholder-id"; // TODO: Get from user context
```

**Soluções possíveis:**

- Backend infere do JWT (recomendado)
- Buscar do contexto de autenticação
- Passar como prop do componente pai

### 2. **Melhorias Futuras (Fases 2-4)**

**Fase 2 - Melhorias de UX:**

- [ ] Campo Telefone (opcional, com máscara)
- [ ] Campo Status (select, default ACTIVE)
- [ ] Loading skeleton melhor
- [ ] Animações com framer-motion

**Fase 3 - Campos Avançados:**

- [ ] Campo de senha (opcional, se não preenchido gera automática)
- [ ] Notas internas / Descrição
- [ ] Data de contratação
- [ ] Salário e comissão
- [ ] Role selection (BARBER, OWNER, etc.)

**Fase 4 - Polimento:**

- [ ] Stepper multi-etapas (se necessário)
- [ ] Preview de dados antes de salvar
- [ ] Validação de CPF duplicado em tempo real (debounced)
- [ ] Upload de foto de perfil
- [ ] Envio de email com credenciais

---

## 🧪 Como Testar

### Cenário 1: Criar staff COM email

1. Abra `/barbershop-staff`
2. Clique em "Adicionar novo"
3. Preencha:
   - Nome: "João da Silva"
   - CPF: "123.456.789-09" (usar CPF válido)
   - Email: "joao@exemplo.com"
4. Clique em "Adicionar"
5. ✅ Deve mostrar toast com senha gerada
6. ✅ Lista deve atualizar automaticamente

### Cenário 2: Criar staff SEM email

1. Abra `/barbershop-staff`
2. Clique em "Adicionar novo"
3. Preencha apenas:
   - Nome: "Maria Santos"
   - CPF: "987.654.321-00"
4. Deixe email vazio
5. Clique em "Adicionar"
6. ✅ Deve criar staff sem usuário
7. ✅ Toast de sucesso simples

### Cenário 3: Validações

1. Tente enviar formulário vazio
   - ✅ Botão deve estar desabilitado
2. Digite CPF inválido (111.111.111-11)
   - ✅ Deve mostrar erro de validação
3. Digite email inválido
   - ✅ Deve mostrar erro de validação
4. Digite nome com números
   - ✅ Deve mostrar erro de validação

---

## 📁 Arquivos Criados/Modificados

### Criados:

- `src/shared/utils/cpf.utils.ts`
- `src/features/barbershop-staff/components/dialogs/CreateStaffModal.tsx`

### Modificados:

- `src/features/barbershop-staff/schemas/barbershop-staff.schemas.ts`
- `src/features/barbershop-staff/pages/BarbershopStaffPage.tsx`
- `src/features/barbershop-staff/pages/sections/BarbershopStaffPageHeader.tsx`
- `src/features/barbershop-staff/locales/pt.json`
- `src/features/barbershop-staff/locales/en.json`

---

## 🎨 Design Decisions

1. **Nome Completo em 1 campo**: Melhor UX, split no frontend
2. **CPF com máscara automática**: Melhor UX, validação mais visual
3. **Email opcional**: Flexibilidade (nem todo barbeiro precisa de acesso ao sistema)
4. **Senha auto-gerada**: Segurança, simplicidade
5. **Modal fecha após sucesso**: Evita cliques duplicados
6. **Validação em tempo real**: Feedback imediato ao usuário

---

## 🚀 Próximos Passos

1. **Testar integração com backend** (quando API estiver disponível)
2. **Resolver TODO do barbershop_id**
3. **Ajustar tratamento de erros específicos do backend**
4. **Implementar Fase 2** quando necessário

---

## 🐛 Correções Aplicadas

### Handling de Erros Melhorado

**Problema**: Modal fechava antes de mostrar os erros, impedindo usuário de corrigir.

**Solução**:

- ✅ Hook `useBarbershopStaffCreate` agora aceita callback `onSuccess`
- ✅ Modal só fecha quando sucesso é confirmado (via callback)
- ✅ Em caso de erro, toast é mostrado e modal permanece aberta
- ✅ Usuário pode ver o erro e corrigir os dados sem perder o preenchimento

```typescript
// Antes: Modal fechava imediatamente
createStaff(data);
onClose(); // ❌ Fechava antes de saber o resultado

// Depois: Modal só fecha em caso de sucesso
const { createStaff } = useBarbershopStaffCreate({
  onSuccess: () => {
    onClose(); // ✅ Só fecha quando sucesso confirmado
  },
});
createStaff(data); // Modal permanece aberta até callback
```

---

**Status**: ✅ **FASE 1 COMPLETA E PRONTA PARA TESTES**
