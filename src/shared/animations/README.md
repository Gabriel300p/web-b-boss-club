# 🎭 Sistema de Animações e Transições

## 📋 Visão Geral

Sistema completo de animações para o projeto Centro Educacional Alfa, implementado como parte da Fase 2.3 do MASTER_IMPROVEMENT_PLAN.md. Este sistema fornece componentes reutilizáveis, hooks personalizados e configurações centralizadas para animações consistentes e acessíveis.

## 🏗️ Arquitetura

```
src/shared/animations/
├── config.ts          # Configurações centralizadas
├── components.tsx     # Componentes de animação reutilizáveis
├── hooks.ts          # Hooks personalizados
├── index.ts          # Exportações principais
├── examples.tsx      # Exemplos de uso
└── README.md         # Esta documentação
```

## 🎯 Recursos Principais

### ✨ Características

- **Acessibilidade First**: Respeita preferências de movimento reduzido
- **Performance Otimizada**: Animações 60fps com Framer Motion
- **TypeScript Completo**: Tipagem estrita e intellisense
- **Configuração Centralizada**: Durações e easings consistentes
- **Componentes Reutilizáveis**: Padrões de animação comuns
- **Hooks Personalizados**: Controle programático avançado
- **Responsive Design**: Funciona em todos os dispositivos

### 🎪 Componentes Disponíveis

1. **PageTransition** - Transições entre páginas
2. **FadeIn** - Animações de entrada com fade
3. **ScaleIn** - Animações de escala
4. **StaggeredList/Item** - Listas com efeito stagger
5. **MicroInteraction** - Micro-interações
6. **MotionButton** - Botões animados
7. **MotionCard** - Cards com hover effects

### 🎪 Hooks Disponíveis

1. **usePrefersReducedMotion** - Detecta preferências de movimento
2. **useAnimationState** - Estado de animação
3. **useInView** - Animações baseadas em scroll
4. **useStaggerAnimation** - Controle de stagger
5. **useSequentialAnimation** - Animações sequenciais
6. **useHoverAnimation** - Efeitos de hover
7. **useScrollProgress** - Progresso de scroll
8. **usePageTransition** - Transições de página

## 🚀 Exemplos de Uso

### Básico - Transição de Página

```tsx
import { PageTransition } from "@/shared/animations";

function MyPage() {
  return (
    <PageTransition variant="fadeIn">
      <div className="p-6">
        <h1>Minha Página</h1>
      </div>
    </PageTransition>
  );
}
```

### Componentes com Animação

```tsx
import { FadeIn, ScaleIn, MotionButton } from "@/shared/animations";

function AnimatedSection() {
  return (
    <div>
      <FadeIn direction="up" delay={0.2}>
        <h2>Título Animado</h2>
      </FadeIn>

      <ScaleIn delay={0.4}>
        <div className="card">
          <p>Conteúdo que escala</p>
        </div>
      </ScaleIn>

      <MotionButton variant="scale" className="btn-primary">
        Botão Animado
      </MotionButton>
    </div>
  );
}
```

### Lista Staggered

```tsx
import { StaggeredList, StaggeredItem } from "@/shared/animations";

function AnimatedList({ items }) {
  return (
    <StaggeredList staggerDelay={0.1}>
      {items.map((item, index) => (
        <StaggeredItem key={index}>
          <div className="list-item">{item.content}</div>
        </StaggeredItem>
      ))}
    </StaggeredList>
  );
}
```

### Animações baseadas em Scroll

```tsx
import { useInView, FadeIn } from "@/shared/animations";

function ScrollTriggeredContent() {
  const { ref, isInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref}>
      {isInView && (
        <FadeIn direction="up">
          <div className="content">Aparece quando entra na tela</div>
        </FadeIn>
      )}
    </section>
  );
}
```

### Animações Acessíveis

```tsx
import { usePrefersReducedMotion, FadeIn } from "@/shared/animations";

function AccessibleAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <FadeIn disabled={prefersReducedMotion}>
      <div>Esta animação respeita as preferências do usuário</div>
    </FadeIn>
  );
}
```

## ⚙️ Configuração

### Durações

```typescript
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.45,
  slower: 0.6,
} as const;
```

### Easings

```typescript
export const ANIMATION_EASING = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", damping: 25, stiffness: 300 },
} as const;
```

### Variantes de Transição

```typescript
export const PAGE_TRANSITIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  // ... mais variantes
} as const;
```

## 🔧 Personalização

### Criando Variantes Customizadas

```tsx
import { motion } from "framer-motion";
import { ANIMATION_DURATION, ANIMATION_EASING } from "@/shared/animations";

const customVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASING.easeOut,
    },
  },
};

function CustomAnimation() {
  return (
    <motion.div variants={customVariants} initial="hidden" animate="visible">
      Animação personalizada
    </motion.div>
  );
}
```

