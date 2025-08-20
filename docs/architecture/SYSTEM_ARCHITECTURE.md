# 🏗️ Arquitetura do Sistema

> **Documentação técnica completa** da arquitetura do Template Default

---

## 📋 **Visão Geral**

O Template Default é uma **aplicação web moderna** construída com foco em:
- ✅ **Escalabilidade** - Suporta crescimento orgânico
- ✅ **Manutenibilidade** - Código limpo e bem estruturado
- ✅ **Performance** - Otimizado para velocidade
- ✅ **Developer Experience** - Ferramental moderno
- ✅ **Type Safety** - TypeScript rigoroso

---

## 🎯 **Princípios Arquiteturais**

### 1. **📦 Modularidade por Features**
```
Cada feature é um módulo independente e autocontido
├── components/     # Componentes específicos da feature  
├── hooks/         # Lógica de estado personalizada
├── services/      # Integração com APIs
├── schemas/       # Validação de dados
└── pages/         # Rotas e páginas
```

### 2. **🔄 Separation of Concerns**
- **UI Layer** → Componentes React puros
- **Logic Layer** → Hooks personalizados  
- **Data Layer** → Services e TanStack Query
- **Validation Layer** → Schemas Zod

### 3. **⚡ Performance First**
- **Lazy Loading** → Carregamento sob demanda
- **Code Splitting** → Bundle otimizado
- **Memoization** → React.memo e useMemo
- **Virtualization** → Lista grandes otimizadas

### 4. **🔒 Type Safety**
- **TypeScript Strict** → Máxima segurança de tipos
- **Schema Validation** → Runtime validation com Zod
- **API Types** → Contratos bem definidos

---

## 🏛️ **Arquitetura em Camadas**

### 📊 **Diagrama de Camadas**

```
┌─────────────────────────────────────────────────────────┐
│                    🎨 PRESENTATION LAYER                │
│                  (React Components)                     │
├─────────────────────────────────────────────────────────┤
│                    🧠 BUSINESS LOGIC LAYER              │
│                    (Custom Hooks)                       │
├─────────────────────────────────────────────────────────┤
│                    🔄 STATE MANAGEMENT LAYER            │
│                  (TanStack Query)                       │
├─────────────────────────────────────────────────────────┤
│                    🌐 DATA ACCESS LAYER                 │
│                     (Services)                          │
├─────────────────────────────────────────────────────────┤
│                    ✅ VALIDATION LAYER                  │
│                   (Zod Schemas)                         │
└─────────────────────────────────────────────────────────┘
```

### 🎨 **Presentation Layer**

**Responsabilidade:** Interface do usuário e interações

```tsx
// Exemplo: Componente de apresentação puro
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardActions>
        <Button onClick={() => onEdit(product)}>Editar</Button>
        <Button variant="destructive" onClick={() => onDelete(product.id)}>
          Excluir
        </Button>
      </CardActions>
    </Card>
  );
}
```

**Características:**
- ✅ Componentes puros (sem side effects)
- ✅ Props bem tipadas
- ✅ Responsabilidade única
- ✅ Reutilizáveis

### 🧠 **Business Logic Layer**

**Responsabilidade:** Lógica de negócio e estado da aplicação

```tsx
// Exemplo: Hook de lógica de negócio
export function useProducts() {
  // Estado derivado das queries
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

  // Mutations para ações
  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) => 
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produto atualizado com sucesso!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produto excluído com sucesso!');
    }
  });

  // API simplificada para componentes
  return {
    // Estado
    products: productsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,

    // Ações
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,

    // Status das ações
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}
```

**Características:**
- ✅ Encapsula lógica complexa
- ✅ Interface simples para UI
- ✅ Gerencia side effects
- ✅ Error handling centralizado

### 🔄 **State Management Layer**

**Responsabilidade:** Cache e sincronização de dados

