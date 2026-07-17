#!/usr/bin/env tsx
/**
 * CERT.1 — Read-only request baseline invariant verification.
 * Replaces frozen implementation_requests=7 assertions.
 */
import { PrismaClient } from "@prisma/client";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertRequestBaselineInvariants,
  verifyRequestBaselineInvariants,
  type SafeRequestSummary,
} from "./lib/request-baseline-invariants";
import {
  fingerprintDatabaseUrl,
  maskDatabaseTarget,
} from "./lib/database-fingerprint";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function printSummary(summary: SafeRequestSummary) {
  console.log(
    `    fp=${summary.requestFingerprint} ref=${summary.referenceCode} status=${summary.status} created=${summary.createdAt.slice(0, 10)} owner=${summary.ownerFingerprint ?? "none"} discovery=${summary.hasDiscovery} blueprint=${summary.hasBlueprint} candidate07=${summary.isCandidate07}`
  );
}

async function main() {
  const envLoad = loadHostedOperatorEnv({ primaryEnvFile: ".env.staging.runtime" });
  assertHostedEnvNotLocalhost(envLoad);
  assertHostedVerificationTarget(envLoad);

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) fail("DATABASE_URL missing");

  console.log("\n=== Request baseline invariants (read-only) ===\n");
  console.log(`  target=${maskDatabaseTarget(dbUrl)}`);
  console.log(`  target_identity_fingerprint=${fingerprintDatabaseUrl(dbUrl).targetHash}`);

  const prisma = new PrismaClient();
  try {
    const report = await verifyRequestBaselineInvariants(prisma);
    console.log(`  implementation_requests=${report.totalCount}`);
    console.log("  request summaries:");
    for (const summary of report.summaries) {
      printSummary(summary);
    }

    if (report.eighthRequestClassification) {
      ok(`EIGHTH_REQUEST_CLASS=${report.eighthRequestClassification}`);
    }

    assertRequestBaselineInvariants(report);
    ok("Candidate 07 preserved with expected owner fingerprint");
    ok("no orphaned requests");
    ok("no duplicate reference codes");
    ok(`UNEXPLAINED_REQUEST_RECORD_COUNT=${report.unexplainedRequestCount}`);
    ok("REQUEST_BASELINE_INVARIANTS=PASS");
    console.log("\nPASS — request baseline invariants\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
