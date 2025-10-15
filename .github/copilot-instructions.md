# B-BOSS Club Frontend - AI Agent Instructions

Modern barbershop management SPA built with **React 19**, **TanStack Router**, **TanStack Query**, and **TypeScript**. Feature-based architecture with optimized caching and type-safe routing.

## Architecture Overview

### Monorepo Structure
This is the **frontend** (`web-b-boss-club/`) of a monorepo with a Fastify backend (`api-b-boss-club/`). Backend runs on `localhost:3002` (dev) or Supabase (prod). See `src/shared/config/environment.ts` for API URL detection.

### Feature-Based Organization
Each feature is self-contained in `src/features/{feature-name}/`:
```
src/features/barbershop-staff/
├── _index.ts              # Barrel exports
├── pages/                 # Page components
├── components/            # Feature-specific components
├── hooks/                 # TanStack Query hooks
├── services/              # API calls
├── schemas/               # Zod validation
└── locales/              # i18n translations
```

**Key features**: `auth/`, `barbershop-staff/`, `barbershop/`, `search/`, `settings/`

### Path Aliases (Critical)
Defined in `tsconfig.json` and `vite.config.ts`:
```typescript
// ✅ ALWAYS use these aliases
import { Button } from "@shared/components/ui/button";
import { useAuth } from "@features/auth/_index";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { AppProviders } from "@app/providers/_index";

// ❌ NEVER use relative imports across features
import { Button } from "../../shared/components/ui/button"; // WRONG
```

## TanStack Router (File-Based Routing)

### Route Definition Pattern
Routes live in `src/app/routes/` and use TanStack Router v1.130+:

```typescript
// src/app/routes/barbershop-staff.tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { z } from "zod";

// Search params schema for type safety
const searchSchema = z.object({
  staffName: z.string().optional(),
});

const LazyPage = lazy(() => 
  import("@features/barbershop-staff/_index.ts").then(m => ({ 
    default: m.BarbershopStaffPage 
  }))
);

export const Route = createFileRoute("/barbershop-staff")({
  validateSearch: searchSchema,
  component: () => (
    <AuthGuard requireAuth={true}>
      <MainLayout>
        <Suspense fallback={<RouteSkeleton />}>
          <LazyPage />
        </Suspense>
      </MainLayout>
    </AuthGuard>
  ),
});
```

**After adding routes**: Run `npm run routes:generate` to update `routeTree.gen.ts`

## TanStack Query (Data Fetching)

### Query Keys Pattern (CRITICAL)
Centralized in feature hooks with user isolation. See `src/features/barbershop-staff/hooks/useBarbershopStaff.ts`:

```typescript
// Define query keys with user scoping
export const STAFF_QUERY_KEYS = {
  staff: {
    all: (userId?: string) => ["barbershop-staff", userId] as const,
    lists: (userId?: string) => 
      [...STAFF_QUERY_KEYS.staff.all(userId), "list"] as const,
    list: (filters: StaffFilters, userId?: string) => 
      [...STAFF_QUERY_KEYS.staff.lists(userId), { filters }] as const,
    detail: (id: string, userId?: string) => 
      [...STAFF_QUERY_KEYS.staff.all(userId), "detail", id] as const,
  },
} as const;

// Usage in hook
export function useBarbershopStaff(filters: StaffFilters) {
  const { user } = useAuthStore();
  
  const queryKey = useMemo(
    () => STAFF_QUERY_KEYS.staff.list(filters, user?.id),
    [filters, user?.id]
  );
  
  return useQuery({
    queryKey,
    queryFn: () => fetchStaffList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
}
```

**Why user scoping**: Prevents cache pollution when users switch accounts (multi-tenant SaaS)

### Mutations with Optimistic Updates
```typescript
const createMutation = useMutation({
  mutationFn: createStaff,
  onMutate: async (newStaff) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKey);
    
    // Optimistically update
    queryClient.setQueryData(queryKey, (old) => [...old, newStaff]);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKey, context.previous);
  },
  onSettled: () => {
    // Always refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey });
  },
});
```

**Global config**: See `src/shared/lib/react-query.ts` for `createQueryOptions` factories

## API Communication

### ApiService Singleton
All HTTP calls use `src/shared/services/api.service.ts`:

```typescript
import { apiService } from "@shared/services/api.service";

// Automatically adds Authorization header from tokenManager
export async function fetchStaffList(filters: StaffFilters) {
  const response = await apiService.get<StaffListResponse>(
    "/barbershop/staff",
    { params: filters }
  );
  return response.data;
}
```

