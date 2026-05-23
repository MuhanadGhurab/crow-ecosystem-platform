/**
 * Run Crow on staging Supabase without Vercel (production `next start` or `next dev`).
 *
 * Usage:
 *   npm run staging:host          # next start (needs prior build)
 *   npm run staging:host:build    # build + start
 *   npm run staging:dev           # next dev (fastest for local / tunnel)
 *
 * Env: .env.staging (hosted DB + Supabase auth — same as intended Vercel prod)
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = Number(process.env.PORT ?? 3000);
const BASE = `http://localhost:${PORT}`;
const args = process.argv.slice(2);
const doBuild = args.includes("--build");
const useDev = args.includes("--dev");

const nextBin = join(ROOT, "node_modules", "next", "dist", "bin", "next");

function run(label, cmd, cmdArgs, inherit = true) {
  console.log(`\n→ ${label}`);
  const r = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: inherit ? "inherit" : "pipe",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (doBuild) {
  run("Vercel build guard", "node", ["scripts/vercel-build-guard.mjs"]);
  run("prisma generate", "npm", ["run", "db:generate"]);
  run("prisma migrate deploy", "npm", ["run", "db:migrate:deploy"]);
  run("next build", "npm", ["run", "build"]);
} else if (!useDev && !existsSync(join(ROOT, ".next", "BUILD_ID"))) {
  console.error("\n✗ No production build (.next/BUILD_ID). Run: npm run staging:host:build\n");
  console.error("  Or use dev mode: npm run staging:dev\n");
  process.exit(1);
}

spawnSync("node", ["scripts/free-port.mjs"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, PORT: String(PORT) },
});

const mode = useDev ? "dev" : "start";
const childArgs = useDev
  ? ["--use-system-ca", nextBin, "dev", "-p", String(PORT)]
  : ["--use-system-ca", nextBin, "start", "-p", String(PORT)];

console.log(`\n=== Staging host (${mode}) ===`);
console.log(`DATABASE: Supabase pooler from .env.staging`);
console.log(`Local:    ${BASE}\n`);

const child = spawn(process.execPath, childArgs, {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT), NODE_ENV: useDev ? "development" : "production" },
});

async function waitForHealth(maxMs = 120_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) {
        const body = await res.json();
        console.log("\n✓ /api/health OK:", JSON.stringify(body, null, 2));
        return true;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

(async () => {
  const ok = await waitForHealth();
  if (!ok) {
    console.error("\n✗ Health check timed out — check logs above.\n");
    return;
  }
  console.log("\n--- Sign in (staging Supabase) ---");
  console.log(`  Login:  ${BASE}/login`);
  console.log(`  MEEM:   ${BASE}/meem-global/dashboard`);
  console.log(`  Admin:  ${BASE}/admin/overview`);
  console.log("\nPublic URL (share with Omar): npm run staging:tunnel");
  console.log("See docs/internal/STAGING_WITHOUT_VERCEL.md\n");
})();

function shutdown() {
  child.kill("SIGTERM");
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => process.exit(code ?? 0));
