/**
 * 📋 SearchResults Component
 * Lista de resultados de busca com agrupamento e estados
 */

import { CaretDown, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { SearchResult } from "../types/search.types";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
  onMouseEnter: (index: number) => void;
  canShowMore: boolean;
  onShowMore: () => void;
  isEmpty: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 📋 Lista de resultados de busca
 *
 * Features:
 * - Agrupamento por categoria
 * - Empty state customizado
 * - Botão "Ver mais" com contador
 * - Animações de lista
 * - Scroll suave
 * - Acessibilidade completa
 */
export function SearchResults({
  results,
  query,
  selectedIndex,
  onSelect,
  onMouseEnter,
  canShowMore,
  onShowMore,
  isEmpty,
  listRef,
}: SearchResultsProps) {
  // Estado vazio: sem resultados para a busca
  if (isEmpty && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <MagnifyingGlassIcon className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <h3 className="mb-2 text-base font-medium text-neutral-900 dark:text-white">
          Nenhum resultado encontrado
        </h3>
        <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
          Não encontramos nenhuma página que corresponda a{" "}
          <span className="font-semibold">"{query}"</span>
        </p>
        <div className="mt-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Tente buscar por:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• Nome de página</li>
            <li>• Configurações</li>
            <li>• Ajuda</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  // Agrupar resultados por tipo
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  // Labels de categorias
  const categoryLabels: Record<string, string> = {
    page: "Páginas",
    staff: "Barbeiros",
    service: "Serviços",
    unit: "Unidades",
  };

  return (
    <div ref={listRef} className="flex flex-col gap-4">
      {/* Resultados agrupados por categoria */}
      {Object.entries(groupedResults).map(([type, categoryResults]) => (
        <div key={type} className="flex flex-col gap-2">
          {/* Header da categoria */}
          <div className="px-2">
            <h3 className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {categoryLabels[type] || type} ({categoryResults.length})
            </h3>
          </div>

          {/* Lista de resultados */}
          <div
            role="listbox"
            aria-label={`Resultados de ${categoryLabels[type] || type}`}
            className="flex flex-col gap-1"
          >
            <AnimatePresence mode="popLayout">
              {categoryResults.map((result, categoryIndex) => {
                const globalIndex = results.indexOf(result);
                return (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    query={query}
                    isSelected={globalIndex === selectedIndex}
                    onSelect={() => onSelect(result)}
                    onMouseEnter={() => onMouseEnter(globalIndex)}
                    index={categoryIndex}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Botão "Ver mais" */}
      <AnimatePresence>
        {canShowMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-neutral-200 pt-3 dark:border-neutral-700"
          >
            <Button
              onClick={onShowMore}
              variant="ghost"
              className={cn(
                "w-full justify-center gap-2",
                "text-sm text-neutral-700 hover:text-neutral-900",
                "dark:text-neutral-300 dark:hover:text-neutral-100",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              Ver mais resultados
              <CaretDown className="h-4 w-4" weight="bold" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
