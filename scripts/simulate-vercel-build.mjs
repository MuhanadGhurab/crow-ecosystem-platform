/**
 * Local simulation of Vercel buildCommand (see vercel.json).
 * Usage: npm run simulate:vercel-build
 *
 * Uses .env by default. Set SIM_DATABASE_URL + SIM_DIRECT_URL to test remote URLs
 * without editing .env (e.g. Supabase pooler strings).
 */
import { spawnSync } from "node:child_process";

const simDb = process.env.SIM_DATABASE_URL?.trim();
const simDirect = process.env.SIM_DIRECT_URL?.trim();

if (simDb) process.env.DATABASE_URL = simDb;
if (simDirect) process.env.DIRECT_URL = simDirect;

const steps = [
  ["Vercel build guard", "node", ["scripts/vercel-build-guard.mjs"]],
  ["prisma generate", "npm", ["run", "db:generate"]],
  ["prisma migrate deploy", "npm", ["run", "db:migrate:deploy"]],
  ["next build", "npm", ["run", "build"]],
];

console.log("\n=== Simulate Vercel build ===\n");
console.log(
  `DATABASE_URL host: ${process.env.DATABASE_URL?.includes("localhost") ? "localhost (BLOCKED on Vercel)" : "remote OK"}`
);
console.log("");

for (const [label, cmd, args] of steps) {
  console.log(`→ ${label}`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (r.status !== 0) {
    console.error(`\n✗ Failed at: ${label}\n`);
    process.exit(r.status ?? 1);
  }
}

console.log("\n✓ Vercel build simulation passed locally.\n");
