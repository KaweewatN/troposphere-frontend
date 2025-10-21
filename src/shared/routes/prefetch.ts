/**
 * Route-based data prefetching configuration
 *
 * This file defines which data should be prefetched for each route
 * during server-side rendering.
 *
 * Usage: Import and pass to render() in server.ts
 */

import type { QueryClient } from "@tanstack/react-query";
import { userManagementQueries } from "../../entities/users";

/**
 * Prefetch data based on the current route
 *
 * @param queryClient - The QueryClient instance for this request
 * @param url - The requested URL path
 *
 * @example
 * ```typescript
 * // In server.ts
 * const { html, dehydratedState } = await render(url, {
 *   prefetchData: prefetchRouteData,
 * });
 * ```
 */
export async function prefetchRouteData(
  queryClient: QueryClient,
  url: string
): Promise<void> {
  // Set a timeout to prevent slow APIs from blocking the response
  const PREFETCH_TIMEOUT = 5000; // 5 seconds

  const prefetchWithTimeout = async <T>(
    promise: Promise<T>,
    timeoutMs = PREFETCH_TIMEOUT
  ): Promise<T | null> => {
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), timeoutMs)
    );

    try {
      return await Promise.race([promise, timeout]);
    } catch (error) {
      console.error("Prefetch error:", error);
      return null;
    }
  };

  // Prefetch for routes containing /clubs
  if (url.includes("/clubs")) {
    await prefetchWithTimeout(
      queryClient.prefetchQuery(userManagementQueries.userClubs())
    );
    return;
  }

  // Prefetch for routes containing /items/
  if (url.includes("/items/")) {
    // TODO: Add items query when available
    // await prefetchWithTimeout(
    //   queryClient.prefetchQuery(itemsQueries.list())
    // );
    return;
  }

  // Prefetch for routes containing /users/
  if (url.includes("/users/")) {
    // TODO: Add users query when available
    // await prefetchWithTimeout(
    //   queryClient.prefetchQuery(usersQueries.list())
    // );
    return;
  }

  // No matching route - don't prefetch anything
  // The app will fetch data on the client as needed
}

/**
 * Example: Prefetch data with user context
 *
 * Use this if you need to prefetch user-specific data based on authentication
 */
export async function prefetchRouteDataWithAuth(
  queryClient: QueryClient,
  url: string,
  userId?: string | number
): Promise<void> {
  // If no user is authenticated, skip user-specific prefetching
  if (!userId) {
    // Still prefetch public data
    await prefetchRouteData(queryClient, url);
    return;
  }

  // Prefetch user-specific data for authenticated users
  if (url === "/" || url === "/home" || url === "/dashboard") {
    await Promise.all([
      queryClient.prefetchQuery(userManagementQueries.userClubs()),
      queryClient.prefetchQuery(userManagementQueries.borrowHistory()),
    ]);
  }
}
