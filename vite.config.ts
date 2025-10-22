import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Proxy all API requests to avoid CORS issues in development
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/clubs": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/items": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:8000",
        changeOrigin: true,
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
