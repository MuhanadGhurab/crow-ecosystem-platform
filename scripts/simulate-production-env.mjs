/**
 * M7 — Simulate production env constraints locally (no deploy).
 * Usage: npm run simulate:production-env
 */
import { spawnSync } from "node:child_process";

const priorNodeEnv = process.env.NODE_ENV;
const priorAuthDisabled = process.env.AUTH_DISABLED;
const priorMock = process.env.USE_MOCK_DATA;

process.env.NODE_ENV = "production";
process.env.AUTH_DISABLED = "false";
process.env.USE_MOCK_DATA = "false";

console.log("\n=== M7 simulate production env ===\n");
console.log("NODE_ENV=production, AUTH_DISABLED=false, USE_MOCK_DATA=false\n");

const steps = [
  ["Production auth gate", "npm", ["run", "gate:production-auth"]],
  ["Deploy readiness (if .env present)", "npm", ["run", "deploy:check"]],
];

for (const [label, cmd, args] of steps) {
  console.log(`→ ${label}`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (label.startsWith("Deploy readiness") && r.status !== 0) {
    console.log("  (skipped blockers — configure .env for full deploy:check)\n");
    continue;
  }
  if (r.status !== 0) {
    console.error(`\n✗ Failed at: ${label}\n`);
    process.exit(r.status ?? 1);
  }
}

if (priorNodeEnv !== undefined) process.env.NODE_ENV = priorNodeEnv;
if (priorAuthDisabled !== undefined) process.env.AUTH_DISABLED = priorAuthDisabled;
if (priorMock !== undefined) process.env.USE_MOCK_DATA = priorMock;

console.log("\n✓ Production env simulation complete.\n");
console.log("Next: DEPLOY_TARGET=azure|vercel npm run deploy:check\n");
