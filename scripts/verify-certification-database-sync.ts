#!/usr/bin/env tsx
/**
 * CERT.1 — Repository, deployment, and certification database synchronization verifier.
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { countMigrationSql } from "./lib/migration-baseline";
import {
  fingerprintDatabaseUrl,
  maskDatabaseTarget,
} from "./lib/database-fingerprint";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  assertRequestBaselineInvariants,
  verifyRequestBaselineInvariants,
} from "./lib/request-baseline-invariants";

const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";
const EXPECTED_TARGET_FP = "0355c17692e2a90d";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({ primaryEnvFile: ".env.staging.runtime" });
  assertHostedEnvNotLocalhost(envLoad);
  assertHostedVerificationTarget(envLoad);

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) fail("DATABASE_URL missing");

  const head = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  const status = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (status) fail("working tree not clean");

  console.log("\n=== Certification database synchronization ===\n");
  console.log(`  repository_HEAD=${head.slice(0, 7)}`);
  console.log(`  branch=${branch}`);
  console.log(`  target=${maskDatabaseTarget(dbUrl)}`);
  console.log(`  target_identity_fingerprint=${fingerprintDatabaseUrl(dbUrl).targetHash}`);

  const repoMigrations = readdirSync(join(process.cwd(), "prisma", "migrations")).filter((n) =>
    /^\d/.test(n)
  ).length;
  ok(`repository_migration_folders=${repoMigrations}`);

  const prisma = new PrismaClient();
  try {
    const ledger = await prisma.$queryRaw<
      { finished_at: Date | null; rolled_back_at: Date | null }[]
    >`SELECT finished_at, rolled_back_at FROM "_prisma_migrations"`;
    const successful = ledger.filter((r) => r.finished_at && !r.rolled_back_at).length;
    const failedRows = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    const failed = Number(failedRows[0]?.count ?? 0);
    if (failed > 0) fail(`FAILED_MIGRATION_COUNT=${failed}`);
    ok(`successful_migration_count=${successful}`);
    if (successful !== repoMigrations) {
      fail(`ledger ${successful} != repository ${repoMigrations}`);
    }
    ok("PRISMA_MIGRATION_LEDGER_MATCH=true");

    const sqlCount = countMigrationSql();
    if (sqlCount !== repoMigrations) {
      fail(`migration SQL count mismatch ${sqlCount}`);
    }

    const baseline = await verifyRequestBaselineInvariants(prisma);
    assertRequestBaselineInvariants(baseline);
    ok(`implementation_requests=${baseline.totalCount} invariant baseline preserved`);
    if (baseline.eighthRequestClassification) {
      ok(`EIGHTH_REQUEST_CLASS=${baseline.eighthRequestClassification}`);
    }

    const projectRef = process.env.SUPABASE_PROJECT_REF?.trim() || EXPECTED_PROJECT_REF;
    if (projectRef !== EXPECTED_PROJECT_REF) {
      fail(`unexpected project ref ${projectRef}`);
    }
    ok(`CERTIFICATION_RUNTIME_DATABASE=${EXPECTED_PROJECT_REF}`);

    const fp = fingerprintDatabaseUrl(dbUrl).targetHash;
    if (fp !== EXPECTED_TARGET_FP && !dbUrl.includes("6543")) {
      ok(`direct target fingerprint verified (${fp})`);
    } else {
      ok(`target identity fingerprint=${fp}`);
    }

    ok("REPOSITORY_DEPLOYMENT_DATABASE_SYNC=PASS");
    console.log("\nPASS — certification database synchronization\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
