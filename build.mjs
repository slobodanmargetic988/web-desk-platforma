import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("index.html", "dist/index.html");

for (const asset of ["og.png"]) {
  try {
    await cp(asset, `dist/${asset}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
