/**
 * 📋 SearchResults Component
 * Lista de resultados de busca com agrupamento e estados
 *
 * Features (FASE 10): Internacionalização completa pt-BR/en-US
 */

import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // 🌍 FASE 10
import type { SearchResult } from "../types/search.types";
import { EmptyState } from "./EmptyState"; // 🎨 FASE 9
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
  const { t } = useTranslation("search"); // � FASE 10

  // �🎨 FASE 9: Estado vazio - sem resultados para a busca
  if (isEmpty && query) {
    return <EmptyState type="no-results" query={query} />;
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

  // 🌍 FASE 10: Labels de categorias internacionalizados
  const categoryLabels: Record<string, string> = {
    page: t("results.categories.pages"),
    staff: t("results.categories.staff"),
    service: t("results.categories.services"),
    unit: t("results.categories.units"),
  };

  return (
    <div ref={listRef} className="flex flex-col gap-4">
      {/* Resultados agrupados por categoria */}
      {Object.entries(groupedResults).map(
        ([type, categoryResults], groupIndex) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              delay: groupIndex * 0.1, // 🎨 FASE 4.2: Stagger entre grupos
              ease: [0.25, 0.1, 0.25, 1], // Easing suave
            }}
            className="flex flex-col gap-2"
          >
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
          </motion.div>
        ),
      )}

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
              aria-label={t("results.showMore")} // ♿ FASE 8
            >
              {t("results.showMore")}
              <CaretDown className="h-4 w-4" weight="bold" aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
