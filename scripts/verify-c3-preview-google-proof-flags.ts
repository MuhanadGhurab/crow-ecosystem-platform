/**
 * C3.10O — Verify branch Preview env matches Google proof window (no secrets).
 * Run after: npm run c3-preview:runtime-env
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RUNTIME = join(process.cwd(), ".env.staging.runtime");

function parseEnv(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    map.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  return map;
}

const EXPECTED: Record<string, string> = {
  GOOGLE_SSO_ENABLED: "true",
  ACCOUNT_REGISTRATION_ENABLED: "false",
  CROW_ONBOARDING_GENERATION_REQUIRED: "2",
  CROW_PHONE_VERIFICATION_REQUIRED: "false",
  C3_AUTH_CANARY_ENABLED: "false",
  C3_REGISTRATION_DIAGNOSTICS: "false",
  C3_SESSION_DIAGNOSTICS: "false",
};

function main() {
  const env = parseEnv(readFileSync(RUNTIME, "utf8"));
  console.log("\n=== C3.10O Preview proof flags (branch pull) ===\n");
  let ok = true;
  for (const [key, expected] of Object.entries(EXPECTED)) {
    const actual = env.get(key) ?? "(unset)";
    const pass = actual === expected;
    console.log(`  ${pass ? "✓" : "✗"} ${key}=${actual} (expected ${expected})`);
    if (!pass) ok = false;
  }
  const preview = env.get("C3_PREVIEW_BASE_URL") ?? "(unset)";
  console.log(`\n  C3_PREVIEW_BASE_URL=${preview}\n`);
  if (!ok) process.exit(1);
  console.log("PASS — Preview proof flags verified\n");
}

main();