```tsx
// Configuração do TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Retry automático em caso de erro
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      // Refetch quando janela recebe foco
      refetchOnWindowFocus: false
    },
    mutations: {
      // Retry para mutations críticas
      retry: (failureCount, error) => {
        return failureCount < 2 && error.status >= 500;
      }
    }
  }
});

// Provider global
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Características:**
- ✅ Cache automático e inteligente
- ✅ Sincronização em background
- ✅ Otimistic updates
- ✅ Error boundaries

### 🌐 **Data Access Layer**

**Responsabilidade:** Comunicação com APIs externas

```tsx
// Exemplo: Service bem estruturado
const API_BASE = '/api/products';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new APIError('Falha ao buscar produtos', response.status);
    }
    return response.json();
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(`Produto ${id} não encontrado`);
      }
      throw new APIError('Falha ao buscar produto', response.status);
    }
    return response.json();
  },

  async create(data: CreateProductData): Promise<Product> {
    // Validação antes de enviar
    const validatedData = createProductSchema.parse(data);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      throw new APIError('Falha ao criar produto', response.status);
    }
    
    return response.json();
  }

  // ... outros métodos
};

// Classes de erro customizadas
export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
```

**Características:**
- ✅ Error handling robusto
- ✅ Validação de entrada
- ✅ Types seguros
- ✅ Logging estruturado

### ✅ **Validation Layer**

**Responsabilidade:** Validação e transformação de dados

```tsx
// Schemas Zod bem estruturados
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.enum(['electronics', 'clothing', 'books']),
  status: z.enum(['active', 'inactive']).default('active'),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schemas derivados
export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateProductSchema = createProductSchema.partial();

// Inferência de tipos
export type Product = z.infer<typeof productSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;

