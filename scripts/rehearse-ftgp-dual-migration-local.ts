#!/usr/bin/env tsx
/**
 * FTGP.0D — disposable local Postgres rehearsal for dual pending migrations.
 * Uses local docker Postgres only (127.0.0.1:5433 / crow_local_dev).
 *
 * Full `migrate deploy` from empty vanilla Postgres is blocked by legacy migration
 * ordering (phase5 FK before tenants). This rehearsal validates post-apply schema
 * fidelity via `db push`, then exercises FTGP constraints with Prisma Client.
 *
 * Hosted migrate-deploy path is validated separately via check-only inventory match
 * against the shared Supabase database (19 applied + 2 pending at FTGP.0D).
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

import { computeMigrationSqlSha256, expectedPendingMigrationNames } from "./lib/controlled-migration-inventory";

const DEFAULT_LOCAL_REHEARSAL_URL =
  "postgresql://crow:crow_local_dev@127.0.0.1:5433/crow_ecosystem?schema=public";

function isDisposableLocalTarget(url: string): boolean {
  const lower = url.toLowerCase();
  const isLocalHost = lower.includes("127.0.0.1") || lower.includes("localhost");
  const isDockerDisposable =
    lower.includes(":5433/") || lower.includes(":5433?") || lower.includes("crow_local_dev");
  return isLocalHost && isDockerDisposable;
}

function assertDisposableLocalTarget(url: string): void {
  if (!isDisposableLocalTarget(url)) {
    throw new Error(
      "Rehearsal requires disposable docker Postgres (127.0.0.1:5433 / crow_local_dev). " +
        "Set FTGP_REHEARSAL_DATABASE_URL explicitly if using another isolated local database."
    );
  }
}

function resolveRehearsalDatabaseUrl(): string {
  const explicit = process.env.FTGP_REHEARSAL_DATABASE_URL?.trim();
  if (explicit) return explicit;
  const configured = process.env.DATABASE_URL?.trim();
  if (configured && isDisposableLocalTarget(configured)) return configured;
  return DEFAULT_LOCAL_REHEARSAL_URL;
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv): void {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if ((result.status ?? 1) !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}`);
  }
}

function ensureDockerPostgres(): void {
  const probe = spawnSync(
    "docker",
    ["compose", "-f", "docker-compose.local.yml", "ps", "--status", "running", "postgres"],
    { encoding: "utf8", shell: process.platform === "win32" }
  );
  if ((probe.stdout ?? "").includes("crow-local-postgres")) {
    return;
  }
  console.log("Starting disposable local Postgres (docker-compose.local.yml)…");
  run("docker", ["compose", "-f", "docker-compose.local.yml", "up", "-d", "postgres"], process.env);
  run(
    "docker",
    ["compose", "-f", "docker-compose.local.yml", "exec", "-T", "postgres", "pg_isready", "-U", "crow"],
    process.env
  );
}

function recreateDisposableDatabase(): void {
  const sql = [
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'crow_ecosystem' AND pid <> pg_backend_pid();",
    "DROP DATABASE IF EXISTS crow_ecosystem;",
    "CREATE DATABASE crow_ecosystem;",
    "",
  ].join("\n");

  const result = spawnSync(
    "docker",
    ["compose", "-f", "docker-compose.local.yml", "exec", "-i", "postgres", "psql", "-U", "crow", "-d", "postgres"],
    { encoding: "utf8", input: sql, shell: false }
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if ((result.status ?? 1) !== 0) {
    throw new Error(`Failed to recreate disposable database (status ${result.status})`);
  }
}

function ensureSupabaseStubRolesForLocalPostgres(): void {
  const sql = [
    "DO $$ BEGIN CREATE ROLE anon NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
    "DO $$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
    "",
  ].join("\n");

  const result = spawnSync(
    "docker",
    ["compose", "-f", "docker-compose.local.yml", "exec", "-i", "postgres", "psql", "-U", "crow", "-d", "postgres"],
    { encoding: "utf8", input: sql, shell: false }
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if ((result.status ?? 1) !== 0) {
    throw new Error(`Failed to ensure Supabase stub roles (status ${result.status})`);
  }
}

async function main() {
  const databaseUrl = resolveRehearsalDatabaseUrl();
  assertDisposableLocalTarget(databaseUrl);

  ensureDockerPostgres();
  ensureSupabaseStubRolesForLocalPostgres();
  recreateDisposableDatabase();

  const rehearsalEnv: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: databaseUrl,
  };

  console.log("\n=== FTGP dual-migration local rehearsal ===\n");
  console.log(`  target: ${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(
    "  note: full migrate deploy from empty DB blocked by legacy phase5 migration on vanilla Postgres;"
  );
  console.log("        using db push to validate post-apply schema + FTGP constraints.\n");

  for (const name of expectedPendingMigrationNames()) {
    console.log(`  ${name} sha256=${computeMigrationSqlSha256(name).slice(0, 16)}…`);
  }

  console.log("\nSyncing post-apply schema via db push…");
  run("npx", ["prisma", "db", "push", "--accept-data-loss"], rehearsalEnv);

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
  try {
    const enumRows = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'LegalDocumentVersionStatus'
      ORDER BY e.enumsortorder`;
    const labels = enumRows.map((row) => row.enumlabel);
    if (!labels.includes("reviewed") || !labels.includes("approved_for_publication")) {
      throw new Error("Legal lifecycle enum values missing after schema sync.");
    }
    console.log("  legal enum values: reviewed, approved_for_publication present");

    const roleEnumRows = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'PlatformInternalRole'
      ORDER BY e.enumsortorder`;
    const roleLabels = roleEnumRows.map((row) => row.enumlabel);
    for (const expected of ["PLATFORM_ADMIN", "IMPLEMENTER", "SALES", "AUDITOR_READONLY"]) {
      if (!roleLabels.includes(expected)) {
        throw new Error(`PlatformInternalRole missing ${expected}`);
      }
    }
    console.log("  PlatformInternalRole enum: present");

    const assignmentCount = await prisma.platformInternalRoleAssignment.count();
    if (assignmentCount !== 0) {
      throw new Error(`Expected zero internal assignments, found ${assignmentCount}`);
    }
    console.log("  internal assignments: 0");

    const indexRows = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'platform_internal_role_assignments'
        AND indexname = 'platform_internal_role_assignments_one_active_per_role'`;
    if (indexRows.length !== 1) {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "platform_internal_role_assignments_one_active_per_role"
        ON "platform_internal_role_assignments" ("platformAccountId", "role")
        WHERE "status" = 'ACTIVE'`;
      console.log("  partial unique index: created (db push omits migration-only index; matches migration SQL)");
    } else {
      console.log("  partial unique index: present");
    }

    const fkRows = await prisma.$queryRaw<Array<{ conname: string }>>`
      SELECT conname FROM pg_constraint
      WHERE conrelid = 'platform_internal_role_assignments'::regclass
        AND contype = 'f'`;
    if (fkRows.length < 3) {
      throw new Error(`Expected at least 3 foreign keys on assignment table, found ${fkRows.length}`);
    }
    console.log(`  foreign keys: ${fkRows.length}`);

    const stamp = Date.now();
    let subject = await prisma.platformAccount.create({
      data: {
        email: `rehearsal-local-${stamp}@crow.local`,
        emailNormalized: `rehearsal-local-${stamp}@crow.local`,
        supabaseUserId: randomUUID(),
        publicAccountId: `PA-RH-${stamp}`,
        status: "ACTIVE",
        onboardingGeneration: 2,
      },
      select: { id: true },
    });

    await prisma.platformInternalRoleAssignment.create({
      data: {
        platformAccountId: subject.id,
        role: "IMPLEMENTER",
        status: "ACTIVE",
        grantReason: "rehearsal",
        grantCorrelationId: "rehearsal-1",
        grantedByPlatformAccountId: subject.id,
      },
    });

    let duplicateBlocked = false;
    try {
      await prisma.platformInternalRoleAssignment.create({
        data: {
          platformAccountId: subject.id,
          role: "IMPLEMENTER",
          status: "ACTIVE",
          grantReason: "rehearsal-dup",
          grantCorrelationId: "rehearsal-2",
          grantedByPlatformAccountId: subject.id,
        },
      });
    } catch {
      duplicateBlocked = true;
    }

    if (!duplicateBlocked) {
      throw new Error("Partial unique index did not block duplicate ACTIVE assignment.");
    }
    console.log("  duplicate ACTIVE assignment blocked by partial unique index");

    await prisma.platformInternalRoleAssignment.deleteMany({
      where: { grantCorrelationId: { startsWith: "rehearsal" } },
    });
    await prisma.platformAccount.delete({ where: { id: subject.id } });
  } finally {
    await prisma.$disconnect();
  }

  console.log("\nPASS — LOCAL DUAL-MIGRATION REHEARSAL (schema + constraints)\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
