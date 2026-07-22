#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function resolveToolkitRoot(argv) {
  if (argv.length === 0) {
    return realpathSync(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    );
  }
  if (argv.length !== 2 || argv[0] !== "--root" || !argv[1]) {
    throw new Error("Usage: node scripts/doctor.mjs [--root <toolkit-path>]");
  }
  return realpathSync(path.resolve(argv[1]));
}

let toolkitRoot;
try {
  toolkitRoot = resolveToolkitRoot(process.argv.slice(2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
const manifestPath = path.join(toolkitRoot, "toolkit-manifest.json");
const errors = [];

const requiredPaths = [
  "AGENTS.md",
  "开始使用.md",
  "toolkit-manifest.json",
  "docs/平台建设UI规范.md",
  "docs/design-system/01-foundations.md",
  "docs/design-system/02-shell-navigation.md",
  "docs/design-system/03-application-page-patterns.md",
  "docs/design-system/04-states-interactions.md",
  "docs/design-system/05-evidence-acceptance.md",
  "docs/design-system/assets/basic-business-application-frame.png",
  "docs/design-system/assets/max-platform-boundary.png",
  "skills/application-extension/SKILL.md",
  "skills/application-extension-template/SKILL.md",
  "assets/product-manager-preview.html",
  "inputs/_模板/业务应用需求模板.md",
  "inputs/_模板/产品经理应用结构表.md",
  "outputs/.gitkeep",
  "scripts/doctor.mjs",
  "scripts/verify-product-manager-preview.mjs",
];

function report(message) {
  errors.push(message);
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function walkFiles(rootDir, relativeDir = "") {
  if (!existsSync(rootDir)) return [];
  const directory = path.join(rootDir, relativeDir);
  if (lstatSync(directory).isSymbolicLink()) {
    report(`管理区包含 symlink/符号链接: ${toPosix(directory)}`);
    return relativeDir ? [toPosix(relativeDir)] : [];
  }
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isSymbolicLink()) return [toPosix(relativePath)];
    if (entry.isDirectory()) return walkFiles(rootDir, relativePath);
    return [toPosix(relativePath)];
  });
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function readText(relativePath) {
  try {
    const filePath = path.join(toolkitRoot, relativePath);
    if (lstatSync(filePath).isSymbolicLink()) {
      report(`管理文件不得是 symlink/符号链接: ${relativePath}`);
      return "";
    }
    return readFileSync(filePath, "utf8");
  } catch (error) {
    report(`无法读取 ${relativePath}: ${error.message}`);
    return "";
  }
}

function skillName(source) {
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return frontmatter?.[1].match(/^name:\s*([^\n]+)$/m)?.[1]?.trim() || "";
}

function isSafeManagedPath(relativePath) {
  if (
    !relativePath ||
    path.isAbsolute(relativePath) ||
    path.win32.isAbsolute(relativePath)
  )
    return false;
  if (relativePath.includes("\0") || relativePath.split(/[\\/]/).includes(".."))
    return false;
  const resolvedPath = path.resolve(toolkitRoot, relativePath);
  return resolvedPath.startsWith(`${toolkitRoot}${path.sep}`);
}

function discoverManagedFiles() {
  const files = ["AGENTS.md", "开始使用.md", "outputs/.gitkeep"];
  for (const directory of [
    "assets",
    "docs",
    "skills",
    "scripts",
    "inputs/_模板",
  ]) {
    files.push(
      ...walkFiles(path.join(toolkitRoot, directory)).map(
        (file) => `${directory}/${file}`,
      ),
    );
  }
  return [...new Set(files)].sort();
}

for (const relativePath of requiredPaths) {
  if (!existsSync(path.join(toolkitRoot, relativePath)))
    report(`缺少必需路径: ${relativePath}`);
}

for (const directory of ["inputs", "outputs"]) {
  const fullPath = path.join(toolkitRoot, directory);
  if (existsSync(fullPath) && !statSync(fullPath).isDirectory())
    report(`${directory} 必须是目录`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  report(`manifest 无法解析: ${error.message}`);
}

if (manifest) {
  const expected = {
    toolkitId: "platform-business-application-toolkit",
    schemaVersion: 1,
    toolkitVersion: "1.0.0",
    uiSpecVersion: "v1.3",
    baselineViewport: "1920x1080",
    mobileScope: "deferred",
    entrypoint: "AGENTS.md",
  };
  for (const [key, value] of Object.entries(expected)) {
    if (manifest[key] !== value)
      report(`manifest ${key} 应为 ${JSON.stringify(value)}`);
  }
  if (!manifest.builtAt || Number.isNaN(Date.parse(manifest.builtAt)))
    report("manifest builtAt 必须是有效 ISO 时间");

  const names = Array.isArray(manifest.skills)
    ? manifest.skills.map((skill) => skill.name)
    : [];
  if (
    JSON.stringify(names) !==
    JSON.stringify(["application-extension", "application-extension-template"])
  ) {
    report("manifest skills 必须按规定包含两个 skill");
  }

  const managedFiles = manifest.managedFiles;
  if (
    !managedFiles ||
    Array.isArray(managedFiles) ||
    typeof managedFiles !== "object"
  ) {
    report("manifest managedFiles 必须是 SHA-256 映射");
  } else {
    const declaredFiles = Object.keys(managedFiles).sort();
    const discoveredFiles = discoverManagedFiles();
    if (JSON.stringify(declaredFiles) !== JSON.stringify(discoveredFiles)) {
      report("integrity: manifest 托管文件集合与实际管理区不一致");
    }

    for (const [relativePath, expectedHash] of Object.entries(managedFiles)) {
      if (!isSafeManagedPath(relativePath)) {
        report(`integrity: 非法托管路径 ${relativePath}`);
        continue;
      }
      const fullPath = path.join(toolkitRoot, relativePath);
      if (!existsSync(fullPath)) {
        report(`integrity: 缺少托管文件 ${relativePath}`);
        continue;
      }
      if (lstatSync(fullPath).isSymbolicLink()) {
        report(`integrity: 管理文件不得是 symlink/符号链接: ${relativePath}`);
        continue;
      }
      const physicalPath = realpathSync(fullPath);
      if (!physicalPath.startsWith(`${toolkitRoot}${path.sep}`)) {
        report(`integrity: 管理文件越出工具包: ${relativePath}`);
        continue;
      }
      const actualHash = sha256(fullPath);
      if (!/^[a-f0-9]{64}$/.test(expectedHash) || actualHash !== expectedHash) {
        report(`SHA-256 hash 不匹配: ${relativePath}`);
      }
    }
  }
}

const mainSkill = readText("skills/application-extension/SKILL.md");
const templateSkill = readText(
  "skills/application-extension-template/SKILL.md",
);

if (skillName(mainSkill) !== "application-extension")
  report("主 skill frontmatter name 不正确");
if (skillName(templateSkill) !== "application-extension-template")
  report("template skill frontmatter name 不正确");
for (const [label, source] of [
  ["主 skill", mainSkill],
  ["template skill", templateSkill],
]) {
  if (!source.includes("v1.3")) report(`${label} 未同步 UI 规范 v1.3`);
  if (!/1920\s*[x×]\s*1080/i.test(source))
    report(`${label} 未声明 1920 x 1080 基线`);
  if (!source.includes("deferred")) report(`${label} 未声明移动端 deferred`);
}
if (
  !/existing-platform|platform-integrated|target platform repository/i.test(
    mainSkill,
  )
) {
  report("主 skill 未声明现有平台接入能力");
}
if (!/standalone Basic applications only/i.test(templateSkill))
  report("template skill 必须限定 standalone Basic");
if (
  !/Pro or Max/.test(templateSkill) ||
  !/\$application-extension/.test(templateSkill)
) {
  report("template skill 未将 Pro/Max 路由到主 skill");
}
for (const [label, skill] of [
  ["主 skill", mainSkill],
  ["template skill", templateSkill],
]) {
  if (!/产品经理[\s\S]{0,420}产品经理预览\.html/.test(skill))
    report(`${label} 缺少产品经理 HTML 预览交付合同`);
  if (!/verify-product-manager-preview\.mjs/.test(skill))
    report(`${label} 缺少产品经理 HTML 预览校验命令`);
}

const agents = readText("AGENTS.md");
const agentChecks = [
  [/role_unknown\s*->\s*request_role_choice/, "AGENTS 缺少角色选择状态机"],
  [
    /request_user_input[\s\S]{0,600}id:\s*[`'"]role[`'"][\s\S]{0,600}产品经理[\s\S]{0,600}设计师[\s\S]{0,600}研发[\s\S]{0,600}工具维护者/,
    "AGENTS 缺少 Codex 角色选择器合同",
  ],
  [
    /(未提供|不可用)[\s\S]{0,240}(编号|文本)/,
    "AGENTS 缺少角色选择器文本降级合同",
  ],
  [
    /(无效|其他)[\s\S]{0,240}(重新|再次).*(选择|确认)/,
    "AGENTS 缺少无效角色选择重试合同",
  ],
  [
    /产品经理[\s\S]{0,420}产品经理预览\.html/,
    "AGENTS 缺少产品经理 HTML 预览交付合同",
  ],
  [
    /角色回答或确认前[\s\S]*不得读取[\s\S]*不得选择、加载[\s\S]*不得创建、修改或写入/,
    "AGENTS 角色硬门禁不完整",
  ],
  [
    /standalone[\s\S]*Basic[\s\S]*(快速|quick)[\s\S]*application-extension-template/i,
    "AGENTS 缺少 template 路由",
  ],
  [
    /(现有平台|platform-integrated)[\s\S]*application-extension/,
    "AGENTS 缺少现有平台路由",
  ],
  [/Pro\s*\/\s*Max[\s\S]*application-extension/, "AGENTS 缺少 Pro/Max 路由"],
  [
    /(HTML|Figma|截图|迁移)[\s\S]*application-extension/,
    "AGENTS 缺少来源迁移路由",
  ],
  [/一个且仅一个 shell owner/, "AGENTS 缺少单壳层约束"],
  [/outputs\/<application-id>\//, "AGENTS 缺少独立输出目录"],
  [/(默认不覆盖|不得覆盖)/, "AGENTS 缺少输出保护"],
  [/1920\s*x\s*1080/i, "AGENTS 缺少桌面验证基线"],
];
for (const [pattern, message] of agentChecks)
  if (!pattern.test(agents)) report(message);

const previewSource = readText("assets/product-manager-preview.html");
const previewChecks = [
  [/^<!doctype html>/i, "产品经理 HTML 预览缺少 <!doctype html>"],
  [/<style>[\s\S]+<\/style>/i, "产品经理 HTML 预览缺少内联样式"],
  [/<script>[\s\S]+<\/script>/i, "产品经理 HTML 预览缺少内联脚本"],
  [/window\.__PRODUCT_MANAGER_PREVIEW__/, "产品经理 HTML 预览缺少数据对象"],
  [/data-module-id/, "产品经理 HTML 预览缺少 Module 交互"],
  [/data-tab-id/, "产品经理 HTML 预览缺少 Tab 交互"],
  [/data-preview-action="detail"/, "产品经理 HTML 预览缺少详情示意"],
  [/data-preview-action="form"/, "产品经理 HTML 预览缺少新建示意"],
];
for (const [pattern, message] of previewChecks)
  if (!pattern.test(previewSource)) report(message);

const forbiddenPreviewPatterns = [
  [/type\s*=\s*["']module["']/i, "产品经理 HTML 预览不得使用 module script"],
  [/\bfetch\s*\(/, "产品经理 HTML 预览不得使用 fetch"],
  [/\/src\//, "产品经理 HTML 预览不得依赖 /src/"],
  [/https?:\/\//i, "产品经理 HTML 预览不得引用外部资源"],
  [/<script\b[^>]*\bsrc\s*=/i, "产品经理 HTML 预览不得使用外链 script"],
  [/<link\b[^>]*\bhref\s*=/i, "产品经理 HTML 预览不得使用外链 stylesheet"],
];
for (const [pattern, message] of forbiddenPreviewPatterns)
  if (pattern.test(previewSource)) report(message);

const forbiddenPathPattern =
  /\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/var\/folders\/|[A-Za-z]:\\Users\\[^\\\s]+\\/;
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);
for (const relativePath of discoverManagedFiles()) {
  if (!textExtensions.has(path.extname(relativePath))) continue;
  const source = readText(relativePath);
  if (forbiddenPathPattern.test(source))
    report(`管理文本包含构建机器绝对路径: ${relativePath}`);
}

const forbiddenArtifacts = discoverManagedFiles().filter((relativePath) => {
  const parts = relativePath.split("/");
  return (
    parts.includes(".DS_Store") ||
    parts.includes("__pycache__") ||
    relativePath.endsWith(".pyc")
  );
});
for (const relativePath of forbiddenArtifacts)
  report(`包含禁止的构建产物: ${relativePath}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    "PASS: 平台业务应用生成工具结构、版本和 SHA-256 integrity 均有效。",
  );
}
