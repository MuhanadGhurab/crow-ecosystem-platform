/**
 * Cross-platform Next.js production build with a safe Node heap ceiling for Vercel.
 * Used by package.json "build" — does not weaken typecheck or hide build errors.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = join(ROOT, "node_modules", "next", "dist", "bin", "next");

const env = { ...process.env };
if (!env.NODE_OPTIONS?.includes("max-old-space-size")) {
  const existing = env.NODE_OPTIONS?.trim();
  env.NODE_OPTIONS = existing
    ? `${existing} --max-old-space-size=6144`
    : "--max-old-space-size=6144";
}

const result = spawnSync(process.execPath, ["--use-system-ca", nextBin, "build"], {
  cwd: ROOT,
  stdio: "inherit",
  env,
  shell: false,
});

process.exit(result.status ?? 1);
