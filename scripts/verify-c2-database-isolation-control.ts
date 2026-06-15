/**
 * C2.2 — Database isolation and controlled migration delivery verifier.
 *
 *   npm run c2-database-isolation:verify
 *
 * Static checks only. Does not connect to hosted databases.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CONTROLLED_MIGRATION_PHRASES } from "./lib/database-environment";

const ROOT = join(import.meta.dirname, "..");

const C22_DOCS = [
  "docs/architecture/crow-core/c2/C2_2_DATABASE_ENVIRONMENT_ISOLATION.md",
  "docs/architecture/crow-core/c2/C2_2_CONTROLLED_MIGRATION_DELIVERY.md",
  "docs/architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md",
  "docs/architecture/crow-core/c2/C2_2_SHARED_DATABASE_INCIDENT_RECORD.md",
  "docs/architecture/crow-core/c2/C2_2_LEGACY_BLUEPRINT_OWNERSHIP_RESOLUTION.md",
  "docs/architecture/crow-core/c2/C2_2_CI_MIGRATION_HYGIENE.md",
  "docs/internal/C2_2_DATABASE_ISOLATION_MIGRATION_CONTROL.md",
] as const;

const FORBIDDEN_BUILD_PATTERNS = [
  "db:migrate:deploy",
  "db push",
  "migrate resolve",
  "backfill-blueprint-persistence",
  "--apply",
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

  console.log("\n=== C2.2 Database isolation & migration control verifier ===\n");

  for (const doc of C22_DOCS) {
    check(existsSync(join(ROOT, doc)), `Doc present: ${doc}`, `Missing doc: ${doc}`);
  }

  const vercel = fileText("vercel.json");
  for (const pattern of FORBIDDEN_BUILD_PATTERNS) {
    check(
      !vercel.includes(pattern),
      `vercel.json buildCommand excludes ${pattern}`,
      `vercel.json must not include ${pattern} in buildCommand`
    );
  }
  check(
    vercel.includes("db:generate") && vercel.includes("build"),
    "vercel.json retains generate + build",
    "vercel.json buildCommand must run db:generate and build"
  );

  const simulate = fileText("scripts/simulate-vercel-build.mjs");
  check(
    !simulate.includes("migrate deploy") && !simulate.includes("db push"),
    "simulate-vercel-build.mjs aligned (no migrate deploy)",
    "simulate-vercel-build.mjs must not run migrate deploy"
  );

  check(
    existsSync(join(ROOT, "scripts/run-controlled-migration.ts")),
    "Controlled migration script present",
    "Missing scripts/run-controlled-migration.ts"
  );

  const controlledSrc = fileText("scripts/run-controlled-migration.ts");
  check(
    controlledSrc.includes("--check-only"),
    "Controlled migration supports --check-only",
    "Controlled migration must support --check-only"
  );
  check(
    controlledSrc.includes(CONTROLLED_MIGRATION_PHRASES.preview) &&
      controlledSrc.includes(CONTROLLED_MIGRATION_PHRASES.production),
    "Distinct confirmation phrases documented in wrapper",
    "Controlled migration must document preview and production phrases"
  );
  check(
    controlledSrc.includes("EXPECTED_DATABASE_FINGERPRINT"),
    "Controlled migration requires fingerprint",
    "Controlled migration must check EXPECTED_DATABASE_FINGERPRINT"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"db:migrate:controlled"') && pkg.includes('"c2-database-isolation:verify"'),
    "package.json wires controlled migration + verifier",
    "package.json must define db:migrate:controlled and c2-database-isolation:verify"
  );

  check(
    existsSync(join(ROOT, "scripts/lib/database-environment.ts")),
    "database-environment module present",
    "Missing scripts/lib/database-environment.ts"
  );
  check(
    existsSync(join(ROOT, "src/lib/crow-core/database-environment.ts")),
    "Runtime database-environment re-export present",
    "Missing src/lib/crow-core/database-environment.ts"
  );

  const guard = fileText("src/lib/auth/blueprint-action-guard.ts");
  check(
    guard.includes("assertC2DatabaseEnvironmentSafe"),
    "blueprint-action-guard invokes C2 database guard for mutations",
    "blueprint-action-guard must call assertC2DatabaseEnvironmentSafe"
  );

  const mutationGuard = fileText("src/lib/crow-core/c2-database-mutation-guard.ts");
  check(
    mutationGuard.includes("enterprise_blueprint_versions"),
    "C2 mutation guard detects C2 tables",
    "C2 mutation guard must check enterprise_blueprint_versions"
  );

  const workflowPath = join(ROOT, ".github/workflows/database-migrate.yml");
  check(existsSync(workflowPath), "database-migrate workflow present", "Missing database-migrate.yml");
  if (existsSync(workflowPath)) {
    const workflow = fileText(".github/workflows/database-migrate.yml");
    check(
      workflow.includes("workflow_dispatch"),
      "Workflow is workflow_dispatch only",
      "database-migrate.yml must use workflow_dispatch"
    );
    check(
      !workflow.includes("push:") && !workflow.includes("pull_request:"),
      "Workflow has no push/PR triggers",
      "database-migrate.yml must not trigger on push or pull_request"
    );
    check(
      !workflow.toLowerCase().includes("echo ${{ secrets"),
      "Workflow does not echo secrets",
      "database-migrate.yml must not echo secrets"
    );
  }

  const gateDoc = fileText("docs/internal/C2_2_DATABASE_ISOLATION_MIGRATION_CONTROL.md");
  check(
    gateDoc.includes("CONDITIONAL PASS") && gateDoc.includes("EXTERNAL ISOLATION PENDING"),
    "Gate doc records C2.2 conditional decision strings",
    "Gate doc must document CONDITIONAL PASS decision"
  );

  const gitignore = fileText(".gitignore");
  check(
    gitignore.includes(".c22-legacy-blueprint-ownership.local.json"),
    ".gitignore excludes local ownership worksheet",
    ".gitignore must exclude .c22-legacy-blueprint-ownership.local.json"
  );

  check(
    !existsSync(join(ROOT, "prisma/migrations/20260614130000")),
    "No new Prisma migration directory added",
    "C2.2 must not add new prisma migrations"
  );

  const migrateDeploy = fileText("scripts/migrate-deploy.mjs");
  check(
    migrateDeploy.includes("controlled") || migrateDeploy.includes("Vercel build"),
    "migrate-deploy.mjs documents non-build usage",
    "migrate-deploy.mjs should note it is not used from Vercel build"
  );

  check(
    existsSync(join(ROOT, "scripts/lib/database-fingerprint.test.ts")),
    "Fingerprint unit test present",
    "Missing database-fingerprint.test.ts"
  );

  console.log(
    pass
      ? "\nC2.2 database isolation verifier: PASS\n"
      : "\nC2.2 database isolation verifier: FAIL\n"
  );
  process.exit(pass ? 0 : 1);
}

main();