// Validação com transformação
export const productFilterSchema = z.object({
  search: z.string().default(''),
  category: z.enum(['all', 'electronics', 'clothing', 'books']).default('all'),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  priceRange: z.tuple([z.number(), z.number()]).default([0, 1000]),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type ProductFilters = z.infer<typeof productFilterSchema>;
```

**Características:**
- ✅ Validação runtime + compile time
- ✅ Mensagens de erro customizadas
- ✅ Transformação automática
- ✅ Type inference

---

## 🗂️ **Estrutura de Diretórios Detalhada**

### 📁 **Frontend Structure**

```
src/
├── 🎯 features/                    # Features modulares
│   ├── records/                    # Feature de registros
│   │   ├── components/             # Componentes da feature
│   │   │   ├── RecordsTable.tsx   # Tabela principal
│   │   │   ├── RecordModal.tsx    # Modal de criação/edição
│   │   │   ├── RecordCard.tsx     # Card individual
│   │   │   └── index.ts           # Barrel export
│   │   ├── hooks/                  # Hooks específicos
│   │   │   ├── useRecords.ts      # Hook principal
│   │   │   ├── useRecordFilters.ts # Hook de filtros
│   │   │   └── index.ts
│   │   ├── services/               # APIs da feature
│   │   │   └── record.service.ts
│   │   ├── schemas/                # Validação da feature
│   │   │   └── record.schemas.ts
│   │   ├── pages/                  # Páginas da feature
│   │   │   └── RecordsPage.tsx
│   │   └── index.ts               # Export principal
│   │
│   └── products/                   # Exemplo de nova feature
│       └── [mesma estrutura]
│
├── 🔗 shared/                      # Recursos compartilhados
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── ui/                    # Componentes básicos (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/                # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── filters/               # Componentes de filtro
│   │   │   ├── ModernCalendar.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── StatusFilter.tsx
│   │   │   └── index.ts
│   │   ├── animations/            # Componentes animados
│   │   │   ├── AnimatedBox.tsx
│   │   │   ├── AnimatedList.tsx
│   │   │   ├── AnimatedTableRow.tsx
│   │   │   └── index.ts
│   │   └── feedback/              # Feedback ao usuário
│   │       ├── Toast.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                     # Hooks reutilizáveis
│   │   ├── useLocalStorage.ts     # Hook de localStorage
│   │   ├── useDebounce.ts         # Hook de debounce
│   │   ├── useKeyboard.ts         # Hook de atalhos
│   │   ├── useMediaQuery.ts       # Hook responsivo
│   │   └── index.ts
│   │
│   ├── lib/                       # Utilitários
│   │   ├── utils.ts               # Utilitários gerais (cn, etc)
│   │   ├── constants.ts           # Constantes globais
│   │   ├── validators.ts          # Validadores comuns
│   │   ├── formatters.ts          # Formatadores (data, moeda)
│   │   ├── api-client.ts          # Cliente HTTP configurado
│   │   └── index.ts
│   │
│   ├── types/                     # Tipos globais
│   │   ├── api.types.ts           # Tipos de API
│   │   ├── common.types.ts        # Tipos comuns
│   │   ├── route.types.ts         # Tipos de rota
│   │   └── index.ts
│   │
│   └── styles/                    # Estilos globais
│       ├── globals.css            # CSS global
│       ├── components.css         # CSS de componentes
│       └── animations.css         # CSS de animações
│
├── 🛣️ routes/                      # Sistema de rotas
│   ├── __root.tsx                # Layout raiz
│   ├── index.tsx                  # Página inicial
│   ├── records/                   # Rotas de registros
│   │   ├── index.tsx             # /records
│   │   └── $recordId.tsx         # /records/$recordId
│   ├── comunicacoes.tsx           # Redirection route
│   └── _layout/                   # Layouts compartilhados
│       └── dashboard.tsx
│
├── 🌐 locales/                    # Internacionalização
│   ├── pt-BR/                    # Português brasileiro
│   │   ├── common.json           # Textos comuns
│   │   ├── records.json          # Textos de registros
│   │   ├── errors.json           # Mensagens de erro
│   │   └── validation.json       # Mensagens de validação
│   └── en-US/                    # Inglês americano
│       └── [mesmos arquivos]
│
├── 📱 App.tsx                     # Componente raiz
├── 🚀 main.tsx                    # Entry point
└── 🌍 vite-env.d.ts              # Tipos do Vite
```

### 📊 **Fluxo de Dados**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   User      │───▶│  Component   │───▶│   Hook      │
│ Interaction │    │   (UI)       │    │ (Logic)     │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  External   │◀───│   Service    │◀───│ TanStack    │
│    API      │    │ (Data Layer) │    │   Query     │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
                         ┌─────────────────────────────┐
                         │      Cache & State          │
                         │    Management Layer         │
                         └─────────────────────────────┘
```

---

## ⚙️ **Configurações e Build**

### 🔧 **Vite Configuration**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    // Plugin para análise de bundle
    bundleAnalyzer({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled'
    })
  ],
  
  // Otimizações de build
  build: {
    // Code splitting por feature
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          
          // Feature chunks
          records: ['./src/features/records'],
          shared: ['./src/shared']
        }
      }
    },
    
    // Otimização de assets
    assetsInlineLimit: 4096,
    
    // Source maps para produção
    sourcemap: true
  },
  
  // Configuração do dev server
  server: {
    port: 3002,
    open: true,
    // Proxy para API local
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features')
    }
  }
});
```

### 📦 **TypeScript Configuration**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // Strict type checking
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // Module system
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    
    // JSX
    "jsx": "react-jsx",
    
    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@features/*": ["./src/features/*"]
    }
  },
  "include": [
    "src",
    "vite-env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

### 🎨 **Tailwind Configuration**

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  
  theme: {
    extend: {
      // Design system colors
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        }
      },
      
      // Custom animations
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out"
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
}
```

---

## 🔄 **Padrões de Estado e Fluxo**

### 📊 **State Management Patterns**

#### **1. Local State (useState)**
```tsx
// Para estado simples e isolado
function ProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Lógica simples local
}
```

#### **2. Form State (react-hook-form)**
```tsx
// Para formulários complexos
function ProductForm() {
  const form = useForm<CreateProductData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'electronics',
      status: 'active',
      tags: []
    }
  });
  
  const onSubmit = form.handleSubmit((data) => {
    createProduct(data);
  });
}
```

