/**
 * Run a ts/tsx entry with CYBERCROW_SCRIPT_PRISMA=1 so @/lib/db skips server-only.
 * Usage: node --env-file=.env.staging scripts/run-with-script-prisma.mjs prisma/seed-rimal.ts [--flags]
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const entry = process.argv[2];
if (!entry) {
  console.error("Usage: run-with-script-prisma.mjs <entry.ts> [args...]");
  process.exit(1);
}

const entryPath = path.resolve(repoRoot, entry);
const extraArgs = process.argv.slice(3);

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["tsx", entryPath, ...extraArgs],
  {
    cwd: repoRoot,
    stdio: "inherit",
    env: { ...process.env, CYBERCROW_SCRIPT_PRISMA: "1" },
    shell: process.platform === "win32",
  }
);

process.exit(result.status ?? 1);
