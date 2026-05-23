/**
 * Wrapper: tsx smoke with NODE_OPTIONS=--use-system-ca (Windows Resend TLS).
 */
import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" "),
};

const r = spawnSync(
  "npx",
  ["tsx", "--env-file=.env", "scripts/run-phase1-smoke.ts"],
  { stdio: "inherit", shell: true, env, cwd: process.cwd() }
);

process.exit(r.status ?? 1);
