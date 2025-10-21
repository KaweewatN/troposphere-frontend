import { QueryClient } from "@tanstack/react-query";

/**
 * Default query client options
 * Used for both server and client query clients
 */
const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      // Time before a query is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,

      // Time to keep unused data in cache (10 minutes)
      gcTime: 1000 * 60 * 10,

      // Retry failed queries 3 times
      retry: 3,

      // Delay between retries (exponential backoff)
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus in development
      refetchOnWindowFocus:
        typeof window !== "undefined" && import.meta.env.PROD,

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
};

/**
 * Create a new QueryClient instance
 * For SSR: create a new instance per request on the server
 * For CSR: use the singleton client on the client
 */
export function createQueryClient() {
  return new QueryClient(defaultQueryClientOptions);
}

/**
 * Singleton query client for client-side rendering
 * Note: On the server, always use createQueryClient() for per-request instances
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // Server-side: always create a new client
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  // Client-side: create singleton on first use
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getQueryClient() instead
 */
export const queryClient = getQueryClient();
