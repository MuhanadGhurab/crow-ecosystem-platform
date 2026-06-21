#!/usr/bin/env tsx
/**
 * Controlled migration delivery — fingerprint-verified migrate status/deploy.
 * Never invoked from Vercel build; use GitHub workflow_dispatch or local operator CLI.
 */
import { spawnSync } from "node:child_process";
import {
  type ControlledMigrationEnvironment,
  CONTROLLED_MIGRATION_PHRASES,
  SHARED_PRODUCTION_BACKEND_WARNING,
  assertAppDatabaseEnvironmentAlignment,
  assertControlledEnvironmentTarget,
  assertControlledMigrationPhrase,
  assertDatabaseFingerprintMatches,
  assertDirectDatabaseFingerprintMatches,
  assertSharedProductionBackendAcknowledged,
  isMigrationExplicitlyAllowed,
  isSharedProductionBackendPairing,
  resolveBackendIsolation,
  resolveDatabaseEnvironment,
} from "./lib/database-environment";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import {
  FTGP_APPROVED_MIGRATION_INVENTORY,
  assertBackupReferencePresent,
  assertExactPendingInventory,
  assertNoFailedMigrationHistory,
  assertPoolerDirectTargetAgreement,
  assertRepositoryMigrationHashesMatchInventory,
  buildCheckReport,
  extractPendingMigrationNames,
  hasHistoryReconcileOnlyEntries,
  printCheckReport,
} from "./lib/controlled-migration-inventory";

/** Documented operator phrases (must match CONTROLLED_MIGRATION_PHRASES). */
const PHRASE_DOCS = {
  preview: "APPLY PREVIEW DATABASE MIGRATIONS",
  production: "APPLY PRODUCTION DATABASE MIGRATIONS",
} satisfies typeof CONTROLLED_MIGRATION_PHRASES;