**Features**:
- Auto-retries on 401 (token refresh via `tokenManager`)
- Global error handling (see `src/shared/lib/errors`)
- CORS configured for `localhost:3002` and Supabase

### Token Management
`src/shared/services/token-manager.ts` handles JWT lifecycle:
- `access_token` (main auth)
- `temp_token` (MFA/forgot password flows)
- Auto-clears on 401 except for MFA routes

## Component Patterns

### UI Components (Radix + CVA)
Located in `src/shared/components/ui/`. Follow this pattern:

```typescript
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**Conventions**:
- Always use `forwardRef` for DOM elements
- Always set `displayName`
- Use `cn()` from `src/shared/lib/utils.ts` for className merging
- Support `asChild` prop for Radix composition

### Feature Components
Example from `src/features/barbershop-staff/components/common/BulkActionsBar.tsx`:

```typescript
/**
 * 🎯 Barra de ações em lote para staff members
 * 
 * Features:
 * - Animação slide up com Framer Motion
 * - Contador de itens selecionados
 * - Botões de ações com confirmação
 * - Loading states durante operações
 */
export function BulkActionsBar({ selectedIds, onActivate, isActivating }: Props) {
  const { t } = useTranslation("barbershop-staff");
  
  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          {/* Component content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Use emojis in JSDoc** for visual scanning (🎯 purpose, 🚀 performance, ⚠️ warnings)

## State Management

### Zustand Stores
Global state in `src/app/store/`. Example: `auth.ts`

```typescript
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      { 
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }) // Only persist user
      }
    ),
    { name: "auth-store" } // DevTools name
  )
);
```

**Available Stores**:
- `auth.ts` - User authentication state (persisted)
- `app.ts` - Theme, sidebar, notifications (not persisted)

**When to use**:
- Auth state (persist across reloads)
- UI preferences (theme, sidebar state)
- Form wizards (multi-step flows)

**When NOT to use**:
- Server data (use TanStack Query)
- URL state (use TanStack Router search params)
- Form state (use React Hook Form)

**LocalStorage Keys**:
- `auth-storage` - Zustand auth store
- `access_token` - JWT token (managed by `tokenManager`)
- `temp_token` - Temporary token for MFA flows
- `forgot_password_email` - Email for password reset flow
- `{feature}-table-settings` - Table customizations per feature

## Internationalization (i18n)

### Translation Files
Located in `src/features/{feature}/locales/` and `src/shared/locales/`:

```json
// src/features/barbershop-staff/locales/pt-BR.json
{
  "title": "Equipe da Barbearia",
  "table": {
    "name": "Nome",
    "role": "Cargo",
    "status": "Status"
  }
}
```

### Usage in Components
```typescript
import { useTranslation } from "react-i18next";

export function StaffTable() {
  const { t } = useTranslation("barbershop-staff");
  
  return (
    <h1>{t("title")}</h1>
    <th>{t("table.name")}</th>
  );
}
```

**Namespace = feature name** (e.g., `"barbershop-staff"`, `"auth"`, `"settings"`)

## Development Workflows

### Quick Start Commands
```bash
# Install dependencies (uses npm, not pnpm like backend)
npm install

# Development server (http://localhost:5173)
npm run dev

# Type checking (no emitting)
npm run type-check

# Linting with auto-fix
npm run lint:fix

# Run tests with coverage
npm run test:coverage

# Build with bundle analysis
npm run build:analyze

# Generate route tree after adding routes
npm run routes:generate
```

### Creating New Features
```bash
# Automated feature scaffolding
npm run create-feature my-feature

# Creates:
# - src/features/my-feature/
# - All boilerplate (page, hooks, services, schemas, locales)
# - Pre-configured barrel exports
```

See `scripts/create-feature.js` for template structure

### Testing
Located in `src/test/` with Vitest + React Testing Library:

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

**Run**: `npm run test:ui` for interactive UI

## Build & Bundle Optimization

### Manual Code Splitting
Defined in `vite.config.ts`:

```typescript
manualChunks: {
  "react-vendor": ["react", "react-dom"],
  "router-vendor": ["@tanstack/react-router"],
  "query-vendor": ["@tanstack/react-query"],
  "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-select"],
  "forms-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
}
```

**Current bundle**: ~140KB gzipped

### Environment Variables
Vite uses `.env` files with `VITE_` prefix:

```env
VITE_API_URL=http://localhost:3002
```

But in this project, **API URL is auto-detected** via `src/shared/config/environment.ts`:
- `localhost` → `http://localhost:3002`
- Production → Supabase URL

## Project-Specific Conventions

### Emoji Prefixes in Comments
Used throughout codebase for visual scanning:
- 🚀 Performance optimization
- 🎯 Main purpose/feature
- 🔑 Authentication/critical
- ⚠️ Warning/caution
- 🔧 Configuration
- 📝 Documentation

### TypeScript Strict Mode
`tsconfig.json` has strict mode enabled:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Never use `any`**. Use `unknown` or proper types.

### Form Validation
All forms use React Hook Form + Zod:

```typescript
// Define schema
const staffSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
});

type StaffForm = z.infer<typeof staffSchema>;

// Use in component
const { register, handleSubmit } = useForm<StaffForm>({
  resolver: zodResolver(staffSchema),
});
```

Schemas live in `src/features/{feature}/schemas/`

### Multi-Step Forms
For complex forms (e.g., staff creation wizard):

```typescript
import { useStepNavigation } from "@shared/hooks/form/useStepNavigation";
import { useStepValidation } from "@shared/hooks/form/useStepValidation";

function WizardForm() {
  const {
    currentStep,
    goNext,
    goPrevious,
    isFirstStep,
    isLastStep,
  } = useStepNavigation({ totalSteps: 4 });
  
  const { validateStep } = useStepValidation(formSchema, currentStep);
  
  return (
    <Form>
      {currentStep === 1 && <BasicDataStep />}
      {currentStep === 2 && <UnitsStep />}
      {currentStep === 3 && <WorkScheduleStep />}
      {currentStep === 4 && <UserAccessStep />}
      
      <Button onClick={goPrevious} disabled={isFirstStep}>
        Previous
      </Button>
      <Button onClick={() => validateStep(() => goNext())} disabled={isLastStep}>
        Next
      </Button>
    </Form>
  );
}
```

**Example**: `src/features/barbershop-staff/components/form/StaffForm.tsx`

**Hooks**:
- `useStepNavigation` - Step state management
- `useStepValidation` - Per-step validation

## Animations & Motion

### Framer Motion Integration
Centralized animation system in `src/shared/animations/`:

```typescript
import { PageTransition, FadeIn, StaggeredList } from "@shared/animations";

export function MyPage() {
  return (
    <PageTransition variant="fadeIn">
      <FadeIn direction="up" delay={0.2}>
        <h1>Animated Content</h1>
      </FadeIn>
      
      <StaggeredList staggerDelay={0.1}>
        {items.map(item => (
          <StaggeredItem key={item.id}>
            {item.name}
          </StaggeredItem>
        ))}
      </StaggeredList>
    </PageTransition>
  );
}
```

**Available Components**:
- `PageTransition` - Page-level transitions
- `FadeIn` - Fade with directional slide
- `ScaleIn` - Scale animations
- `StaggeredList/Item` - Stagger children
- `MotionButton` - Animated buttons
- `MotionCard` - Hover effects

**Accessibility**: All animations respect `prefers-reduced-motion`

### Performance Optimizations

#### `useMemo` Usage Pattern
```typescript
// Query keys MUST be memoized
const queryKey = useMemo(
  () => STAFF_QUERY_KEYS.staff.list(filters, user?.id),
  [filters, user?.id]
);

// Filters merging
const mergedFilters = useMemo(
  () => ({ ...DEFAULT_FILTERS, ...filters }),
  [filters]
);
```

**Why**: Prevents infinite re-renders and unnecessary API calls

#### `React.memo` Strategy
Only used after profiling. Current usage:
- `src/features/barbershop-staff/components/table/columns-actions.tsx` - `StaffActions`
- `src/features/barbershop-staff/components/dialogs/ConfirmBulkActionDialog.tsx`
- `src/shared/components/filters/Filter.tsx`

**Pattern**:
```typescript
export const ExpensiveComponent = memo(function ExpensiveComponent({ prop }) {
  // Component logic
});
```

#### Performance Monitoring
```typescript
import { usePerformanceOptimization } from "@shared/hooks";

const {
  optimizedData,
  shouldEnableAnimations,
  shouldVirtualize,
  performanceConfig
} = usePerformanceOptimization(data, {
  enableAnimations: true,
  virtualizeThreshold: 100,
});
```

**See**: `src/shared/hooks/usePerformanceOptimization.ts`

## Advanced Patterns

### Drag & Drop (DnD Kit)
Used in table column reordering:

```typescript
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

// See: src/shared/components/table/TableSettings.backup.tsx
```

**Note**: Currently backup implementation only. Production uses simplified version.

### File Upload Pattern
Supabase Storage integration in `src/shared/utils/supabase-storage.utils.ts`:

```typescript
import { uploadFile, STORAGE_CONFIG } from "@shared/utils/supabase-storage.utils";

const result = await uploadFile({
  bucket: STORAGE_CONFIG.BUCKETS.STAFF_AVATARS,
  path: `${userId}/avatar-${Date.now()}.jpg`,
  file: imageFile,
  onProgress: (progress) => console.log(`${progress}%`)
});

if (result.success) {
  console.log("Uploaded:", result.url);
}
```

**Features**:
- Max 2MB file size
- Allowed types: JPEG, PNG, WebP
- Progress tracking
- Automatic validation

**Component**: `src/shared/components/form/AvatarUpload.tsx`

### URL State Management (nuqs)
For filters and searchable state:

```typescript
import { NuqsAdapter } from "nuqs/adapters/react";

// Wrapped in FiltersProvider (src/app/providers/FiltersProvider.tsx)
// Syncs filter state to URL query params
```

**Why**: Shareable URLs with filter state

### Error Handling Patterns

#### Error Boundary
```typescript
import { ErrorBoundary } from "@shared/components/errors/ErrorBoundary";

<ErrorBoundary fallback={CustomErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

**Implementation**: `src/shared/components/errors/ErrorBoundary.tsx`  
**Usage**: Wrapped around entire app in `AppProviders`

#### Error Handler Singleton
```typescript
import { ErrorHandler, ErrorTypes, createAppError } from "@shared/lib/errors";

const errorHandler = ErrorHandler.getInstance(useToast());

const error = createAppError({
  type: ErrorTypes.VALIDATION,
  code: "INVALID_EMAIL",
  message: "Email format invalid",
  context: { email }
});

errorHandler.handle(error);
```

**Features**:
- Automatic toast notifications
- Logging based on error type
- External reporting (placeholder for Sentry)

**Files**:
- `src/shared/lib/errors/handler.ts` - Error handler
- `src/shared/lib/errors/taxonomy.ts` - Error types

## Testing Patterns

### Component Testing
```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MyComponent", () => {
  it("should handle user interaction", async () => {
    render(<MyComponent />);
    
    const button = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("Success")).toBeInTheDocument();
    });
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from "@testing-library/react";

it("should update state", () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.updateValue("new value");
  });
  
  expect(result.current.value).toBe("new value");
});
```

### Mocking TanStack Query
```typescript
// src/test/utils/test-utils.tsx provides wrapper with QueryClient
import { renderWithProviders } from "@test/utils/test-utils";

test("fetches data", async () => {
  renderWithProviders(<MyComponent />);
  // Queries are automatically wrapped
});
```

**No MSW**: Mock Service Worker not configured. API calls mocked via Vitest.

## Critical Debugging Notes

### Authentication Flow
1. `tokenManager.setAccessToken()` stores JWT in localStorage
2. `apiService` auto-adds `Authorization: Bearer {token}` header
3. Backend verifies JWT via `src/plugins/supabase-auth.plugin.ts`
4. On 401, frontend clears tokens and redirects to `/auth/login` (except MFA routes)

**Multi-tab Sync**: `tokenManager` listens to `storage` events to sync tokens across tabs

### Common Gotchas
- **Route changes not working?** Run `npm run routes:generate`
- **Infinite re-renders?** Check `useMemo` dependencies in query hooks
- **Cache not invalidating?** Ensure query keys match exactly (including user ID)
- **401 errors in MFA flow?** Check `tokenManager.getTempToken()` preservation logic in `api.service.ts:122`
- **Animations not respecting reduced motion?** Check `src/shared/animations/config.ts`
- **Large bundle size?** Run `npm run build:analyze` to inspect chunks

## Key Files Reference

- `src/App.tsx` - Router + provider setup
- `src/app/routes/` - All route definitions
- `src/app/store/auth.ts` - Global auth state
- `src/shared/services/api.service.ts` - HTTP client singleton
- `src/shared/services/token-manager.ts` - JWT lifecycle
- `src/shared/lib/react-query.ts` - Query config factories
- `src/shared/components/ui/` - Radix-based component library
- `vite.config.ts` - Build config with code splitting
- `tailwind.config.js` - Design system tokens

## Important Notes

- **Package manager**: npm (backend uses pnpm)
- **Node version**: 18+ required
- **Animation library**: Framer Motion (see `src/shared/animations/`)
- **Table virtualization**: `react-window` for large datasets (see `OptimizedTable.tsx`)
- **Dark mode**: Supported via Tailwind CSS variables
- **Mobile support**: Responsive design via Tailwind breakpoints
