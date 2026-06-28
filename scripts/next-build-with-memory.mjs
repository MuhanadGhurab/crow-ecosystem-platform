/**
 * Cross-platform Next.js production build with a safe Node heap ceiling.
 * Vercel standard builders have 8 GB total RAM — reserve headroom for webpack
 * native allocations outside the V8 heap (disable cache, single parallelism).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = join(ROOT, "node_modules", "next", "dist", "bin", "next");

const isVercel = process.env.VERCEL === "1";
/** Local certification build: 8192 MB with single-threaded webpack. Vercel: 3072 MB split compile/generate. */
const heapMb = isVercel ? 3072 : 8192;

function buildEnv() {
  const env = { ...process.env, NODE_ENV: "production" };
  if (!env.NODE_OPTIONS?.includes("max-old-space-size")) {
    const existing = env.NODE_OPTIONS?.trim();
    env.NODE_OPTIONS = existing
      ? `${existing} --max-old-space-size=${heapMb}`
      : `--max-old-space-size=${heapMb}`;
  }
  return env;
}

function runNext(args) {
  return spawnSync(process.execPath, ["--use-system-ca", nextBin, ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: buildEnv(),
    shell: false,
  });
}

if (isVercel) {
  const compile = runNext(["build", "--experimental-build-mode", "compile"]);
  if ((compile.status ?? 1) !== 0) {
    process.exit(compile.status ?? 1);
  }
  const generate = runNext(["build", "--experimental-build-mode", "generate"]);
  process.exit(generate.status ?? 1);
}

const result = runNext(["build"]);
process.exit(result.status ?? 1);
