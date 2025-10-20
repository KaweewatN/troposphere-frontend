import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    minify: false, // Disable minification for SSR
  },
  esbuild: {
    jsx: "automatic",
    jsxDev: false, // Force production JSX runtime
  },
});
