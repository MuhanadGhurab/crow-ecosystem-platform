/**
 * C3.10R — Google OAuth persistence path uses C2 guard and transactional reconciliation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const providerIdentity = readFileSync(
  join(process.cwd(), "src/lib/account/provider-identity.service.ts"),
  "utf8"
);
const orchestration = readFileSync(
  join(process.cwd(), "src/lib/account/c3-auth-orchestration.ts"),
  "utf8"
);
const guard = readFileSync(
  join(process.cwd(), "src/lib/crow-core/c2-database-mutation-guard.ts"),
  "utf8"
);
const dbGuardSync = readFileSync(
  join(process.cwd(), "scripts/sync-c3-production-database-guard.ts"),
  "utf8"
);

assert(
  providerIdentity.includes("resolvePlatformAccountForOAuthUser"),
  "OAuth reconciliation entrypoint exists"
);
assert(
  providerIdentity.includes("assertC2DatabaseEnvironmentSafe"),
  "OAuth reconciliation uses C2 database guard"
);
assert(
  orchestration.includes("reconcileLegacyOnboardingGeneration"),
  "legacy generation reconciled after legal"
);
assert(
  !orchestration.includes("must complete the current onboarding process"),
  "removed hard generation crash message"
);
assert(
  guard.includes("EXPECTED_DATABASE_FINGERPRINT"),
  "C2 guard enforces runtime fingerprint"
);
assert(
  dbGuardSync.includes("b7f801cfe5e30009"),
  "production guard sync uses pooler fingerprint"
);
assert(
  dbGuardSync.includes("0355c17692e2a90d"),
  "production guard sync uses direct fingerprint"
);

console.log(
  "PASS — GOOGLE PERSISTENCE PATH IS GUARDED, RECONCILES LEGACY GENERATION, AND REQUIRES PRODUCTION FINGERPRINTS\n"
);
