/**
 * ⌨️ useSearchKeyboard Hook
 * Gerenciamento de navegação por teclado na busca
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchResult } from "../types/search.types";

export interface UseSearchKeyboardOptions {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * ⌨️ Hook para gerenciar navegação por teclado
 *
 * Atalhos suportados:
 * - ↑/↓: Navegar pelos resultados
 * - Enter: Selecionar resultado destacado
 * - Esc: Fechar modal
 * - Home: Ir para primeiro resultado
 * - End: Ir para último resultado
 *
 * @returns Índice selecionado e métodos de controle
 */
export function useSearchKeyboard({
  results,
  onSelect,
  onClose,
  isOpen,
}: UseSearchKeyboardOptions) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Usar ref para manter valores atualizados sem causar re-renders
  const resultsRef = useRef(results);
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);

  // Atualizar refs de forma síncrona (não em useEffect)
  // Isso evita um ciclo extra de renderização
  resultsRef.current = results;
  onSelectRef.current = onSelect;
  onCloseRef.current = onClose;

  // Reset ao mudar quantidade de resultados
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Reset ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  /**
   * 📜 Scroll automático para item selecionado
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list || selectedIndex < 0) return;

    const items = list.querySelectorAll('[role="option"]');
    const selectedItem = items[selectedIndex] as HTMLElement;

    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  /**
   * ⌨️ Handler de navegação por teclado
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentResults = resultsRef.current;
      if (currentResults.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < currentResults.length - 1 ? prev + 1 : 0,
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : currentResults.length - 1,
          );
          break;

        case "Home":
          event.preventDefault();
          setSelectedIndex(0);
          break;

        case "End":
          event.preventDefault();
          setSelectedIndex(currentResults.length - 1);
          break;

        case "Enter":
          event.preventDefault();
          setSelectedIndex((currentIndex) => {
            if (currentResults[currentIndex]) {
              onSelectRef.current(currentResults[currentIndex]);
            }
            return currentIndex;
          });
          break;

        case "Escape":
          event.preventDefault();
          onCloseRef.current();
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]); // Apenas isOpen como dependência

  /**
   * 🖱️ Handler de hover do mouse
   */
  const handleMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  /**
   * 📌 Verificar se item está selecionado
   */
  const isSelected = useCallback(
    (index: number) => {
      return index === selectedIndex;
    },
    [selectedIndex],
  );

  return {
    selectedIndex,
    listRef,
    isSelected,
    handleMouseEnter,
    setSelectedIndex,
  };
}
