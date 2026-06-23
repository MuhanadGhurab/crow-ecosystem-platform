#!/usr/bin/env tsx
/**
 * FTGP.1A — Static audit of ProCrow review transition fail-closed properties.
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
  console.log("\n=== FTGP ProCrow review transition implementation audit ===\n");

  const service = read("src/lib/ftgp/ftgp-procrow-review-transition.service.ts");
  const constants = read("src/lib/ftgp/ftgp-procrow-review-transition.constants.ts");
  const dryRun = read("scripts/verify-ftgp-request-review-transition-dry-run.ts");
  const adminPipeline = read("src/lib/actions/admin-pipeline.ts");
  const layout = read("src/app/layout.tsx");
  const vercelBuild = read("scripts/vercel-build-guard.mjs");

  assertIncludes(constants, "PENDING_REVIEW", "from status");
  assertIncludes(constants, "UNDER_DISCOVERY", "to status");
  assertIncludes(service, "requestId: string", "explicit request id");
  assertIncludes(service, "actorPlatformAccountId", "explicit actor id");
  assertIncludes(service, "correlationId", "correlation id");
  assertIncludes(service, "listActiveInternalPlatformRoles", "DB role resolution");
  assertIncludes(service, "platform.requests.manage", "actor permission");
  assertIncludes(service, "FTGP_PROCROW_REVIEW_FROM_STATUS", "allowed current status");
  assertIncludes(service, "prismaTransaction", "transaction boundary");
  assertIncludes(constants, "FTGP_PROCROW_REVIEW_AUDIT_SECTION", "audit section constant");
  assertIncludes(constants, "ftgp_lifecycle_audit", "lifecycle audit section value");
  ok("PROCROW_REVIEW_TRANSITION_FAIL_CLOSED=PASS");

  assertIncludes(service, "idempotent: true", "idempotent path");
  assertIncludes(service, "Concurrent status change", "optimistic status check");
  assertIncludes(service, "existingAudit", "correlation idempotency");
  ok("PROCROW_REVIEW_TRANSITION_IDEMPOTENT=PASS");

  assertIncludes(service, "discoveryAnswer.upsert", "audit evidence write");
  assertIncludes(service, "notifyPipelineEvent", "pipeline audit notification");
  if (service.includes("app_metadata") || service.includes("updateUserById")) {
    fail("transition must not modify Auth metadata");
  }
  if (service.includes("tenantMembership.create") || service.includes("ClientOrganizationMember")) {
    fail("transition must not create customer/tenant authority");
  }
  ok("PROCROW_REVIEW_TRANSITION_AUDITED=PASS");

  assertIncludes(dryRun, "REQUEST_TRANSITION_WRITES_EXECUTED=false", "dry-run zero-write");
  assertIncludes(adminPipeline, "requireActionRequestReview", "legacy action gated");

  if (layout.includes("transitionImplementationRequestToProCrowReview")) {
    fail("transition must not run on startup");
  }
  if (vercelBuild.includes("procrow-review-transition")) {
    fail("transition must not run on build");
  }
  ok("AUTOMATIC_REQUEST_TRANSITION=false");

  console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION AUDIT\n");
}

main();
