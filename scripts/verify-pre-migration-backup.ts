#!/usr/bin/env tsx
/**
 * C3.4 — Verify pre-migration backup archive + disposable restore.
 * Run: npm run db:backup:verify
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  resolvePgBackupClient,
  runPgRestoreList,
  runPgRestoreToDatabase,
  runPsqlCommand,
  runPsqlQuery,
} from "./lib/pg-backup-client";

const BACKUP_ROOT = join(process.cwd(), ".backups", "c3-8-pre-migration");
const RESTORE_DB = "crow_backup_validation";
const LOCAL_ADMIN_URL = "postgresql://crow:crow_local_dev@127.0.0.1:5433/postgres";
const LOCAL_RESTORE_URL = `postgresql://crow:crow_local_dev@127.0.0.1:5433/${RESTORE_DB}`;

type Manifest = {
  createdAtUtc: string;
  serverMajor: number;
  clientKind: string;
  clientVersion: string;
  maskedTarget: string;
  directFingerprint: string;
  artifacts: {
    customArchive: { path: string; byteLength: number; sha256: string };
    schemaOnly: { path: string; byteLength: number; sha256: string };
  };
};

function resolveBackupDir(): string {
  const latestPath = join(BACKUP_ROOT, "LATEST");
  if (existsSync(latestPath)) {
    const stamp = readFileSync(latestPath, "utf8").trim();
    return join(BACKUP_ROOT, stamp);
  }
  const dirs = readdirSync(BACKUP_ROOT)
    .filter((name) => statSync(join(BACKUP_ROOT, name)).isDirectory())
    .sort()
    .reverse();
  if (!dirs[0]) throw new Error("No backup directory found under .backups/c3-pre-migration");
  return join(BACKUP_ROOT, dirs[0]);
}

function assertTrackedByGit(path: string): void {
  const check = spawnSync("git", ["ls-files", "--error-unmatch", path], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (check.status === 0) {
    throw new Error(`Backup artifact is tracked by Git: ${path}`);
  }
}

function main() {
  const backupDir = resolveBackupDir();
  const manifestPath = join(backupDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    console.error("Missing manifest.json in backup directory.");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const archivePath = join(backupDir, "shared-production.custom.dump");
  const schemaPath = join(backupDir, "shared-production.schema.sql");

  console.log("\n=== C3 backup verification ===\n");
  console.log(`Backup UTC: ${manifest.createdAtUtc}`);
  console.log(`Masked target: ${manifest.maskedTarget}`);
  console.log(`Direct fingerprint: ${manifest.directFingerprint}`);

  for (const path of [archivePath, schemaPath, manifestPath]) {
    if (!existsSync(path) || statSync(path).size === 0) {
      console.error(`Missing or empty artifact: ${path}`);
      process.exit(1);
    }
    assertTrackedByGit(path);
  }

  const archiveBytes = readFileSync(archivePath);
  const checksum = createHash("sha256").update(archiveBytes).digest("hex");
  if (checksum !== manifest.artifacts.customArchive.sha256) {
    console.error("Archive checksum mismatch.");
    process.exit(1);
  }

  const client = resolvePgBackupClient(manifest.serverMajor);
  const list = runPgRestoreList(archivePath, client);
  const requiredMarkers = [
    "_prisma_migrations",
    "platform_accounts",
    "legal_documents",
    "legal_document_versions",
    "email_verification_challenges",
    "tenants",
    "enterprise_blueprint_versions",
  ];
  for (const marker of requiredMarkers) {
    if (!list.includes(marker)) {
      console.error(`Archive list missing expected object: ${marker}`);
      process.exit(1);
    }
  }
  console.log("✓ pg_restore --list succeeded with expected schema markers");

  runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
  const create = runPsqlCommand(LOCAL_ADMIN_URL, `CREATE DATABASE ${RESTORE_DB};`, client);
  if (create.status !== 0) {
    console.error("Could not create disposable restore database. Is local Postgres on 5433 running?");
    console.error(create.stderr.slice(0, 300));
    process.exit(1);
  }

  const restore = runPgRestoreToDatabase(archivePath, LOCAL_RESTORE_URL, client);
  const restoreStderr = restore.stderr ?? "";
  const benign =
    /already exists|must be owner of|permission denied for schema auth|extension .* already exists|unrecognized configuration parameter|transaction_timeout|supabase_vault|extension ".*" is not available|extension ".*" does not exist|COMMENT ON EXTENSION|relation "vault\.|COPY vault\.|errors ignored on restore|Command was:|^HINT:/i;
  const fatalLines = restoreStderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !benign.test(line));

  let migrationCount = "0";
  let tenantCount = "0";
  let blueprintCount = "0";
  let platformAccountCount = "0";
  let legalDocumentCount = "0";
  try {
    migrationCount = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public._prisma_migrations;",
      client
    );
    tenantCount = runPsqlQuery(LOCAL_RESTORE_URL, "SELECT COUNT(*) FROM public.tenants;", client);
    blueprintCount = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public.enterprise_blueprint_versions;",
      client
    );
    platformAccountCount = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public.platform_accounts;",
      client
    );
    legalDocumentCount = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public.legal_documents;",
      client
    );
    const failedMigrations = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public._prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL;",
      client
    );
    if (Number.parseInt(failedMigrations, 10) > 0) {
      console.error("Active failed migration rows present after restore.");
      process.exit(1);
    }
  } catch (error) {
    if (fatalLines.length > 0 || restore.status !== 0) {
      console.error("Disposable restore reported fatal errors:");
      console.error(fatalLines.slice(0, 8).join("\n"));
      process.exit(1);
    }
    throw error;
  }

  if (restore.status !== 0 && fatalLines.length > 0) {
    console.error("Disposable restore reported fatal errors:");
    console.error(fatalLines.slice(0, 8).join("\n"));
    process.exit(1);
  }

  if (restore.status !== 0 && fatalLines.length === 0) {
    console.log("✓ Disposable restore completed with expected Supabase extension warnings only");
  }

  if (Number.parseInt(migrationCount, 10) < 1) {
    console.error("Migration history missing after restore.");
    process.exit(1);
  }

  console.log("✓ Disposable restore completed");
  console.log(`  _prisma_migrations rows: ${migrationCount}`);
  console.log(`  tenants rows: ${tenantCount}`);
  console.log(`  platform_accounts rows: ${platformAccountCount}`);
  console.log(`  legal_documents rows: ${legalDocumentCount}`);
  console.log(`  enterprise_blueprint_versions rows: ${blueprintCount}`);
  console.log(`  Archive SHA-256: ${checksum}`);

  runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
  console.log(`  dropped disposable database ${RESTORE_DB}`);
  console.log("\ndb:backup:verify PASSED\n");
}

main();
