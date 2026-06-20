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
import { maskDatabaseTarget } from "./lib/database-fingerprint";

const C3_PENDING_MIGRATIONS = [
  "20260614140000_c3_account_registration",
  "20260614150000_c3_legal_agreement",
  "20260614160000_c3_public_schema_access_hardening",
  "20260618140000_c3_dual_channel_onboarding",
] as const;

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
  npm run db:migrate:controlled -- --environment production --check-only --allow-shared-production-backend
  npm run db:migrate:controlled -- --environment preview --confirm "${PHRASE_DOCS.preview}"
  npm run db:migrate:controlled -- --environment production --confirm "${PHRASE_DOCS.production}"`);
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

function assertMigrationInventory(output: string, checkOnly: boolean): void {
  if (/failed migrations/i.test(output)) {
    console.error("Failed migrations detected in migrate status output.");
    process.exit(1);
  }

  const pending = C3_PENDING_MIGRATIONS.filter((name) => output.includes(name));
  const unexpected = output
    .split("\n")
    .filter((line) => line.includes("have not yet been applied"))
  ;

  if (checkOnly) {
    if (pending.length !== C3_PENDING_MIGRATIONS.length) {
      console.error(`Expected exactly ${C3_PENDING_MIGRATIONS.length} pending C3 migrations.`);
      console.error(`Found: ${pending.join(", ") || "(none)"}`);
      process.exit(1);
    }
    for (const name of C3_PENDING_MIGRATIONS) {
      if (!output.includes(name)) {
        console.error(`Missing expected pending migration: ${name}`);
        process.exit(1);
      }
    }
    if (/DROP TABLE|DROP COLUMN|RENAME TO/i.test(output)) {
      console.error("Destructive SQL markers found in migration status context.");
      process.exit(1);
    }
  }

  if (unexpected.length > 0 && !checkOnly) {
    return;
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

  try {
    assertControlledEnvironmentTarget(environment);
    assertSharedProductionBackendAcknowledged(allowSharedProductionBackend);
    assertAppDatabaseEnvironmentAlignment({ allowSharedProductionBackend });
    if (allowSharedProductionBackend && isSharedProductionBackendPairing()) {
      console.warn(`\n${SHARED_PRODUCTION_BACKEND_WARNING}\n`);
      if (!direct) {
        throw new Error("DIRECT_URL is required for shared production backend check-only.");
      }
      assertDirectDatabaseFingerprintMatches();
    } else {
      assertDatabaseFingerprintMatches();
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!checkOnly) {
    if (!isMigrationExplicitlyAllowed()) {
      console.error(
        "ALLOW_DATABASE_MIGRATION must be true for apply mode. Use --check-only for status-only."
      );
      process.exit(1);
    }
    const backupChecksum = process.env.MIGRATION_BACKUP_CHECKSUM?.trim();
    if (!backupChecksum) {
      console.error(
        "MIGRATION_BACKUP_CHECKSUM is required for apply mode. " +
          "Record a fresh backup checksum before controlled migrate deploy."
      );
      process.exit(1);
    }
    console.log(`  backupChecksum: ${backupChecksum.slice(0, 8)}… (verified present)`);
    try {
      assertControlledMigrationPhrase(environment, confirm);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  const dbEnv = resolveDatabaseEnvironment();
  console.log(`\nControlled migration (${checkOnly ? "check-only" : "apply"})`);
  console.log(`  environment: ${environment}`);
  console.log(`  databaseEnvironment: ${dbEnv}`);
  console.log(`  backendIsolation: ${resolveBackendIsolation() ?? "unset"}`);
  console.log(`  appEnvironment: ${process.env.APP_ENVIRONMENT ?? "(from runtime)"}`);
  console.log(`  target: ${maskDatabaseTarget(url)}`);
  if (direct) console.log(`  directTarget: ${maskDatabaseTarget(direct)}\n`);
  else console.log("");

  const statusBefore = runPrisma(["migrate", "status"]);
  assertMigrationInventory(statusBefore.output, checkOnly);

  if (expectedMigrationName && !statusBefore.output.includes(expectedMigrationName)) {
    console.error(`Expected migration name not found in migrate status: ${expectedMigrationName}`);
    process.exit(1);
  }

  if (checkOnly) {
    console.log("\nCheck-only complete — no migrate deploy executed.\n");
    process.exit(0);
  }

  if (statusBefore.status !== 0 && /failed migrations/i.test(statusBefore.output)) {
    process.exit(statusBefore.status);
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