### Adicionando Novos Componentes

```tsx
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ANIMATION_DURATION } from "./config";

export const MyCustomAnimation = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.normal }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
```

## 🎯 Boas Práticas

### 1. Sempre Respeitar Preferências de Acessibilidade

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

// ✅ Bom
<FadeIn disabled={prefersReducedMotion}>
  <Component />
</FadeIn>

// ❌ Ruim - não considera acessibilidade
<FadeIn>
  <Component />
</FadeIn>
```

### 2. Usar Delays Apropriados

```tsx
// ✅ Bom - delays escalonados
<FadeIn delay={0.1}>First</FadeIn>
<FadeIn delay={0.2}>Second</FadeIn>
<FadeIn delay={0.3}>Third</FadeIn>

// ❌ Ruim - todos ao mesmo tempo
<FadeIn>First</FadeIn>
<FadeIn>Second</FadeIn>
<FadeIn>Third</FadeIn>
```

### 3. Performance em Listas

```tsx
// ✅ Bom - usa StaggeredList
<StaggeredList>
  {items.map((item) => (
    <StaggeredItem key={item.id}>{item.content}</StaggeredItem>
  ))}
</StaggeredList>;

// ❌ Ruim - animações individuais em listas grandes
{
  items.map((item, index) => (
    <FadeIn key={item.id} delay={index * 0.1}>
      {item.content}
    </FadeIn>
  ));
}
```

### 4. Usar Variantes Configuradas

```tsx
// ✅ Bom - usa configurações centralizadas
<PageTransition variant="fadeIn">
  <Content />
</PageTransition>

// ❌ Ruim - valores hardcoded
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  <Content />
</motion.div>
```

## 🔍 Debugging e Troubleshooting

### Verificar se Animações Estão Funcionando

```tsx
import { ANIMATION_SYSTEM_INFO } from "@/shared/animations";

console.log("Animation System:", ANIMATION_SYSTEM_INFO);
// Output: { version: "1.0.0", status: "🟢 Active", ... }
```

### Testar Preferências de Movimento

```tsx
function DebugMotionPreferences() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div>
      <p>Reduced Motion: {prefersReducedMotion ? "Enabled" : "Disabled"}</p>
      {/* Testar no DevTools: 
          Emulate CSS media type prefers-reduced-motion: reduce */}
    </div>
  );
}
```

### Performance Monitoring

```tsx
function PerformanceMonitor() {
  const { isAnimating } = useAnimationState();

  useEffect(() => {
    if (isAnimating) {
      console.time("Animation Duration");
    } else {
      console.timeEnd("Animation Duration");
    }
  }, [isAnimating]);

  return null;
}
```

## 📊 Status da Implementação

- ✅ **Configuração Base**: Durações, easings, variantes
- ✅ **Componentes Core**: PageTransition, FadeIn, ScaleIn, etc.
- ✅ **Hooks Personalizados**: 8 hooks implementados
- ✅ **Acessibilidade**: Detecção de preferências
- ✅ **TypeScript**: Tipagem completa
- ✅ **Documentação**: Exemplos e guias
- ✅ **Testes**: Estrutura preparada

## 🔄 Integração com Projeto Existente

### 1. Substituir Animações Existentes

```tsx
// Antes (manual)
import { motion } from "framer-motion";

function OldComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}

// Depois (sistema)
import { FadeIn } from "@/shared/animations";

function NewComponent() {
  return <FadeIn direction="up">Content</FadeIn>;
}
```

### 2. Migrar Toast System (Já Implementado)

```tsx
// O sistema de toast já usa algumas animações
// Pode ser expandido para usar mais componentes do sistema
import { ToastMain } from "@/shared/components/ui/toast/ToastMain";
// Já implementado com Framer Motion
```

### 3. Aplicar em Rotas

```tsx
// routes/__root.tsx
import { PageTransition } from "@/shared/animations";

export const Route = createRootRoute({
  component: () => (
    <PageTransition variant="fadeIn">
      <Outlet />
    </PageTransition>
  ),
});
```

## 🚀 Próximos Passos

1. **Testes Unitários**: Implementar testes para componentes e hooks
2. **Storybook**: Documentação visual interativa
3. **Performance**: Métricas e otimizações
4. **Mais Variantes**: Expandir biblioteca de animações
5. **A11y Testing**: Testes de acessibilidade automatizados

## 📚 Recursos Externos

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG Motion Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [CSS Tricks - Animation Guide](https://css-tricks.com/almanac/properties/a/animation/)

---

**🎭 Sistema de Animações v1.0.0 - Implementado ✅**

_Desenvolvido como parte do MASTER_IMPROVEMENT_PLAN.md - Fase 2.3: UX/Animation System_
