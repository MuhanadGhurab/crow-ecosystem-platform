#!/usr/bin/env tsx
/**
 * FTGP.0G — Static audit of audited IMPLEMENTER grant fail-closed properties.
 * Run: npm run ftgp-implementer-grant:audit
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(1);
}

function assertIncludes(src: string, needle: string, label: string) {
  if (!src.includes(needle)) fail(`${label}: missing "${needle}"`);
}

function main() {
  console.log("\n=== FTGP IMPLEMENTER grant implementation audit ===\n");

  const service = read("src/lib/auth/platform-internal-role.service.ts");
  const grant = read("src/lib/platform/ftgp-implementer-grant.ts");
  const execute = read("scripts/ftgp-implementer-grant-execute.ts");
  const executeGates = read("scripts/lib/ftgp-implementer-grant-execute-gates.ts");
  const dryRun = read("scripts/verify-ftgp-implementer-grant-dry-run.ts");
  const layout = read("src/app/layout.tsx");

  assertIncludes(execute, "FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID", "explicit target via operator env");
  assertIncludes(grant, "grantorPlatformAccountId", "explicit grantor");
  assertIncludes(grant, 'role: "IMPLEMENTER"', "role fixed to IMPLEMENTER");
  assertIncludes(grant, "ftgp-first-platform-admin", "rejects bootstrap correlation reuse");
  assertIncludes(executeGates, "execute_not_authorized", "execute authorization gate");
  assertIncludes(executeGates, "execute_phrase_invalid", "execute phrase required");
  assertIncludes(executeGates, "grantor_mismatch", "grantor must match verified Platform Admin");
  assertIncludes(executeGates, "vercel_runtime_forbidden", "Vercel runtime forbidden");
  ok("IMPLEMENTER_GRANT_FAIL_CLOSED=PASS");

  assertIncludes(service, "grantCorrelationId", "unique grant correlation id");
  assertIncludes(service, "idempotent: true", "idempotent grant path");
  assertIncludes(service, "DUPLICATE_ACTIVE", "duplicate assignment rejected");
  assertIncludes(service, "grantorMayAssignRole", "grantor authority from DB assignments");
  assertIncludes(grant, "countActivePlatformAdminAssignmentsForGrant", "grantor count from DB");
  ok("IMPLEMENTER_GRANT_IDEMPOTENT=PASS");

  assertIncludes(service, "platform_internal_role_granted", "grant audit event");
  assertIncludes(grant, "platform_admin_grant", "audit source provenance");
  assertIncludes(grant, "source: FTGP_IMPLEMENTER_GRANT_SOURCE", "source recorded on audit");
  if (service.includes("updateUserById") || service.includes("app_metadata")) {
    fail("grant service must not modify Auth metadata");
  }
  if (
    service.includes("tenantMembership.create") ||
    service.includes("ClientOrganizationMember.create")
  ) {
    fail("grant service must not create customer/tenant authority");
  }
  ok("IMPLEMENTER_GRANT_AUDITED=PASS");

  assertIncludes(dryRun, "IMPLEMENTER_GRANT_WRITES_EXECUTED=false", "dry-run is zero-write");
  assertIncludes(execute, "FTGP_IMPLEMENTER_GRANT_EXECUTE_AUTHORIZED", "execute separately gated");

  if (layout.includes("grantFtgpImplementerRole") || layout.includes("ftgp-implementer-grant")) {
    fail("IMPLEMENTER grant must not run on application startup");
  }
  ok("AUTOMATIC_IMPLEMENTER_GRANT=false");

  console.log("\nPASS — FTGP IMPLEMENTER GRANT IMPLEMENTATION AUDIT\n");
}

main();
