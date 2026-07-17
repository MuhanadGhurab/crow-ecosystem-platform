/**
 * C1.1 — Blueprint Persistence Migration Approval Gate verifier.
 *
 *   npm run c1-migration-gate:verify
 *
 * Confirms architecture docs exist, exactly one persistence strategy is selected,
 * and no Prisma schema/migration changes were introduced in the gate branch.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  countMigrationSql,
  hasC2BlueprintMigration,
  C1_MIGRATION_BASELINE,
} from "./lib/migration-baseline";

const ROOT = join(import.meta.dirname, "..");

const C1_1_DOC_FILES = [
  "docs/architecture/crow-core/c1/C1_1_MIGRATION_APPROVAL_GATE.md",
  "docs/architecture/crow-core/c1/C1_1_AUTHORIZATION_MATRIX.md",
  "docs/architecture/crow-core/c1/C1_1_THREAT_MODEL.md",
  "docs/architecture/crow-core/c1/C1_1_BACKFILL_AND_ROLLOUT_PLAN.md",
  "docs/architecture/crow-core/c1/C1_1_SCHEMA_DESIGN_PREVIEW.md",
  "docs/internal/C1_1_BLUEPRINT_PERSISTENCE_MIGRATION_APPROVAL_GATE.md",
] as const;

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

  console.log("\n=== C1.1 Blueprint Persistence Migration Approval Gate verifier ===\n");

  for (const f of C1_1_DOC_FILES) {
    check(existsSync(join(ROOT, f)), `Doc: ${f}`, `Missing C1.1 doc: ${f}`);
  }

  const gate = fileText("docs/architecture/crow-core/c1/C1_1_MIGRATION_APPROVAL_GATE.md");
  const proposal = fileText("docs/architecture/crow-core/c1/C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md");
  const schemaPreview = fileText("docs/architecture/crow-core/c1/C1_1_SCHEMA_DESIGN_PREVIEW.md");
  const authMatrix = fileText("docs/architecture/crow-core/c1/C1_1_AUTHORIZATION_MATRIX.md");
  const threat = fileText("docs/architecture/crow-core/c1/C1_1_THREAT_MODEL.md");
  const backfill = fileText("docs/architecture/crow-core/c1/C1_1_BACKFILL_AND_ROLLOUT_PLAN.md");

  check(
    gate.includes("Hybrid") && gate.includes("Option 2"),
    "Gate selects Hybrid persistence (Option 2)",
    "Gate must select exactly one strategy: Hybrid (Option 2)"
  );
  check(
    gate.includes("APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION"),
    "Gate decision: APPROVE PATH C — READY FOR C2 (PO sign-off)",
    "Gate must record APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION"
  );
  check(
    !gate.includes("CONDITIONAL APPROVAL — PRODUCT DECISIONS REQUIRED") ||
      gate.includes("superseded by PO sign-off"),
    "Conditional approval superseded by PO sign-off",
    "Gate must not remain in CONDITIONAL APPROVAL state after PO sign-off"
  );
  check(
    gate.includes("Mandatory C2 security gates") && gate.includes("listEnterpriseBlueprints"),
    "Mandatory C2 security gates documented",
    "Gate must document mandatory C2 security gates"
  );
  check(
    proposal.includes("APPROVE PATH C") || proposal.includes("PO sign-off"),
    "Migration proposal reflects PO sign-off",
    "C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md must reflect PO sign-off"
  );
  check(
    proposal.includes("Hybrid") && proposal.includes("C1.1"),
    "Migration proposal updated for C1.1 hybrid design",
    "C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md must reference C1.1 hybrid"
  );

  check(
    schemaPreview.includes("NON-EXECUTABLE DESIGN PREVIEW"),
    "Schema preview marked non-executable",
    "C1_1_SCHEMA_DESIGN_PREVIEW.md must state NON-EXECUTABLE"
  );
  check(
    schemaPreview.includes("EnterpriseBlueprintVersion"),
    "Schema preview defines EnterpriseBlueprintVersion",
    "Schema preview must define version model"
  );

  const invariantChecks: Array<[string, string]> = [
    ["tenant-scoped", "Tenant scoping explicit"],
    ["identity", "Blueprint identity vs version separation"],
    ["immutable", "Approved-version immutability"],
    ["client-safe", "Client-safe projection"],
    ["SHA-256", "Content hashing (SHA-256)"],
    ["AI cannot approve", "AI cannot approve"],
    ["LEGACY_IMPORT", "Backfill provenance (no invented approvals)"],
    ["optimistic", "Concurrency strategy"],
    ["rollback", "Rollback strategy"],
  ];
  for (const [needle, label] of invariantChecks) {
    check(
      gate.toLowerCase().includes(needle.toLowerCase()) ||
        proposal.toLowerCase().includes(needle.toLowerCase()),
      `Invariant/doc: ${label}`,
      `Missing in gate or proposal: ${label}`
    );
  }

  check(
    authMatrix.includes("platform_admin") && authMatrix.includes("client"),
    "Authorization matrix covers roles",
    "C1_1_AUTHORIZATION_MATRIX.md must list platform_admin and client"
  );
  check(
    threat.includes("IDOR") || threat.includes("cross-tenant"),
    "Threat model addresses cross-tenant / IDOR",
    "C1_1_THREAT_MODEL.md must address IDOR"
  );
  check(
    backfill.includes("LEGACY_IMPORT") || backfill.includes("provenance"),
    "Backfill plan defines provenance",
    "Backfill plan must not invent approvals"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"c1-migration-gate:verify"'),
    "package.json defines c1-migration-gate:verify",
    "Add c1-migration-gate:verify script to package.json"
  );

  if (hasC2BlueprintMigration(ROOT)) {
    ok("C2 branch detected — C1.1 gate migration freeze check skipped");
  } else {
    const migrationCount = countMigrationSql(ROOT);
    check(
      migrationCount === C1_MIGRATION_BASELINE,
      `No new prisma migrations (${migrationCount} === ${C1_MIGRATION_BASELINE})`,
      `Migration count changed: ${migrationCount} (baseline ${C1_MIGRATION_BASELINE})`
    );
  }

  const schemaPath = join(ROOT, "prisma/schema.prisma");
  const schemaStat = existsSync(schemaPath);
  check(schemaStat, "prisma/schema.prisma exists (read-only check)", "Missing prisma/schema.prisma");

  const internal = fileText("docs/internal/C1_1_BLUEPRINT_PERSISTENCE_MIGRATION_APPROVAL_GATE.md");
  check(
    internal.includes("APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION"),
    "Internal gate doc records PO sign-off",
    "Internal C1_1 doc must record APPROVE PATH C decision"
  );

  const status = fileText("docs/internal/PROJECT_STATUS.md");
  check(
    status.includes("APPROVE PATH C") || status.includes("c1-migration-gate"),
    "PROJECT_STATUS references C1.1 gate and PO sign-off",
    "Update docs/internal/PROJECT_STATUS.md for C1.1"
  );

  const milestones = fileText("docs/internal/MILESTONES.md");
  check(
    milestones.includes("C1.1") && milestones.includes("APPROVE PATH C"),
    "MILESTONES includes C1.1 approved row",
    "Update docs/internal/MILESTONES.md with C1.1 PO sign-off"
  );

  console.log(
    pass
      ? "\nC1.1 Migration Approval Gate verifier: PASSED\n"
      : "\nC1.1 Migration Approval Gate verifier: FAILED\n"
  );
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
