# 📸 Implementação de Upload de Foto para Colaboradores - Resumo

## ✅ Status: Implementação Completa

**Data:** 10/10/2025  
**Feature:** Upload de foto de perfil para colaboradores (barbershop-staff)

---

## 📋 O que foi implementado

### 1. 🔧 **Backend (API)**

#### 📦 Supabase Storage Service

**Arquivo:** `api-b-boss-club/src/shared/services/supabase-storage.service.ts`

- ✅ Service helper para upload de arquivos
- ✅ Geração de URLs públicas
- ✅ Validação de tipo e tamanho
- ✅ Limpeza automática de avatars antigos
- ✅ Transformação de imagens (resize, quality, format)

**Features:**

- Upload com progress tracking
- Limite: 2MB por arquivo
- Formatos: JPEG, PNG, WebP
- Organização por usuário (`user-id/avatar-timestamp.ext`)

---

#### 📝 Models Atualizados

**Arquivo:** `api-b-boss-club/src/features/barbershop-staff/models/barbershop-staff.models.ts`

**Adicionado `avatar_url` em:**

- ✅ `createStaffSchema.user.avatar_url` (opcional)
- ✅ `updateStaffSchema.avatar_url` (opcional)
- ✅ `staffResponseSchema.user.avatar_url` (retorno na API)

---

#### 🔄 Service Atualizado

**Arquivo:** `api-b-boss-club/src/features/barbershop-staff/services/barbershop-staff.service.ts`

**Modificações:**

1. **createStaff()**
   - ✅ Salva `avatar_url` ao criar usuário
   - ✅ Atualiza `avatar_url` se usuário já existir

2. **updateStaff()**
   - ✅ Permite atualizar `avatar_url` do usuário
   - ✅ Atualiza separadamente (tabela `users`)

3. **mapStaffToResponse()**
   - ✅ Inclui `avatar_url` na resposta

4. **Todos os selects do Prisma**
   - ✅ Incluem `avatar_url: true` nas queries

---

### 2. 🎨 **Frontend (Web)**

#### 📦 Supabase Storage Utils

**Arquivo:** `web-b-boss-club/src/shared/utils/supabase-storage.utils.ts`

**Functions:**

- ✅ `uploadFile()` - Upload com progress
- ✅ `uploadAvatar()` - Helper específico para avatars
- ✅ `deleteFile()` - Remover arquivo
- ✅ `validateFile()` - Validação client-side
- ✅ `resizeImage()` - Redimensionar antes do upload (economia de bandwidth)
- ✅ `getPublicUrl()` - Gerar URL pública
- ✅ `getOptimizedImageUrl()` - URL com transformações

**Configurações:**

```typescript
MAX_FILE_SIZE: 2MB
ALLOWED_TYPES: image/jpeg, image/png, image/webp
BUCKET: staff-avatars
```

---

#### 🖼️ Componente AvatarUpload

**Arquivo:** `web-b-boss-club/src/shared/components/form/AvatarUpload.tsx`

**Features:**

- ✅ Preview circular com iniciais como fallback
- ✅ Drag & drop
- ✅ Click to upload
- ✅ Progress indicator
- ✅ Botão de remover foto
- ✅ Validação de tipo e tamanho
- ✅ Resize automático (512x512)
- ✅ Overlay com ícone de câmera no hover
- ✅ Estados: loading, dragging, disabled
- ✅ Feedback com toast

**Props:**

```typescript
interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  fullName?: string;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}
```

---

#### 📝 Schemas Atualizados

**Arquivo:** `web-b-boss-club/src/features/barbershop-staff/schemas/barbershop-staff.schemas.ts`

**Adicionado `avatar_url` em:**

- ✅ `baseStaffFieldsSchema` (campo base)
- ✅ `createStaffFormInputSchema` (formulário de criação)
- ✅ `createStaffFormSchema` (transformação para backend)
- ✅ `updateStaffFormInputSchema` (formulário de edição)
- ✅ `staffApiToFormSchema` (transformação de API → Form)
- ✅ `getStaffFormDefaults()` (valores padrão)

