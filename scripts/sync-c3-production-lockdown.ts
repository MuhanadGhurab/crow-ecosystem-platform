/**
 * C3.10R — Restore Production to rollback-compatible flags after resolver incident.
 */
import { spawnSync } from "node:child_process";

import { vercelEnvAdd, type VercelEnvAddOptions } from "./lib/vercel-env-add-with-timeout";

const PRODUCTION_TARGET: VercelEnvAddOptions = { target: "production" };

const LOCKDOWN_FLAGS = [
  { name: "GOOGLE_SSO_ENABLED", value: "false" },
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false" },
  { name: "CROW_PHONE_VERIFICATION_REQUIRED", value: "false" },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "1" },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false" },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false" },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false" },
  { name: "C3_PROOF_DIAGNOSTICS", value: "false" },
] as const;

async function main() {
  for (const spec of LOCKDOWN_FLAGS) {
    console.log(`Setting Production ${spec.name}=${spec.value}…`);
    await vercelEnvAdd(spec.name, spec.value, PRODUCTION_TARGET);
    console.log(`  ✓ ${spec.name}`);
  }
  console.log("Production lockdown flags applied (Google off, generation gate 1).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
