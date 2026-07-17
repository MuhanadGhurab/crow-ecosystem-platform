/**
 * C2.1 — Preview migration readiness gate verifier.
 *
 *   npm run c2-preview-readiness:verify
 *
 * Read-only static checks. Does not connect to hosted databases.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  C2_MIGRATION_DIR,
  hasC2BlueprintMigration,
} from "./lib/migration-baseline";

const ROOT = join(import.meta.dirname, "..");

const C21_DOCS = [
  "docs/architecture/crow-core/c2/C2_1_PREVIEW_MIGRATION_READINESS.md",
  "docs/architecture/crow-core/c2/C2_1_PREVIEW_DATABASE_AUDIT.md",
  "docs/architecture/crow-core/c2/C2_1_BACKFILL_DRY_RUN_REPORT.md",
  "docs/architecture/crow-core/c2/C2_1_PREVIEW_APPLY_RUNBOOK.md",
  "docs/architecture/crow-core/c2/C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md",
  "docs/internal/C2_1_PREVIEW_MIGRATION_READINESS_GATE.md",
] as const;

const SECRET_PATTERNS = [
  /postgresql:\/\/[^:]+:[^@]+@/i,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]+['"]/i,
  /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/,
  /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
];

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main(): boolean {
  let pass = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      pass = false;
    }
  };

  console.log("\n=== C2.1 Preview migration readiness verifier ===\n");

  for (const doc of C21_DOCS) {
    check(existsSync(join(ROOT, doc)), `Doc present: ${doc}`, `Missing doc: ${doc}`);
  }

  check(
    hasC2BlueprintMigration(ROOT),
    `C2 migration present (${C2_MIGRATION_DIR})`,
    `Missing C2 migration ${C2_MIGRATION_DIR}`
  );

  const gateDoc = fileText("docs/internal/C2_1_PREVIEW_MIGRATION_READINESS_GATE.md");
  check(
    gateDoc.includes("APPLY C2 MIGRATION TO PREVIEW"),
    "Apply runbook requires explicit PO authorization phrase",
    "Gate doc must require explicit APPLY C2 MIGRATION TO PREVIEW authorization"
  );
  check(
    !gateDoc.toLowerCase().includes("migration applied") ||
      gateDoc.includes("not marked applied") ||
      gateDoc.includes("NOT APPLIED"),
    "Gate does not falsely mark Preview migration as applied by C2.1",
    "Gate doc must not mark Preview migration as applied"
  );

  const runbook = fileText("docs/architecture/crow-core/c2/C2_1_PREVIEW_APPLY_RUNBOOK.md");
  check(
    runbook.includes("prisma migrate deploy"),
    "Apply runbook specifies migrate deploy",
    "Apply runbook must document migrate deploy"
  );
  check(
    runbook.includes("Production") && runbook.toLowerCase().includes("separate"),
    "Production excluded from Preview apply",
    "Apply runbook must exclude Production"
  );

  const hygiene = fileText("docs/architecture/crow-core/c2/C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md");
  check(
    hygiene.includes("C2.H") && hygiene.includes("db push"),
    "Baseline hygiene proposal separated (C2.H)",
    "Missing C2.H baseline hygiene separation"
  );

  const backfillReport = fileText("docs/architecture/crow-core/c2/C2_1_BACKFILL_DRY_RUN_REPORT.md");
  check(
    backfillReport.toLowerCase().includes("dry-run") || backfillReport.includes("dry run"),
    "Backfill report is dry-run only",
    "Backfill report must document dry-run only"
  );
  check(
    !backfillReport.includes("--apply"),
    "Backfill report does not document --apply execution",
    "Backfill report must not reference --apply runs"
  );

  const readiness = fileText("docs/architecture/crow-core/c2/C2_1_PREVIEW_MIGRATION_READINESS.md");
  const validDecisions = [
    "READY FOR EXPLICIT PREVIEW APPLY AUTHORIZATION",
    "CONDITIONAL READINESS — MANUAL DATA RESOLUTION REQUIRED",
    "BLOCKED — PREVIEW/PRODUCTION DATABASE ISOLATION NOT PROVEN",
    "BLOCKED — MIGRATION HISTORY INCOMPATIBLE",
    "BLOCKED — SCHEMA DRIFT",
    "BLOCKED — TENANT OWNERSHIP RISK",
    "FAILED — HOSTED MUTATION OCCURRED",
  ];
  check(
    validDecisions.some((d) => readiness.includes(d)),
    "Readiness doc records a valid C2.1 decision",
    "Readiness doc must include exactly one C2.1 decision string"
  );

  check(
    readiness.includes("LEGACY_IMPORT") && !readiness.includes("LEGACY_IMPORTED"),
    "Canonical provenance terminology LEGACY_IMPORT",
    "Use LEGACY_IMPORT (not LEGACY_IMPORTED) in C2.1 docs"
  );

  check(
    existsSync(join(ROOT, "scripts/audit-preview-database-readonly.ts")),
    "Read-only Preview audit script present",
    "Missing scripts/audit-preview-database-readonly.ts"
  );
  check(
    existsSync(join(ROOT, "scripts/lib/database-fingerprint.ts")),
    "Database fingerprint helper present",
    "Missing scripts/lib/database-fingerprint.ts"
  );

  const auditSrc = fileText("scripts/audit-preview-database-readonly.ts");
  check(
    !auditSrc.includes("migrate deploy") &&
      !auditSrc.includes("migrate resolve") &&
      !auditSrc.includes("db push"),
    "Audit script avoids mutating Prisma commands",
    "Audit script must not invoke migrate deploy/resolve or db push"
  );

  for (const doc of [...C21_DOCS, "docs/internal/PROJECT_STATUS.md"]) {
    if (!existsSync(join(ROOT, doc))) continue;
    const text = fileText(doc);
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        fail(`Possible secret in ${doc}`);
        pass = false;
      }
    }
  }

  const evidencePath = join(ROOT, "docs/architecture/crow-core/c2/.c21-preview-audit-evidence.json");
  if (existsSync(evidencePath)) {
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
      hostedMutation?: boolean;
      isolation?: { classification?: string };
      migrationHistory?: { classification?: string };
    };
    check(
      evidence.hostedMutation === false,
      "Evidence records hostedMutation: false",
      "Evidence must record hostedMutation: false"
    );
    check(
      Boolean(evidence.isolation?.classification),
      "Evidence includes isolation classification",
      "Evidence missing isolation classification"
    );
    check(
      Boolean(evidence.migrationHistory?.classification),
      "Evidence includes migration-history classification",
      "Evidence missing migration-history classification"
    );
  } else {
    ok("Evidence JSON absent (run c2-preview-readiness:audit locally with .env.staging)");
  }

  check(
    existsSync(join(ROOT, "scripts/verify-c2-preview-migration-readiness.ts")),
    "C2.1 verifier script present",
    "Missing verify-c2-preview-migration-readiness.ts"
  );

  console.log(pass ? "\nC2.1 preview readiness verifier: PASS\n" : "\nC2.1 preview readiness verifier: FAIL\n");
  process.exit(pass ? 0 : 1);
}

main();
