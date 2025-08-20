# 🚀 Frontend Template - React + TanStack Router

Template moderno e otimizado para desenvolvimento frontend com React, TanStack Router e TypeScript.

## ⚡ Features Principais

- **⚛️ React 19** - Última versão com Concurrent Features
- **🛣️ TanStack Router** - Roteamento type-safe com lazy loading
- **📝 TypeScript** - Type safety completo
- **🎨 Tailwind CSS** - Styling moderno e responsivo
- **🧪 Vitest** - Testes rápidos e modernos
- **📊 TanStack Query** - Gerenciamento de estado servidor
- **🎭 Framer Motion** - Animações fluidas
- **🌍 i18next** - Internacionalização
- **🔧 ESLint + Prettier** - Code quality

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── app/                 # Configuração da aplicação
│   ├── routes/         # Definições de rotas
│   ├── providers/      # Context providers
│   └── store/         # Estado global
├── features/           # Features isoladas
│   ├── _template/     # Template para novas features
│   ├── auth/          # Autenticação
│   ├── comunicacoes/  # Feature exemplo
│   └── records/       # Feature exemplo
├── shared/             # Recursos compartilhados
│   ├── components/    # Componentes UI
│   ├── hooks/         # Custom hooks
│   ├── lib/          # Utilitários
│   └── types/        # Tipos globais
└── test/              # Configuração de testes
```

### Padrões de Roteamento

#### Estrutura Simplificada
- ✅ **Rotas centralizadas** em `src/app/routes/`
- ✅ **Lazy loading automático** com Suspense
- ✅ **Type safety completo** com TanStack Router
- ✅ **Code splitting otimizado** por rota

#### Como Adicionar Nova Rota
```tsx
// 1. Criar arquivo em src/app/routes/nova-rota.tsx
export const Route = createFileRoute("/nova-rota")({
  component: () => (
    <MainLayout>
      <Suspense fallback={<RouteSkeleton />}>
        <NovaRotaPage />
      </Suspense>
    </MainLayout>
  ),
});

// 2. Executar
npm run routes:generate
```

## 🎯 Como Criar Nova Feature

### Usando o Template Automático
```bash
# Criar nova feature baseada no template
npm run create-feature minha-feature

# Isso criará:
# - src/features/minha-feature/
# - Todos os arquivos base (page, hooks, services, etc.)
# - Com nomes e imports já configurados
```

### Estrutura de Feature
Cada feature segue o padrão:
```
features/minha-feature/
├── index.ts           # Exports públicos
├── pages/             # Componentes de página
├── components/        # Componentes específicos
├── hooks/             # Custom hooks
├── services/          # API calls
├── schemas/           # Validações Zod
└── types/             # TypeScript types
```

## � Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run build:analyze` | Build com análise de bundle |
| `npm run test` | Testes em watch mode |
| `npm run test:coverage` | Testes com coverage |
| `npm run type-check` | Verificação TypeScript |
| `npm run lint` | Linting com ESLint |
| `npm run create-feature` | Criar nova feature |
| `npm run check-all` | Verificar tudo (types + lint + tests) |

## 📊 Performance

### Code Splitting Otimizado
- **Route-level splitting**: Cada página é lazy-loaded
- **Vendor chunks**: Bibliotecas separadas por categoria
- **Bundle size**: ~140KB gzipped (otimizado)

### Loading States
- **RouteSkeleton**: Para transições entre páginas
- **ComponentSkeletons**: Para componentes específicos
- **Error Boundaries**: Tratamento robusto de erros

## 🧪 Testes

### Estrutura de Testes
```
test/
├── setup.ts           # Configuração global
├── helpers/           # Helpers de teste
├── fixtures/          # Dados mock
└── utils/             # Utilitários de teste
```

### Executar Testes
```bash
# Todos os testes
npm run test

# Com coverage
npm run test:coverage

# UI interativa
npm run test:ui
```

## 🎨 Styling

### Tailwind CSS
- **Design system consistente**
- **Dark mode support**
- **Responsive design**
- **Custom components** em `src/shared/components/ui/`

### Componentes UI
```tsx
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
```

## 🌍 Internacionalização

### Configuração
- **i18next** configurado
- **Lazy loading** de traduções
- **Type safety** para chaves de tradução

