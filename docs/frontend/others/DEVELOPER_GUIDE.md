# 👨‍💻 Guia do Desenvolvedor

> **Guia completo para desenvolvedores humanos** trabalhando com o Template Default

---

## 🎯 **Visão Geral para Desenvolvedores**

Este template foi construído seguindo **best practices** da indústria e padrões modernos de desenvolvimento React/TypeScript. Ele serve como uma base sólida para projetos de qualquer tamanho.

---

## 🏗️ **Arquitetura do Sistema**

### 📁 **Estrutura Feature-based**

```
src/
├── app/                 # ⚙️ Configuração da aplicação
│   ├── providers/       # Context providers (Query, Router, etc.)
│   └── config/          # Configurações globais
├── features/            # 🎯 Features organizadas por domínio
│   ├── records/         # Feature genérica de registros
│   │   ├── components/  # Componentes específicos
│   │   ├── hooks/       # Hooks da feature
│   │   ├── services/    # Lógica de API
│   │   ├── schemas/     # Validação Zod
│   │   └── pages/       # Páginas da feature
│   └── comunicacoes/    # Feature legacy (será removida)
├── shared/              # 🔗 Recursos compartilhados
│   ├── components/      # UI components reutilizáveis
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Utilitários e configurações
│   └── animations/      # Sistema de animações
├── routes/              # 🛣️ Definições de rotas
└── i18n/                # 🌐 Internacionalização
```

### 🎨 **Padrões de Design**

#### **1. Component Composition**
```tsx
// ✅ Bom: Componente composável
export function DataTable<T>({ data, columns, actions }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader columns={columns} />
      <TableBody data={data} columns={columns} />
      {actions && <TableActions actions={actions} />}
    </Table>
  );
}

// ❌ Evite: Componente monolítico
export function MegaTable() {
  // 500+ linhas de código...
}
```

#### **2. Hook Composition**
```tsx
// ✅ Bom: Hook específico e reutilizável
export function useRecords() {
  const query = useQuery({
    queryKey: ['records'],
    queryFn: fetchRecords
  });
  
  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => queryClient.invalidateQueries(['records'])
  });
  
  return { 
    records: query.data, 
    isLoading: query.isLoading,
    create: createMutation.mutate 
  };
}
```

#### **3. Type Safety**
```tsx
// ✅ Bom: Tipos bem definidos
interface Record {
  id: string;
  title: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}

export function RecordCard({ record }: { record: Record }) {
  // TypeScript garante que todas as propriedades existem
}

// ❌ Evite: any ou tipos frouxos
export function RecordCard({ record }: { record: any }) {
  // Sem segurança de tipos
}
```

---

## 🛠️ **Desenvolvimento Local**

### 🔧 **Setup Inicial**

1. **Clone e instale dependências**
```bash
git clone <repo-url>
cd template-default/frontend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edite as variáveis necessárias
```

3. **Inicie o desenvolvimento**
```bash
npm run dev  # http://localhost:3002
```

### 🧪 **Testing Workflow**

```bash
# Testes em watch mode
npm run test

# UI de testes (recomendado)
npm run test:ui

# Testes com coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### 🔄 **Git Workflow**

```bash
# 1. Crie uma branch feature
git checkout -b feature/nova-funcionalidade

# 2. Faça commits seguindo Conventional Commits
git commit -m "feat(records): add bulk delete functionality"
git commit -m "fix(calendar): resolve date selection bug"
git commit -m "docs(readme): update installation guide"

# 3. Push e abra PR
git push origin feature/nova-funcionalidade
```

---

## 🎨 **Sistema de Componentes**

### 🧩 **Componentes Base**

#### **Button System**
```tsx
// Variantes disponíveis
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Com animações
<MotionButton variant="scale">Scale Effect</MotionButton>
<MotionButton variant="lift">Lift Effect</MotionButton>
```

#### **Form Components**
```tsx
// Formulários com validação
const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido")
});

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  });
  
  return (
    <Form {...form}>
      <FormField name="name" render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </Form>
  );
}
```

### 🎬 **Sistema de Animações**

#### **Componentes Animados**
```tsx
// Fade in
<AnimatedBox variant="fadeIn">
  <Card>Conteúdo animado</Card>
</AnimatedBox>

// Lista animada com stagger
<AnimatedList>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</AnimatedList>

// Tabela com rows animadas
<tbody>
  {data.map((row, index) => (
    <AnimatedTableRow key={row.id} index={index}>
      <td>{row.name}</td>
    </AnimatedTableRow>
  ))}
</tbody>
```

#### **Custom Animations**
```tsx
// Hook personalizado para animações
export function useScrollReveal() {
  const { ref, isInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  
  return { ref, isInView };
}

// Uso
function MyComponent() {
  const { ref, isInView } = useScrollReveal();
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      Conteúdo revelado no scroll
    </motion.div>
  );
}
```

---

## 📝 **Sistema Records Genérico**

### 🎯 **Adaptando para Novo Domínio**

1. **Defina os schemas**
```tsx
// schemas/product.schemas.ts
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome obrigatório"),
  price: z.number().positive("Preço deve ser positivo"),
  category: z.string(),
  status: z.enum(['active', 'inactive'])
});

