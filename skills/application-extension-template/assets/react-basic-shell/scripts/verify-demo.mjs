import { createServer } from "node:net";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = resolve(projectRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const checks = [];

function report(status, stage, message) {
  console.log(`[${status}] [${stage}] ${message}`);
}

function fail(stage, message, recovery) {
  checks.push({ stage, message });
  report("FAIL", stage, message);
  if (recovery) console.log(`[RECOVERY] ${recovery}`);
}

function pass(stage, message) {
  report("PASS", stage, message);
}

function runPnpm(args, stage) {
  return new Promise((resolveRun) => {
    const child = spawn("pnpm", args, {
      cwd: projectRoot,
      stdio: "inherit",
    });

    child.once("error", (error) => {
      fail(stage, `无法启动 pnpm：${error.message}`, "安装 pnpm 后重新运行 pnpm check。");
      resolveRun(false);
    });
    child.once("close", (code) => {
      if (code === 0) {
        pass(stage, `pnpm ${args.join(" ")} 已完成。`);
        resolveRun(true);
        return;
      }
      fail(stage, `pnpm ${args.join(" ")} 退出码为 ${code ?? "unknown"}。`, "修复上述构建错误后重新运行 pnpm check。");
      resolveRun(false);
    });
  });
}

function findFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("无法分配本地预览端口。"));
        return;
      }
      const { port } = address;
      server.close((error) => (error ? reject(error) : resolvePort(port)));
    });
  });
}

async function fetchWhenReady(url, attempts = 30) {
  let lastError;
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(800) });
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
    }
  }
  throw lastError || new Error(`未能访问 ${url}`);
}

async function stopPreview(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform !== "win32" && child.pid) {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  } else {
    child.kill("SIGTERM");
  }

  await Promise.race([
    once(child, "close"),
    new Promise((resolveDelay) => setTimeout(resolveDelay, 2000)),
  ]);
}

async function verifyPreview() {
  const port = await findFreePort();
  const preview = spawn("pnpm", ["preview", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const previewOutput = [];
  preview.stdout?.on("data", (chunk) => previewOutput.push(chunk.toString()));
  preview.stderr?.on("data", (chunk) => previewOutput.push(chunk.toString()));
  let previewError;
  preview.once("error", (error) => {
    previewError = error;
  });

  try {
    const baseUrl = `http://127.0.0.1:${port}`;
    const home = await fetchWhenReady(`${baseUrl}/`);
    if (previewError) throw previewError;
    if (home.status !== 200) throw new Error(`首页返回 HTTP ${home.status}`);
    const html = await home.text();
    if (!html.includes('id="root"')) throw new Error("首页缺少 React 挂载节点 #root");

    const manifest = await fetch(`${baseUrl}/basic-shell/manifest.json`, {
      signal: AbortSignal.timeout(1500),
    });
    if (manifest.status !== 200) {
      throw new Error(`/basic-shell/manifest.json 返回 HTTP ${manifest.status}`);
    }
    const manifestPayload = await manifest.json();
    if (!Array.isArray(manifestPayload.assets) || manifestPayload.assets.length === 0) {
      throw new Error("/basic-shell/manifest.json 未声明可验证的资源。");
    }
    for (const asset of manifestPayload.assets) {
      if (!asset?.file || typeof asset.file !== "string") {
        throw new Error("/basic-shell/manifest.json 包含无效资源路径。");
      }
      const resource = await fetch(`${baseUrl}/basic-shell/${asset.file}`, {
        signal: AbortSignal.timeout(1500),
      });
      if (resource.status !== 200) {
        throw new Error(`/basic-shell/${asset.file} 返回 HTTP ${resource.status}`);
      }
    }
    pass(
      "preview",
      `首页、/basic-shell/manifest.json 与 ${manifestPayload.assets.length} 项基础资源均可通过 ${baseUrl} 访问。`,
    );
  } catch (error) {
    const output = previewOutput.join("").trim();
    throw new Error(output ? `${error.message}\n${output}` : error.message);
  } finally {
    await stopPreview(preview);
  }
}

function validateEnvironment() {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (!Number.isInteger(nodeMajor) || nodeMajor < 22) {
    fail("environment", `当前 Node.js ${process.versions.node}，需要 Node.js 22 或更高版本。`, "安装 Node.js 22 后重新运行 pnpm check。");
  } else {
    pass("environment", `Node.js ${process.versions.node}。`);
  }

  const pnpmVersion = spawnSync("pnpm", ["--version"], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  if (pnpmVersion.error || pnpmVersion.status !== 0) {
    fail("environment", "未找到可用的 pnpm。", "安装 pnpm 后重新运行 pnpm check。");
  } else {
    pass("environment", `pnpm ${pnpmVersion.stdout.trim()}。`);
  }

  if (!String(packageJson.packageManager || "").startsWith("pnpm@")) {
    fail("package-manager", "package.json 必须声明 pnpm packageManager。", "将 packageManager 固定为 pnpm 后重新生成应用。");
  }
  if (!existsSync(resolve(projectRoot, "pnpm-lock.yaml"))) {
    fail("lockfile", "缺少 pnpm-lock.yaml。", "在可信模板目录执行 pnpm install --lockfile-only 后重新运行 pnpm check。");
  }
  if (existsSync(resolve(projectRoot, "package-lock.json"))) {
    fail("package-manager", "检测到 package-lock.json，npm 与 pnpm 不能混用。", "移除 package-lock.json 和 node_modules 后运行 pnpm install --frozen-lockfile，再运行 pnpm check。");
  }
  if (!existsSync(resolve(projectRoot, "node_modules"))) {
    fail("dependencies", "依赖尚未安装。", "运行 pnpm check，或先运行 pnpm install --frozen-lockfile。");
  }
}

validateEnvironment();

if (checks.length === 0) {
  const built = await runPnpm(["build"], "build");
  if (built) {
    try {
      await verifyPreview();
    } catch (error) {
      fail("preview", error.message, "检查构建输出和基础资源后重新运行 pnpm check。");
    }
  }
}

if (checks.length > 0) {
  console.error(`验证失败：${checks.length} 个问题。`);
  process.exitCode = 1;
} else {
  console.log("[PASS] standalone demo 运行校验完成。");
}
