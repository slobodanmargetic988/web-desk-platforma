import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = 4173;
const types = { ".html": "text/html; charset=utf-8", ".png": "image/png" };

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = normalize(join(root, relative));
  if (!file.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  const stream = createReadStream(file);
  stream.on("open", () => response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }));
  stream.on("error", () => response.writeHead(404).end("Not found"));
  stream.pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
