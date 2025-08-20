/**
 * 🚀 Advanced TanStack Query Cache Management Utilities
 *
 * Specialized hooks and utilities for cache invalidation,
 * prefetching, and cache warming strategies
 */

import { QUERY_KEYS } from "@shared/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchComunicacoes } from "../services/comunicacao.service";

/**
 * 🔄 Hook for managing comunicacoes cache with advanced strategies
 */
export function useComunicacoesCache() {
  const queryClient = useQueryClient();

  // 🚀 Selective invalidation - only invalidate specific queries
  const invalidateComunicacoes = useCallback(
    (options?: { exact?: boolean }) => {
      return queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comunicacoes.all,
        exact: options?.exact ?? false,
      });
    },
    [queryClient],
  );

  // 🚀 Prefetch comunicacoes data for performance
  const prefetchComunicacoes = useCallback(
    async (options?: { staleTime?: number }) => {
      return queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.comunicacoes.all,
        queryFn: fetchComunicacoes,
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
      });
    },
    [queryClient],
  );

  // 🚀 Manual cache update without invalidation
  const updateComunicacoesCache = useCallback(
    (updater: (oldData: unknown) => unknown) => {
      queryClient.setQueryData(QUERY_KEYS.comunicacoes.all, updater);
    },
    [queryClient],
  );

  // 🚀 Get cached data without triggering fetch
  const getCachedComunicacoes = useCallback(() => {
    return queryClient.getQueryData(QUERY_KEYS.comunicacoes.all);
  }, [queryClient]);

  // 🚀 Remove comunicacoes from cache
  const removeComunicacoesCache = useCallback(() => {
    queryClient.removeQueries({
      queryKey: QUERY_KEYS.comunicacoes.all,
    });
  }, [queryClient]);

  // 🚀 Force refresh data (bypass cache)
  const refetchComunicacoes = useCallback(() => {
    return queryClient.refetchQueries({
      queryKey: QUERY_KEYS.comunicacoes.all,
    });
  }, [queryClient]);

  // 🚀 Cancel ongoing queries
  const cancelComunicacoesQueries = useCallback(() => {
    return queryClient.cancelQueries({
      queryKey: QUERY_KEYS.comunicacoes.all,
    });
  }, [queryClient]);

  // 🚀 Check if data is stale
  const isCommunicacoesStale = useCallback(() => {
    const query = queryClient.getQueryState(QUERY_KEYS.comunicacoes.all);
    return query ? Date.now() - query.dataUpdatedAt > 5 * 60 * 1000 : true; // 5 min stale time
  }, [queryClient]);

  return {
    // Cache management
    invalidateComunicacoes,
    updateComunicacoesCache,
    removeComunicacoesCache,
    getCachedComunicacoes,

    // Performance utilities
    prefetchComunicacoes,
    refetchComunicacoes,
    cancelComunicacoesQueries,

    // Status checks
    isCommunicacoesStale,
  };
}

/**
 * 🔧 Hook for managing query state and background updates
 */
export function useQueryState() {
  const queryClient = useQueryClient();

  // 🚀 Get all active queries count
  const getActiveQueriesCount = useCallback(() => {
    return queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => query.state.fetchStatus === "fetching").length;
  }, [queryClient]);

  // 🚀 Get cache size information
  const getCacheInfo = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const allQueries = cache.getAll();
    return {
      totalQueries: allQueries.length,
      activeQueries: allQueries.filter(
        (query) => query.state.fetchStatus === "fetching",
      ).length,
      staleQueries: allQueries.filter(
        (query) => Date.now() - query.state.dataUpdatedAt > 5 * 60 * 1000,
      ).length,
    };
  }, [queryClient]);

  // 🚀 Clear all cache
  const clearAllCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    getActiveQueriesCount,
    getCacheInfo,
    clearAllCache,
  };
}
