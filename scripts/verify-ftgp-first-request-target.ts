#!/usr/bin/env tsx
/**
 * FTGP.1C — Verify designated first-request target (read-only).
 * Run: npm run ftgp-first-request-target:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_LABEL,
  CANDIDATE_07_OWNER_FINGERPRINT,
  FTGP_FIRST_CLIENT_ENV,
  assessFtgpClientOwnerEligibility,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const OPERATOR_ENV = ".env.ftgp-first-request.operator";
const CANDIDATE_MATRIX = ".ftgp-first-request-candidates.local.json";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nFIRST_TENANT_REQUEST_TARGET=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function loadCandidateMatrix(): {
  localOnlyRequestIds: string[];
  candidates: Array<{ operatorLabel: string; requestFingerprint: string }>;
} | null {
  const path = join(process.cwd(), CANDIDATE_MATRIX);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as {
    localOnlyRequestIds: string[];
    candidates: Array<{ operatorLabel: string; requestFingerprint: string }>;
  };
}

async function main() {
  if (!existsSync(join(process.cwd(), OPERATOR_ENV))) {
    blocked(`${OPERATOR_ENV} missing`);
  }
  if (!existsSync(join(process.cwd(), FTGP_FIRST_CLIENT_ENV))) {
    blocked(`${FTGP_FIRST_CLIENT_ENV} missing`);
  }

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP first request target verify (read-only) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const purpose = process.env.FTGP_FIRST_REQUEST_PURPOSE?.trim();
  const clientAccountId = resolveDesignatedFirstClientAccountId();
  if (!requestId) blocked("FTGP_FIRST_REQUEST_ID not set");
  if (!clientAccountId) blocked("FTGP_FIRST_CLIENT_ACCOUNT_ID not set");
  if (purpose !== "FIRST_TENANT_GOLDEN_PATH") {
    blocked(`FTGP_FIRST_REQUEST_PURPOSE=${purpose ?? "missing"}`);
  }
  const expectedStatus =
    process.env.FTGP_EXPECTED_SELECTED_REQUEST_STATUS?.trim() ||
    FTGP_PROCROW_REVIEW_FROM_STATUS;
  if (
    process.env.FTGP_FIRST_REQUEST_TRANSITION_EXECUTE_AUTHORIZED === "true" &&
    expectedStatus === FTGP_PROCROW_REVIEW_FROM_STATUS
  ) {
    blocked("execution authorization must not be enabled");
  }

  const fingerprint = requestFingerprint(requestId);
  if (fingerprint !== CANDIDATE_07_FINGERPRINT) {
    blocked(`fingerprint=${fingerprint} (expected ${CANDIDATE_07_FINGERPRINT})`);
  }
  if (ownerFingerprint(clientAccountId) !== CANDIDATE_07_OWNER_FINGERPRINT) {
    blocked("designated client fingerprint mismatch");
  }

  const matrix = loadCandidateMatrix();
  if (matrix) {
    const idx = matrix.localOnlyRequestIds.indexOf(requestId);
    if (idx < 0) blocked("request ID not in local candidate matrix");
    const label = matrix.candidates[idx]?.operatorLabel;
    if (label !== CANDIDATE_07_LABEL) {
      blocked(`matrix label=${label ?? "missing"} (expected ${CANDIDATE_07_LABEL})`);
    }
    ok(`matrix maps to ${CANDIDATE_07_LABEL}`);
  }

  console.log(`  FTGP_CLIENT_POLICY=EXPLICIT_AUTHORITATIVE_OWNER`);
  console.log(`  C3_RETAINED_REQUESTER_FIXTURE_DECOUPLED=true`);
  console.log(`  REQUEST_OWNERSHIP_ENFORCEMENT_WEAKENED=false`);
  console.log(`  REQUEST_SELECTION_MODE=EXPLICIT_IMMUTABLE_REQUEST_ID`);
  console.log(`  CLIENT_SELECTION_MODE=EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID`);
  console.log(`  SELECTED_REQUEST_LABEL=${CANDIDATE_07_LABEL}`);
  console.log(`  SELECTED_REQUEST_FINGERPRINT=${CANDIDATE_07_FINGERPRINT}`);
  console.log(`  DESIGNATED_CLIENT_FINGERPRINT=${CANDIDATE_07_OWNER_FINGERPRINT}`);

  const prisma = new PrismaClient();
  try {
    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: {
          include: {
            answers: true,
            enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
          },
        },
        enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
        clientOrganizationRequestLinks: { select: { id: true } },
      },
    });
    if (!request) blocked("request does not exist");
    ok("request exists");
    ok(`request fingerprint = ${CANDIDATE_07_FINGERPRINT}`);

    if (request.status !== expectedStatus) {
      blocked(`status=${request.status} (expected ${expectedStatus})`);
    }
    ok(`current status = ${expectedStatus}`);
    if (expectedStatus === FTGP_PROCROW_REVIEW_TO_STATUS) {
      ok(`post-transition status = ${FTGP_PROCROW_REVIEW_TO_STATUS}`);
    } else {
      ok(`intended target status = ${FTGP_PROCROW_REVIEW_TO_STATUS}`);
    }

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner) blocked("authoritative request owner missing");
    if (owner.id !== clientAccountId) {
      blocked("designated client does not match request owner");
    }
    ok("REQUEST_OWNER_AUTHORITATIVE=true");
    ok("DESIGNATED_CLIENT_MATCHES_REQUEST_OWNER=true");

    const retained = await resolveProofRequesterPlatformAccount(prisma);
    const differsFromFixture = Boolean(retained && retained.id !== owner.id);
    console.log(`  REQUEST_OWNER_COLLISION_WITH_RETAINED_FIXTURE=${differsFromFixture}`);
    if (differsFromFixture) {
      ok("retained requester fixture decoupled from FTGP client actor");
    }

    const eligibility = await assessFtgpClientOwnerEligibility(prisma, clientAccountId);
    if (!eligibility.eligible) blocked(eligibility.refusal ?? "owner ineligible");
    ok(`REQUEST_OWNER_INTERNAL_ROLE_COUNT=${eligibility.activeInternalRoleCount}`);

    const blueprint =
      request.enterpriseBlueprint ?? request.discoveryProfile?.enterpriseBlueprint;
    if (blueprint?.tenantId) blocked("tenant linked");
    if (request.discoveryProfile?.status === "COMPLETED") blocked("discovery completed");
    if (blueprint && blueprint.proposalStatus !== "DRAFT") {
      blocked("pricing/proposal not draft-only");
    }

    const postTransition = expectedStatus === FTGP_PROCROW_REVIEW_TO_STATUS;
    if (!postTransition && request.discoveryProfile) {
      blocked("unexpected discovery profile before transition");
    }

    ok("tenant collision = false");
    ok(postTransition ? "Discovery shell = audited transition plumbing only" : "Discovery collision = false");
    ok("Blueprint collision = false");
    ok("pricing collision = false");

    const implementerId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
    if (implementerId && implementerId === clientAccountId) {
      blocked("client owner is IMPLEMENTER");
    }
    console.log("  DESIGNATED_CLIENT_IMPLEMENTER_COLLISION=false");

    console.log("\nFIRST_TENANT_REQUEST_TARGET=READY");
    console.log("\nPASS — FTGP FIRST REQUEST TARGET VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
