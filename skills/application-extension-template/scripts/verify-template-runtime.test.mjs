import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = path.join(skillRoot, "assets", "react-basic-shell");

test("standalone template exposes a pnpm-only runtime verification contract", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(templateRoot, "package.json"), "utf8"),
  );
  const readmePath = path.join(templateRoot, "README.md");
  const verifierPath = path.join(templateRoot, "scripts", "verify-demo.mjs");

  assert.match(packageJson.packageManager, /^pnpm@/);
  assert.equal(packageJson.scripts.verify, "node scripts/verify-demo.mjs");
  assert.equal(
    packageJson.scripts.check,
    "pnpm install --frozen-lockfile && pnpm verify",
  );
  assert.equal(existsSync(path.join(templateRoot, "pnpm-lock.yaml")), true);
  assert.equal(existsSync(readmePath), true);
  assert.equal(existsSync(verifierPath), true);

  const readme = readFileSync(readmePath, "utf8");
  const verifier = readFileSync(verifierPath, "utf8");
  assert.match(readme, /pnpm check/);
  assert.doesNotMatch(readme, /```bash\s*\nnpm install/);
  assert.match(readme, /不要使用 `npm install`/);
  assert.match(readme, /不要直接双击.*index\.html/);
  assert.match(verifier, /spawn\(\s*"pnpm",\s*\[\s*"preview"/);
  assert.match(verifier, /\/basic-shell\/manifest\.json/);
  assert.match(verifier, /manifestPayload\.assets/);
  assert.match(verifier, /basic-shell\/\$\{asset\.file\}/);
  assert.match(verifier, /package-lock\.json/);
  assert.match(verifier, /process\.kill|child\.kill/);
});
