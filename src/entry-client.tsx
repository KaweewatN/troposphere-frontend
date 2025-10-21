import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { hydrate } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { getQueryClient } from "./shared/lib/react-query";

// Declare global type for dehydrated state
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
  }
}

// Get or create the query client
const queryClient = getQueryClient();

// Hydrate the query client with server state if available
if (window.__REACT_QUERY_STATE__) {
  hydrate(queryClient, window.__REACT_QUERY_STATE__);
}

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App queryClient={queryClient} />
    </BrowserRouter>
  </StrictMode>
);
