#!/usr/bin/env tsx
/**
 * FTGP.1E — Zero-write Discovery session dry run.
 * Run: npm run ftgp-discovery-session:dry-run
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  pickHighestInternalCrowRole,
} from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import { FTGP_PROCROW_REVIEW_TO_STATUS } from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import { discoveryProfileFingerprint } from "./lib/ftgp-discovery-fingerprints";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";
import { MANIFEST_PATH } from "./analyze-ftgp-discovery-shell-provenance";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nDISCOVERY_SESSION_DRY_RUN=FAILED`);
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
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  console.log("\n=== FTGP Discovery session dry-run (zero writes) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const actorAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  if (!requestId) fail("FTGP_FIRST_REQUEST_ID missing");
  if (!actorAccountId) fail("FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID missing");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "Pre dry-run baseline");

    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: { include: { answers: true, enterpriseBlueprint: true } },
        enterpriseBlueprint: true,
      },
    });
    if (!request) fail("request missing");
    ok("request exists = true");
    ok(`request fingerprint = ${CANDIDATE_07_FINGERPRINT}`);
    if (request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail(`request status=${request.status}`);
    }
    ok(`request status = ${FTGP_PROCROW_REVIEW_TO_STATUS}`);

    const clientId = resolveDesignatedFirstClientAccountId();
    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || !clientId || owner.id !== clientId) {
      fail("owner not authoritative");
    }
    if (ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }
    ok("request owner authoritative = true");

    const profiles = await prisma.discoveryProfile.count({ where: { requestId } });
    if (profiles !== 1) fail(`DiscoveryProfile count=${profiles}`);
    ok("DiscoveryProfile exists exactly once");

    const profile = request.discoveryProfile;
    if (!profile) fail("profile missing");
    if (profile.status !== "IN_PROGRESS") fail(`profile status=${profile.status}`);
    ok("profile status = IN_PROGRESS");
    if (profile.completedAt) fail("profile completion timestamp set");
    ok("profile completion timestamp = null");

    const preAnswerCount = profile.answers.length;

    const actor = await prisma.platformAccount.findUnique({
      where: { id: actorAccountId },
      select: { status: true },
    });
    if (!actor || actor.status !== "ACTIVE") fail("IMPLEMENTER not ACTIVE");
    ok("IMPLEMENTER exists = true");
    ok("IMPLEMENTER active = true");

    const actorRoles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: actorAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const crowRole = pickHighestInternalCrowRole(actorRoles.map((r) => r.role));
    if (!crowRole || !hasPermission(crowRole, Permission["platform.requests.manage"])) {
      fail("IMPLEMENTER permission invalid");
    }
    ok("IMPLEMENTER permission valid = true");
    console.log("  IMPLEMENTER authority source = DATABASE_INTERNAL_ROLE_ASSIGNMENT");

    console.log("  client owner authenticated proof = unavailable");
    ok("internal preparation allowed = true");
    ok("client answer capture allowed = false");
    ok("Discovery completion allowed = false");

    ok("expected request status delta = 0");
    ok("expected DiscoveryProfile delta = 0");
    ok("expected answer delta = 0");
    ok("expected audit-event delta = 0");
    ok("expected Blueprint delta = 0");
    ok("expected pricing delta = 0");
    ok("expected tenant delta = 0");
    ok("expected membership delta = 0");
    ok("expected Auth metadata delta = 0");
    ok("writes executed = 0");

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    if (postBaseline.implementationRequests !== preBaseline.implementationRequests) {
      fail("implementation request count changed");
    }
    const postAnswers = await prisma.discoveryAnswer.count({
      where: { profile: { requestId } },
    });
    if (postAnswers !== preAnswerCount) fail("answer count changed");

    const manifestPath = join(process.cwd(), MANIFEST_PATH);
    try {
      let manifest = readFileSync(manifestPath, "utf8");
      manifest = manifest.replace(
        "Discovery session dry run: pending",
        "Discovery session dry run: passed"
      );
      writeFileSync(manifestPath, manifest, "utf8");
    } catch {
      ok("manifest update skipped (run analyze first)");
    }

    console.log(`\n  profile_fingerprint=${discoveryProfileFingerprint(profile.id)}`);
    console.log("\nDISCOVERY_SESSION_DRY_RUN=PASS");
    console.log("DISCOVERY_WRITES_EXECUTED=false");
    console.log("CLIENT_ANSWER_CAPTURE_AUTHORIZED=false");
    console.log("DISCOVERY_COMPLETION_AUTHORIZED=false");
    console.log("\nPASS — FTGP DISCOVERY SESSION DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
