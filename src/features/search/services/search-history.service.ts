/**
 * 💾 Search History Service
 * Gerenciamento de histórico de buscas usando localStorage
 * FASE 3: Salva apenas metadata serializável (sem ícones)
 */

import type {
  SearchResult,
  SerializableSearchResult,
} from "../types/search.types";
import { SEARCH_LIMITS } from "../types/search.types";
import { deserializeSearchResult } from "../utils/search-icon-resolver";

const HISTORY_KEY = "b-boss-search-history";
const MAX_HISTORY = SEARCH_LIMITS.MAX_HISTORY;

/**
 * � Converte SearchResult para formato serializável
 * Remove ícone e adiciona metadata de histórico
 */
function toSerializable(result: SearchResult): SerializableSearchResult {
  const base = {
    id: result.id,
    type: result.type,
    title: result.title,
    description: result.description,
    score: result.score,
    searchedAt: Date.now(),
    clickCount: 1,
    metadata: result.metadata,
  };

  // Adicionar campos específicos por tipo
  if (result.type === "page") {
    return {
      ...base,
      href: result.href,
      shortcut: result.shortcut,
      section: result.section,
    };
  }

  if (result.type === "staff") {
    return {
      ...base,
      status: result.status,
      avatarUrl: result.avatarUrl,
    };
  }

  return base;
}

/**
 * � Converte formato serializável de volta para SearchResult
 * Reconstrói o ícone baseado no tipo
 */
function fromSerializable(
  data: SerializableSearchResult,
): SearchResult & { searchedAt: Date; clickCount: number } {
  const deserialized = deserializeSearchResult(data);

  return {
    ...deserialized,
    searchedAt: new Date(data.searchedAt),
    clickCount: data.clickCount,
  } as SearchResult & { searchedAt: Date; clickCount: number };
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
      const data = localStorage.getItem(HISTORY_KEY);
      const history: SerializableSearchResult[] = data ? JSON.parse(data) : [];

      const existingIndex = history.findIndex((item) => item.id === result.id);

      let updated: SerializableSearchResult[];

      if (existingIndex !== -1) {
        // Item já existe: incrementar clickCount e mover para o topo
        const existing = history[existingIndex];
        updated = [
          {
            ...toSerializable(result),
            searchedAt: Date.now(),
            clickCount: existing.clickCount + 1,
          },
          ...history.filter((_, i) => i !== existingIndex),
        ];
      } else {
        // Novo item: adicionar no topo
        updated = [toSerializable(result), ...history];
      }

      // Limitar ao máximo permitido
      const limited = updated.slice(0, MAX_HISTORY);

      // Salvar no localStorage
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error("Erro ao salvar histórico de busca:", error);
      // Falha silenciosa: não bloquear UX
    }
  },

  /**
   * 📖 Retorna histórico completo
   * Ordenado por data (mais recente primeiro)
   */
  get(): (SearchResult & { searchedAt: Date; clickCount: number })[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];

      const parsed: SerializableSearchResult[] = JSON.parse(data);
      return parsed.map(fromSerializable);
    } catch (error) {
      console.error("Erro ao carregar histórico de busca:", error);
      return [];
    }
  },

  /**
   * 📖 Retorna histórico limitado (para UI)
   */
  getRecent(
    limit: number = 5,
  ): (SearchResult & { searchedAt: Date; clickCount: number })[] {
    return this.get().slice(0, limit);
  },

  /**
   * 🔍 Busca no histórico por tipo
   */
  getByType(
    type: SearchResult["type"],
  ): (SearchResult & { searchedAt: Date; clickCount: number })[] {
    return this.get().filter((item) => item.type === type);
  },

  /**
   * 🗑️ Remove item específico do histórico
   */
  remove(id: string): void {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return;

      const history: SerializableSearchResult[] = JSON.parse(data);
      const updated = history.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
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
    mostClicked:
      | (SearchResult & { searchedAt: Date; clickCount: number })
      | null;
  } {
    const history = this.get();
    const byType: Record<string, number> = {};

    history.forEach((item) => {
      byType[item.type] = (byType[item.type] || 0) + 1;
    });

    const mostClicked = history.reduce(
      (max, item) => (item.clickCount > (max?.clickCount || 0) ? item : max),
      null as (SearchResult & { searchedAt: Date; clickCount: number }) | null,
    );

    return {
      total: history.length,
      byType,
      mostClicked,
    };
  },
};
