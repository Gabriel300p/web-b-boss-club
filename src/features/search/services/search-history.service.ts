/**
 * 💾 Search History Service
 * Gerenciamento de histórico de buscas usando localStorage
 */

import type { SearchHistoryItem, SearchResult } from "../types/search.types";
import { SEARCH_LIMITS } from "../types/search.types";

const HISTORY_KEY = "b-boss-search-history";
const MAX_HISTORY = SEARCH_LIMITS.MAX_HISTORY;

/**
 * 📝 Serializa Date para string no localStorage
 */
function serializeHistoryItem(item: SearchHistoryItem): unknown {
  return {
    ...item,
    searchedAt: item.searchedAt.toISOString(),
  };
}

/**
 * 📝 Deserializa string para Date do localStorage
 */
function deserializeHistoryItem(
  data: Record<string, unknown>,
): SearchHistoryItem {
  return {
    ...data,
    searchedAt: new Date(data.searchedAt as string),
  } as SearchHistoryItem;
}

/**
 * 💾 Serviço de histórico de pesquisas
 */
export const searchHistoryService = {
  /**
   * ✅ Adiciona item ao histórico
   * - Remove duplicatas (mesmo ID)
   * - Incrementa clickCount se já existir
   * - Mantém limite máximo
   * - Ordena por data (mais recente primeiro)
   */
  save(result: SearchResult): void {
    try {
      const history = this.get();
      const existingIndex = history.findIndex((item) => item.id === result.id);

      let updated: SearchHistoryItem[];

      if (existingIndex !== -1) {
        // Item já existe: incrementar clickCount e mover para o topo
        const existing = history[existingIndex];
        updated = [
          {
            ...result,
            searchedAt: new Date(),
            clickCount: existing.clickCount + 1,
          },
          ...history.filter((_, i) => i !== existingIndex),
        ];
      } else {
        // Novo item: adicionar no topo
        updated = [
          {
            ...result,
            searchedAt: new Date(),
            clickCount: 1,
          },
          ...history,
        ];
      }

      // Limitar ao máximo permitido
      const limited = updated.slice(0, MAX_HISTORY);

      // Salvar no localStorage
      const serialized = limited.map(serializeHistoryItem);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Erro ao salvar histórico de busca:", error);
      // Falha silenciosa: não bloquear UX
    }
  },

  /**
   * 📖 Retorna histórico completo
   * Ordenado por data (mais recente primeiro)
   */
  get(): SearchHistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map(deserializeHistoryItem);
    } catch (error) {
      console.error("Erro ao carregar histórico de busca:", error);
      return [];
    }
  },

  /**
   * 📖 Retorna histórico limitado (para UI)
   */
  getRecent(limit: number = 5): SearchHistoryItem[] {
    return this.get().slice(0, limit);
  },

  /**
   * 🔍 Busca no histórico por tipo
   */
  getByType(type: SearchResult["type"]): SearchHistoryItem[] {
    return this.get().filter((item) => item.type === type);
  },

  /**
   * 🗑️ Remove item específico do histórico
   */
  remove(id: string): void {
    try {
      const history = this.get();
      const updated = history.filter((item) => item.id !== id);
      const serialized = updated.map(serializeHistoryItem);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Erro ao remover do histórico:", error);
    }
  },

  /**
   * 🧹 Limpa todo o histórico
   */
  clear(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  },

  /**
   * 📊 Retorna estatísticas do histórico
   */
  getStats(): {
    total: number;
    byType: Record<string, number>;
    mostClicked: SearchHistoryItem | null;
  } {
    const history = this.get();
    const byType: Record<string, number> = {};

    history.forEach((item) => {
      byType[item.type] = (byType[item.type] || 0) + 1;
    });

    const mostClicked = history.reduce(
      (max, item) => (item.clickCount > (max?.clickCount || 0) ? item : max),
      null as SearchHistoryItem | null,
    );

    return {
      total: history.length,
      byType,
      mostClicked,
    };
  },
};
