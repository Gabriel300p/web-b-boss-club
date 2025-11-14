/**
 * 📄 SearchResultItem Component
 * Item individual de resultado de busca com animações e acessibilidade
 *
 * Features (FASE 10): Internacionalização completa pt-BR/en-US
 */

import { ArrowRightIcon } from "@phosphor-icons/react";
import { BadgeWithoutDot } from "@shared/components/ui/badge";
import { cn } from "@shared/lib/utils";
import { motion } from "framer-motion";
import { memo } from "react"; // ⚡ FASE 6: Otimização
import { useTranslation } from "react-i18next"; // 🌍 FASE 10
import type { PageSearchResult, SearchResult } from "../types/search.types";
import { HighlightedText } from "./HighlightedText";

interface SearchResultItemProps {
  result: SearchResult & { clickCount?: number }; // ✅ FASE 4.1: Adicionar clickCount
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
 *
 * ⚡ FASE 6: Memoizado para evitar re-renders desnecessários
 */
function SearchResultItemComponent({
  result,
  query,
  isSelected,
  onSelect,
  onMouseEnter,
  index,
}: SearchResultItemProps) {
  const { t } = useTranslation("search"); // 🌍 FASE 10
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

  // 🏆 FASE 4.1: Badge de frequência do histórico
  const getFrequencyBadge = () => {
    if (result.clickCount && result.clickCount > 1) {
      return (
        <BadgeWithoutDot
          variant="warning"
          size="sm"
          className="text-xs font-semibold"
        >
          ×{result.clickCount}
        </BadgeWithoutDot>
      );
    }
    return null;
  };

  // ♿ FASE 8 + 🌍 FASE 10: Label acessível descritivo e internacionalizado
  const getAriaLabel = () => {
    const parts: string[] = [result.title];

    if (result.description) {
      parts.push(result.description);
    }

    if (result.type === "page") {
      const pageResult = result as PageSearchResult;
      parts.push(`Seção ${pageResult.section}`);
    }

    if (result.type === "staff") {
      parts.push(
        result.status === "ACTIVE" ? t("status.active") : t("status.inactive"),
      );
    }

    if (result.clickCount && result.clickCount > 1) {
      parts.push(t("history.accessCount", { count: result.clickCount }));
    }

    if (isSelected) {
      parts.push(t("status.selected"));
    }

    return parts.join(", ");
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
      aria-label={getAriaLabel()} // ♿ FASE 8
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-4 py-4 text-left transition-all duration-150",
        "focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:focus:ring-neutral-700",
        isSelected
          ? "bg-neutral-100 dark:bg-neutral-900"
          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
      )}
    >
      {/* Ícone do resultado */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md transition-all duration-150",
            isSelected
              ? "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
            "group-hover:scale-105",
          )}
        >
          <Icon className="h-5 w-5" weight="duotone" />
        </div>

        {/* 🟢 FASE 4.3: Indicador de status para staff */}
        {result.type === "staff" && result.status && (
          <div
            className={cn(
              "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900",
              result.status === "ACTIVE"
                ? "bg-green-500"
                : "bg-neutral-400 dark:bg-neutral-600",
            )}
            aria-hidden="true" // ♿ FASE 8: Status já está no aria-label do botão
          />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Título com highlight e badges */}
        <div className="flex items-center gap-2">
          <HighlightedText
            text={result.title}
            query={query}
            className="truncate text-sm font-medium text-neutral-900 dark:text-white"
            highlightClassName="bg-yellow-400/30 dark:bg-yellow-500/20 text-neutral-900 dark:text-yellow-300 font-semibold rounded px-0.5"
          />
          {getSectionBadge()}
          {getFrequencyBadge()} {/* 🏆 FASE 4.1: Badge de frequência */}
        </div>

        {/* Descrição com highlight */}
        <HighlightedText
          text={result.description}
          query={query}
          className="truncate text-xs text-neutral-500 dark:text-neutral-400"
          highlightClassName="bg-yellow-400/30 dark:bg-yellow-500/20 text-neutral-700 dark:text-yellow-300 font-semibold rounded px-0.5"
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

// ⚡ FASE 6: Export memoizado para prevenir re-renders desnecessários
// Só re-renderiza se result.id, query, ou isSelected mudarem
export const SearchResultItem = memo(
  SearchResultItemComponent,
  (prev, next) => {
    return (
      prev.result.id === next.result.id &&
      prev.query === next.query &&
      prev.isSelected === next.isSelected &&
      prev.index === next.index
    );
  },
);
