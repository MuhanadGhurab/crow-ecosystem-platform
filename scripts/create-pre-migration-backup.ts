#!/usr/bin/env tsx
/**
 * Create a logical backup of the shared Supabase database before controlled migration.
 * Output stays outside Git. Requires DATABASE_URL (use --env-file=.env.staging).
 *
 * Run: npm run db:backup:pre-migration -- --env-file=.env.staging
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { assertDatabaseFingerprintMatches, resolveDatabaseEnvironment, expectedDatabaseFingerprint } from "./lib/database-environment";

function parseEnvFileArg(argv: string[]): string | null {
  const idx = argv.indexOf("--env-file");
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1] ?? null;
  return null;
}

function loadEnvFile(path: string) {
  const { config } = require("dotenv") as typeof import("dotenv");
  config({ path });
}

function main() {
  const envFile = parseEnvFileArg(process.argv.slice(2));
  if (envFile) loadEnvFile(envFile);

  const dbEnv = resolveDatabaseEnvironment();
  if (!dbEnv) {
    console.error("DATABASE_ENVIRONMENT is not set. Set production for shared backup.");
    process.exit(1);
  }
  if (dbEnv !== "production") {
    console.error(`DATABASE_ENVIRONMENT must be production for shared backup (got ${dbEnv ?? "unset"}).`);
    process.exit(1);
  }

  const databaseUrl =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("DIRECT_URL or DATABASE_URL is not set.");
    process.exit(1);
  }

  const expected = expectedDatabaseFingerprint();
  if (expected) {
    const actual = fingerprintDatabaseUrl(databaseUrl).targetHash;
    if (actual !== expected) {
      console.error(
        `Backup target fingerprint mismatch (expected ${expected}, actual ${actual}). Target: ${maskDatabaseTarget(databaseUrl)}`
      );
      process.exit(1);
    }
  } else if (process.env.DATABASE_URL?.trim()) {
    assertDatabaseFingerprintMatches();
  } else {
    console.error("EXPECTED_DATABASE_FINGERPRINT is not set.");
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(process.cwd(), ".backups", "c3-pre-migration");
  mkdirSync(outDir, { recursive: true });
  const sqlPath = join(outDir, `${stamp}-shared-production.sql`);
  const metaPath = join(outDir, `${stamp}-shared-production.meta.json`);

  console.log("\n=== Pre-migration backup ===\n");
  console.log(`Target: ${maskDatabaseTarget(databaseUrl)}`);
  console.log(`Output: ${sqlPath}`);

  const dumpFlags = ["--no-owner", "--no-privileges", "--format=plain"];

  let dump = spawnSync("pg_dump", [...dumpFlags, `--file=${sqlPath}`, databaseUrl], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (dump.status !== 0) {
    console.warn("pg_dump not available locally — trying Docker postgres:15-alpine…");
    const sslUrl = databaseUrl.includes("?")
      ? `${databaseUrl}&sslmode=require`
      : `${databaseUrl}?sslmode=require`;
    const dockerOut = spawnSync(
      "docker",
      ["run", "--rm", "-e", "PGSSLMODE=require", "postgres:15-alpine", "pg_dump", ...dumpFlags, sslUrl],
      { encoding: "buffer", shell: process.platform === "win32", maxBuffer: 1024 * 1024 * 512 }
    );
    if (dockerOut.status === 0 && dockerOut.stdout) {
      writeFileSync(sqlPath, dockerOut.stdout);
      dump = { status: 0, stderr: "" } as ReturnType<typeof spawnSync>;
    } else {
      dump = dockerOut;
    }
  }

  if (dump.status !== 0) {
    console.error("\n✗ pg_dump failed");
    console.error(dump.stderr?.slice(0, 500) ?? "unknown error");
    console.error("\nInstall PostgreSQL client tools or run backup from an operator workstation with pg_dump.\n");
    process.exit(1);
  }

  const { readFileSync } = require("node:fs") as typeof import("node:fs");
  const bytes = readFileSync(sqlPath);
  if (bytes.length === 0) {
    console.error("\n✗ Backup file is empty\n");
    process.exit(1);
  }

  const checksum = createHash("sha256").update(bytes).digest("hex");
  const meta = {
    createdAt: new Date().toISOString(),
    databaseEnvironment: dbEnv,
    maskedTarget: maskDatabaseTarget(databaseUrl),
    byteLength: bytes.length,
    sha256: checksum,
    restoration: [
      "1. Restore to a disposable Postgres instance only (never overwrite production without PO authorization).",
      "2. psql \"$RESTORE_DATABASE_URL\" -f <backup.sql>",
      "3. Verify `_prisma_migrations` row count matches pre-migration audit.",
      "4. Run npm run db:migrate:controlled -- --environment production --check-only before any apply.",
    ],
  };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  console.log("\n✓ Backup created");
  console.log(`  Path: ${sqlPath}`);
  console.log(`  SHA-256: ${checksum}`);
  console.log(`  Bytes: ${bytes.length}`);
  console.log(`  Meta: ${metaPath}\n`);
}

main();
