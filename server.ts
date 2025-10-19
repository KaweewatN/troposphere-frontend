import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import type { Request, Response } from "express";
import type { ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? fs.readFileSync(
      path.resolve(__dirname, "./dist/client/index.html"),
      "utf-8"
    )
  : "";

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
    let render: () => { html: string };

    if (!isProduction && vite) {
      // Always read fresh template in development
      template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const { html: appHtml } = render();

    const html = template
      .replace(`<!--app-head-->`, "")
      .replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
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
