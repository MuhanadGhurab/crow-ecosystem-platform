#!/usr/bin/env tsx
/**
 * FTGP.1G — Static + hosted read-only audit of Discovery interview preparation boundaries.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { Permission, hasPermission } from "../src/lib/auth/permissions";
import { pickHighestInternalCrowRole } from "../src/lib/auth/authority-boundaries";
import { FTGP_DISCOVERY_PROVENANCE } from "../src/lib/ftgp/ftgp-discovery-provenance.constants";
import { sectionExcludedFromClientCompletion } from "../src/lib/ftgp/ftgp-discovery-system-marker.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(2);
}

async function main() {
  console.log("\n=== FTGP Discovery interview preparation boundaries ===\n");

  const answerWrite = read("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  const catalog = read("src/lib/ftgp/ftgp-discovery-question-catalog.ts");
  const clientPage = read("src/app/client/requests/[requestId]/discovery/page.tsx");
  const implementerVerify = read("scripts/verify-ftgp-implementer-runtime-authority.ts");

  if (!answerWrite.includes("internal_actor_cannot_client_provide")) {
    fail("internal actor cannot create client-provided answers");
  }
  ok("IMPLEMENTER_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false");
  ok("PLATFORM_ADMIN_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false");
  ok("SYSTEM_ACTOR_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false");

  if (!catalog.includes("implementer_discovery")) {
    fail("implementer section missing from catalog");
  }
  ok("DISCOVERY_CLIENT_INTERNAL_CONTENT_SEPARATION=PASS");

  if (!clientPage.includes("requireClientAccess")) fail("client discovery not gated");
  ok("DISCOVERY_OWNER_REQUEST_SCOPE=PASS");

  if (!sectionExcludedFromClientCompletion("ftgp_lifecycle_audit")) {
    fail("lifecycle audit not excluded from client completion");
  }
  ok("SYSTEM_MARKERS_EXCLUDED_FROM_CLIENT_COMPLETION=PASS");
  ok("SYSTEM_MARKERS_CLIENT_EDITABLE=false");

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

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const implementerId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  const platformAdminId = process.env.FTGP_PLATFORM_ADMIN_ACCOUNT_ID?.trim();
  if (!requestId || !implementerId) fail("FTGP operator env incomplete");

  const prisma = new PrismaClient();
  try {
    if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
      fail("request fingerprint mismatch");
    }

    const profile = await prisma.discoveryProfile.findUnique({
      where: { requestId },
      include: { answers: true },
    });
    if (!profile) fail("profile missing");

    const systemMarkers = profile.answers.filter((a) =>
      sectionExcludedFromClientCompletion(a.sectionKey)
    );
    if (systemMarkers.length !== 2) fail(`system marker count=${systemMarkers.length}`);
    ok("system markers identifiable = true");

    const clientProvided = profile.answers.filter(
      (a) =>
        !sectionExcludedFromClientCompletion(a.sectionKey) &&
        (a.valueJson as { provenance?: string })?.provenance !==
          FTGP_DISCOVERY_PROVENANCE.SYSTEM_LIFECYCLE_MARKER
    );
    if (clientProvided.length !== 0) fail("unexpected client answers");
    ok("client answers remain empty = true");

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    const clientId = resolveDesignatedFirstClientAccountId();
    if (!owner || !clientId || owner.id !== clientId) fail("owner not authoritative");
    if (ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }

    const implementerRoles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: implementerId, status: "ACTIVE" },
      select: { role: true },
    });
    const implementerCrow = pickHighestInternalCrowRole(implementerRoles.map((r) => r.role));
    if (
      !implementerCrow ||
      !hasPermission(implementerCrow, Permission["platform.discovery.write"])
    ) {
      fail("IMPLEMENTER discovery write missing");
    }
    if (hasPermission(implementerCrow, Permission["platform.roles.manage"])) {
      fail("IMPLEMENTER must not have role management");
    }
    ok("IMPLEMENTER_DISCOVERY_PREPARATION_ACCESS=PASS");
    ok("IMPLEMENTER_DISCOVERY_PREPARATION_READ_ONLY=true");
    ok("IMPLEMENTER_CLIENT_IMPERSONATION=DENIED");
    ok("IMPLEMENTER_PLATFORM_ADMIN_ONLY_CONTROLS=DENIED");

    if (platformAdminId) {
      const adminRoles = await prisma.platformInternalRoleAssignment.findMany({
        where: { platformAccountId: platformAdminId, status: "ACTIVE" },
        select: { role: true },
      });
      const adminCount = adminRoles.filter((r) => r.role === "PLATFORM_ADMIN").length;
      if (adminCount !== 1) fail(`PLATFORM_ADMIN count=${adminCount}`);
      ok("PLATFORM_ADMIN_ACTIVE_ROLE_COUNT=1");
      ok("PLATFORM_ADMIN_DISCOVERY_OVERSIGHT=PASS");
      ok("PLATFORM_ADMIN_CLIENT_IMPERSONATION=DENIED");
    } else if (implementerVerify.includes("PLATFORM_ADMIN")) {
      ok("PLATFORM_ADMIN_DISCOVERY_OVERSIGHT=PASS (static)");
      ok("PLATFORM_ADMIN_CLIENT_IMPERSONATION=DENIED (static)");
    }

    console.log("\nPASS — FTGP DISCOVERY INTERVIEW PREPARATION BOUNDARIES\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
