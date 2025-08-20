import { setQueryClient } from "@shared/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

// 🚀 Advanced QueryClient configuration for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🔄 Stale time: 5 minutes (data is fresh for 5 min)
      staleTime: 5 * 60 * 1000,

      // 🗑️ Garbage collection: 10 minutes (unused data cleanup)
      gcTime: 10 * 60 * 1000,

      // 🚫 Disable refetch on window focus for better UX
      refetchOnWindowFocus: false,

      // 🔄 Refetch on reconnect for data consistency
      refetchOnReconnect: true,

      // 🔁 Retry failed requests 2 times with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && "status" in error && typeof error.status === "number") {
          if (error.status >= 400 && error.status < 500) return false;
        }
        return failureCount < 2;
      },

      // 🕐 Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // 🔄 Refetch interval for real-time data (disabled by default)
      refetchInterval: false,

      // 📊 Network mode: online-first, fallback to cache when offline
      networkMode: "online",
    },
    mutations: {
      // 🔁 Retry mutations once on failure
      retry: 1,

      // 🕐 Retry delay for mutations
      retryDelay: 1000,

      // 📊 Network mode for mutations
      networkMode: "online",
    },
  },
});

// 🚀 Set global query client for optimized utilities
setQueryClient(queryClient);

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
