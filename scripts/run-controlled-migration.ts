#!/usr/bin/env tsx
/**
 * Controlled migration delivery — fingerprint-verified migrate status/deploy.
 * Never invoked from Vercel build; use GitHub workflow_dispatch or local operator CLI.
 *
 * Requires EXPECTED_DATABASE_FINGERPRINT to match DATABASE_URL before any status/deploy.
 * Confirmation phrases (distinct per environment):
 *   preview:    APPLY PREVIEW DATABASE MIGRATIONS
 *   production: APPLY PRODUCTION DATABASE MIGRATIONS
 */
import { spawnSync } from "node:child_process";
import {
  type ControlledMigrationEnvironment,
  CONTROLLED_MIGRATION_PHRASES,
  assertAppDatabaseEnvironmentAlignment,
  assertControlledEnvironmentTarget,
  assertControlledMigrationPhrase,
  assertDatabaseFingerprintMatches,
  isMigrationExplicitlyAllowed,
  resolveDatabaseEnvironment,
} from "./lib/database-environment";
import { maskDatabaseTarget } from "./lib/database-fingerprint";

function parseArgs(argv: string[]) {
  let environment: ControlledMigrationEnvironment | null = null;
  let confirm: string | undefined;
  let checkOnly = false;
  let expectedMigrationName: string | undefined;

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
    } else if (arg === "--expected-migration" && argv[i + 1]) {
      expectedMigrationName = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  npm run db:migrate:controlled -- --environment preview --check-only
  npm run db:migrate:controlled -- --environment preview --confirm "${CONTROLLED_MIGRATION_PHRASES.preview}"
  npm run db:migrate:controlled -- --environment production --confirm "${CONTROLLED_MIGRATION_PHRASES.production}"`);
      process.exit(0);
    }
  }

  return { environment, confirm, checkOnly, expectedMigrationName };
}

function runPrisma(args: string[]) {
  const result = spawnSync("npx", ["prisma", ...args], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result.status ?? 1;
}

function assertMigrationNamePresent(expectedName: string | undefined): void {
  if (!expectedName) return;
  const status = spawnSync("npx", ["prisma", "migrate", "status"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
  const output = `${status.stdout ?? ""}${status.stderr ?? ""}`;
  if (!output.includes(expectedName)) {
    console.error(`Expected migration name not found in migrate status: ${expectedName}`);
    process.exit(1);
  }
}

function main() {
  const { environment, confirm, checkOnly, expectedMigrationName } = parseArgs(process.argv.slice(2));

  if (!environment) {
    console.error("Missing required --environment (preview | production).");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  try {
    assertControlledEnvironmentTarget(environment);
    assertAppDatabaseEnvironmentAlignment();
    assertDatabaseFingerprintMatches();
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
  console.log(`  target: ${maskDatabaseTarget(url)}\n`);

  const statusBefore = runPrisma(["migrate", "status"]);
  if (statusBefore !== 0) {
    process.exit(statusBefore);
  }

  assertMigrationNamePresent(expectedMigrationName);

  if (checkOnly) {
    console.log("\nCheck-only complete — no migrate deploy executed.\n");
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
  process.exit(statusAfter);
}

main();
