# Troposphere Frontend - SSR React Application

This project uses **Server-Side Rendering (SSR)** with React, TypeScript, Vite, and Express for optimal performance and SEO.

## Features

- ⚡ **Server-Side Rendering (SSR)** - Fast initial page load and better SEO
- 🔥 **Hot Module Replacement (HMR)** - Fast development experience
- 📦 **Code Splitting** - Optimized bundle sizes
- 🎨 **TypeScript** - Type-safe development
- 🚀 **Production Ready** - Optimized builds with compression

## Getting Started

### Installation

```bash
yarn install
```

### Development

Run the development server with SSR:

```bash
yarn dev
```

The server will start at `http://localhost:5173` with SSR enabled.

### Production Build

Build the application for production:

```bash
yarn build
```

This creates two builds:

- `dist/client` - Client-side assets
- `dist/server` - Server-side rendering bundle

### Production Preview

Run the production build locally:

```bash
yarn preview
```

## Project Structure

```
├── src/
│   ├── entry-client.tsx    # Client-side entry point (hydration)
│   ├── entry-server.tsx    # Server-side entry point (SSR)
│   ├── App.tsx             # Main React component
│   └── main.tsx            # Legacy entry (not used in SSR)
├── server.ts               # Express server for SSR
├── index.html              # HTML template with SSR placeholders
└── vite.config.ts          # Vite configuration
```

## How SSR Works

1. **Development Mode**: Vite dev server handles SSR with HMR
2. **Production Mode**: Express server serves pre-rendered HTML
3. **Hydration**: React hydrates the server-rendered HTML on the client

## Environment Variables

Create a `.env` file:

```env
PORT=5173
NODE_ENV=development
BASE=/
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