#### **3. Server State (TanStack Query)**
```tsx
// Para dados do servidor
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    // Configurações de cache
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Configurações de refetch
    refetchOnWindowFocus: false
  });
}
```

#### **4. Global State (Context quando necessário)**
```tsx
// Para estado global específico
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}>();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 🔄 **Data Flow Patterns**

#### **1. Optimistic Updates**
```tsx
const updateMutation = useMutation({
  mutationFn: productService.update,
  
  // Update otimista
  onMutate: async (newProduct) => {
    await queryClient.cancelQueries(['products']);
    
    const previousProducts = queryClient.getQueryData(['products']);
    
    queryClient.setQueryData(['products'], (old: Product[]) =>
      old.map(product => 
        product.id === newProduct.id 
          ? { ...product, ...newProduct.data }
          : product
      )
    );
    
    return { previousProducts };
  },
  
  // Rollback em caso de erro
  onError: (err, newProduct, context) => {
    queryClient.setQueryData(['products'], context?.previousProducts);
  },
  
  // Sempre refetch após sucesso/erro
  onSettled: () => {
    queryClient.invalidateQueries(['products']);
  }
});
```

#### **2. Background Sync**
```tsx
// Sincronização em background
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: productService.getAll,
  
  // Refetch em intervalos
  refetchInterval: 30 * 1000, // 30 segundos
  
  // Refetch quando volta online
  refetchOnReconnect: true,
  
  // Refetch quando janela recebe foco
  refetchOnWindowFocus: true
});
```

---

## 🚀 **Performance e Otimizações**

### ⚡ **Code Splitting Strategies**

#### **1. Route-based Splitting**
```tsx
// Lazy loading de rotas
const RecordsPage = lazy(() => import('@features/records/pages/RecordsPage'));
const ProductsPage = lazy(() => import('@features/products/pages/ProductsPage'));

// No router
const router = createRouter({
  routeTree,
  // Lazy loading automático
  defaultPendingComponent: () => <div>Loading...</div>
});
```

#### **2. Component-based Splitting**
```tsx
// Lazy loading de componentes pesados
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowChart(true)}>
        Show Chart
      </Button>
      
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

### 🎯 **Render Optimization**

#### **1. React.memo for Pure Components**
```tsx
// Memoização de componentes puros
export const ProductCard = memo(function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: ProductCardProps) {
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison se necessário
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.updatedAt === nextProps.product.updatedAt;
});
```

#### **2. useMemo for Expensive Calculations**
```tsx
function ProductList({ products, filters }: ProductListProps) {
  // Filtros e ordenação memoizados
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (filters.search) {
          return product.name.toLowerCase().includes(filters.search.toLowerCase());
        }
        return true;
      })
      .filter(product => {
        if (filters.category !== 'all') {
          return product.category === filters.category;
        }
        return true;
      })
      .sort((a, b) => {
        const aValue = a[filters.sortBy];
        const bValue = b[filters.sortBy];
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
  }, [products, filters]);
  
  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### **3. useCallback for Event Handlers**
```tsx
function ProductList({ products }: ProductListProps) {
  const [selectedId, setSelectedId] = useState<string>();
  
  // Callback memoizado para evitar re-renders
  const handleProductClick = useCallback((productId: string) => {
    setSelectedId(productId);
    // Lógica adicional...
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
}
```

### 📊 **Bundle Analysis**

```bash
# Analisar bundle size
npm run build:analyze

# Lighthouse CI para performance
npm run lighthouse

# Bundle visualizer
npm run analyze
```

---

## 🔒 **Segurança e Boas Práticas**

### 🛡️ **Type Safety**

```tsx
// Tipos rigorosos em toda aplicação
interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  errors?: Record<string, string[]>;
}

// Generic type para APIs
async function apiRequest<T>(
  url: string, 
  options?: RequestInit
): Promise<APIResponse<T>> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new APIError(
      `API Error: ${response.status}`, 
      response.status
    );
  }
  
  return response.json();
}

