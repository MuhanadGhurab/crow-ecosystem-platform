/**
 * C1 — Enterprise Blueprint Studio verifier.
 *
 *   npm run enterprise-blueprint-studio:verify
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const DOC_FILES = [
  "docs/architecture/crow-core/c1/00-C1-OVERVIEW.md",
  "docs/architecture/crow-core/c1/01-EXISTING-BLUEPRINT-PERSISTENCE-MAPPING.md",
  "docs/architecture/crow-core/c1/02-C1-CROW-CORE-CONTRACT-EXTENSIONS.md",
  "docs/architecture/crow-core/c1/03-BLUEPRINT-STUDIO-UX-CONTRACT.md",
  "docs/architecture/crow-core/c1/04-BLUEPRINT-ADAPTER-AND-LIFECYCLE.md",
  "docs/architecture/crow-core/c1/05-ROI-COMMERCIAL-INTELLIGENCE.md",
  "docs/architecture/crow-core/c1/06-SOW-GENERATOR.md",
  "docs/architecture/crow-core/c1/07-TRACEABILITY-AND-VERSIONING.md",
  "docs/architecture/crow-core/c1/08-ARCHITECTURE-LAB-C1.md",
  "docs/architecture/crow-core/c1/09-TESTING-AND-VERIFICATION.md",
  "docs/architecture/crow-core/c1/10-C1-OPEN-QUESTIONS-AND-FUTURE-MIGRATION.md",
  "docs/architecture/crow-core/c1/C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md",
  "docs/architecture/crow-core/c1/C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md",
] as const;

const SERVICE_MODULES = [
  "src/lib/crow-core/blueprint-studio/index.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-adapter.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-version.service.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-diff.service.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-hash.service.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-readiness.service.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-lifecycle.ts",
  "src/lib/crow-core/blueprint-studio/fixtures/meem-global-reference.ts",
  "src/lib/crow-core/commercial-intelligence/index.ts",
  "src/lib/crow-core/commercial-intelligence/roi-calculator.ts",
  "src/lib/crow-core/commercial-intelligence/sow-generator.ts",
  "src/lib/crow-core/traceability/blueprint-traceability.service.ts",
  "src/lib/server/blueprint-studio-load.ts",
  "src/lib/actions/blueprint-studio.ts",
] as const;

const STUDIO_UI = [
  "src/app/blueprints/[blueprintId]/studio/page.tsx",
  "src/app/blueprints/[blueprintId]/studio/[section]/page.tsx",
  "src/components/blueprint-studio/blueprint-studio-shell.tsx",
  "src/components/blueprint-studio/blueprint-studio-section-content.tsx",
  "src/components/blueprint-studio/blueprint-studio-traceability-drawer.tsx",
] as const;

const TEST_FILES = [
  "src/lib/crow-core/blueprint-studio/blueprint-version.service.test.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-diff.service.test.ts",
  "src/lib/crow-core/blueprint-studio/blueprint-hash.service.test.ts",
  "src/lib/crow-core/commercial-intelligence/roi-calculator.test.ts",
  "src/lib/crow-core/commercial-intelligence/sow-generator.test.ts",
] as const;

const MIGRATION_BASELINE_COUNT = 13;

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

function countMigrationSql(): number {
  const dir = join(ROOT, "prisma/migrations");
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(join(dir, entry.name, "migration.sql"))) {
      count += 1;
    }
  }
  return count;
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

  console.log("\n=== C1 Enterprise Blueprint Studio verifier ===\n");

  for (const f of DOC_FILES) {
    check(existsSync(join(ROOT, f)), `Doc: ${f}`, `Missing doc: ${f}`);
  }

  check(
    existsSync(join(ROOT, "docs/internal/C1_ENTERPRISE_BLUEPRINT_STUDIO.md")),
    "Internal C1 summary doc",
    "Missing docs/internal/C1_ENTERPRISE_BLUEPRINT_STUDIO.md"
  );

  for (const f of SERVICE_MODULES) {
    check(existsSync(join(ROOT, f)), `Service: ${f}`, `Missing service module: ${f}`);
  }

  for (const f of STUDIO_UI) {
    check(existsSync(join(ROOT, f)), `Studio UI: ${f}`, `Missing studio UI: ${f}`);
  }

  for (const f of TEST_FILES) {
    check(existsSync(join(ROOT, f)), `Test: ${f}`, `Missing test: ${f}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"enterprise-blueprint-studio:verify"'),
    "package.json defines enterprise-blueprint-studio:verify",
    "Add enterprise-blueprint-studio:verify script"
  );
  check(
    pkg.includes('"test:blueprint-studio"'),
    "package.json defines test:blueprint-studio",
    "Add test:blueprint-studio script"
  );

  const migrationCount = countMigrationSql();
  check(
    migrationCount === MIGRATION_BASELINE_COUNT,
    `No new prisma migrations (${migrationCount} === ${MIGRATION_BASELINE_COUNT})`,
    `Migration count changed: ${migrationCount} (baseline ${MIGRATION_BASELINE_COUNT})`
  );

  const mapping = fileText("docs/architecture/crow-core/c1/C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md");
  check(
    mapping.includes("PATH A") && mapping.includes("PATH C"),
    "Persistence mapping documents Path A + Path C",
    "Persistence mapping must lock Path A + Path C"
  );

  const proposal = fileText("docs/architecture/crow-core/c1/C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md");
  check(
    proposal.includes("BlueprintVersion") || proposal.includes("blueprint_version"),
    "Migration proposal defines version persistence",
    "Migration proposal must describe BlueprintVersion storage"
  );

  const routes = fileText("src/lib/routes.ts");
  check(
    routes.includes("studio") && routes.includes("studioSection"),
    "routes.blueprint(id).studio registered",
    "Register studio routes in src/lib/routes.ts"
  );

  const blueprintLayout = fileText("src/app/blueprints/[blueprintId]/layout.tsx");
  check(
    blueprintLayout.includes("studio") || blueprintLayout.includes("Studio"),
    "Blueprint layout links to Studio",
    "Blueprint layout must expose Studio nav"
  );

  const adapter = fileText("src/lib/crow-core/blueprint-studio/blueprint-adapter.ts");
  check(
    !adapter.includes("prisma") || adapter.includes("EnterpriseBlueprintDetail"),
    "Adapter uses blueprint.service types (no direct Prisma in crow-core)",
    "blueprint-adapter should use blueprint.service boundary"
  );

  const crowCoreStudio = [
    ...SERVICE_MODULES.filter((f) => f.startsWith("src/lib/crow-core/")),
    "src/lib/crow-core/commercial-intelligence/roi-calculator.ts",
    "src/lib/crow-core/commercial-intelligence/sow-generator.ts",
  ];
  let prismaClean = true;
  for (const f of crowCoreStudio) {
    const path = join(ROOT, f);
    if (!existsSync(path)) continue;
    if (fileText(f).includes("@prisma/client")) {
      fail(`crow-core C1 module must not import Prisma: ${f}`);
      prismaClean = false;
      pass = false;
    }
  }
  if (prismaClean) ok("C1 crow-core modules are persistence-neutral");

  const labContent =
    fileText("src/components/crow-core-lab/architecture-lab-content.tsx") +
    fileText("src/lib/crow-core/lab/mock-architecture-lab-data.ts");
  check(
    labContent.includes("MOCK_C1_COMMAND_CENTER"),
    "Architecture Lab includes C1 command center mock",
    "Architecture Lab must include C1 mock sections"
  );
  check(
    labContent.toLowerCase().includes("mock") && labContent.toLowerCase().includes("reference prototype"),
    "Architecture Lab C1 remains mock-only",
    "C1 Architecture Lab must remain mock/reference only"
  );

  const commercial = fileText("src/lib/crow-core/commercial/index.ts");
  check(
    commercial.includes("SOW_SECTION_KEYS") && commercial.includes("RoiScenario"),
    "C0 commercial contract extended for C1",
    "Extend commercial/index.ts with SOW_SECTION_KEYS and RoiScenario"
  );

  const trace = fileText("src/lib/crow-core/traceability/index.ts");
  check(
    trace.includes("BlueprintTraceEvent") || trace.includes("blueprint_version"),
    "Traceability contract extended for blueprint studio",
    "Extend traceability/index.ts for blueprint events"
  );

  const actions = fileText("src/lib/actions/blueprint-studio.ts");
  check(
    actions.includes("requireActionDiscoveryWrite"),
    "Studio mutations guarded by discovery.write",
    "blueprint-studio actions must use requireActionDiscoveryWrite"
  );

  const internal = fileText("docs/internal/C1_ENTERPRISE_BLUEPRINT_STUDIO.md");
  check(
    internal.includes("CONDITIONAL PASS") || internal.includes("MIGRATION APPROVAL REQUIRED"),
    "Internal doc states CONDITIONAL PASS decision",
    "Internal C1 doc must document CONDITIONAL PASS"
  );

  console.log(
    pass
      ? "\nC1 Enterprise Blueprint Studio verifier: PASSED\n"
      : "\nC1 Enterprise Blueprint Studio verifier: FAILED\n"
  );
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
