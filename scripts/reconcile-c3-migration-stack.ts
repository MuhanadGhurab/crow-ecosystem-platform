/**
 * C3.9B — migration stack reconciliation (check-only, hosted direct DB).
 * Does not apply migrations or mutate _prisma_migrations.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { maskDatabaseTarget } from "./lib/database-fingerprint";

const ROOT = process.cwd();
const C3_DUAL_CHANNEL = "20260618140000_c3_dual_channel_onboarding";

const C3_5_APPLIED = [
  "20260614140000_c3_account_registration",
  "20260614150000_c3_legal_agreement",
  "20260614160000_c3_public_schema_access_hardening",
] as const;

const EXPECTED_C3_STACK = [...C3_5_APPLIED, C3_DUAL_CHANNEL] as const;

type MigrationClass =
  | "EXPECTED_SINGLE_PENDING_C3_8_MIGRATION"
  | "EXPECTED_ALREADY_APPLIED_C3_5"
  | "ALREADY_APPLIED_BUT_HISTORY_DRIFT"
  | "LEGITIMATE_PREVIOUS_PENDING_MIGRATION"
  | "UNEXPECTED_MIGRATION"
  | "LOCAL_ONLY_OR_SUPERSEDED"
  | "MANUAL_REVIEW_REQUIRED";

function localMigrationDirs(): string[] {
  return readdirSync(join(ROOT, "prisma/migrations"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function runMigrateStatus(): string {
  const result = spawnSync("npx", ["prisma", "migrate", "status"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.status !== 0 && !/following migration/i.test(output)) {
    console.error(output);
    throw new Error("prisma migrate status failed");
  }
  return output;
}

function extractPendingFromStatus(output: string): string[] {
  const marker = "Following migration have not yet been applied:";
  const altMarker = "Following migrations have not yet been applied:";
  const section =
    output.split(marker)[1]?.split("\n\n")[0] ??
    output.split(altMarker)[1]?.split("\n\n")[0] ??
    "";

  const pending: string[] = [];
  for (const line of section.split("\n")) {
    const match = line.trim().match(/^(\d{14}_[\w]+)/);
    if (match) pending.push(match[1]);
  }
  return pending.sort();
}

function classifyMigration(name: string, hostedRows: { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null }[]): MigrationClass {
  const row = hostedRows.find((r) => r.migration_name === name);
  if (name === C3_DUAL_CHANNEL) return "EXPECTED_SINGLE_PENDING_C3_8_MIGRATION";
  if ((C3_5_APPLIED as readonly string[]).includes(name)) {
    if (row?.finished_at && !row.rolled_back_at) return "EXPECTED_ALREADY_APPLIED_C3_5";
    return "LEGITIMATE_PREVIOUS_PENDING_MIGRATION";
  }
  if (row?.finished_at && !row.rolled_back_at) {
    return "ALREADY_APPLIED_BUT_HISTORY_DRIFT";
  }
  if (!localMigrationDirs().includes(name)) {
    return "LOCAL_ONLY_OR_SUPERSEDED";
  }
  return "MANUAL_REVIEW_REQUIRED";
}

async function queryHostedMigrations(): Promise<
  { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null; checksum: string | null }[]
> {
  const prisma = new PrismaClient();
  try {
    return await prisma.$queryRaw<
      { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null; checksum: string | null }[]
    >`
      SELECT migration_name, finished_at, rolled_back_at, checksum
      FROM "_prisma_migrations"
      ORDER BY migration_name ASC
    `;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const direct = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!direct) {
    console.error("DIRECT_URL or DATABASE_URL required for migration reconciliation.");
    process.exit(1);
  }

  console.log("\n=== C3 migration stack reconciliation (check-only) ===\n");
  console.log(`  target: ${maskDatabaseTarget(direct)}`);
  console.log(`  APP_ENVIRONMENT: ${process.env.APP_ENVIRONMENT ?? "(unset)"}`);
  console.log(`  DATABASE_ENVIRONMENT: ${process.env.DATABASE_ENVIRONMENT ?? "(unset)"}`);
  console.log(`  BACKEND_ISOLATION: ${process.env.BACKEND_ISOLATION ?? "(unset)"}\n`);

  const statusOutput = runMigrateStatus();
  const pending = extractPendingFromStatus(statusOutput);
  const hosted = await queryHostedMigrations();

  console.log("Pending migrations (ordered):");
  if (pending.length === 0) {
    console.log("  (none reported by prisma migrate status)");
  }
  for (const name of pending) {
    const cls = classifyMigration(name, hosted);
    console.log(`  - ${name} → ${cls}`);
  }

  const localOnly = localMigrationDirs().filter((d) => !hosted.some((h) => h.migration_name === d));
  if (localOnly.length > 0) {
    console.log("\nLocal migration folders absent from hosted _prisma_migrations:");
    for (const name of localOnly) console.log(`  - ${name}`);
  }

  const rolledBack = hosted.filter((r) => r.rolled_back_at);
  if (rolledBack.length > 0) {
    console.log("\nRolled-back hosted migration rows:");
    for (const row of rolledBack) console.log(`  - ${row.migration_name}`);
  }

  const unexpected = pending.filter(
    (name) =>
      classifyMigration(name, hosted) === "UNEXPECTED_MIGRATION" ||
      classifyMigration(name, hosted) === "MANUAL_REVIEW_REQUIRED"
  );

  const onlyDualChannelPending =
    pending.length === 1 && pending[0] === C3_DUAL_CHANNEL;
  const fourStackPending =
    pending.length === EXPECTED_C3_STACK.length &&
    EXPECTED_C3_STACK.every((m) => pending.includes(m));

  console.log("\nSummary:");
  if (onlyDualChannelPending) {
    console.log("  EXACTLY ONE AUTHORIZED PENDING MIGRATION");
  } else if (fourStackPending) {
    console.log(
      "  CONDITIONAL — four C3 migrations pending; product-owner review required before apply."
    );
  } else {
    console.log("  MIGRATION STACK RECONCILIATION REQUIRED");
    if (unexpected.length) console.log(`  Unexpected/manual-review count: ${unexpected.length}`);
  }

  console.log("");
  process.exit(unexpected.length > 0 ? 2 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