// Uso com type safety
const products = await apiRequest<Product[]>('/api/products');
//    ^? APIResponse<Product[]>
```

### 🔐 **Input Validation**

```tsx
// Validação rigorosa com Zod
const userInputSchema = z.object({
  // Sanitização de strings
  name: z.string()
    .min(1, 'Nome obrigatório')
    .max(100, 'Nome muito longo')
    .trim()
    .transform(val => val.replace(/[<>]/g, '')), // Remove HTML
    
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
    
  // Validação de números
  age: z.number()
    .int('Idade deve ser inteira')
    .min(0, 'Idade deve ser positiva')
    .max(150, 'Idade inválida'),
    
  // Validação de arrays
  tags: z.array(z.string().max(50))
    .max(10, 'Máximo 10 tags')
    .default([]),
    
  // Enums para valores controlados
  role: z.enum(['admin', 'user', 'guest']).default('user')
});
```

### 🚨 **Error Boundaries**

```tsx
// Error boundary global
export class GlobalErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log para serviço de monitoramento
    console.error('Global Error:', error, errorInfo);
    
    // Enviar para serviço de erro (Sentry, etc)
    if (process.env.NODE_ENV === 'production') {
      // errorReportingService.report(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Algo deu errado</h2>
          <details>
            <summary>Detalhes do erro</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <Button onClick={() => this.setState({ hasError: false })}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 📈 **Monitoramento e Observabilidade**

### 📊 **Performance Metrics**

```tsx
// Hook para medir performance
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Mais que 1 frame
        console.warn(`Slow render: ${componentName} took ${renderTime}ms`);
      }
      
      // Enviar métricas para serviço de monitoramento
      if (process.env.NODE_ENV === 'production') {
        // analytics.track('component_render_time', {
        //   component: componentName,
        //   renderTime
        // });
      }
    };
  });
}

// Uso no componente
function ExpensiveComponent() {
  usePerformanceMonitor('ExpensiveComponent');
  
  return <div>{/* ... */}</div>;
}
```

### 🔍 **Error Tracking**

```tsx
// Service de error tracking
export const errorTrackingService = {
  reportError(error: Error, context?: Record<string, any>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      context
    };
    
    // Log local para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorData);
    }
    
    // Enviar para serviço em produção
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(console.error);
    }
  }
};

// Hook para tracking automático
export function useErrorTracking() {
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      errorTrackingService.reportError(
        new Error(event.message),
        { source: 'unhandled_error' }
      );
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorTrackingService.reportError(
        new Error(String(event.reason)),
        { source: 'unhandled_promise_rejection' }
      );
    };
    
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
```

---

## 🎯 **Conclusão Arquitetural**

### ✅ **Benefícios da Arquitetura**

1. **🏗️ Escalabilidade**
   - Features modulares e independentes
   - Code splitting automático
   - Bundle optimization

2. **🔧 Manutenibilidade**
   - Separação clara de responsabilidades
   - Padrões consistentes
   - Documentação abrangente

3. **⚡ Performance**
   - Lazy loading estratégico
   - Memoização inteligente
   - Cache otimizado

4. **🔒 Confiabilidade**
   - Type safety rigorosa
   - Error boundaries robustos
   - Validação abrangente

5. **👥 Developer Experience**
   - Tooling moderno
   - Hot reload rápido
   - Debugging facilitado

### 🚀 **Evolutividade**

A arquitetura foi projetada para:
- ✅ **Adição fácil de novas features**
- ✅ **Migração incremental de tecnologias**
- ✅ **Scaling horizontal de equipes**
- ✅ **Integration com sistemas externos**

---

<div align="center">
  <p><strong>🏗️ Arquitetura sólida, flexível e moderna</strong></p>
  <p><em>Preparada para crescimento e evolução contínua</em></p>
</div>
