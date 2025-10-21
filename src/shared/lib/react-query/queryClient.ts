import { QueryClient } from "@tanstack/react-query";

/**
 * React Query client configuration
 * Provides default options for queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before a query is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,

      // Time to keep unused data in cache (10 minutes)
      gcTime: 1000 * 60 * 10,

      // Retry failed queries 3 times
      retry: 3,

      // Delay between retries (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus in development
      refetchOnWindowFocus: import.meta.env.PROD,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Delay before retry
      retryDelay: 1000,
    },
  },
});