---

#### 🔗 Integração no UserAccessStep

**Arquivo:** `web-b-boss-club/src/features/barbershop-staff/components/form/steps/UserAccessStep.tsx`

**Adicionado:**

- ✅ Componente `AvatarUpload` no topo (antes do email)
- ✅ Handler `handleAvatarUploadSuccess` (atualiza form)
- ✅ Handler `handleAvatarUploadError` (mostra toast)
- ✅ Watch do `full_name` para atualizar iniciais
- ✅ Watch do `avatar_url` para atualizar preview

**Posicionamento:**

```tsx
<div className="space-y-5">
  {/* 📸 Avatar Upload */}
  <div className="flex flex-col items-center border-b border-neutral-800 pb-6">
    <AvatarUpload ... />
  </div>

  {/* Email field */}
  <FormField name="email" ... />
</div>
```

---

### 3. 📚 **Documentação**

#### 📄 Setup Guide

**Arquivo:** `api-b-boss-club/docs/SUPABASE_STORAGE_SETUP.md`

**Conteúdo:**

- ✅ Passo a passo para criar bucket
- ✅ 4 políticas RLS (INSERT, SELECT, UPDATE, DELETE)
- ✅ Configuração de variáveis de ambiente
- ✅ Exemplos de URLs e transformações
- ✅ Queries SQL para monitoramento
- ✅ Troubleshooting

---

## 🚀 Como Usar

### 1️⃣ **Configurar Supabase Storage** (Obrigatório!)

Siga o guia: `api-b-boss-club/docs/SUPABASE_STORAGE_SETUP.md`

**Checklist:**

- [ ] Criar bucket `staff-avatars`
- [ ] Aplicar 4 políticas RLS
- [ ] Verificar variáveis de ambiente

**Variáveis necessárias (já devem existir):**

```env
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Frontend (.env ou .env.local)
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

### 2️⃣ **Testar no Frontend**

1. Abrir formulário de criação de staff
2. Ir para a tab "Acesso do Usuário" (step 4)
3. Verá o componente de upload no topo
4. Pode:
   - Clicar no círculo para selecionar arquivo
   - Arrastar e soltar arquivo
   - Ver preview instantâneo
   - Ver progresso do upload
   - Remover foto (botão X)

**Validações:**

- Aceita apenas JPEG, PNG, WebP
- Máximo 2MB
- Resize automático para 512x512

---

### 3️⃣ **Fluxo Completo**

#### Criar Colaborador com Foto:

1. Preencher dados básicos (nome, CPF, etc.)
2. Ir para "Acesso do Usuário"
3. Fazer upload da foto
4. Preencher email
5. Salvar

**O que acontece:**

- Foto é redimensionada (512x512)
- Upload para Supabase Storage (`staff-avatars/user-id/avatar-timestamp.jpg`)
- URL é salva no formulário
- Backend recebe `user.avatar_url`
- URL é salva na tabela `users.avatar_url`
- Resposta inclui `avatar_url`

---

#### Editar Colaborador (trocar foto):

1. Abrir modal de edição
2. Ir para "Acesso do Usuário"
3. Fazer novo upload (substitui anterior)
4. Salvar

**O que acontece:**

- Nova foto é uploadada
- Foto antiga é deletada automaticamente (limpeza)
- `users.avatar_url` é atualizado

---

## 📁 Estrutura de Arquivos Criados/Modificados

```
api-b-boss-club/
├── docs/
│   └── SUPABASE_STORAGE_SETUP.md ⭐ NOVO
├── src/
│   ├── shared/
│   │   └── services/
│   │       └── supabase-storage.service.ts ⭐ NOVO
│   └── features/
│       └── barbershop-staff/
│           ├── models/
│           │   └── barbershop-staff.models.ts ✏️ MODIFICADO
│           └── services/
│               └── barbershop-staff.service.ts ✏️ MODIFICADO

