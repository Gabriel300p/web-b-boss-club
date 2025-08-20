# 🎨 Design System - Centro Educacional Alfa

## 📋 Visão Geral

O Design System do Centro Educacional Alfa é um conjunto abrangente de componentes, tokens de design e diretrizes que garantem consistência visual e experiência do usuário em toda a aplicação.

## 🎯 Princípios de Design

### 1. **Consistência**

- Uso consistente de cores, tipografia e espaçamento
- Padrões de interação unificados
- Comportamentos previsíveis

### 2. **Acessibilidade**

- Conformidade com WCAG 2.1 AA
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado

### 3. **Escalabilidade**

- Componentes modulares e reutilizáveis
- Sistema de tokens organizados
- Fácil manutenção e extensão

### 4. **Performance**

- Componentes otimizados
- Bundle size mínimo
- Lazy loading quando apropriado

## 🎨 Design Tokens

### Cores

#### Cores da Marca

```typescript
brand: {
  50: "oklch(0.971 0.013 264.695)",   // Muito claro
  500: "oklch(0.576 0.135 264.695)",  // Principal
  900: "oklch(0.216 0.027 264.695)",  // Muito escuro
}
```

#### Cores Semânticas

```typescript
success: {
  500: "oklch(0.628 0.445 162.012)",  // Verde
}
warning: {
  500: "oklch(0.628 0.281 85.875)",   // Amarelo
}
error: {
  500: "oklch(0.620 0.281 17.378)",   // Vermelho
}
info: {
  500: "oklch(0.620 0.281 248.046)",  // Azul
}
```

### Tipografia

```typescript
fontSize: {
  xs: "0.75rem",    // 12px
  sm: "0.875rem",   // 14px
  base: "1rem",     // 16px
  lg: "1.125rem",   // 18px
  xl: "1.25rem",    // 20px
  "2xl": "1.5rem",  // 24px
}

fontWeight: {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
}
```

### Espaçamento

```typescript
spacing: {
  1: "0.25rem",     // 4px
  2: "0.5rem",      // 8px
  3: "0.75rem",     // 12px
  4: "1rem",        // 16px
  6: "1.5rem",      // 24px
  8: "2rem",        // 32px
}
```

### Bordas e Sombras

```typescript
borderRadius: {
  sm: "0.25rem",    // 4px
  md: "0.5rem",     // 8px
  lg: "0.625rem",   // 10px
  xl: "0.75rem",    // 12px
}

boxShadow: {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
}
```

## 🧱 Componentes

### Componentes Básicos

#### Button

```tsx
import { Button } from "@shared/components/ui";

<Button variant="default" size="md">
  Clique aqui
</Button>;
```

**Variantes:** `default` | `secondary` | `destructive` | `outline` | `ghost` | `link`

**Tamanhos:** `sm` | `default` | `lg` | `xl`

#### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@shared/components/ui";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo do card aqui.</CardContent>
</Card>;
```

**Variantes:** `default` | `elevated` | `floating` | `outlined` | `ghost`

#### Badge

```tsx
import { Badge } from "@shared/components/ui";

<Badge variant="success" size="sm">
  Ativo
</Badge>;
```

**Variantes:** `default` | `secondary` | `success` | `warning` | `error` | `info`

#### Progress

```tsx
import { Progress } from "@shared/components/ui";

<Progress value={75} variant="success" showValue />;
```

### Componentes de Feedback

#### Toast

```tsx
import { useToast } from "@shared/hooks";

const { success, error, warning, info } = useToast();

// Toast básico
success("Operação realizada com sucesso!");

// Toast com descrição
success("Dados salvos!", "Todas as informações foram armazenadas.");

// Toast expansível
showToast({
  type: "info",
  title: "Mensagem longa",
  message: "Esta mensagem pode ser expandida...",
  expandable: true,
});
```

### Componentes de Layout

#### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
    </DialogHeader>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>;
```

## 🎯 Uso do Theme Provider

```tsx
import { ThemeProvider } from "@shared/providers/ThemeProvider";
import { useTheme } from "@shared/hooks/useTheme";

// No App.tsx
function App() {
  return (
    <ThemeProvider defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}

// Em qualquer componente
function MyComponent() {
  const { config, setMode, toggleMode, isLight, isDark, getColorValue } =
    useTheme();

  return (
    <div>
      <p>Tema atual: {config.mode}</p>
      <button onClick={toggleMode}>Alternar tema</button>
    </div>
  );
}
```

## 🚀 Guias de Uso

### Importação de Componentes

```tsx
// ✅ Recomendado - Importação centralizada
import { Button, Card, Badge } from "@shared/components/ui";

// ❌ Evitar - Importação individual
import { Button } from "@shared/components/ui/button";
```

### Extensão de Componentes

```tsx
// ✅ Estendendo com className
<Button className="bg-brand-500 hover:bg-brand-600 w-full">
  Botão customizado
</Button>;

// ✅ Criando variante customizada
const CustomButton = (props) => (
  <Button
    variant="outline"
    className="border-brand-500 text-brand-500"
    {...props}
  />
);
```

### Responsividade

```tsx
// ✅ Classes responsivas do Tailwind
<Card className="p-4 md:p-6 lg:p-8">
  <CardTitle className="text-lg md:text-xl lg:text-2xl">
    Título responsivo
  </CardTitle>
</Card>
```

### Acessibilidade

```tsx
// ✅ Sempre incluir labels e aria-attributes
<Button
  aria-label="Fechar modal"
  onClick={closeModal}
>
  ✕
</Button>

<Progress
  value={progress}
  aria-label={`Progresso: ${progress}%`}
/>
```

## 📦 Estrutura do Projeto

```
src/shared/
├── components/ui/           # Componentes do design system
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   └── index.ts            # Exportações centralizadas
├── styles/
│   └── design-tokens.ts    # Tokens de design
├── providers/
│   └── ThemeProvider.tsx   # Provider de tema
├── hooks/
│   └── useTheme.ts         # Hook de tema
└── utils/
    └── theme-utils.ts      # Utilitários de tema
```

## 🔄 Versionamento

O design system segue semantic versioning:

- **Major (1.0.0)**: Breaking changes nos componentes
- **Minor (0.1.0)**: Novos componentes ou funcionalidades
- **Patch (0.0.1)**: Bug fixes e melhorias menores

## 🤝 Contribuição

### Adicionando Novos Componentes

1. Criar o componente em `src/shared/components/ui/`
2. Seguir os padrões de nomenclatura e estrutura
3. Incluir variantes usando `class-variance-authority`
4. Adicionar documentação e exemplos
5. Exportar no `index.ts`
6. Criar testes unitários

### Padrões de Código

- Use `forwardRef` para componentes que recebem ref
- Implemente variantes com `cva`
- Inclua TypeScript types completos
- Mantenha acessibilidade em mente
- Siga as convenções de nomenclatura

## 📝 Roadmap

### v1.1.0 (Próxima versão)

- [ ] Avatar component
- [ ] Tooltip component
- [ ] DataTable component
- [ ] Tabs component

### v1.2.0 (Futuro)

- [ ] Dark mode completo
- [ ] Mais variantes de cores
- [ ] Componentes de formulário avançados
- [ ] Sistema de grid
