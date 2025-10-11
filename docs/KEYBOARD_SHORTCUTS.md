# ⌨️ Atalhos de Teclado - Busca Global

Documentação completa dos atalhos de teclado disponíveis no componente de busca global.

## 🎯 Navegação Básica

| Atalho | Ação | Descrição |
|--------|------|-----------|
| `↓` (Arrow Down) | Próximo resultado | Navega para o próximo item da lista. Volta ao primeiro quando chegar no último. |
| `↑` (Arrow Up) | Resultado anterior | Navega para o item anterior. Vai para o último quando estiver no primeiro. |
| `Enter` | Selecionar | Abre/navega para o resultado atualmente destacado. |
| `Home` | Ir para o início | Pula para o primeiro resultado da lista. |
| `End` | Ir para o fim | Pula para o último resultado da lista. |

## 🚀 Atalhos Avançados (FASE 5)

| Atalho | Ação | Descrição |
|--------|------|-----------|
| `Ctrl + Backspace` | Limpar busca | Remove todo o texto do campo de busca rapidamente. |
| `Ctrl + H` | Limpar histórico | Apaga completamente o histórico de buscas. |
| `Esc` (1x) | Limpar busca | Primeiro Esc limpa o texto da busca. |
| `Esc` (2x) | Fechar modal | Duplo Esc em < 500ms fecha o modal completamente. |

## 💡 Comportamento Inteligente

### Duplo Esc
O comportamento do `Esc` é progressivo:

```
┌─────────────────────────────────────────────┐
│ 1º Esc → Limpa o texto da busca             │
│ 2º Esc (< 500ms) → Fecha o modal            │
└─────────────────────────────────────────────┘
```

**Por quê?** Isso permite que você limpe rapidamente a busca sem fechar acidentalmente o modal, mas ainda assim oferece uma forma rápida de sair completamente.

### Scroll Automático
Quando você navega com `↑` ou `↓`, o item selecionado automaticamente entra em visualização usando `scrollIntoView` com comportamento suave:

```typescript
selectedItem.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
});
```

## 🏗️ Implementação Técnica

### Hook Principal: `useSearchKeyboard.ts`

```typescript
export interface UseSearchKeyboardOptions {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
  isOpen: boolean;
  onClearQuery?: () => void;    // ⌨️ FASE 5
  onClearHistory?: () => void;  // ⌨️ FASE 5
}
```

### Ordem de Verificação de Teclas

1. **Ctrl + Backspace** → Limpa query e retorna
2. **Ctrl + H** → Limpa histórico e retorna
3. **Esc** → Verifica timing para duplo Esc
4. **↑↓ Enter Home End** → Navegação padrão (apenas se houver resultados)

### Prevenção de Conflitos

Todos os atalhos chamam `event.preventDefault()` para evitar comportamentos padrão do navegador:

```typescript
if (event.ctrlKey && event.key === "Backspace") {
  event.preventDefault(); // ✅ Previne navegação "voltar"
  onClearQueryRef.current?.();
  return;
}
```

## 🔍 Exemplos de Uso

### Busca Rápida + Limpeza
```
1. Ctrl+K              → Abre o modal
2. Digite "barbe"      → Mostra resultados
3. Ctrl+Backspace      → Limpa tudo rapidamente
4. Digite "staff"      → Nova busca
5. ↓ ↓ ↓              → Navega pelos resultados
6. Enter               → Seleciona o item
```

### Gerenciar Histórico
```
1. Ctrl+K              → Abre o modal
2. (vazio)             → Mostra histórico
3. ↓ ↓                → Navega pelo histórico
4. Ctrl+H              → Limpa todo o histórico
5. Esc                 → Fecha o modal
```

### Navegação Eficiente
```
1. Ctrl+K              → Abre o modal
2. Digite "teste"      → Mostra resultados
3. Home                → Vai para o primeiro
4. ↓ ↓ ↓ ↓ ↓          → Navega 5 itens
5. End                 → Vai para o último
6. Enter               → Seleciona
```

## 📊 Performance

### Otimizações Implementadas

1. **Refs ao invés de State** para callbacks:
   ```typescript
   const onSelectRef = useRef(onSelect);
   const onClearQueryRef = useRef(onClearQuery);
   ```
   → Evita re-renders desnecessários quando props mudam

2. **Single Event Listener**:
   - Um único `keydown` listener no `document`
   - Removido corretamente no cleanup do `useEffect`

3. **Early Returns**:
   ```typescript
   if (event.ctrlKey && event.key === "Backspace") {
     event.preventDefault();
     onClearQueryRef.current?.();
     return; // ✅ Não processa outros casos
   }
   ```

## 🎨 UX Considerations

### Visual Feedback
- ✅ Item selecionado tem background amber/amarelo
- ✅ Scroll suave ao navegar
- ✅ Hover do mouse também seleciona (não conflita com teclado)

### Acessibilidade
- ✅ `role="option"` em cada resultado
- ✅ `aria-selected` no item ativo
- ✅ `role="listbox"` no container de resultados
- ✅ Descrição dos atalhos no `DialogDescription` (screen readers)

## 🔄 Próximas Melhorias (Futuras Fases)

- [ ] **Tab**: Navegar entre categorias de resultados
- [ ] **Ctrl + 1-9**: Selecionar resultado por número
- [ ] **Ctrl + A**: Selecionar tudo no input
- [ ] **PageUp/PageDown**: Navegar por blocos de 5 itens

---

**Criado em**: FASE 5 - Atalhos de Teclado Avançados  
**Última atualização**: Janeiro 2025
