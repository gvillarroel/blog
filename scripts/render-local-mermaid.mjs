import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  throw new Error("Usage: node scripts/render-local-mermaid.mjs <input.mmd> <output.svg>");
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = path.resolve(inputArg);
const outputPath = path.resolve(outputArg);
const source = await fs.readFile(inputPath, "utf8");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const contentTypes = new Map([
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".wasm", "application/wasm"],
]);

let resolveSaved;
let rejectSaved;
const saved = new Promise((resolve, reject) => {
  resolveSaved = resolve;
  rejectSaved = reject;
});

const page = `<!doctype html>
<meta charset="utf-8">
<title>rendering</title>
<body></body>
<script type="module">
  import mermaid from "/node_modules/mermaid/dist/mermaid.esm.mjs";
  try {
    const source = await fetch("/source").then((response) => response.text());
    mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
    const { svg } = await mermaid.render("my-svg", source);
    document.body.innerHTML = svg;
    await fetch("/save", {
      method: "POST",
      headers: { "content-type": "image/svg+xml; charset=utf-8" },
      body: svg,
    });
    document.title = "done";
  } catch (error) {
    await fetch("/error", { method: "POST", body: error?.stack || String(error) });
    document.title = "error";
  }
</script>`;

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(page);
      return;
    }
    if (request.method === "GET" && url.pathname === "/source") {
      response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      response.end(source);
      return;
    }
    if (request.method === "GET" && url.pathname.startsWith("/node_modules/")) {
      const relative = decodeURIComponent(url.pathname.slice(1));
      const target = path.resolve(repoRoot, relative);
      const modulesRoot = path.resolve(repoRoot, "node_modules") + path.sep;
      if (!target.startsWith(modulesRoot)) {
        response.writeHead(403).end();
        return;
      }
      const data = await fs.readFile(target);
      response.writeHead(200, {
        "content-type": contentTypes.get(path.extname(target)) ?? "application/octet-stream",
      });
      response.end(data);
      return;
    }
    if (request.method === "POST" && (url.pathname === "/save" || url.pathname === "/error")) {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString("utf8");
      response.writeHead(204).end();
      if (url.pathname === "/error") rejectSaved(new Error(body));
      else {
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        let decoratedSvg = body.replace(
          "<svg ",
          '<svg data-diagram-background="light" ',
        );
        if (/<svg\b[^>]*\bstyle="/.test(decoratedSvg)) {
          decoratedSvg = decoratedSvg.replace(
            /(<svg\b[^>]*\bstyle=")/,
            '$1background-color: white; ',
          );
        } else {
          decoratedSvg = decoratedSvg.replace(
            "<svg ",
            '<svg style="background-color: white;" ',
          );
        }
        await fs.writeFile(outputPath, decoratedSvg, "utf8");
        resolveSaved();
      }
      return;
    }
    response.writeHead(404).end();
  } catch (error) {
    response.writeHead(500).end(String(error));
    rejectSaved(error);
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not allocate renderer port");

const browser = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "--no-first-run",
  "--no-default-browser-check",
  `http://127.0.0.1:${address.port}/`,
], { stdio: ["ignore", "ignore", "pipe"] });

let browserErrors = "";
browser.stderr.on("data", (chunk) => { browserErrors += chunk; });

let timeoutId;
const timeout = new Promise((_, reject) => {
  timeoutId = setTimeout(() => reject(new Error(`Mermaid render timed out. ${browserErrors}`)), 30000);
});

try {
  await Promise.race([saved, timeout]);
} finally {
  clearTimeout(timeoutId);
  browser.kill();
  await new Promise((resolve) => server.close(resolve));
}

console.log(outputPath);
