/**
 * 🔍 useGlobalSearch Hook
 * Hook principal que orquestra todo o sistema de busca
 */

import {
  FileTextIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { SearchableEntity, SearchCategory } from "../types/search.types";
import { SEARCH_LIMITS } from "../types/search.types";
import { useDebouncedValue } from "./useDebouncedValue";
import { useSearchPages } from "./useSearchPages";
import { useSearchStaff } from "./useSearchStaff";

/**
 * 🔍 Hook principal de busca global
 *
 * Características:
 * - Busca unificada de páginas (local)
 * - Debounce automático
 * - Suporte a categorias
 * - Estado de loading
 * - Limite de resultados com "Ver mais"
 *
 * @returns Estado completo da busca
 */
export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    SearchableEntity | "all"
  >("all");
  const [showAllResults, setShowAllResults] = useState(false);

  // Debounce para evitar buscas excessivas
  const debouncedQuery = useDebouncedValue(query, 300);

  // Determinar limite de resultados
  const maxResults = showAllResults
    ? SEARCH_LIMITS.EXPANDED
    : SEARCH_LIMITS.INITIAL;

  // Buscar páginas
  const { results: pageResults, hasMore: hasMorePages } = useSearchPages(
    debouncedQuery,
    maxResults,
  );

  // Buscar staff (barbeiros)
  const {
    results: staffResults,
    hasMore: hasMoreStaff,
    isLoading: isStaffLoading,
  } = useSearchStaff(
    debouncedQuery,
    maxResults,
    selectedCategory === "all" || selectedCategory === "staff",
  );

  // ⚡ FASE 6: Combinar resultados (memoizado)
  // Só recalcula quando pageResults, staffResults ou selectedCategory mudam
  const allResults = useMemo(() => {
    // Filtrar por categoria selecionada
    if (selectedCategory === "page") {
      return pageResults;
    }
    if (selectedCategory === "staff") {
      return staffResults;
    }

    // "all": combinar páginas + staff e ordenar por score
    return [...pageResults, ...staffResults].sort((a, b) => b.score - a.score);
  }, [pageResults, staffResults, selectedCategory]);

  // ⚡ FASE 6: Calcular categorias com contadores (memoizado)
  // Só recalcula quando os comprimentos dos arrays mudam
  const categories: SearchCategory[] = useMemo(() => {
    return [
      {
        id: "all",
        label: "Tudo",
        count: allResults.length,
        icon: MagnifyingGlassIcon,
      },
      {
        id: "page",
        label: "Páginas",
        count: pageResults.length,
        icon: FileTextIcon,
      },
      {
        id: "staff",
        label: "Barbeiros",
        count: staffResults.length,
        icon: UsersIcon,
      },
    ];
  }, [allResults.length, pageResults.length, staffResults.length]);

  // Estado de loading
  const isLoading = isStaffLoading;

  // Verificar se há mais resultados para mostrar
  const canShowMore = useMemo(() => {
    if (showAllResults) return false; // Já mostrando tudo
    if (!debouncedQuery) return false; // Sem busca ativa

    // Verificar baseado na categoria
    if (selectedCategory === "page") return hasMorePages;
    if (selectedCategory === "staff") return hasMoreStaff;

    // "all": tem mais se qualquer categoria tiver mais
    return hasMorePages || hasMoreStaff;
  }, [
    showAllResults,
    debouncedQuery,
    selectedCategory,
    hasMorePages,
    hasMoreStaff,
  ]);

  // Handlers
  const handleShowMore = () => {
    setShowAllResults(true);
  };

  const handleCategoryChange = (category: SearchableEntity | "all") => {
    setSelectedCategory(category);
    setShowAllResults(false); // Reset ao trocar categoria
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setShowAllResults(false); // Reset ao mudar query
  };

  const handleClear = () => {
    setQuery("");
    setShowAllResults(false);
    setSelectedCategory("all");
  };

  return {
    // Query state
    query,
    setQuery: handleQueryChange,
    debouncedQuery,
    clearQuery: handleClear,

    // Results
    results: allResults,
    categories,

    // Category state
    selectedCategory,
    setSelectedCategory: handleCategoryChange,

    // Loading state
    isLoading,

    // Pagination state
    showAllResults,
    canShowMore,
    handleShowMore,
    resultLimit: maxResults,

    // Metadata
    totalResults: allResults.length,
    hasResults: allResults.length > 0,
    isEmpty: allResults.length === 0 && debouncedQuery.length > 0,
  };
}