export type Product = z.infer<typeof productSchema>;
```

2. **Crie o service**
```tsx
// services/product.service.ts
export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch('/api/products');
    return response.json();
  },
  
  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

3. **Implemente os hooks**
```tsx
// hooks/useProducts.ts
export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });
  
  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produto criado com sucesso!');
    }
  });
  
  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    create: createMutation.mutate,
    isCreating: createMutation.isLoading
  };
}
```

4. **Configure as colunas da tabela**
```tsx
// components/productColumns.tsx
export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
      return <div>{formatted}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ProductActions product={row.original} />
    )
  }
];
```

---

## 🌐 **Internacionalização**

### 🔧 **Adicionando Novos Idiomas**

1. **Crie arquivo de tradução**
```json
// i18n/locales/es-ES/common.json
{
  "buttons": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar"
  },
  "messages": {
    "success": "Operación exitosa",
    "error": "Ocurrió un error"
  }
}
```

2. **Configure no init.ts**
```tsx
// i18n/init.ts
const resources = {
  'pt-BR': {
    common: ptBRCommon,
    records: ptBRRecords
  },
  'en-US': {
    common: enUSCommon,
    records: enUSRecords  
  },
  'es-ES': {
    common: esESCommon,
    records: esESRecords
  }
};
```

### 🎯 **Uso em Componentes**
```tsx
export function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <Button>{t('buttons.save')}</Button>
    </div>
  );
}
```

---

## ⚡ **Performance**

### 🎯 **Best Practices**

#### **1. Lazy Loading**
```tsx
// Lazy loading de rotas
const RecordsPage = lazy(() => import('./features/records/pages/RecordsPage'));

// Lazy loading de componentes
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes />
    </Suspense>
  );
}
```

#### **2. Memo e useMemo**
```tsx
// Memo em componentes
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* renderização complexa */}</div>;
});

// useMemo para cálculos
function DataList({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);
  
  return <List items={filteredItems} />;
}
```

#### **3. Virtualização**
```tsx
// Para listas longas
import { VirtualizedTable } from '@shared/components/ui';

function LargeDataTable({ data }) {
  return (
    <VirtualizedTable
      data={data}
      itemHeight={50}
      containerHeight={400}
      renderItem={({ item }) => <TableRow data={item} />}
    />
  );
}
```

---

## 🐛 **Debug e Troubleshooting**

### 🔍 **Ferramentas de Debug**

#### **1. React Query Devtools**
```tsx
// Já configurado em development
// Acesse a aba React Query nas DevTools
```

#### **2. TanStack Router Devtools**
```tsx
// Já configurado em development
// Acesse a aba TanStack Router nas DevTools
```

#### **3. Logs Estruturados**
```tsx
// Use o sistema de logging
import { logger } from '@shared/lib/logger';

export function MyComponent() {
  useEffect(() => {
    logger.info('Component mounted', { component: 'MyComponent' });
  }, []);
}
```

### 🚨 **Problemas Comuns**

#### **1. Hydration Errors**
```tsx
// ❌ Problema: Diferença entre server e client
function MyComponent() {
  return <div>{new Date().toString()}</div>;
}

// ✅ Solução: useEffect para client-only
function MyComponent() {
  const [date, setDate] = useState<string>();
  
  useEffect(() => {
    setDate(new Date().toString());
  }, []);
  
  return <div>{date}</div>;
}
```

#### **2. Memory Leaks**
```tsx
// ❌ Problema: Subscription não limpa
useEffect(() => {
  const subscription = someObservable.subscribe();
  // Sem cleanup
}, []);

// ✅ Solução: Cleanup function
useEffect(() => {
  const subscription = someObservable.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

---

## 📊 **Monitoramento e Análise**

### 📈 **Métricas de Performance**
- Lighthouse CI integrado
- Bundle size analysis com `npm run build:analyze`
- Web Vitals monitoring

### 🔍 **Error Tracking**
- Error boundaries implementados
- Logging estruturado
- Preparado para Sentry integration

---

## 🔄 **Roadmap de Melhorias**

### ⭐ **Próximas Features**
- [ ] PWA support
- [ ] Offline capabilities  
- [ ] Real-time updates
- [ ] Advanced caching strategies
- [ ] Micro-frontend support

### 🐛 **Known Issues**
- Toast warnings em testes (warnings apenas, funcionalidade OK)
- Legacy comunicacoes feature (será removida na v2.0)

---

## 🤝 **Contribuindo**

### 📝 **Guidelines**
1. **Sempre** execute testes antes de commit
2. **Mantenha** cobertura de testes > 80%
3. **Documente** features novas
4. **Siga** os padrões de código existentes
5. **Use** Conventional Commits

### 🎯 **Áreas que Precisam de Ajuda**
- Testes E2E com Playwright
- Documentação de componentes com Storybook
- Performance monitoring
- Accessibility improvements

---

<div align="center">
  <p><strong>Happy Coding! 🚀</strong></p>
  <p><em>Construído com ❤️ para a comunidade de desenvolvimento</em></p>
</div>