### Uso
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation('feature-name');
  return <p>{t('message.key')}</p>;
}
```

## 🔧 Configuração de Desenvolvimento

### Aliases Configurados
```typescript
"@/*"        -> "./src/*"
"@app/*"     -> "./src/app/*"
"@shared/*"  -> "./src/shared/*"
"@features/*" -> "./src/features/*"
```

### Hot Reload
- **Vite HMR** para desenvolvimento rápido
- **React Fast Refresh** preserva estado
- **TypeScript checking** em background

## 📈 Otimizações Implementadas

### Bundle Optimization
- **Tree shaking** agressivo
- **Dead code elimination**
- **Vendor chunk splitting**
- **Asset optimization**

### Runtime Performance
- **React 19 optimizations**
- **Lazy loading** estratégico
- **Memoization** onde necessário
- **Virtual scrolling** para listas grandes

## 🚦 Próximos Passos

Para usar este template em um novo projeto:

1. **Clonar e adaptar**:
   ```bash
   git clone <template-repo>
   cd novo-projeto
   npm install
   ```

2. **Personalizar**:
   - Atualizar `package.json`
   - Configurar variáveis de ambiente
   - Adaptar tema e branding

3. **Primeira feature**:
   ```bash
   npm run create-feature primeira-feature
   npm run dev
   ```

4. **Deploy**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📚 Recursos Adicionais

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query) 
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vitest Docs](https://vitest.dev)

**Template criado para máxima produtividade e qualidade de código! 🎉**
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build para produção
pnpm preview          # Preview do build

# Qualidade de código
pnpm lint             # Executa ESLint
pnpm lint:fix         # Corrige problemas automaticamente
pnpm type-check       # Verifica tipos TypeScript

# Testes
pnpm test             # Roda testes em modo watch
pnpm test:run         # Executa todos os testes
pnpm test:coverage    # Gera relatório de cobertura
```

## 🏗️ Arquitetura e Padrões

### Gerenciamento de Estado

- **Zustand** para estado global da aplicação
- **TanStack Query** para estado do servidor (cache, sincronização)
- **React Hook Form** para estado de formulários

### Validação

- **Zod** para validação de schemas
- Validação tanto no frontend quanto preparada para backend

### Componentização

- Componentes organizados por responsabilidade
- Separação clara entre componentes de UI e componentes de negócio
- Uso de composition pattern

### Performance

- **Code splitting** com lazy loading
- **Bundle splitting** otimizado
- Memoização estratégica de componentes
- Debounce em operações de busca

### 📱 Interface Responsiva

- **Design Adaptativo**: Interface otimizada para desktop, tablet e mobile
- **Componentes Reutilizáveis**: Sistema de design consistente
- **Experiência de Usuário**: Interface intuitiva e acessível

## 🛠️ Tecnologias Utilizadas

### Core

- **React 19.1.0**: Biblioteca principal para construção da interface
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Vite 7.0.4**: Build tool moderna e rápida

### Estilização

- **TailwindCSS 4.1.11**: Framework CSS utilitário para estilização
- **Radix UI**: Componentes acessíveis e customizáveis
- **Phosphorn Icons**: Biblioteca de ícones

### Gerenciamento de Estado

- **React Query 5.83.0**: Gerenciamento de estado do servidor e cache
- **React Hooks**: Gerenciamento de estado local

### Roteamento

- **React Router DOM 7.7.1**: Navegação entre páginas

### Outras Bibliotecas

- **React Table 8.21.3**: Tabelas interativas e responsivas
- **Date-fns**: Manipulação e formatação de datas

## 🏗️ Arquitetura da Aplicação

### Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos de UI
│   ├── layout/          # Componentes de layout
│   └── common/          # Componentes comuns
├── pages/               # Páginas da aplicação
│   ├── comunicacoes/    # Módulo de comunicações
│   │   ├── components/  # Componentes específicos
│   │   ├── hooks/       # Hooks customizados
│   │   └── services/    # Serviços e dados
│   └── LoginPage.tsx    # Página de login
├── types/               # Definições de tipos TypeScript
├── lib/                 # Utilitários e configurações
└── assets/              # Recursos estáticos
```

### Padrões Arquiteturais

- **Feature-Based Architecture**: Organização por funcionalidades
- **Component Composition**: Componentes reutilizáveis e compostos
- **Custom Hooks**: Lógica de negócio encapsulada
- **Service Layer**: Camada de serviços para integração com dados

## 🚀 Setup Inicial

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa.git

# Navegue até o diretório
cd challenge-3-centro-educacional-alfa

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev      # Executa em modo de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa linting do código
```

