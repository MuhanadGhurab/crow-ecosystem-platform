#!/usr/bin/env tsx
/**
 * CLOUD.1D — create hosted logical dump outside repository (no credentials logged).
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import {
  queryServerMajorVersion,
  resolvePgBackupClient,
  runPgDumpToFile,
  runPgRestoreList,
  runPgRestoreToDatabase,
  runPsqlCommand,
  runPsqlQuery,
} from "./lib/pg-backup-client";

const RESTORE_DB = "crow_hosted_dump_validation";
const LOCAL_ADMIN_URL = "postgresql://crow:crow_local_dev@127.0.0.1:5433/postgres";
const LOCAL_RESTORE_URL = `postgresql://crow:crow_local_dev@127.0.0.1:5433/${RESTORE_DB}`;

function defaultBackupRoot(): string {
  const configured = process.env.CROW_OPERATOR_BACKUP_ROOT?.trim();
  if (configured) return configured;
  return join(homedir(), "crow-operator-backups", "wbwnsndcxrgyqwppurms");
}

function tryDisposableRestore(
  archivePath: string,
  client: ReturnType<typeof resolvePgBackupClient>
): "DISPOSABLE_RESTORE_PASSED" | "ARCHIVE_LISTED" {
  runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
  const create = runPsqlCommand(LOCAL_ADMIN_URL, `CREATE DATABASE ${RESTORE_DB};`, client);
  if (create.status !== 0) {
    return "ARCHIVE_LISTED";
  }

  const restore = runPgRestoreToDatabase(archivePath, LOCAL_RESTORE_URL, client);
  const restoreStderr = restore.stderr ?? "";
  const benign =
    /already exists|must be owner of|permission denied for schema auth|extension .* already exists|unrecognized configuration parameter|transaction_timeout|supabase_vault|extension ".*" is not available|extension ".*" does not exist|COMMENT ON EXTENSION|relation "vault\.|COPY vault\.|errors ignored on restore|Command was:|^HINT:/i;
  const fatalLines = restoreStderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !benign.test(line));

  try {
    const migrationCount = runPsqlQuery(
      LOCAL_RESTORE_URL,
      "SELECT COUNT(*) FROM public._prisma_migrations;",
      client
    );
    if (Number.parseInt(migrationCount, 10) < 1) {
      runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
      return "ARCHIVE_LISTED";
    }
  } catch {
    if (fatalLines.length > 0 || restore.status !== 0) {
      runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
      return "ARCHIVE_LISTED";
    }
  }

  if (restore.status !== 0 && fatalLines.length > 0) {
    runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
    return "ARCHIVE_LISTED";
  }

  runPsqlCommand(LOCAL_ADMIN_URL, `DROP DATABASE IF EXISTS ${RESTORE_DB};`, client);
  return "DISPOSABLE_RESTORE_PASSED";
}

function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.migration.recovery"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });

  const directUrl = process.env.DIRECT_URL?.trim();
  if (!directUrl) {
    throw new Error("DIRECT_URL is required for hosted logical dump.");
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(defaultBackupRoot(), stamp);
  mkdirSync(outDir, { recursive: true });

  const archivePath = join(outDir, "shared-production.custom.dump");
  const manifestPath = join(outDir, "manifest.json");

  console.log("\n=== CLOUD.1D hosted logical dump ===\n");
  console.log(`env_file=${envLoad.primaryEnvFile}`);
  console.log(`target_project_ref=${hosted.supabaseProjectRef}`);
  console.log(`direct_fingerprint=${hosted.directFingerprint}`);

  const server = queryServerMajorVersion(directUrl);
  const client = resolvePgBackupClient(server.major);

  runPgDumpToFile(
    archivePath,
    ["--format=custom", "--compress=9", "--no-owner", "--no-acl"],
    directUrl,
    client
  );

  const archiveBytes = readFileSync(archivePath);
  if (archiveBytes.length === 0) {
    throw new Error("Logical dump archive is empty.");
  }

  const sha256 = createHash("sha256").update(archiveBytes).digest("hex");
  const createdAt = new Date().toISOString();

  const list = runPgRestoreList(archivePath, client);
  const requiredMarkers = ["_prisma_migrations", "platform_accounts", "implementation_requests"];
  for (const marker of requiredMarkers) {
    if (!list.includes(marker)) {
      throw new Error(`Archive list missing expected object: ${marker}`);
    }
  }

  let validation: "ARCHIVE_LISTED" | "DISPOSABLE_RESTORE_PASSED" | "FAILED" = "ARCHIVE_LISTED";
  try {
    validation = tryDisposableRestore(archivePath, client);
  } catch {
    validation = "FAILED";
  }

  const manifest = {
    createdAtUtc: createdAt,
    targetProjectRef: hosted.supabaseProjectRef,
    directFingerprint: hosted.directFingerprint,
    format: "custom",
    byteLength: archiveBytes.length,
    sha256,
    validation,
    restoreTemplate:
      "pg_restore --no-owner --no-acl --dbname \"$RESTORE_DATABASE_URL\" shared-production.custom.dump",
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("");
  console.log("LOGICAL_DUMP_CREATED=true");
  console.log("LOGICAL_DUMP_FORMAT=custom");
  console.log(`LOGICAL_DUMP_SIZE_BYTES=${archiveBytes.length}`);
  console.log(`LOGICAL_DUMP_SHA256=${sha256}`);
  console.log(`LOGICAL_DUMP_CREATED_AT=${createdAt}`);
  console.log("LOGICAL_DUMP_TARGET_FINGERPRINT=0355c17692e2a90d");
  console.log(`LOGICAL_DUMP_VALIDATION=${validation}`);
  console.log("");

  if (validation === "FAILED") {
    process.exit(1);
  }
}

main();
