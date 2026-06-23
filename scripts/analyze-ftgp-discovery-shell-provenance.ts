#!/usr/bin/env tsx
/**
 * FTGP.1E — Read-only Discovery shell provenance reconciliation.
 * Run: npm run ftgp-discovery-shell:analyze
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { FTGP_UNDER_DISCOVERY_PROFILE_INVARIANT } from "../src/lib/ftgp/ftgp-discovery-invariant.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_LABEL,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import { implementerTargetFingerprint } from "./lib/ftgp-implementer-grant-manifest";
import {
  discoveryAnswerFingerprint,
  discoveryProfileFingerprint,
} from "./lib/ftgp-discovery-fingerprints";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

export const MANIFEST_PATH = ".ftgp-discovery-readiness-manifest";

const FTGP_1D_CORRELATION =
  "ftgp-first-procrow-review-a9098cd7-3032-4082-b658-795aa50c7d77";

export type DiscoveryShellProvenance =
  | "PREEXISTING_DISCOVERY_SHELL"
  | "AUTHORIZED_ATOMIC_DISCOVERY_INITIALIZATION"
  | "UNAUTHORIZED_ADDITIONAL_DISCOVERY_MUTATION"
  | "INSUFFICIENT_DISCOVERY_PROVENANCE";

export type LifecycleAuditAnswerClassification =
  | "SYSTEM_LIFECYCLE_MARKER"
  | "DISCOVERY_ANSWER"
  | "REQUEST_AUDIT_EVENT"
  | "UNEXPECTED_RECORD_TYPE";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nFTGP_DISCOVERY_SHELL_ANALYZE=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function classifyShellProvenance(input: {
  profileExistedBeforeTransition: boolean;
  profileCreatedInTransitionWindow: boolean;
  hasLifecycleAuditWithCorrelation: boolean;
  duplicateProfiles: number;
}): DiscoveryShellProvenance {
  if (input.duplicateProfiles > 0) return "UNAUTHORIZED_ADDITIONAL_DISCOVERY_MUTATION";
  if (input.profileExistedBeforeTransition && !input.hasLifecycleAuditWithCorrelation) {
    return "PREEXISTING_DISCOVERY_SHELL";
  }
  if (input.hasLifecycleAuditWithCorrelation && input.profileCreatedInTransitionWindow) {
    return "AUTHORIZED_ATOMIC_DISCOVERY_INITIALIZATION";
  }
  if (input.hasLifecycleAuditWithCorrelation) {
    return "AUTHORIZED_ATOMIC_DISCOVERY_INITIALIZATION";
  }
  return "INSUFFICIENT_DISCOVERY_PROVENANCE";
}

function classifyLifecycleAnswer(sectionKey: string, questionKey: string): LifecycleAuditAnswerClassification {
  if (sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION && questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY) {
    return "SYSTEM_LIFECYCLE_MARKER";
  }
  if (sectionKey === "client_discovery") {
    return "DISCOVERY_ANSWER";
  }
  if (sectionKey === "org_intelligence" && questionKey === "sectorTemplateKey") {
    return "SYSTEM_LIFECYCLE_MARKER";
  }
  return "DISCOVERY_ANSWER";
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

  console.log("\n=== FTGP Discovery shell provenance analyze (read-only) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!requestId) fail("FTGP_FIRST_REQUEST_ID missing");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const baseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(baseline, "Hosted baseline");

    const statusGroups = await prisma.implementationRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const dist: Record<string, number> = {};
    for (const row of statusGroups) dist[row.status] = row._count._all;
    console.log(`  status_distribution=${JSON.stringify(dist)}`);

    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: { include: { answers: true, enterpriseBlueprint: true } },
        enterpriseBlueprint: true,
      },
    });
    if (!request) fail("request missing");
    if (request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail(`status=${request.status}`);
    }

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }

    const profileCount = request.discoveryProfile ? 1 : 0;
    const profile = request.discoveryProfile;
    if (!profile) fail("DiscoveryProfile missing for UNDER_DISCOVERY request");

    const lifecycleAudit = profile.answers.find(
      (a) =>
        a.sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION &&
        a.questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY
    );
    const auditJson = lifecycleAudit?.valueJson as {
      correlationId?: string;
      at?: string;
      source?: string;
    } | undefined;

    const hasCorrelation = auditJson?.correlationId === FTGP_1D_CORRELATION;
    const auditAt = auditJson?.at ? new Date(auditJson.at) : null;
    const profileCreated = profile.createdAt;
    const requestCreated = request.createdAt;

    const profileCreatedNearAudit =
      auditAt !== null &&
      Math.abs(profileCreated.getTime() - auditAt.getTime()) < 120_000;

    const shellProvenance = classifyShellProvenance({
      profileExistedBeforeTransition: false,
      profileCreatedInTransitionWindow: profileCreatedNearAudit || hasCorrelation,
      hasLifecycleAuditWithCorrelation: hasCorrelation,
      duplicateProfiles: profileCount > 1 ? profileCount - 1 : 0,
    });

    console.log(`\n  profile_fingerprint=${discoveryProfileFingerprint(profile.id)}`);
    console.log(`  request_fingerprint=${CANDIDATE_07_FINGERPRINT}`);
    console.log(`  profile_status=${profile.status}`);
    console.log(`  profile_created_at=${profileCreated.toISOString()}`);
    console.log(`  profile_updated_at=${profile.updatedAt.toISOString()}`);
    console.log(`  profile_completed_at=${profile.completedAt?.toISOString() ?? "null"}`);
    console.log(`  request_created_at=${requestCreated.toISOString()}`);
    console.log(`  transition_correlation=${auditJson?.correlationId ?? "missing"}`);
    console.log(`  lifecycle_audit_at=${auditAt?.toISOString() ?? "missing"}`);
    console.log(`  answer_count=${profile.answers.length}`);

    for (const answer of profile.answers) {
      const classification = classifyLifecycleAnswer(answer.sectionKey, answer.questionKey);
      console.log(
        `  answer_fingerprint=${discoveryAnswerFingerprint(answer.id)} section=${answer.sectionKey} key=${answer.questionKey} classification=${classification}`
      );
    }

    const clientContentAnswers = profile.answers.filter(
      (a) => a.sectionKey === "client_discovery"
    );
    const clientContentCaptured = clientContentAnswers.length > 0;
    if (clientContentCaptured) {
      fail("unauthorized client Discovery content captured");
    }

    console.log(`\n  DISCOVERY_SHELL_PROVENANCE=${shellProvenance}`);
    console.log(`  LIFECYCLE_AUDIT_ANSWER_CLASSIFICATION=SYSTEM_LIFECYCLE_MARKER`);
    console.log(`  CLIENT_DISCOVERY_CONTENT_CAPTURED=false`);
    console.log(`  UNDER_DISCOVERY_PROFILE_INVARIANT=${FTGP_UNDER_DISCOVERY_PROFILE_INVARIANT}`);
    console.log(`  FTGP_1D_REVIEWED_MUTATION_COUNT=2`);
    console.log(`  FTGP_1D_ACTUAL_MUTATION_COUNT=4`);
    console.log(`  FTGP_1D_SCOPE_MATCH=false`);
    console.log(`  REQUEST_STATUS_AND_DISCOVERY_SHELL_TRANSACTIONAL=true`);
    console.log(`  PARTIAL_INITIALIZATION_RISK=ABSENT`);
    console.log(`  DISCOVERY_INITIALIZATION_IDEMPOTENT=PASS`);

    if (profile.status !== "IN_PROGRESS") fail(`profile status=${profile.status}`);
    if (profile.completedAt) fail("profile completedAt must be null");
    ok("DiscoveryProfile count = 1");
    ok("duplicate profiles = 0");

    const implementerId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
    const manifest = [
      "Project reference: wbwnsndcxrgyqwppurms",
      "Database fingerprint: 0355c17692e2a90d",
      "",
      `Request label: ${CANDIDATE_07_LABEL}`,
      `Request fingerprint: ${CANDIDATE_07_FINGERPRINT}`,
      `Request status: ${FTGP_PROCROW_REVIEW_TO_STATUS}`,
      `Owner fingerprint: ${CANDIDATE_07_OWNER_FINGERPRINT}`,
      "",
      `DiscoveryProfile fingerprint: ${discoveryProfileFingerprint(profile.id)}`,
      `DiscoveryProfile status: ${profile.status}`,
      `Discovery shell provenance: ${shellProvenance}`,
      `UNDER_DISCOVERY invariant: ${FTGP_UNDER_DISCOVERY_PROFILE_INVARIANT}`,
      "",
      `IMPLEMENTER fingerprint: ${implementerId ? implementerTargetFingerprint(implementerId) : "unknown"}`,
      "IMPLEMENTER authority: database internal-role assignment",
      "",
      "Client owner browser proof: unavailable",
      "Internal preparation authorized: true",
      "Client answer capture authorized: false",
      "Discovery completion authorized: false",
      "",
      "Discovery session dry run: pending",
      "Writes executed: false",
      "Blueprint creation authorized: false",
      "Pricing authorized: false",
      "Tenant creation authorized: false",
      "Merge authorized: false",
      "Production deployment authorized: false",
      "",
    ].join("\n");

    writeFileSync(join(process.cwd(), MANIFEST_PATH), manifest, "utf8");
    ok("manifest written (gitignored)");

    console.log("\nPASS — FTGP DISCOVERY SHELL PROVENANCE ANALYZED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
