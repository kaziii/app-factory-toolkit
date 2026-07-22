#!/usr/bin/env node
// 重建 toolkit-manifest.json 的 managedFiles 哈希与 builtAt（工具维护者流程）。
// 发现规则与 scripts/doctor.mjs 完全一致：AGENTS.md、开始使用.md、outputs/.gitkeep
// + assets/docs/skills/scripts/inputs/_模板 全量文件。改完管理区文件后跑本脚本再跑 doctor。
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, lstatSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "toolkit-manifest.json");

function walkFiles(rootDir, relativeDir = "") {
  if (!existsSync(rootDir)) return [];
  const directory = path.join(rootDir, relativeDir);
  if (lstatSync(directory).isSymbolicLink()) throw new Error(`symlink: ${directory}`);
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`symlink: ${relativePath}`);
    if (entry.isDirectory()) return walkFiles(rootDir, relativePath);
    return [relativePath.split(path.sep).join("/")];
  });
}

const files = ["AGENTS.md", "开始使用.md", "outputs/.gitkeep"];
for (const directory of ["assets", "docs", "skills", "scripts", "inputs/_模板"]) {
  files.push(...walkFiles(path.join(root, directory)).map((f) => `${directory}/${f}`));
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.managedFiles = Object.fromEntries(
  [...new Set(files)].sort().map((f) => [
    f,
    createHash("sha256").update(readFileSync(path.join(root, f))).digest("hex"),
  ]),
);
manifest.builtAt = new Date().toISOString();
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest rebuilt: ${Object.keys(manifest.managedFiles).length} managed files`);
