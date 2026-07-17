#!/usr/bin/env tsx
/**
 * FTGP — static audit of first Platform Admin bootstrap fail-closed properties.
 * Run: npm run ftgp-bootstrap-implementation:audit
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
  console.log("\n=== FTGP Platform Admin bootstrap implementation audit ===\n");

  const bootstrap = read("src/lib/platform/platform-internal-role-bootstrap.ts");
  const deps = read("scripts/lib/platform-owner-bootstrap-deps.ts");
  const service = read("src/lib/auth/platform-internal-role.service.ts");
  const resolution = read("src/lib/platform/platform-owner-bootstrap.resolution.ts");
  const execute = read("scripts/platform-owner-bootstrap-execute.ts");
  const executeGates = read("scripts/lib/platform-owner-execute-gates.ts");
  const layout = read("src/app/layout.tsx");
  const vercelBuild = read("scripts/vercel-build-guard.mjs");

  assertIncludes(bootstrap, "bootstrap_disabled", "disabled by default");
  assertIncludes(bootstrap, "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID", "explicit target id");
  assertIncludes(bootstrap, "vercel_runtime_forbidden", "Vercel runtime forbidden");
  assertIncludes(bootstrap, "production_forbidden", "production forbidden");
  assertIncludes(bootstrap, "No first-user-admin", "no first user admin");
  assertIncludes(bootstrap, "bootstrapRequiresExplicitTarget", "explicit target required");
  ok("FIRST_ADMIN_BOOTSTRAP_FAIL_CLOSED=PASS (env gates)");

  assertIncludes(service, "grantCorrelationId", "unique grant correlation id");
  assertIncludes(service, "platform_internal_role_granted", "grant audit event");
  assertIncludes(service, "platform_internal_role_revoked", "revoke audit event");
  assertIncludes(service, "DUPLICATE_ACTIVE", "conflicting assignment rejected");
  assertIncludes(service, "idempotent: true", "idempotent grant path");
  assertIncludes(service, "grantedByPlatformAccountId", "grantor provenance");
  assertIncludes(service, "revokedByPlatformAccountId", "revoker provenance");
  assertIncludes(service, "revokedAt", "revokedAt on revoke");
  if (service.includes("updateUserById") || service.includes("app_metadata")) {
    fail("grant service must not modify Auth metadata");
  }
  if (
    service.includes("tenantMembership") ||
    service.includes("submittedByUserId") ||
    service.includes("ClientOrganizationMember")
  ) {
    fail("grant service must not create customer/tenant authority");
  }
  ok("FIRST_ADMIN_BOOTSTRAP_IDEMPOTENT=PASS");
  ok("FIRST_ADMIN_BOOTSTRAP_AUDITED=PASS");

  assertIncludes(resolution, "existing_platform_owner", "rejects existing owner");
  assertIncludes(resolution, "ambiguous_auth_identity", "rejects ambiguous auth");
  assertIncludes(resolution, "dryRun: true", "plan is dry-run");
  assertIncludes(deps, "countActivePlatformAdmins", "counts DB assignments not metadata");

  assertIncludes(execute, "executeAuthorized: false", "execute blocked");
  assertIncludes(executeGates, "execute_disabled", "execute disabled gate");
  assertIncludes(executeGates, "execute_phrase_invalid", "execute phrase required");

  if (layout.includes("platform-internal-role-bootstrap") || layout.includes("bootstrapPlatformAdmin")) {
    fail("bootstrap must not run on application startup");
  }
  if (vercelBuild.includes("bootstrap") && vercelBuild.includes("platform")) {
    fail("bootstrap must not run during Vercel build");
  }
  ok("AUTOMATIC_BOOTSTRAP_ON_DEPLOY=false");

  console.log("\nPASS — FTGP BOOTSTRAP IMPLEMENTATION AUDIT\n");
}

main();
