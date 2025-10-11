/**
 * 🔍 SearchModal Component
 * Modal principal de busca global do sistema
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useSearchKeyboard } from "../hooks/useSearchKeyboard";
import type { SearchResult } from "../types/search.types";
import { RecentSearches } from "./RecentSearches";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 🔍 Modal de busca global
 *
 * Features:
 * - Busca unificada de páginas
 * - Histórico de pesquisas
 * - Navegação por teclado
 * - Debounce automático
 * - Animações suaves
 * - Acessibilidade completa
 * - Responsivo
 */
export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const navigate = useNavigate();

  // Hook de busca global
  const {
    query,
    setQuery,
    debouncedQuery,
    clearQuery,
    results,
    isLoading,
    canShowMore,
    handleShowMore,
    isEmpty,
  } = useGlobalSearch();

  // Hook de histórico (desabilitado temporariamente)
  const { recentHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Determinar se mostra resultados ou histórico
  const showResults = debouncedQuery.length > 0;

  // Memoizar displayResults para evitar re-renders desnecessários
  const displayResults = useMemo(() => {
    return showResults ? results : recentHistory;
  }, [showResults, results, recentHistory]);

  // Navegação por resultado
  const handleSelect = useCallback(
    (result: SearchResult) => {
      // TODO FASE 3: Adicionar ao histórico quando reativar
      // addToHistory(result);

      // Navegar baseado no tipo
      if (result.type === "page") {
        navigate({ to: result.href });
      } else if (result.type === "staff") {
        // Navegar para página de staff com o nome do barbeiro para filtrar
        const staffName = result.title; // "Teste Com Imagem" (não "teste")
        navigate({
          to: "/barbershop-staff",
          search: { staffName }, // ✅ Passa o nome correto, não o ID
        });
      }

      // Fechar modal
      onOpenChange(false);

      // Limpar query após pequeno delay (UX)
      setTimeout(clearQuery, 300);
    },
    [navigate, onOpenChange, clearQuery],
  );

  // Callback estável para fechar modal
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Hook de navegação por teclado
  const { selectedIndex, listRef, handleMouseEnter } = useSearchKeyboard({
    results: displayResults,
    onSelect: handleSelect,
    onClose: handleClose,
    isOpen: open,
  });

  // Limpar ao fechar
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        // Limpar query quando fechar
        setTimeout(clearQuery, 300);
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, clearQuery],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        {/* Header com título acessível (oculto visualmente) */}
        <DialogTitle className="sr-only">Buscar no sistema</DialogTitle>
        <DialogDescription className="sr-only">
          Use a busca para encontrar páginas, barbeiros e outros recursos do
          sistema. Navegue com as setas do teclado e pressione Enter para
          selecionar.
        </DialogDescription>

        {/* Input de busca */}
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={clearQuery}
            isLoading={isLoading}
            placeholder={
              showResults ? "Pesquisar..." : "Pesquisar páginas, barbeiros..."
            }
          />
        </div>

        {/* Resultados ou histórico */}
        <div className="max-h-[60vh] min-h-[300px] overflow-y-auto p-4">
          {showResults ? (
            <SearchResults
              results={results}
              query={debouncedQuery}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onMouseEnter={handleMouseEnter}
              canShowMore={canShowMore}
              onShowMore={handleShowMore}
              isEmpty={isEmpty}
              listRef={listRef}
            />
          ) : (
            <RecentSearches
              recentSearches={recentHistory}
              onSelect={handleSelect}
              onRemove={removeFromHistory}
              onClearAll={clearHistory}
              selectedIndex={selectedIndex}
              onMouseEnter={handleMouseEnter}
              listRef={listRef}
            />
          )}
        </div>

        {/* Footer com atalhos */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono dark:bg-neutral-700">
                ↑↓
              </kbd>
              <span>Navegar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono dark:bg-neutral-700">
                Enter
              </kbd>
              <span>Selecionar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono dark:bg-neutral-700">
                Esc
              </kbd>
              <span>Fechar</span>
            </div>
          </div>

          {showResults && results.length > 0 && (
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {results.length}{" "}
              {results.length === 1 ? "resultado" : "resultados"}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
