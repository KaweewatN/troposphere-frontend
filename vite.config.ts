import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Disable minification for SSR
  },
  esbuild: {
    jsx: "automatic",
    jsxDev: false, // Force production JSX runtime
  },
});
