#!/usr/bin/env tsx
/**
 * FTGP.1A — ProCrow review transition dry-run (zero writes).
 * Run: npm run ftgp-request-review-transition:dry-run
 */
import { PrismaClient } from "@prisma/client";

import {
  pickHighestInternalCrowRole,
} from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import { FTGP_PROCROW_REVIEW_FROM_STATUS } from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

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
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP ProCrow review transition dry-run (zero writes) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim() || null;
  if (!requestId) {
    blocked("OPERATOR MUST DESIGNATE EXACTLY ONE IMPLEMENTATION REQUEST");
  }

  const actorAccountId =
    process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() ||
    (await (async () => {
      const prisma = new PrismaClient();
      try {
        const grantor = await resolveImplementerGrantor(prisma);
        return grantor?.platformAccountId ?? null;
      } finally {
        await prisma.$disconnect();
      }
    })());

  if (!actorAccountId) blocked("IMPLEMENTER actor not resolved");

  const correlationId =
    process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim() ||
    `ftgp-procrow-review-dry-run-${Date.now().toString(36)}`;

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

    const { preservedAccountId } = requireProofOperatorEnv();
    if (preservedAccountId && request.submittedByUserId) {
      const requester = await prisma.platformAccount.findUnique({
        where: { id: preservedAccountId },
        select: { supabaseUserId: true },
      });
      if (requester?.supabaseUserId !== request.submittedByUserId) {
        blocked("request owner is not retained requester");
      }
    }

    if (request.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      blocked(`request status=${request.status} (expected ${FTGP_PROCROW_REVIEW_FROM_STATUS})`);
    }

    const actor = await prisma.platformAccount.findUnique({
      where: { id: actorAccountId },
      select: { status: true },
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

    const blueprint = request.enterpriseBlueprint ?? request.discoveryProfile?.enterpriseBlueprint;
    if (blueprint?.tenantId) blocked("tenant linked");
    if (request.discoveryProfile?.status === "COMPLETED") blocked("discovery completed");
    if (blueprint && blueprint.proposalStatus !== "DRAFT") {
      blocked("pricing/proposal not draft-only");
    }

    ok("request exists");
    ok("request owner authoritative");
    ok(`request current status = ${FTGP_PROCROW_REVIEW_FROM_STATUS}`);
    ok("request eligible for ProCrow Review transition");
    ok("actor exists");
    ok("actor ACTIVE");
    ok("actor role = IMPLEMENTER");
    ok("actor permission platform.requests.manage = true");
    ok("expected request status delta = PENDING_REVIEW → UNDER_DISCOVERY");
    ok("expected audit-event delta = +1");
    ok("expected Discovery delta = +1 profile on execute (not in dry-run)");
    ok("expected Blueprint delta = 0");
    ok("expected tenant delta = 0");
    ok("no write performed");

    console.log(`\n  request_fingerprint=${requestFingerprint(requestId)}`);
    console.log(`  correlation_id_length=${correlationId.length}`);

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    if (
      postBaseline.internalRoleAssignments !== preBaseline.internalRoleAssignments ||
      postBaseline.implementationRequests !== preBaseline.implementationRequests
    ) {
      blocked("hosted baseline changed during dry-run");
    }

    console.log("\nPROCROW_REVIEW_TRANSITION_DRY_RUN=PASS");
    console.log("REQUEST_TRANSITION_WRITES_EXECUTED=false");
    console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
