import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "@/lib/ftgp/ftgp-procrow-review-transition.constants";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

// Lifecycle constants align with pipeline startDiscovery pre-review gate
{
  assert.equal(FTGP_PROCROW_REVIEW_FROM_STATUS, "PENDING_REVIEW");
  assert.equal(FTGP_PROCROW_REVIEW_TO_STATUS, "UNDER_DISCOVERY");
  assert.equal(FTGP_PROCROW_REVIEW_AUDIT_SECTION, "ftgp_lifecycle_audit");
  assert.equal(FTGP_PROCROW_REVIEW_AUDIT_KEY, "procrow_review_transition");
}

// Controlled service boundary (static)
{
  const service = read("src/lib/ftgp/ftgp-procrow-review-transition.service.ts");
  assert(service.includes("planProCrowReviewTransition"));
  assert(service.includes("transitionImplementationRequestToProCrowReview"));
  assert(service.includes("listActiveInternalPlatformRoles"));
  assert(service.includes("platform.requests.manage"));
  assert(service.includes("prismaTransaction"));
  assert(service.includes("idempotent: true"));
  assert(!service.includes("updateUserById"));
  assert(!service.includes("tenantMembership.create"));
  assert(!service.includes("ClientOrganizationMember"));
}

// Dry-run script blocks without explicit operator designation
{
  const dryRun = read("scripts/verify-ftgp-request-review-transition-dry-run.ts");
  assert(dryRun.includes("FTGP_FIRST_REQUEST_ID"));
  assert(dryRun.includes("OPERATOR MUST DESIGNATE EXACTLY ONE IMPLEMENTATION REQUEST"));
  assert(dryRun.includes("REQUEST_TRANSITION_WRITES_EXECUTED=false"));
}

// Designated first-request operator env (gitignored)
{
  const gitignore = read(".gitignore");
  assert(gitignore.includes(".env.ftgp-first-request.operator"));
  assert(gitignore.includes(".ftgp-first-request-review-manifest"));
}

// First-request target verifier exists
{
  const targetVerify = read("scripts/verify-ftgp-first-request-target.ts");
  assert(targetVerify.includes("FIRST_TENANT_REQUEST_TARGET=READY"));
  assert(targetVerify.includes("resolveProofRequesterPlatformAccount"));
}

console.log("PASS — FTGP request review transition readiness");
