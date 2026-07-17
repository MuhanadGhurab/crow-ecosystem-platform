#!/usr/bin/env tsx
/**
 * FTGP.1D — ProCrow review transition idempotency (no second write).
 * Run: npm run ftgp-request-review-transition:idempotency
 */
import { PrismaClient } from "@prisma/client";

import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { transitionImplementationRequestToProCrowReview } from "../src/lib/ftgp/ftgp-procrow-review-transition.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nPROCROW_REVIEW_TRANSITION_IDEMPOTENCY=FAILED`);
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

  console.log("\n=== FTGP ProCrow review transition idempotency ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const actorAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  const correlationId = process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim();
  if (!requestId || !actorAccountId || !correlationId) {
    fail("request, actor, and correlation ID required");
  }

  const prisma = new PrismaClient();
  let pre: Awaited<ReturnType<typeof captureCloud1hDatabaseBaseline>>;
  let preAudit: number;
  try {
    pre = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(pre, "Pre-idempotency baseline");

    preAudit = await prisma.discoveryAnswer.count({
      where: {
        sectionKey: FTGP_PROCROW_REVIEW_AUDIT_SECTION,
        questionKey: FTGP_PROCROW_REVIEW_AUDIT_KEY,
        profile: { requestId },
      },
    });
  } finally {
    await prisma.$disconnect();
  }

  const result = await transitionImplementationRequestToProCrowReview({
    requestId,
    actorPlatformAccountId: actorAccountId,
    correlationId,
  });

  if (!result.idempotent) {
    fail("expected idempotent=true on second invocation");
  }
  ok("PROCROW_REVIEW_TRANSITION_IDEMPOTENCY=PASS");
  ok("EXPECTED_SECOND_EXECUTION_DELTA=0");

  const prismaPost = new PrismaClient();
  try {
    const post = await captureCloud1hDatabaseBaseline(prismaPost);
    const postAudit = await prismaPost.discoveryAnswer.count({
      where: {
        sectionKey: FTGP_PROCROW_REVIEW_AUDIT_SECTION,
        questionKey: FTGP_PROCROW_REVIEW_AUDIT_KEY,
        profile: { requestId },
      },
    });
    if (post.implementationRequests !== pre.implementationRequests) {
      fail("request count changed");
    }
    if (post.internalRoleAssignments !== pre.internalRoleAssignments) {
      fail("internal assignments changed");
    }
    if (postAudit !== preAudit) {
      fail("duplicate audit events");
    }
    ok("DUPLICATE_REQUEST_LIFECYCLE_EVENTS=0");

    const request = await prismaPost.implementationRequest.findUnique({
      where: { id: requestId },
      select: { status: true },
    });
    if (request?.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      fail(`status=${request?.status}`);
    }
  } finally {
    await prismaPost.$disconnect();
  }

  console.log("\nPASS — FTGP PROCROW REVIEW TRANSITION IDEMPOTENCY\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
