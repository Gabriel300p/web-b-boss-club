/**
 * 📝 useSearchHistory Hook
 * Gerenciamento de histórico de buscas
 *
 * ⚠️ TEMPORARIAMENTE DESABILITADO - Ícones não podem ser serializados
 */

import { useCallback, useState } from "react";
import type { SearchHistoryItem } from "../types/search.types";

/**
 *  Hook para gerenciar histórico de buscas
 *
 * @returns Histórico e métodos para manipulação
 */
export function useSearchHistory() {
  // ⚠️ HISTÓRICO TEMPORARIAMENTE DESABILITADO
  // Ícones não podem ser serializados para localStorage
  // TODO FASE 2: Implementar salvamento sem ícone + reconstrução ao carregar
  const [history] = useState<SearchHistoryItem[]>([]);

  const addToHistory = useCallback(() => {
    // Desabilitado
  }, []);

  const removeFromHistory = useCallback(() => {
    // Desabilitado
  }, []);

  const clearHistory = useCallback(() => {
    // Desabilitado
  }, []);

  const getRecent = useCallback((): SearchHistoryItem[] => {
    return [];
  }, []);

  const getByType = useCallback((): SearchHistoryItem[] => {
    return [];
  }, []);

  const recentHistory: SearchHistoryItem[] = [];

  const stats = {
    total: 0,
    byType: {} as Record<string, number>,
    mostClicked: null,
  };

  return {
    history,
    recentHistory,
    stats,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecent,
    getByType,
    isEmpty: true,
    hasHistory: false,
  };
}
