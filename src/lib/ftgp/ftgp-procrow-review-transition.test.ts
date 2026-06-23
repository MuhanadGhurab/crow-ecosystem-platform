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

// FTGP client policy decoupled from retained C3 proof requester fixture
{
  const targetVerify = read("scripts/verify-ftgp-first-request-target.ts");
  assert(targetVerify.includes("FTGP_CLIENT_POLICY=EXPLICIT_AUTHORITATIVE_OWNER"));
  assert(targetVerify.includes("C3_RETAINED_REQUESTER_FIXTURE_DECOUPLED=true"));
  assert(targetVerify.includes("DESIGNATED_CLIENT_MATCHES_REQUEST_OWNER"));
  assert(!targetVerify.includes("owner is not retained requester"));

  const dryRun = read("scripts/verify-ftgp-request-review-transition-dry-run.ts");
  assert(dryRun.includes("FTGP_FIRST_CLIENT_ACCOUNT_ID"));
  assert(dryRun.includes("designated client does not match request owner"));
  assert(!dryRun.includes("request owner is not retained requester"));

  const list = read("scripts/list-ftgp-first-request-candidates.ts");
  assert(list.includes("EXPLICIT_AUTHORITATIVE_OWNER"));
  assert(!list.includes("owner is not retained requester"));
}

// Operator artifacts remain gitignored
{
  const gitignore = read(".gitignore");
  assert(gitignore.includes(".env.ftgp-first-request.operator"));
  assert(gitignore.includes(".env.ftgp-first-client.operator"));
  assert(gitignore.includes(".env.ftgp-first-request-transition.operator"));
  assert(gitignore.includes(".ftgp-first-request-review-manifest"));
  assert(gitignore.includes(".ftgp-request-owner-provenance.local.json"));
}

// Audited execute entrypoint and audit source
{
  const constants = read("src/lib/ftgp/ftgp-procrow-review-transition.constants.ts");
  assert(constants.includes('FTGP_PROCROW_REVIEW_AUDIT_SOURCE = "implementer_procrow_review"'));
  const execute = read("scripts/ftgp-request-review-transition-execute.ts");
  assert(execute.includes("transitionImplementationRequestToProCrowReview"));
  assert(execute.includes("ftgp-request-review-transition-execute-gates"));
}

// Retained requester invariants preserved in C3 resolution (separate from FTGP client actor)
{
  const c3Resolution = read("scripts/lib/c3-proof-requester-resolution.ts");
  assert(c3Resolution.includes("resolveProofRequesterPlatformAccount"));
}

console.log("PASS — FTGP request review transition readiness");
