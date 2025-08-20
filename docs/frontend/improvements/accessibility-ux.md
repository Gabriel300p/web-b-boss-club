# ♿ Melhorias de Acessibilidade e UX

## 1. Melhorias de Acessibilidade
```typescript
// src/shared/components/filters/AccessibleFilter.tsx
export const AccessibleFilter = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerId = useId();
  const contentId = useId();
  
  return (
    <div>
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-describedby={`${triggerId}-description`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        {/* Trigger content */}
      </button>
      
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
      >
        {/* Filter content */}
      </div>
      
      <div id={`${triggerId}-description`} className="sr-only">
        Pressione Enter ou Espaço para abrir as opções de filtro
      </div>
    </div>
  );
};
```

## 2. Keyboard Navigation
```typescript
// src/shared/hooks/useKeyboardNavigation.ts
export const useKeyboardNavigation = (itemCount: number) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev === 0 ? itemCount - 1 : prev - 1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
    }
  }, [itemCount]);
  
  return { focusedIndex, handleKeyDown };
};
```

## 3. Screen Reader Support
```typescript
// src/shared/components/filters/FilterAnnouncer.tsx
export const FilterAnnouncer = ({ filteredCount, totalCount }: {
  filteredCount: number;
  totalCount: number;
}) => {
  const announcement = useMemo(() => {
    if (filteredCount === totalCount) {
      return `Mostrando todos os ${totalCount} resultados`;
    }
    return `Filtrado para ${filteredCount} de ${totalCount} resultados`;
  }, [filteredCount, totalCount]);
  
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
};
```

## 4. High Contrast Mode Support
```css
/* src/shared/styles/accessibility.css */
@media (prefers-contrast: high) {
  .filter-button {
    border: 2px solid;
    background: ButtonFace;
    color: ButtonText;
  }
  
  .filter-button:focus {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filter-animation {
    animation: none !important;
    transition: none !important;
  }
}
```
