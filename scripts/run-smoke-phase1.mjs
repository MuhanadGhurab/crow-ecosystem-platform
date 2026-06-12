/**
 * Wrapper: tsx smoke with NODE_OPTIONS=--use-system-ca (Windows Resend TLS).
 * Uses .env when present; CI passes DATABASE_URL via workflow env.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  /** Required by @/lib/db server-only guard for CLI smoke (see run-with-script-prisma.mjs). */
  CYBERCROW_SCRIPT_PRISMA: "1",
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" "),
};

const tsxArgs = ["tsx"];
if (existsSync(".env")) {
  tsxArgs.push("--env-file=.env");
}
tsxArgs.push("scripts/run-phase1-smoke.ts");

const r = spawnSync("npx", tsxArgs, {
  stdio: "inherit",
  shell: true,
  env,
  cwd: process.cwd(),
});

process.exit(r.status ?? 1);
