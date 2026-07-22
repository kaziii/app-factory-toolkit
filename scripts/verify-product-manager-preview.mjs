#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const previewPath = resolve(
  scriptDirectory,
  process.argv[2] || "../assets/product-manager-preview.html",
);
const errors = [];

function report(message) {
  errors.push(message);
}

if (!existsSync(previewPath)) {
  report(`缺少产品经理 HTML 预览: ${previewPath}`);
} else {
  const source = readFileSync(previewPath, "utf8");
  const requiredPatterns = [
    [/^<!doctype html>/i, "缺少 <!doctype html>"],
    [/<style>[\s\S]+<\/style>/i, "缺少内联样式"],
    [/<script>[\s\S]+<\/script>/i, "缺少内联脚本"],
    [/window\.__PRODUCT_MANAGER_PREVIEW__/, "缺少预览数据对象"],
    [/data-preview-model/, "缺少预览模型标记"],
    [/data-module-id/, "缺少 Module 交互标记"],
    [/data-tab-id/, "缺少 Tab 交互标记"],
    [/data-preview-action="detail"/, "缺少详情示意交互标记"],
    [/data-preview-action="form"/, "缺少新建示意交互标记"],
  ];
  for (const [pattern, message] of requiredPatterns) {
    if (!pattern.test(source)) report(message);
  }

  const forbiddenPatterns = [
    [/type\s*=\s*["']module["']/i, "禁止 module script"],
    [/\bimport\s+(?:[\w*{]|\()/, "禁止 ES module import"],
    [/\bfetch\s*\(/, "禁止 fetch 运行时依赖"],
    [/\/src\//, "禁止 /src/ 运行时依赖"],
    [/https?:\/\//i, "禁止外部运行时资源"],
    [/<script\b[^>]*\bsrc\s*=/i, "禁止外链 script"],
    [/<link\b[^>]*\bhref\s*=/i, "禁止外链 stylesheet"],
  ];
  for (const [pattern, message] of forbiddenPatterns) {
    if (pattern.test(source)) report(message);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("PASS: 产品经理 HTML 预览静态合同有效。");
}
