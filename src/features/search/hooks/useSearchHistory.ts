/**
 * 📝 useSearchHistory Hook
 * Gerenciamento de histórico de buscas com reconstrução de ícones
 *
 * ✅ FASE 3: Habilitado com serialização inteligente
 */

import { useCallback, useEffect, useState } from "react";
import { searchHistoryService } from "../services/search-history.service";
import type { SearchResult } from "../types/search.types";

/**
 * 🎯 Hook para gerenciar histórico de buscas
 *
 * @returns Histórico e métodos para manipulação
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<
    (SearchResult & { searchedAt: Date; clickCount: number })[]
  >([]);

  // Carregar histórico ao montar
  useEffect(() => {
    setHistory(searchHistoryService.get());
  }, []);

  const addToHistory = useCallback((result: SearchResult) => {
    searchHistoryService.save(result);
    setHistory(searchHistoryService.get());
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    searchHistoryService.remove(id);
    setHistory(searchHistoryService.get());
  }, []);

  const clearHistory = useCallback(() => {
    searchHistoryService.clear();
    setHistory([]);
  }, []);

  const getRecent = useCallback(
    (
      limit: number = 5,
    ): (SearchResult & { searchedAt: Date; clickCount: number })[] => {
      return searchHistoryService.getRecent(limit);
    },
    [],
  );

  const getByType = useCallback(
    (
      type: SearchResult["type"],
    ): (SearchResult & { searchedAt: Date; clickCount: number })[] => {
      return searchHistoryService.getByType(type);
    },
    [],
  );

  const recentHistory = searchHistoryService.getRecent(5);
  const stats = searchHistoryService.getStats();

  return {
    history,
    recentHistory,
    stats,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecent,
    getByType,
    isEmpty: history.length === 0,
    hasHistory: history.length > 0,
  };
}
