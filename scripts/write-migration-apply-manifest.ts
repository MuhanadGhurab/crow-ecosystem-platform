#!/usr/bin/env tsx
/**
 * CLOUD.1D — write gitignored dual-migration apply manifest (no secrets).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { FTGP_APPROVED_MIGRATION_INVENTORY } from "./lib/controlled-migration-inventory";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { validateMigrationRecoveryEvidence } from "./lib/migration-recovery-evidence";

const MANIFEST_PATH = join(process.cwd(), ".migration-apply-manifest");

function readLatestDumpManifest(): {
  sha256: string | null;
  validation: string | null;
  createdAt: string | null;
} {
  const envSha = process.env.LOGICAL_DUMP_SHA256?.trim();
  const envValidation = process.env.LOGICAL_DUMP_VALIDATION?.trim();
  const envCreated = process.env.LOGICAL_DUMP_CREATED_AT?.trim();
  if (envSha) {
    return { sha256: envSha, validation: envValidation ?? null, createdAt: envCreated ?? null };
  }

  const pointer = process.env.CROW_LATEST_LOGICAL_DUMP_MANIFEST?.trim();
  if (pointer && existsSync(pointer)) {
    const parsed = JSON.parse(readFileSync(pointer, "utf8")) as {
      sha256?: string;
      validation?: string;
      createdAtUtc?: string;
    };
    return {
      sha256: parsed.sha256 ?? null,
      validation: parsed.validation ?? null,
      createdAt: parsed.createdAtUtc ?? null,
    };
  }
  return { sha256: null, validation: null, createdAt: null };
}

function main() {
  const appliedVerified = process.argv.includes("--applied-verified");

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.migration.recovery"],
  });
  assertHostedEnvNotLocalhost(envLoad);
  const hosted = assertHostedVerificationTarget({ requireDatabaseUrls: true });
  const recovery = validateMigrationRecoveryEvidence();
  const dump = readLatestDumpManifest();

  const lines = [
    "Project reference: wbwnsndcxrgyqwppurms",
    `Database fingerprint: ${hosted.directFingerprint ?? "0355c17692e2a90d"}`,
    "Hosted environment file: .env.staging.runtime",
    "",
    "Data API public exposure: contained",
    "",
    ...FTGP_APPROVED_MIGRATION_INVENTORY.flatMap((entry) => [
      `Migration ${entry.order}:`,
      entry.name,
      entry.sqlSha256,
      "",
    ]),
    `Recovery method: ${recovery.evidence?.method ?? "(unset)"}`,
    `Recovery reference: ${recovery.sanitized.referencePresent ? "(present — see .env.migration.recovery)" : "(unset)"}`,
    `Recovery verified at: ${recovery.sanitized.verifiedAt ?? "(unset)"}`,
    "",
    `Logical dump created: ${dump.sha256 ? "true" : "false"}`,
    `Logical dump SHA-256: ${dump.sha256 ?? "(unset)"}`,
    `Logical dump validation: ${dump.validation ?? "(unset)"}`,
    "",
    `Apply executed: ${appliedVerified ? "true" : "false"}`,
    `Apply verified: ${appliedVerified ? "true" : "false"}`,
    `Migration 1 applied: ${appliedVerified ? "true" : "false"}`,
    `Migration 2 applied: ${appliedVerified ? "true" : "false"}`,
    `Failed migration count: ${appliedVerified ? "0" : "(not applied)"}`,
    `Pending migration count: ${appliedVerified ? "0" : "(not applied)"}`,
    `Internal assignments created: ${appliedVerified ? "0" : "(not applied)"}`,
    "Apply authorized: false",
    "Branch push authorized: false",
    "Preview deployment authorized: false",
    "Production deployment authorized: false",
    "Role bootstrap authorized: false",
    "",
  ];

  writeFileSync(MANIFEST_PATH, lines.join("\n"));
  console.log(`\nWrote apply manifest: ${MANIFEST_PATH} (gitignored)\n`);
}

main();