web-b-boss-club/
├── src/
│   ├── shared/
│   │   ├── components/
│   │   │   └── form/
│   │   │       └── AvatarUpload.tsx ⭐ NOVO
│   │   └── utils/
│   │       └── supabase-storage.utils.ts ⭐ NOVO
│   └── features/
│       └── barbershop-staff/
│           ├── schemas/
│           │   └── barbershop-staff.schemas.ts ✏️ MODIFICADO
│           └── components/
│               └── form/
│                   └── steps/
│                       └── UserAccessStep.tsx ✏️ MODIFICADO
```

---

## 🧪 Testes Pendentes

**Antes de ir para produção, testar:**

- [ ] Upload de foto em criação de staff
- [ ] Upload de foto em edição de staff
- [ ] Validação de arquivo muito grande (> 2MB)
- [ ] Validação de tipo inválido (.gif, .pdf)
- [ ] Drag & drop funcionando
- [ ] Preview aparecendo corretamente
- [ ] Remover foto funcionando
- [ ] Foto aparecendo na listagem de staff (se implementado)
- [ ] Foto sendo salva no banco (`users.avatar_url`)
- [ ] Políticas RLS bloqueando acesso não autorizado
- [ ] Limpeza de fotos antigas funcionando

---

## 🎯 Próximos Passos Sugeridos

1. **Mostrar foto na listagem de staff** (tabela)
   - Adicionar coluna com avatar
   - Usar componente `StaffAvatar` existente + foto

2. **Mostrar foto no sidebar do formulário**
   - Preview no `StaffSidebar.tsx`

3. **Implementar cropper de imagem**
   - Permitir recorte antes do upload
   - Lib sugerida: `react-image-crop`

4. **Cache de imagens**
   - Service Worker para cache
   - Lazy loading

5. **Otimizações**
   - Usar WebP sempre que possível
   - Implementar lazy loading
   - Placeholder blur (LQIP)

---

## 🔒 Segurança

### RLS (Row Level Security)

**Políticas implementadas:**

1. **INSERT** - Apenas autenticados podem fazer upload
2. **SELECT** - Qualquer pessoa pode ver (público)
3. **UPDATE** - Apenas dono pode atualizar
4. **DELETE** - Apenas dono pode deletar

### Validações

**Client-side:**

- Tipo de arquivo (JPEG, PNG, WebP)
- Tamanho máximo (2MB)
- Resize automático (economia)

**Server-side:**

- Validação de URL (Zod schema)
- Autenticação obrigatória
- Bucket isolado por usuário

---

## 📊 Custos (Supabase Free Tier)

**Limites FREE:**

- ✅ 1GB de storage
- ✅ 2GB de bandwidth/mês
- ✅ 50MB max file size

**Estimativa:**

- Foto: ~100KB (após resize)
- 1000 colaboradores = ~100MB
- Transferência: ~50 visualizações/foto/mês = 5MB/colaborador

**Conclusão:** FREE tier é suficiente para centenas de colaboradores! 🎉

---

## ❓ FAQ

### Posso usar outro serviço de storage?

Sim! Basta:

1. Implementar interface similar em `supabase-storage.utils.ts`
2. Trocar URLs e autenticação
3. Manter mesma estrutura de validação

### Como adicionar mais formatos?

```typescript
// web-b-boss-club/src/shared/utils/supabase-storage.utils.ts
export const STORAGE_CONFIG = {
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif", // ⬅️ Adicionar aqui
  ],
};
```

### Como aumentar tamanho máximo?

**Frontend:**

```typescript
// supabase-storage.utils.ts
MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
```

**Backend:**

```typescript
// supabase-storage.service.ts
MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
```

**Supabase Dashboard:**

- Storage → staff-avatars → Settings → File size limit

---

## ✅ Conclusão

Feature **COMPLETA** e **PRONTA** para uso!

Falta apenas:

1. Seguir o guia de setup do Supabase (`SUPABASE_STORAGE_SETUP.md`)
2. Testar fluxo completo
3. Deploy! 🚀

---

**Documentação criada por:** GitHub Copilot  
**Data:** 10/10/2025  
**Versão:** 1.0
