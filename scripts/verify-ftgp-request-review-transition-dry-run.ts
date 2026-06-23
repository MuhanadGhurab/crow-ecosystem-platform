#!/usr/bin/env tsx
/**
 * FTGP.1A/1B — ProCrow review transition dry-run (zero writes).
 * Run: npm run ftgp-request-review-transition:dry-run
 */
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  pickHighestInternalCrowRole,
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_LABEL,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
  assessFtgpClientOwnerEligibility,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

const MANIFEST_PATH = ".ftgp-first-request-review-manifest";
const EXPECTED_FINGERPRINT = CANDIDATE_07_FINGERPRINT;
const EXPECTED_LABEL = CANDIDATE_07_LABEL;

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nPROCROW_REVIEW_TRANSITION_DRY_RUN=BLOCKED`);
  console.error(`REQUEST_TRANSITION_WRITES_EXECUTED=false`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
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

  console.log("\n=== FTGP ProCrow review transition dry-run (zero writes) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim() || null;
  if (!requestId) {
    blocked("OPERATOR MUST DESIGNATE EXACTLY ONE IMPLEMENTATION REQUEST");
  }
  if (process.env.FTGP_FIRST_REQUEST_TRANSITION_EXECUTE_AUTHORIZED === "true") {
    blocked("execution authorization must not be enabled in operator env");
  }

  const fingerprint = requestFingerprint(requestId);
  if (fingerprint !== EXPECTED_FINGERPRINT) {
    blocked(`request fingerprint=${fingerprint} (expected ${EXPECTED_FINGERPRINT})`);
  }

  const clientAccountId = resolveDesignatedFirstClientAccountId();
  if (!clientAccountId) {
    blocked("FTGP_FIRST_CLIENT_ACCOUNT_ID required (designated client actor)");
  }

  const actorAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;
  if (!actorAccountId) {
    blocked("FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID required (IMPLEMENTER actor)");
  }

  const correlationId =
    process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim() ||
    `ftgp-first-procrow-review-${randomUUID()}`;

  const prisma = new PrismaClient();
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "Pre dry-run baseline");

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

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner) blocked("authoritative request owner missing");
    if (owner.id !== clientAccountId) {
      blocked("designated client does not match request owner");
    }
    const clientEligibility = await assessFtgpClientOwnerEligibility(prisma, clientAccountId);
    if (!clientEligibility.eligible) {
      blocked(`client owner ineligible: ${clientEligibility.refusal ?? "unknown"}`);
    }
    if (actorAccountId === clientAccountId) {
      blocked("IMPLEMENTER and client owner must differ");
    }
    console.log("  DESIGNATED_CLIENT_IMPLEMENTER_COLLISION=false");

    if (request.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      blocked(`request status=${request.status} (expected ${FTGP_PROCROW_REVIEW_FROM_STATUS})`);
    }

    const preLifecycleAuditCount =
      request.discoveryProfile?.answers.filter(
        (a) =>
          a.sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION &&
          a.questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY
      ).length ?? 0;

    const actor = await prisma.platformAccount.findUnique({
      where: { id: actorAccountId },
      select: { status: true, supabaseUserId: true },
    });
    if (!actor || actor.status !== "ACTIVE") blocked("actor not ACTIVE");

    const actorRoles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: actorAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const crowRole = pickHighestInternalCrowRole(actorRoles.map((r) => r.role));
    if (!crowRole || !hasPermission(crowRole, Permission["platform.requests.manage"])) {
      blocked("actor lacks platform.requests.manage");
    }
    if (crowRole !== "implementer") {
      blocked(`actor platform role=${crowRole ?? "none"} (expected implementer)`);
    }
    if (resolveAuthoritativePlatformRole([], "implementer") !== null) {
      blocked("metadata-only actor path would authorize");
    }
    ok("actor Platform Admin-only authority = false");

    const blueprint =
      request.enterpriseBlueprint ?? request.discoveryProfile?.enterpriseBlueprint;
    if (blueprint?.tenantId) blocked("tenant linked");
    if (request.discoveryProfile?.status === "COMPLETED") blocked("discovery completed");
    if (blueprint && blueprint.proposalStatus !== "DRAFT") {
      blocked("pricing/proposal not draft-only");
    }

    ok("request exists");
    ok(`request fingerprint = ${EXPECTED_FINGERPRINT}`);
    ok("request owner authoritative");
    ok("designated client matches owner = true");
    ok(`request current status = ${FTGP_PROCROW_REVIEW_FROM_STATUS}`);
    ok("request eligible for ProCrow Review = true");
    ok("actor exists");
    ok("actor ACTIVE");
    ok("actor role = IMPLEMENTER");
    ok("actor permission platform.requests.manage = true");
    ok("PROCROW_REVIEW_ACTOR_ELIGIBLE=PASS");
    console.log("  PROCROW_REVIEW_ACTOR_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT");
    ok("expected request status delta = exactly 1");
    ok("expected lifecycle audit-event delta = +1");
    ok("expected ownership delta = 0");
    ok("expected Discovery delta = 0");
    ok("expected Blueprint delta = 0");
    ok("expected pricing/proposal delta = 0");
    ok("expected tenant delta = 0");
    ok("expected client membership delta = 0");
    ok("expected tenant membership delta = 0");
    ok("expected Auth metadata delta = 0");
    ok("writes executed = 0");

    console.log(`\n  request_label=${EXPECTED_LABEL}`);
    console.log(`  correlation_id=${correlationId}`);
    console.log(`  pre_lifecycle_audit_events=${preLifecycleAuditCount}`);

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    if (
      postBaseline.internalRoleAssignments !== preBaseline.internalRoleAssignments ||
      postBaseline.implementationRequests !== preBaseline.implementationRequests ||
      postBaseline.internalRoleGrantAuditEvents !== preBaseline.internalRoleGrantAuditEvents
    ) {
      blocked("hosted baseline changed during dry-run");
    }

    const postRequest = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      select: { status: true },
    });
    if (postRequest?.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      blocked("selected request status changed during dry-run");
    }

    const manifest = [
      "Project reference: wbwnsndcxrgyqwppurms",
      "Database fingerprint: 0355c17692e2a90d",
      "Request selection mode: explicit immutable request ID",
      `Request label: ${EXPECTED_LABEL}`,
      `Request fingerprint: ${EXPECTED_FINGERPRINT}`,
      `Request current status: ${FTGP_PROCROW_REVIEW_FROM_STATUS}`,
      `Request target status: ${FTGP_PROCROW_REVIEW_TO_STATUS}`,
      "Owner eligibility: verified",
      "Actor role: IMPLEMENTER",
      "Actor authority: database internal-role assignment",
      "Expected status delta: 1",
      "Expected lifecycle audit-event delta: 1",
      "Expected ownership delta: 0",
      "Expected Discovery delta: 0",
      "Expected Blueprint delta: 0",
      "Expected pricing delta: 0",
      "Expected tenant delta: 0",
      "Expected membership delta: 0",
      "Expected Auth metadata delta: 0",
      `Correlation ID: ${correlationId}`,
      "Dry run passed: true",
      "Execution authorized: false",
      "Transition executed: false",
      "Rollback executed: false",
      "Merge authorized: false",
      "Production deployment authorized: false",
      "",
      "Future audit provenance:",
      "  event = implementation_request_status_changed (via ftgp_lifecycle_audit/procrow_review_transition)",
      "  source = implementer_procrow_review",
      "  reason = first tenant golden-path ProCrow review acceptance",
      "  actor = authoritative IMPLEMENTER",
      "  request = designated immutable request",
      "",
    ].join("\n");

    writeFileSync(join(process.cwd(), MANIFEST_PATH), manifest, "utf8");
    console.log(`\n  wrote ${MANIFEST_PATH} (gitignored)`);

    console.log("\nPROCROW_REVIEW_TRANSITION_DRY_RUN=PASS");
    console.log("REQUEST_TRANSITION_WRITES_EXECUTED=false");
    console.log("HOSTED_BUSINESS_STATE_UNCHANGED=true");
    console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
