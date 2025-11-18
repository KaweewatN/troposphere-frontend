import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import type { Request, Response } from "express";
import type { ViteDevServer } from "vite";
import type { QueryClient } from "@tanstack/react-query";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Type for render function
interface RenderOptions {
  prefetchData?: (queryClient: QueryClient, url: string) => Promise<void>;
}

interface RenderResult {
  html: string;
  dehydratedState?: unknown;
}

type RenderFunction = (
  url: string,
  options?: RenderOptions
) => Promise<RenderResult>;

// Cached production assets
const templateHtml = isProduction
  ? fs.readFileSync(
      path.resolve(__dirname, "./dist/client/index.html"),
      "utf-8"
    )
  : "";

// Safe serialization for embedding in HTML
function safeSerialize(data: unknown): string {
  const json = JSON.stringify(data);
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\//g, "\\u002f")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

const app = express();

// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(
    base,
    sirv(path.resolve(__dirname, "./dist/client"), { extensions: [] })
  );
}

// Serve HTML
app.use("*", async (req: Request, res: Response) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template: string;
    let render: RenderFunction;

    if (!isProduction && vite) {
      // Always read fresh template in development
      template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx"))
        .render as RenderFunction;
    } else {
      template = templateHtml;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const importedRender = (await import("./dist/server/entry-server.js"))
        .render as any;

      // Wrap to ensure it returns a Promise with the right shape
      render = async (
        url: string,
        options?: RenderOptions
      ): Promise<RenderResult> => {
        const result = await Promise.resolve(importedRender(url, options));
        return result;
      };
    }

    // Render the app and get dehydrated state
    const { html: appHtml, dehydratedState } = await render(url);

    // Inject dehydrated state into HTML
    const stateScript = dehydratedState
      ? `<script>window.__REACT_QUERY_STATE__ = ${safeSerialize(
          dehydratedState
        )};</script>`
      : "";

    const html = template
      .replace(`<!--app-head-->`, stateScript)
      .replace(`<!--app-html-->`, appHtml);

    // Send CSP header so browsers that ignore meta CSP (notably some iOS/Safari versions)
    // will still receive the `upgrade-insecure-requests` directive.
    res
      .status(200)
      .set({
        "Content-Type": "text/html",
        "Content-Security-Policy": "upgrade-insecure-requests",
      })
      .send(html);
  } catch (e) {
    const error = e as Error;
    vite?.ssrFixStacktrace(error);
    console.log(error.stack);
    res.status(500).end(error.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
