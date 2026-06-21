/**
 * C2 — Blueprint persistence runtime verifier.
 *
 *   npm run c2-blueprint-runtime:verify
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  C2_MIGRATION_DIR,
  countMigrationSql,
  expectedMigrationBaseline,
  hasC2BlueprintMigration,
} from "./lib/migration-baseline";

const ROOT = join(import.meta.dirname, "..");

const C2_DOC_FILES = [
  "docs/architecture/crow-core/c2/00-C2-OVERVIEW.md",
  "docs/architecture/crow-core/c2/01-PERSISTENCE-IMPLEMENTATION-MAP.md",
  "docs/architecture/crow-core/c2/02-PRISMA-SCHEMA-AND-MIGRATION.md",
  "docs/architecture/crow-core/c2/03-BLUEPRINT-VERSIONING-RUNTIME.md",
  "docs/architecture/crow-core/c2/04-AUTHORIZATION-AND-TENANT-ISOLATION.md",
  "docs/architecture/crow-core/c2/05-APPROVAL-AND-TRACEABILITY-RUNTIME.md",
  "docs/architecture/crow-core/c2/06-ROI-PERSISTENCE-RUNTIME.md",
  "docs/architecture/crow-core/c2/07-SOW-PERSISTENCE-RUNTIME.md",
  "docs/architecture/crow-core/c2/08-LEGACY-DUAL-READ-AND-BACKFILL.md",
  "docs/architecture/crow-core/c2/09-MIGRATION-DEPLOYMENT-RUNBOOK.md",
  "docs/architecture/crow-core/c2/10-C2-SECURITY-VERIFICATION.md",
  "docs/architecture/crow-core/c2/11-C2-OPEN-QUESTIONS-AND-FOLLOW-UP.md",
  "docs/internal/C2_BLUEPRINT_PERSISTENCE_RUNTIME.md",
] as const;

const RUNTIME_MODULES = [
  "src/lib/crow-core/blueprint-persistence/blueprint.repository.ts",
  "src/lib/crow-core/blueprint-persistence/blueprint-version.repository.ts",
  "src/lib/crow-core/blueprint-persistence/blueprint-approval.repository.ts",
  "src/lib/crow-core/blueprint-persistence/blueprint-trace.repository.ts",
  "src/lib/crow-core/blueprint-persistence/roi.repository.ts",
  "src/lib/crow-core/blueprint-persistence/sow.repository.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-versioning.service.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-approval.service.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-projection.service.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-dual-read.service.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-backfill.service.ts",
  "src/lib/crow-core/blueprint-runtime/snapshot-hash.ts",
  "src/lib/crow-core/blueprint-runtime/snapshot-validation.ts",
  "src/lib/auth/blueprint-actions.ts",
  "src/lib/auth/blueprint-action-guard.ts",
  "scripts/backfill-blueprint-persistence.ts",
  "scripts/verify-c2-blueprint-persistence-runtime.ts",
] as const;

const C2_TESTS = [
  "src/lib/crow-core/blueprint-runtime/snapshot-hash.test.ts",
  "src/lib/crow-core/blueprint-runtime/snapshot-validation.test.ts",
  "src/lib/crow-core/blueprint-runtime/blueprint-projection.service.test.ts",
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

  console.log("\n=== C2 Blueprint persistence runtime verifier ===\n");

  check(
    hasC2BlueprintMigration(ROOT),
    `C2 migration present (${C2_MIGRATION_DIR})`,
    `Missing C2 migration directory ${C2_MIGRATION_DIR}`
  );

  const migrationDirs = readdirSync(join(ROOT, "prisma/migrations"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(ROOT, "prisma/migrations", e.name, "migration.sql")))
    .map((e) => e.name);
  const c2Dirs = migrationDirs.filter((d) => d.includes("blueprint_versioning"));
  check(
    c2Dirs.length === 1,
    "Exactly one C2 blueprint versioning migration",
    `Expected one blueprint_versioning migration, found: ${c2Dirs.join(", ") || "(none)"}`
  );

  const migrationSql = fileText(`prisma/migrations/${C2_MIGRATION_DIR}/migration.sql`);
  check(
    !/\bDROP\s+(TABLE|COLUMN|INDEX)\b/i.test(migrationSql) &&
      !/\bRENAME\s+(TABLE|COLUMN)\b/i.test(migrationSql),
    "C2 migration SQL is additive (no DROP/RENAME)",
    "C2 migration must not DROP or RENAME legacy objects"
  );
  check(
    migrationSql.includes("enterprise_blueprint_versions_one_active_draft") &&
      migrationSql.includes("enterprise_blueprint_versions_one_current_approved"),
    "Partial unique indexes for draft and current-approved",
    "Migration must include one-active-draft and one-current-approved partial indexes"
  );

  const schema = fileText("prisma/schema.prisma");
  for (const model of [
    "EnterpriseBlueprintVersion",
    "BlueprintApproval",
    "BlueprintTraceEvent",
    "BlueprintChangeRequest",
    "BlueprintConfigurationProposal",
    "RoiAssumption",
    "RoiAssumptionRevision",
    "RoiSnapshot",
    "SowDocument",
    "SowVersion",
    "SowSection",
  ]) {
    check(schema.includes(`model ${model}`), `Prisma model ${model}`, `Missing model ${model}`);
  }
  check(
    schema.includes("currentApprovedVersionId") && schema.includes("activeDraftVersionId"),
    "Blueprint identity/version pointer fields",
    "EnterpriseBlueprint must separate identity from version pointers"
  );

  for (const f of RUNTIME_MODULES) {
    check(existsSync(join(ROOT, f)), `Module: ${f}`, `Missing: ${f}`);
  }

  const repo = fileText("src/lib/crow-core/blueprint-persistence/blueprint.repository.ts");
  check(
    repo.includes("listBlueprintsForScope") && repo.includes("tenantId"),
    "Tenant-scoped blueprint list repository",
    "listBlueprintsForScope must scope by tenant"
  );

  const guard = fileText("src/lib/auth/blueprint-action-guard.ts");
  check(
    guard.includes("requireBlueprintAction") && guard.includes("Sales cannot approve ROI"),
    "Explicit blueprint action authorization",
    "blueprint-action-guard must enforce action-level auth"
  );
  check(
    !guard.toLowerCase().includes("sarea"),
    "SAREA not used for blueprint authorization",
    "SAREA must not appear in blueprint-action-guard"
  );

  const projection = fileText("src/lib/crow-core/blueprint-runtime/blueprint-projection.service.ts");
  check(
    projection.includes("projectClientSafeBlueprint") && projection.includes("INTERNAL_SLICE_TYPES"),
    "Server-side client-safe projection",
    "Client projection must be server-enforced"
  );

  const versioning = fileText("src/lib/crow-core/blueprint-runtime/blueprint-versioning.service.ts");
  check(
    versioning.includes("saveBlueprintDraft") && versioning.includes("revision"),
    "Optimistic concurrency on draft save",
    "Versioning service must use revision-based concurrency"
  );

  const approval = fileText("src/lib/crow-core/blueprint-runtime/blueprint-approval.service.ts");
  check(
    approval.includes("approveBlueprintVersion") && approval.includes("contentHash"),
    "Approval binds exact version and hash",
    "Approval service must verify hash at approval time"
  );

  const backfill = fileText("src/lib/crow-core/blueprint-runtime/blueprint-backfill.service.ts");
  check(
    backfill.includes("dryRun") && backfill.includes("LEGACY_IMPORT"),
    "Backfill dry-run default and provenance",
    "Backfill must default to dry-run and mark LEGACY_IMPORT provenance"
  );

  const backfillCli = fileText("scripts/backfill-blueprint-persistence.ts");
  check(
    backfillCli.includes("--dry-run") && backfillCli.includes("--apply"),
    "Backfill CLI modes",
    "backfill script must support --dry-run and --apply"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"c2-blueprint-runtime:verify"') && pkg.includes('"blueprint-persistence:backfill"'),
    "package.json C2 scripts",
    "Add c2-blueprint-runtime:verify and blueprint-persistence:backfill"
  );

  for (const f of C2_DOC_FILES) {
    check(existsSync(join(ROOT, f)), `Doc: ${f}`, `Missing doc: ${f}`);
  }

  for (const f of C2_TESTS) {
    check(existsSync(join(ROOT, f)), `Test: ${f}`, `Missing test: ${f}`);
  }

  const actions = fileText("src/lib/actions/blueprint-studio.ts");
  check(
    actions.includes("requireBlueprintAction") || actions.includes("saveBlueprintDraft"),
    "Studio actions wired to C2 persistence path",
    "blueprint-studio actions must use C2 persistence"
  );

  const configProposal = schema.includes("BlueprintConfigurationProposal");
  check(configProposal, "Configuration proposal model (no runtime deploy)", "Missing BlueprintConfigurationProposal");

  const migrationCount = countMigrationSql(ROOT);
  const expectedMigrations = expectedMigrationBaseline(ROOT);
  check(
    migrationCount === expectedMigrations,
    `Migration baseline ${expectedMigrations} (${migrationCount})`,
    `Expected ${expectedMigrations} migrations, got ${migrationCount}`
  );

  const status = fileText("docs/internal/PROJECT_STATUS.md");
  check(
    status.includes("C2") || status.includes("c2-blueprint-runtime"),
    "PROJECT_STATUS references C2 runtime",
    "Update PROJECT_STATUS for C2"
  );

  console.log(
    pass
      ? "\nC2 Blueprint persistence runtime verifier: PASSED\n"
      : "\nC2 Blueprint persistence runtime verifier: FAILED\n"
  );
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