## 💻 Guia de Uso

### 1. Acesso ao Sistema

- Acesse a aplicação através da rota `/login`
- Use as credenciais de professor para fazer login
- Após autenticação, você será redirecionado para a página de comunicações

### 2. Visualização de Comunicações

- A página principal exibe todas as comunicações em formato de tabela
- Use o campo de busca para filtrar por título, autor, tipo ou descrição
- Visualize informações como título, autor, tipo, datas de criação e atualização

### 3. Criação de Comunicações

- Clique no botão "Nova Comunicação"
- Preencha os campos obrigatórios: título, autor, tipo e descrição
- Clique em "Adicionar" para salvar

### 4. Edição de Comunicações

- Clique no ícone de edição na linha da comunicação desejada
- Modifique os campos necessários
- Clique em "Editar" para salvar as alterações

### 5. Exclusão de Comunicações

- Clique no ícone de exclusão na linha da comunicação desejada
- Confirme a exclusão no modal de confirmação

## 🎨 Sistema de Design

### Paleta de Cores

- **Primária**: Tons de azul para elementos principais
- **Secundária**: Cinza para elementos neutros
- **Status**: Verde, amarelo e vermelho para estados específicos

### Tipografia

- **Fonte Principal - Inter**: Sistema padrão otimizada para legibilidade
- **Hierarquia**: Diferentes pesos e tamanhos para organização visual

### Componentes

- **Botões**: Variações de tamanho e estilo
- **Formulários**: Campos consistentes e validação visual
- **Tabelas**: Layout responsivo com ordenação e paginação
- **Modais**: Sobreposições para ações importantes

### Operações CRUD

- **GET /comunicacoes**: Buscar todas as comunicações
- **POST /comunicacoes**: Criar nova comunicação
- **PUT /comunicacoes/:id**: Atualizar comunicação existente
- **DELETE /comunicacoes/:id**: Excluir comunicação

### Gerenciamento de Estado

- Utilização do React Query para cache e sincronização
- Estados de loading, error e success
- Invalidação automática após mutações

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações por Dispositivo

- **Mobile**: Layout em coluna única, navegação simplificada
- **Tablet**: Layout híbrido, tabelas com scroll horizontal
- **Desktop**: Layout completo, todas as funcionalidades visíveis

## 🔒 Segurança e Autenticação

### Controle de Acesso

- Rotas protegidas para funcionalidades administrativas
- Validação de autenticação em componentes sensíveis
- Redirecionamento automático para login quando necessário

### Validação de Dados

- Validação de formulários no frontend
- Sanitização de entradas do usuário
- Feedback visual para erros de validação

## 🧪 Testes e Qualidade

### Ferramentas de Qualidade

- **ESLint**: Análise estática de código
- **TypeScript**: Verificação de tipos
- **Prettier**: Formatação consistente de código

### Boas Práticas

- Componentização adequada
- Hooks customizados para lógica reutilizável
- Tipagem forte com TypeScript
- Convenções de nomenclatura consistentes

## 🚀 Deploy e Produção

### Build de Produção

```bash
npm run build
```

### Otimizações

- Code splitting automático
- Compressão de assets
- Otimização de imagens
- Minificação de código

## 📝 Considerações Técnicas

### Performance

- Lazy loading de componentes
- Memoização de componentes pesados
- Otimização de re-renders
- Cache inteligente com React Query

### Acessibilidade

- Componentes Radix UI com acessibilidade nativa
- Labels apropriados em formulários
- Navegação por teclado
- Contraste adequado de cores

### Manutenibilidade

- Código modular e reutilizável
- Documentação inline
- Estrutura de pastas organizada
- Separação clara de responsabilidades

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como parte do Tech Challenge da Pós-Tech Frontend Engineering, focando na criação de uma solução robusta e escalável para o gerenciamento de comunicações educacionais.

## 📄 Licença

Este projeto é desenvolvido para fins educacionais como parte do programa de Pós-Graduação em Full Stack Development.
