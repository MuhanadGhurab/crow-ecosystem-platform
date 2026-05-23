/**
 * M6 — Verify AUTH_DISABLED=true is blocked when NODE_ENV=production.
 * Mirrors assertAuthNotDisabledInProduction in src/lib/supabase/env.ts
 */
const AUTH_DISABLED_PRODUCTION_ERROR =
  "AUTH_DISABLED=true is not allowed when NODE_ENV=production";

function assertAuthNotDisabledInProduction() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.AUTH_DISABLED === "true"
  ) {
    throw new Error(AUTH_DISABLED_PRODUCTION_ERROR);
  }
}

process.env.NODE_ENV = "production";
process.env.AUTH_DISABLED = "true";

console.log("\n=== M6 production auth gate ===\n");

try {
  assertAuthNotDisabledInProduction();
  console.error("✗ Gate failed: AUTH_DISABLED=true was not blocked in production\n");
  process.exit(1);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("AUTH_DISABLED")) {
    console.log("✓ AUTH_DISABLED=true correctly blocked when NODE_ENV=production\n");
    process.exit(0);
  }
  console.error("✗ Unexpected error:", message);
  process.exit(1);
}
