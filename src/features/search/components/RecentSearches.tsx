/**
 * 🕐 RecentSearches Component
 * Exibe pesquisas recentes quando não há busca ativa
 *
 * Features (FASE 10): Internacionalização completa pt-BR/en-US
 */

import { ClockCounterClockwise, X } from "@phosphor-icons/react";
import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // 🌍 FASE 10
import type { SearchHistoryItem } from "../types/search.types";
import { EmptyState } from "./EmptyState"; // 🎨 FASE 9
import { SearchResultItem } from "./SearchResultItem";

interface RecentSearchesProps {
  recentSearches: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  selectedIndex: number;
  onMouseEnter: (index: number) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🕐 Lista de pesquisas recentes
 *
 * Features:
 * - Mostra histórico quando não há busca ativa
 * - Botão para remover item individual
 * - Botão para limpar todo histórico
 * - Animações suaves
 * - Empty state customizado
 */
export function RecentSearches({
  recentSearches,
  onSelect,
  onRemove,
  onClearAll,
  selectedIndex,
  onMouseEnter,
  listRef,
}: RecentSearchesProps) {
  const { t } = useTranslation("search"); // � FASE 10

  // �🎨 FASE 9: Estado vazio - sem histórico
  if (recentSearches.length === 0) {
    return <EmptyState type="no-history" />;
  }

  return (
    <div ref={listRef} className="flex flex-col gap-3">
      {/* Header com botão de limpar */}
      <div className="flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          <ClockCounterClockwise className="h-4 w-4" weight="bold" />
          {t("history.title")}
        </h3>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs",
            "text-neutral-600 hover:text-neutral-900",
            "dark:text-neutral-400 dark:hover:text-neutral-100",
          )}
        >
          {t("history.clear")}
        </Button>
      </div>

      {/* Lista de pesquisas recentes */}
      <div
        role="listbox"
        aria-label={t("history.title")}
        className="flex flex-col gap-1"
      >
        <AnimatePresence mode="popLayout">
          {recentSearches.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              {/* Item de resultado */}
              <SearchResultItem
                result={item}
                query="" // Sem highlight para recentes
                isSelected={index === selectedIndex}
                onSelect={() => onSelect(item)}
                onMouseEnter={() => onMouseEnter(index)}
                index={index}
              />

              {/* Botão de remover */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className={cn(
                  "absolute top-1/2 right-12 -translate-y-1/2",
                  "hidden group-hover:flex",
                  "h-7 w-7 items-center justify-center rounded-md",
                  "bg-neutral-100 text-neutral-600",
                  "hover:bg-neutral-200 hover:text-neutral-900",
                  "dark:bg-neutral-800 dark:text-neutral-400",
                  "dark:hover:bg-neutral-700 dark:hover:text-neutral-100",
                  "transition-colors duration-150",
                  "focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:focus:ring-neutral-600",
                )}
                aria-label="Remover do histórico"
                type="button"
              >
                <X className="h-4 w-4" weight="bold" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
