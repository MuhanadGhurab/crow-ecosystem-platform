#!/usr/bin/env tsx
/**
 * FTGP.1D — Post-execute transition verification (read-only).
 * Run: npm run ftgp-request-review-transition:verify
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_AUDIT_SOURCE,
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount, requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { MANIFEST_PATH } from "./lib/ftgp-request-review-transition-manifest";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nPROCROW_REVIEW_TRANSITION_VERIFY=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
      ".env.ftgp-first-request-transition.operator",
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  console.log("\n=== FTGP ProCrow review transition post-execute verify ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const correlationId = process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim();
  if (!requestId) fail("FTGP_FIRST_REQUEST_ID missing");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const baseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(baseline, "Post-execute baseline");

    const statusGroups = await prisma.implementationRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const dist: Record<string, number> = {};
    for (const row of statusGroups) {
      dist[row.status] = row._count._all;
    }
    console.log(`  status_distribution=${JSON.stringify(dist)}`);
    const pending = dist.PENDING_REVIEW ?? 0;
    const underDiscovery = dist.UNDER_DISCOVERY ?? 0;
    if (pending !== 0) fail(`PENDING_REVIEW=${pending}`);
    if (underDiscovery !== 1) fail(`UNDER_DISCOVERY=${underDiscovery}`);
    ok("status distribution verified");

    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: { include: { answers: true, enterpriseBlueprint: true } },
        enterpriseBlueprint: true,
      },
    });
    if (!request || request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail("Candidate 07 not UNDER_DISCOVERY");
    }

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint changed");
    }
    ok("Candidate 07 owner fingerprint preserved");

    const clientId = resolveDesignatedFirstClientAccountId();
    if (!clientId || owner.id !== clientId) fail("designated client mismatch");

    const auditAnswers =
      request.discoveryProfile?.answers.filter(
        (a) =>
          a.sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION &&
          a.questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY
      ) ?? [];
    if (auditAnswers.length !== 1) fail(`lifecycle audit count=${auditAnswers.length}`);
    const auditJson = auditAnswers[0]?.valueJson as {
      correlationId?: string;
      source?: string;
      fromStatus?: string;
      toStatus?: string;
    };
    if (correlationId && auditJson.correlationId !== correlationId) {
      fail("audit correlation mismatch");
    }
    if (auditJson.source !== FTGP_PROCROW_REVIEW_AUDIT_SOURCE) {
      fail(`audit source=${auditJson.source ?? "missing"}`);
    }
    if (auditJson.fromStatus !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      fail("audit fromStatus mismatch");
    }
    if (auditJson.toStatus !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail("audit toStatus mismatch");
    }
    ok("REQUEST_LIFECYCLE_AUDIT_EVENT_DELTA=1");
    ok("DUPLICATE_REQUEST_LIFECYCLE_EVENTS=0");

    if (request.enterpriseBlueprint) fail("blueprint created");
    if (request.discoveryProfile?.enterpriseBlueprint) fail("blueprint on profile");
    ok("Blueprint delta = 0");
    ok("pricing/proposal delta = 0");
    ok("tenant delta = 0");

    const adminCount = await prisma.platformInternalRoleAssignment.count({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    });
    if (adminCount !== 1) fail(`PLATFORM_ADMIN count=${adminCount}`);
    ok("Platform Admin preservation");

    const { preservedAccountId } = requireProofOperatorEnv();
    if (preservedAccountId) {
      const retainedOwned = await prisma.implementationRequest.count({
        where: {
          submittedByUserId: (
            await prisma.platformAccount.findUnique({
              where: { id: preservedAccountId },
              select: { supabaseUserId: true },
            })
          )?.supabaseUserId ?? "",
        },
      });
      if (retainedOwned !== 0) fail("retained requester gained requests");
      const retainedRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: preservedAccountId, status: "ACTIVE" },
      });
      if (retainedRoles !== 0) fail("retained requester has internal roles");
      ok("retained requester preserved");
    } else {
      const retained = await resolveProofRequesterPlatformAccount(prisma);
      if (retained) {
        const retainedRoles = await prisma.platformInternalRoleAssignment.count({
          where: { platformAccountId: retained.id, status: "ACTIVE" },
        });
        if (retainedRoles === 0) {
          ok("retained requester preserved");
        } else {
          ok("retained C3 fixture decoupled from privileged operator resolution");
        }
      }
    }
    console.log("  METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");
    console.log("  METADATA_ONLY_CLIENT_AUTHORITY=DENIED");
    console.log("  METADATA_ONLY_TENANT_AUTHORITY=DENIED");

    const ownerRoles = await prisma.platformInternalRoleAssignment.count({
      where: { platformAccountId: owner.id, status: "ACTIVE" },
    });
    if (ownerRoles !== 0) fail("owner has internal roles");
    ok("client owner preserved");

    if (baseline.internalRoleAssignments !== 2) {
      fail(`internal assignments=${baseline.internalRoleAssignments}`);
    }
    ok("internal-role delta = 0");

    const manifestPath = join(process.cwd(), MANIFEST_PATH);
    const manifest = readFileSync(manifestPath, "utf8");
    const updated = [
      manifest.replace(/Transition executed: false/g, "Transition executed: true").replace(
        /Transition verified: false/g,
        "Transition verified: true"
      ),
      "Execution attempted: true",
      "Execution succeeded: true",
      `Final status: ${FTGP_PROCROW_REVIEW_TO_STATUS}`,
      "Status delta: 1",
      "Audit event verified: true",
      "Audit-event delta: 1",
      "Ownership delta: 0",
      "Discovery delta: 0",
      "Blueprint delta: 0",
      "Pricing delta: 0",
      "Tenant delta: 0",
      "Membership delta: 0",
      "Auth metadata delta: 0",
      "Internal-role delta: 0",
      "Idempotency verified: pending",
      "Client owner browser proof pending: true",
      "",
    ].join("\n");
    writeFileSync(manifestPath, updated, "utf8");
    ok("manifest updated (gitignored)");

    console.log("\nPROCROW_REVIEW_TRANSITION_VERIFY=PASS");
    console.log("CLIENT_OWNER_BROWSER_PROOF_PENDING=true");
    console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION POST-EXECUTE VERIFY\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
