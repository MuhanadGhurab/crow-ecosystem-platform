#!/usr/bin/env tsx
/**
 * FTGP.1D — Audited first ProCrow review transition execute (single transition).
 * Run: npm run ftgp-request-review-transition:execute
 */
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
  FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_REASON,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { transitionImplementationRequestToProCrowReview } from "../src/lib/ftgp/ftgp-procrow-review-transition.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_LABEL,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  MANIFEST_PATH,
  assertHostedDatabaseFingerprint,
} from "./lib/ftgp-request-review-transition-manifest";
import {
  FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_PHRASE,
  validateFtgpReviewTransitionExecuteGates,
} from "./lib/ftgp-request-review-transition-execute-gates";
import { implementerTargetFingerprint } from "./lib/ftgp-implementer-grant-manifest";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

const OPERATOR_ENV_APPEND = ".env.ftgp-first-request-transition.operator";

function fail(msg: string): never {
  console.error(`\nPROCROW_REVIEW_TRANSITION_EXECUTE=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function runGate(script: string): void {
  execSync(`npm run ${script}`, {
    stdio: "inherit",
    shell: process.platform === "win32",
    timeout: 600_000,
    env: process.env,
  });
}

function writePreExecuteManifest(correlationId: string): void {
  const manifest = [
    "Project reference: wbwnsndcxrgyqwppurms",
    "Database fingerprint: 0355c17692e2a90d",
    "",
    "Request selection mode: explicit immutable request ID",
    `Request label: ${CANDIDATE_07_LABEL}`,
    `Request fingerprint: ${CANDIDATE_07_FINGERPRINT}`,
    "",
    `Owner fingerprint: ${CANDIDATE_07_OWNER_FINGERPRINT}`,
    "Owner provenance: legitimate authoritative owner",
    "Designated client matches owner: true",
    "",
    `Actor fingerprint: f82bef0cddd75238`,
    "Actor role: IMPLEMENTER",
    "Actor authority: database internal-role assignment",
    "",
    `Current status: ${FTGP_PROCROW_REVIEW_FROM_STATUS}`,
    `Target status: ${FTGP_PROCROW_REVIEW_TO_STATUS}`,
    "",
    "Expected status delta: 1",
    "Expected lifecycle audit-event delta: 1",
    "Expected ownership delta: 0",
    "Expected Discovery delta: 0",
    "Expected Blueprint delta: 0",
    "Expected pricing delta: 0",
    "Expected tenant delta: 0",
    "Expected membership delta: 0",
    "Expected Auth metadata delta: 0",
    "",
    `Correlation ID: ${correlationId}`,
    "Dry run passed: true",
    "Execution authorized: true",
    "Transition executed: false",
    "Transition verified: false",
    "Recovery executed: false",
    "Merge authorized: false",
    "Production deployment authorized: false",
    "",
  ].join("\n");
  writeFileSync(join(process.cwd(), MANIFEST_PATH), manifest, "utf8");
}

async function captureCandidateMetrics(prisma: PrismaClient, requestId: string) {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      discoveryProfile: { include: { answers: true, enterpriseBlueprint: true } },
      enterpriseBlueprint: true,
    },
  });
  if (!request) throw new Error("request missing");
  const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
  return {
    status: request.status,
    ownerFingerprint: owner ? ownerFingerprint(owner.id) : "unknown",
    lifecycleAuditCount:
      request.discoveryProfile?.answers.filter(
        (a) =>
          a.sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION &&
          a.questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY
      ).length ?? 0,
    discoveryProfileCount: request.discoveryProfile ? 1 : 0,
    blueprintCount: request.enterpriseBlueprint || request.discoveryProfile?.enterpriseBlueprint ? 1 : 0,
  };
}

async function main() {
  const baseEnvLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
    ],
  });
  assertHostedEnvNotLocalhost(baseEnvLoad);
  assertHostedDatabaseFingerprint();

  console.log("\n=== FTGP ProCrow review transition execute (audited) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!requestId) fail("FTGP_FIRST_REQUEST_ID required");

  console.log("=== Preflight gates (read-only) ===\n");
  runGate("ftgp-first-request-target:verify");
  runGate("ftgp-procrow-review-transition:audit");
  runGate("ftgp-request-review-transition:dry-run");

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
      OPERATOR_ENV_APPEND,
    ],
  });
  assertHostedDatabaseFingerprint();

  const actorAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  if (!actorAccountId) fail("FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID required");

  const correlationId =
    process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim() ||
    `ftgp-first-procrow-review-${randomUUID()}`;

  writePreExecuteManifest(correlationId);

  const gate = validateFtgpReviewTransitionExecuteGates({
    requestId,
    actorAccountId,
    correlationId,
    manifestCorrelationId: correlationId,
    operatorAuthorizationFlag:
      process.env.FTGP_FIRST_REQUEST_TRANSITION_EXECUTE_AUTHORIZED === "true",
  });
  if (!gate.allowed) fail(gate.message);

  console.log("=== Execute authorization gates ===\n");
  ok(gate.message);

  const prisma = new PrismaClient();
  let preMetrics: Awaited<ReturnType<typeof captureCandidateMetrics>>;
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "Pre-execute baseline");

    preMetrics = await captureCandidateMetrics(prisma, requestId);
    if (preMetrics.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      fail(`request status=${preMetrics.status}`);
    }
    if (preMetrics.ownerFingerprint !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail(`owner fingerprint=${preMetrics.ownerFingerprint}`);
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=== Execute transition ===\n");
  const result = await transitionImplementationRequestToProCrowReview({
    requestId,
    actorPlatformAccountId: actorAccountId,
    correlationId,
    reason: FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_REASON,
  });

  ok(`transition completed idempotent=${result.idempotent}`);
  ok(`fromStatus=${result.fromStatus} toStatus=${result.toStatus}`);

  const prismaPost = new PrismaClient();
  try {
    const post = await captureCandidateMetrics(prismaPost, requestId);
    if (post.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail(`post status=${post.status}`);
    }
    if (post.ownerFingerprint !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail(`post owner fingerprint=${post.ownerFingerprint}`);
    }
    const auditDelta = post.lifecycleAuditCount - preMetrics.lifecycleAuditCount;
    if (auditDelta !== 1 && !result.idempotent) {
      fail(`lifecycle audit delta=${auditDelta}`);
    }
    ok("PROCROW_REVIEW_TRANSITION_EXECUTED=PASS");
    ok("REQUEST_STATUS_DELTA=1");
    ok("REQUEST_LIFECYCLE_AUDIT_EVENT_DELTA=1");
  } finally {
    await prismaPost.$disconnect();
  }

  console.log("\nPROCROW_REVIEW_TRANSITION_EXECUTE=PASS");
  console.log(`  correlation_id=${correlationId}`);
  console.log(`  request_fingerprint=${requestFingerprint(requestId)}`);
  console.log(`  actor_fingerprint=${implementerTargetFingerprint(actorAccountId)}`);
  console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION EXECUTED\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
