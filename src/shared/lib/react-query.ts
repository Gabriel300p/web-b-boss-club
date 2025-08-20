/**
 * 🚀 TanStack Query Optimization Strategy
 *
 * Centralized query keys, optimistic updates, caching strategies
 * and performance optimizations for React Query
 */

import type { QueryClient } from "@tanstack/react-query";

// 🔑 Centralized Query Keys for type safety and consistency
export const QUERY_KEYS = {
  comunicacoes: {
    all: ["comunicacoes"] as const,
    lists: () => [...QUERY_KEYS.comunicacoes.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...QUERY_KEYS.comunicacoes.lists(), filters] as const,
    details: () => [...QUERY_KEYS.comunicacoes.all, "detail"] as const,
    detail: (id: string) => [...QUERY_KEYS.comunicacoes.details(), id] as const,
  },
  // 🚀 Future: Add other entities here
  // users: { ... },
  // settings: { ... }
} as const;

// 🚀 Query options factory for consistent configuration
export const createQueryOptions = {
  /**
   * Standard list query configuration
   */
  list: <T>(queryFn: () => Promise<T>) => ({
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  }),

  /**
   * Detail query configuration (more aggressive caching)
   */
  detail: <T>(queryFn: () => Promise<T>) => ({
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  }),

  /**
   * Real-time data configuration (frequent updates)
   */
  realtime: <T>(queryFn: () => Promise<T>) => ({
    queryFn,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // 1 minute
    retry: 1,
  }),
} as const;

// 🚀 Mutation configuration factory
export const createMutationOptions = {
  /**
   * Standard mutation with optimistic updates
   */
  withOptimisticUpdate: <TData, TVariables>(config: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: readonly unknown[];
    optimisticUpdateFn?: (oldData: unknown, variables: TVariables) => unknown;
    onError?: (error: Error, variables: TVariables, context: unknown) => void;
  }) => ({
    mutationFn: config.mutationFn,
    onMutate: async (variables: TVariables) => {
      if (!config.optimisticUpdateFn || !queryClient) return;

      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: config.queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(config.queryKey);

      // Optimistically update
      if (previousData && config.optimisticUpdateFn) {
        queryClient.setQueryData(
          config.queryKey,
          config.optimisticUpdateFn(previousData, variables),
        );
      }

      return { previousData };
    },
    onError: (error: Error, variables: TVariables, context: unknown) => {
      // Rollback on error
      if (
        context &&
        typeof context === "object" &&
        "previousData" in context &&
        queryClient
      ) {
        queryClient.setQueryData(
          config.queryKey,
          (context as { previousData: unknown }).previousData,
        );
      }
      config.onError?.(error, variables, context);
    },
    onSettled: () => {
      // Always refetch after error or success
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: config.queryKey });
      }
    },
  }),

  /**
   * Simple mutation without optimistic updates
   */
  simple: <TData, TVariables>(config: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    invalidateKeys?: readonly unknown[][];
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }) => ({
    mutationFn: config.mutationFn,
    onSuccess: (data: TData, variables: TVariables) => {
      // Invalidate specified queries
      if (config.invalidateKeys) {
        config.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      config.onSuccess?.(data, variables);
    },
    onError: config.onError,
  }),
};

// 🚀 Global query client instance (to be set by provider)
let queryClient: QueryClient;

export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};
