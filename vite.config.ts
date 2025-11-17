import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Proxy all API requests to avoid CORS issues in development
  // Use bypass function to prevent proxying for page routes
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/clubs": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: (req) => {
          // Only proxy API requests (exclude HTML requests for frontend routes)
          if (req.headers.accept?.includes("text/html")) {
            return req.url;
          }
        },
      },
      "/items": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) {
            return req.url;
          }
        },
      },
      "/users": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) {
            return req.url;
          }
        },
      },
    },
  },

  build: {
    minify: false, // Disable minification for SSR
  },
  esbuild: {
    jsx: "automatic",
    jsxDev: false, // Force production JSX runtime
  },
});
