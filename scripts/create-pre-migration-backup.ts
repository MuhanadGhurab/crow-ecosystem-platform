#!/usr/bin/env tsx
/**
 * C3.4 — Create verified pre-migration backups (custom archive + schema-only).
 * Run: npm run db:backup:pre-migration
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertDirectDatabaseFingerprintMatches,
  resolveBackendIsolation,
  resolveDatabaseEnvironment,
} from "./lib/database-environment";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import {
  queryServerMajorVersion,
  resolvePgBackupClient,
  runPgDumpToFile,
} from "./lib/pg-backup-client";

const BACKUP_ROOT = join(process.cwd(), ".backups", "c3-pre-migration");

function main() {
  const dbEnv = resolveDatabaseEnvironment() ?? "production";
  if (dbEnv !== "production") {
    console.error(`DATABASE_ENVIRONMENT must be production (got ${dbEnv}).`);
    process.exit(1);
  }
  if (!process.env.DATABASE_ENVIRONMENT?.trim()) {
    process.env.DATABASE_ENVIRONMENT = "production";
  }
  if (!process.env.EXPECTED_DIRECT_DATABASE_FINGERPRINT?.trim()) {
    process.env.EXPECTED_DIRECT_DATABASE_FINGERPRINT = "0355c17692e2a90d";
  }

  const directUrl = process.env.DIRECT_URL?.trim();
  if (!directUrl) {
    console.error("DIRECT_URL is required for pre-migration backup.");
    process.exit(1);
  }

  try {
    assertDirectDatabaseFingerprintMatches();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(BACKUP_ROOT, stamp);
  mkdirSync(outDir, { recursive: true });

  const archivePath = join(outDir, "shared-production.custom.dump");
  const schemaPath = join(outDir, "shared-production.schema.sql");
  const manifestPath = join(outDir, "manifest.json");

  console.log("\n=== C3 pre-migration backup ===\n");
  console.log(`Target: ${maskDatabaseTarget(directUrl)}`);
  console.log(`Output: ${outDir}`);

  const server = queryServerMajorVersion(directUrl);
  const client = resolvePgBackupClient(server.major);

  console.log(`Server major: ${server.major}`);
  console.log(`Client: ${client.kind} (${client.clientVersion})`);

  runPgDumpToFile(
    archivePath,
    ["--format=custom", "--compress=9", "--no-owner", "--no-acl"],
    directUrl,
    client
  );
  runPgDumpToFile(
    schemaPath,
    ["--schema-only", "--no-owner", "--no-acl"],
    directUrl,
    client
  );

  const archiveBytes = readFileSync(archivePath);
  const schemaBytes = readFileSync(schemaPath);
  if (archiveBytes.length === 0 || schemaBytes.length === 0) {
    console.error("\n✗ Backup artifact is empty\n");
    process.exit(1);
  }

  const manifest = {
    createdAtUtc: new Date().toISOString(),
    databaseEnvironment: dbEnv,
    backendIsolation: resolveBackendIsolation(),
    maskedTarget: maskDatabaseTarget(directUrl),
    directFingerprint: fingerprintDatabaseUrl(directUrl).targetHash,
    serverMajor: server.major,
    serverVersionRaw: server.raw,
    clientKind: client.kind,
    clientVersion: client.clientVersion,
    artifacts: {
      customArchive: {
        path: archivePath,
        byteLength: archiveBytes.length,
        sha256: createHash("sha256").update(archiveBytes).digest("hex"),
      },
      schemaOnly: {
        path: schemaPath,
        byteLength: schemaBytes.length,
        sha256: createHash("sha256").update(schemaBytes).digest("hex"),
      },
    },
    restoreTemplate:
      "pg_restore --no-owner --no-acl --dbname \"$RESTORE_DATABASE_URL\" shared-production.custom.dump",
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  writeFileSync(join(BACKUP_ROOT, "LATEST"), stamp);

  console.log("\n✓ Backup artifacts created");
  console.log(`  Custom archive: ${archivePath}`);
  console.log(`  Schema-only: ${schemaPath}`);
  console.log(`  Archive SHA-256: ${manifest.artifacts.customArchive.sha256}`);
  console.log(`  Archive bytes: ${manifest.artifacts.customArchive.byteLength}`);
  console.log(`  Manifest: ${manifestPath}\n`);
}

main();
