import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import App from "./App";
import { createQueryClient } from "./shared/lib/react-query";

export interface RenderOptions {
  /**
   * Optional callback to prefetch data before rendering
   * Use this to prefetch critical data for the current route
   */
  prefetchData?: (queryClient: QueryClient, url: string) => Promise<void>;
}

export async function render(url: string, options: RenderOptions = {}) {
  // Create a fresh QueryClient for this request
  const queryClient = createQueryClient();

  // Prefetch data if a prefetch function is provided
  if (options.prefetchData) {
    try {
      await options.prefetchData(queryClient, url);
    } catch (error) {
      console.error("Error prefetching data:", error);
      // Continue rendering even if prefetch fails
    }
  }

  // Render the app to string
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url} future={{ v7_relativeSplatPath: true }}>
        <App queryClient={queryClient} />
      </StaticRouter>
    </StrictMode>
  );

  // Dehydrate the query client state
  const dehydratedState = dehydrate(queryClient);

  return {
    html,
    dehydratedState,
  };
}