function parseArgs(argv: string[]) {
  let environment: ControlledMigrationEnvironment | null = null;
  let confirm: string | undefined;
  let checkOnly = false;
  let expectedMigrationName: string | undefined;
  let allowSharedProductionBackend = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--environment" && argv[i + 1]) {
      const value = argv[++i];
      if (value !== "preview" && value !== "production") {
        console.error(`Invalid --environment ${value}. Use preview or production.`);
        process.exit(1);
      }
      environment = value;
    } else if (arg === "--confirm" && argv[i + 1]) {
      confirm = argv[++i];
    } else if (arg === "--check-only") {
      checkOnly = true;
    } else if (arg === "--allow-shared-production-backend") {
      allowSharedProductionBackend = true;
    } else if (arg === "--expected-migration" && argv[i + 1]) {
      expectedMigrationName = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  npm run db:migrate:controlled -- --environment preview --check-only --allow-shared-production-backend
  npm run db:migrate:controlled -- --environment preview --confirm "${PHRASE_DOCS.preview}" --allow-shared-production-backend`);
      process.exit(0);
    }
  }

  return { environment, confirm, checkOnly, expectedMigrationName, allowSharedProductionBackend };
}

function runPrisma(args: string[]) {
  const result = spawnSync("npx", ["prisma", ...args], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return { status: result.status ?? 1, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

function assertApprovedInventoryConfigured(): void {
  assertRepositoryMigrationHashesMatchInventory();
  console.log("\nApproved migration inventory:");
  for (const entry of FTGP_APPROVED_MIGRATION_INVENTORY) {
    console.log(
      `  ${entry.order}. ${entry.name} [${entry.riskClassification}] mode=${entry.applyMode} sha256=${entry.sqlSha256.slice(0, 12)}…`
    );
  }
}

function main() {
  const {
    environment,
    confirm,
    checkOnly,
    expectedMigrationName,
    allowSharedProductionBackend,
  } = parseArgs(process.argv.slice(2));

  if (!environment) {
    console.error("Missing required --environment (preview | production).");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL?.trim();
  const direct = process.env.DIRECT_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  if (!direct) {
    console.error("DIRECT_URL is required for controlled migration.");
    process.exit(1);
  }

  try {
    assertControlledEnvironmentTarget(environment, { allowSharedProductionBackend });
    assertSharedProductionBackendAcknowledged(allowSharedProductionBackend);
    assertAppDatabaseEnvironmentAlignment({ allowSharedProductionBackend });
    assertApprovedInventoryConfigured();
    if (allowSharedProductionBackend && isSharedProductionBackendPairing()) {
      console.warn(`\n${SHARED_PRODUCTION_BACKEND_WARNING}\n`);
      assertDirectDatabaseFingerprintMatches();
    } else {
      assertDatabaseFingerprintMatches();
    }
    assertPoolerDirectTargetAgreement(url, direct);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const applyMode = !checkOnly;

  if (applyMode) {
    if (!isMigrationExplicitlyAllowed()) {
      console.error(
        "ALLOW_DATABASE_MIGRATION must be true for apply mode. Use --check-only for status-only."
      );
      process.exit(1);
    }
    try {
      assertBackupReferencePresent(true);
      const reference = process.env.MIGRATION_BACKUP_REFERENCE?.trim();
      const checksum = process.env.MIGRATION_BACKUP_CHECKSUM?.trim();
      const verifiedAt = process.env.MIGRATION_BACKUP_VERIFIED_AT?.trim();
      const method = process.env.MIGRATION_RECOVERY_METHOD?.trim();
      console.log(`  backupReference: ${reference ? `${reference.slice(0, 8)}…` : "(via checksum)"}`);
      if (checksum) console.log(`  backupChecksum: ${checksum.slice(0, 8)}…`);
      console.log(`  backupVerifiedAt: ${verifiedAt}`);
      console.log(`  recoveryMethod: ${method}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    try {
      assertControlledMigrationPhrase(environment, confirm);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    if (hasHistoryReconcileOnlyEntries()) {
      console.error(
        "Inventory contains history_reconcile_only entries — run reconciliation separately before schema deploy."
      );
      process.exit(1);
    }
  }

  const dbEnv = resolveDatabaseEnvironment();
  const directFp = fingerprintDatabaseUrl(direct).targetHash;

  console.log(`\nControlled migration (${checkOnly ? "check-only" : "apply"})`);
  console.log(`  environment: ${environment}`);
  console.log(`  databaseEnvironment: ${dbEnv}`);
  console.log(`  backendIsolation: ${resolveBackendIsolation() ?? "unset"}`);
  console.log(`  appEnvironment: ${process.env.APP_ENVIRONMENT ?? "(from runtime)"}`);
  console.log(`  poolerTarget: ${maskDatabaseTarget(url)}`);
  console.log(`  directTarget: ${maskDatabaseTarget(direct)}`);

  const statusBefore = runPrisma(["migrate", "status"]);

  try {
    assertNoFailedMigrationHistory(statusBefore.output);
    const pendingBefore = extractPendingMigrationNames(statusBefore.output);
    assertExactPendingInventory(pendingBefore);

    const report = buildCheckReport({
      directFingerprint: directFp,
      directPoolerMatch: true,
      migrateStatusOutput: statusBefore.output,
      actualPending: pendingBefore,
      applyMode,
    });
    printCheckReport(report);

    if (expectedMigrationName && !pendingBefore.includes(expectedMigrationName)) {
      throw new Error(`Expected migration not pending: ${expectedMigrationName}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (checkOnly) {
    console.log("Check-only complete — no migrate deploy executed.\n");
    process.exit(0);
  }

  console.log("\nApplying migrations via controlled wrapper…\n");
  const deploy = spawnSync("node", ["scripts/migrate-deploy.mjs"], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if ((deploy.status ?? 1) !== 0) {
    process.exit(deploy.status ?? 1);
  }

  const statusAfter = runPrisma(["migrate", "status"]);
  process.exit(statusAfter.status);
}

main();
