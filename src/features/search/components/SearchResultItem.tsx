/**
 * 📄 SearchResultItem Component
 * Item individual de resultado de busca com animações e acessibilidade
 */

import { ArrowRightIcon } from "@phosphor-icons/react";
import { BadgeWithoutDot } from "@shared/components/ui/badge";
import { cn } from "@shared/lib/utils";
import { motion } from "framer-motion";
import type { PageSearchResult, SearchResult } from "../types/search.types";
import { HighlightedText } from "./HighlightedText";

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  index: number;
}

/**
 * 📄 Item de resultado de busca
 *
 * Features:
 * - Highlight de termos buscados
 * - Animação de entrada
 * - Estado de seleção (keyboard navigation)
 * - Ícone por tipo de resultado
 * - Badge de seção (para páginas)
 * - Hover state suave
 * - Acessibilidade completa
 */
export function SearchResultItem({
  result,
  query,
  isSelected,
  onSelect,
  onMouseEnter,
  index,
}: SearchResultItemProps) {
  const Icon = result.icon;

  // Validar que Icon é um componente React válido
  // Histórico do localStorage perde a referência do ícone (não pode serializar funções)
  // Nesses casos, silenciosamente não renderizamos o item
  const isValidIcon =
    Icon &&
    (typeof Icon === "function" ||
      (typeof Icon === "object" && "$$typeof" in Icon));

  if (!isValidIcon) {
    // Não renderizar items com ícone inválido (geralmente do histórico)
    return null;
  }

  // Determinar badge para páginas
  const getSectionBadge = () => {
    if (result.type === "page") {
      const pageResult = result as PageSearchResult;
      return (
        <BadgeWithoutDot
          variant={pageResult.section === "principal" ? "info" : "neutral"}
          size="sm"
          className="text-xs font-normal"
        >
          {pageResult.section === "principal" ? "Principal" : "Outros"}
        </BadgeWithoutDot>
      );
    }
    return null;
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.15,
        delay: index * 0.02, // Animação cascata
      }}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-4 py-4 text-left transition-all duration-150",
        "focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:focus:ring-neutral-700",
        isSelected
          ? "bg-neutral-100 dark:bg-neutral-900"
          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
      )}
    >
      {/* Ícone do resultado */}
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md transition-all duration-150",
          isSelected
            ? "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
          "group-hover:scale-105",
        )}
      >
        <Icon className="h-5 w-5" weight="duotone" />
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Título com highlight */}
        <div className="flex items-center gap-2">
          <HighlightedText
            text={result.title}
            query={query}
            className="truncate text-sm font-medium text-neutral-900 dark:text-white"
            highlightClassName="bg-amber-400/30 dark:bg-amber-500/20 text-neutral-900 dark:text-amber-300 font-semibold rounded px-0.5"
          />
          {getSectionBadge()}
        </div>

        {/* Descrição com highlight */}
        <HighlightedText
          text={result.description}
          query={query}
          className="truncate text-xs text-neutral-500 dark:text-neutral-400"
          highlightClassName="bg-amber-400/30 dark:bg-amber-500/20 text-neutral-700 dark:text-amber-300 font-semibold rounded px-0.5"
        />
      </div>

      {/* Ícone de navegação */}
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-150",
          isSelected
            ? "translate-x-0 opacity-100"
            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
        )}
      >
        <ArrowRightIcon
          className="h-4 w-4 text-neutral-400 dark:text-neutral-500"
          weight="bold"
        />
      </div>

      {/* Borda de seleção (visual extra) */}
      {isSelected && (
        <motion.div
          layoutId="search-selection"
          className="absolute inset-0 rounded-lg border-2 border-neutral-300 dark:border-neutral-800"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
