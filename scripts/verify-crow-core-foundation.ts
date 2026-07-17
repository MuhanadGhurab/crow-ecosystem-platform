/**
 * C0 — Crow Core universal operating architecture foundation verifier.
 *
 *   npm run crow-core-foundation:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { countMigrationSql, expectedMigrationBaseline } from "./lib/migration-baseline";

const ROOT = join(import.meta.dirname, "..");

const DOC_FILES = [
  "docs/architecture/crow-core/00-CROW-CORE-OVERVIEW.md",
  "docs/architecture/crow-core/01-CROW-EXPERIENCE-SYSTEM.md",
  "docs/architecture/crow-core/02-ENTERPRISE-BLUEPRINT-COMMERCIAL-INTELLIGENCE.md",
  "docs/architecture/crow-core/03-SHARED-ENTERPRISE-ENTITY-MODEL.md",
  "docs/architecture/crow-core/04-UNIVERSAL-PROCESS-WORKFLOW-ENGINE.md",
  "docs/architecture/crow-core/05-APPROVAL-DECISION-SERVICE.md",
  "docs/architecture/crow-core/06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md",
  "docs/architecture/crow-core/07-SAREA-HUMAN-EXPERIENCE-ORCHESTRATION.md",
  "docs/architecture/crow-core/08-CYBERCROW-CONTROL-PLANE.md",
  "docs/architecture/crow-core/09-AI-CAPABILITY-FRAMEWORK.md",
  "docs/architecture/crow-core/10-TENANT-RESILIENCE-LOAD-MANAGEMENT.md",
  "docs/architecture/crow-core/11-INDUSTRY-DEPARTMENT-TEMPLATE-SYSTEM.md",
  "docs/architecture/crow-core/12-SAUDI-GOVERNMENT-INTEGRATION-LAYER.md",
  "docs/architecture/crow-core/13-CURRENT-TO-TARGET-TRANSITION-MAP.md",
  "docs/architecture/crow-core/14-ARCHITECTURE-DECISIONS-AND-OPEN-QUESTIONS.md",
] as const;

const CONTRACT_MODULES = [
  "src/lib/crow-core/index.ts",
  "src/lib/crow-core/README.md",
  "src/lib/crow-core/common.ts",
  "src/lib/crow-core/blueprint/index.ts",
  "src/lib/crow-core/commercial/index.ts",
  "src/lib/crow-core/entities/index.ts",
  "src/lib/crow-core/process/index.ts",
  "src/lib/crow-core/decision/index.ts",
  "src/lib/crow-core/traceability/index.ts",
  "src/lib/crow-core/security/index.ts",
  "src/lib/crow-core/sarea/index.ts",
  "src/lib/crow-core/ai/index.ts",
  "src/lib/crow-core/resilience/index.ts",
  "src/lib/crow-core/industries/index.ts",
  "src/lib/crow-core/integrations/index.ts",
  "src/lib/crow-core/lab/mock-architecture-lab-data.ts",
] as const;

const LAB_FILES = [
  "src/app/admin/architecture-lab/page.tsx",
  "src/components/crow-core-lab/architecture-lab-content.tsx",
] as const;

const CONSTITUTIONAL_PHRASES: { label: string; patterns: string[] }[] = [
  {
    label: "SAREA does not grant access",
    patterns: ["does not grant access", "never grants", "never grant", "does not grant permissions"],
  },
  {
    label: "Government identity ≠ Crow authorization",
    patterns: ["not Crow authorization", "does not grant", "identity assurance", "Nafath"],
  },
  {
    label: "Blueprint includes ROI and SOW",
    patterns: ["RoiModel", "SowDraft", "ROI", "SOW"],
  },
  {
    label: "Traceability chain documented",
    patterns: ["Traceability", "MaterialChange", "traceability"],
  },
  {
    label: "Universal process lifecycle (22 stages)",
    patterns: ["22", "ProcessLifecycleStage", "lifecycle stage"],
  },
  {
    label: "Security beyond CIA",
    patterns: ["Non-repudiation", "Least privilege", "Accountability", "15"],
  },
  {
    label: "Tenant resilience defined",
    patterns: ["TenantQuota", "AbuseSignal", "DegradationPolicy", "resilience"],
  },
];

const FORBIDDEN_OVERCLAIM = [
  "autonomous approval",
  "Nafath grants admin",
  "live government integration",
  "SIEM replacement",
  "autonomous SOC",
  "autonomous remediation",
  "SAREA grants access",
  "SAREA replaces RBAC",
  "invisible tenant change",
] as const;

const SECRET_PATTERNS = [/sk-[a-zA-Z0-9]{20,}/, /password\s*=\s*["'][^"']+["']/i] as const;

/** Baseline migration SQL count at C0 branch start (no new migrations in C0). */

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

  console.log("\n=== C0 Crow Core foundation verifier ===\n");

  for (const f of DOC_FILES) {
    check(existsSync(join(ROOT, f)), `Doc: ${f}`, `Missing doc: ${f}`);
  }

  check(
    existsSync(join(ROOT, "docs/internal/C0_UNIVERSAL_OPERATING_ARCHITECTURE_EXPERIENCE_FOUNDATION.md")),
    "Internal C0 summary doc",
    "Missing docs/internal/C0_UNIVERSAL_OPERATING_ARCHITECTURE_EXPERIENCE_FOUNDATION.md"
  );

  for (const f of CONTRACT_MODULES) {
    check(existsSync(join(ROOT, f)), `Contract: ${f}`, `Missing contract: ${f}`);
  }

  for (const f of LAB_FILES) {
    check(existsSync(join(ROOT, f)), `Architecture Lab: ${f}`, `Missing lab file: ${f}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"crow-core-foundation:verify"'),
    "package.json defines crow-core-foundation:verify",
    "Add crow-core-foundation:verify script to package.json"
  );

  const expectedMigrations = expectedMigrationBaseline(ROOT);
  const migrationCount = countMigrationSql(ROOT);
  check(
    migrationCount === expectedMigrations,
    `Prisma migration count (${migrationCount} === ${expectedMigrations})`,
    `Migration count changed: ${migrationCount} (expected ${expectedMigrations})`
  );

  const docCorpus = DOC_FILES.map((f) => fileText(f)).join("\n");
  const contractCorpus = CONTRACT_MODULES.map((f) => fileText(f)).join("\n");
  const corpus = docCorpus + contractCorpus + fileText("src/lib/crow-core/README.md");

  for (const rule of CONSTITUTIONAL_PHRASES) {
    const hit = rule.patterns.some((p) => corpus.toLowerCase().includes(p.toLowerCase()));
    check(hit, `Constitutional: ${rule.label}`, `Missing constitutional signal: ${rule.label}`);
  }

  const labContent =
    fileText("src/components/crow-core-lab/architecture-lab-content.tsx") +
    fileText("src/lib/crow-core/lab/mock-architecture-lab-data.ts");
  const labLower = labContent.toLowerCase();
  check(
    labLower.includes("reference prototype") && labLower.includes("mock data only"),
    "Architecture Lab labeled as reference prototype",
    "Architecture Lab must show reference prototype banner"
  );
  check(
    labContent.includes("isReferencePrototype") || labLower.includes("mock"),
    "Architecture Lab uses mock/reference data markers",
    "Architecture Lab must use mock data markers"
  );

  const adminLayout = fileText("src/app/admin/layout.tsx");
  check(
    adminLayout.includes("requirePlatformConsole"),
    "Admin layout requires platform console",
    "Admin layout must call requirePlatformConsole()"
  );

  const routes = fileText("src/lib/routes.ts");
  check(
    routes.includes("architectureLab") && routes.includes("/admin/architecture-lab"),
    "routes.admin.architectureLab registered",
    "Register architectureLab in src/lib/routes.ts"
  );

  const nav = fileText("src/lib/constants/procrow-admin-nav.ts");
  check(
    nav.includes("Architecture Lab") && nav.includes("routes.admin.architectureLab"),
    "ProCrow nav includes Architecture Lab",
    "Add Architecture Lab to PROCROW_ADMIN_NAV_GROUPS"
  );

  const OVERCLAIM_SCAN_EXCLUDE = new Set([
    "scripts/verify-crow-core-foundation.ts",
    "docs/architecture/crow-core/14-ARCHITECTURE-DECISIONS-AND-OPEN-QUESTIONS.md",
  ]);

  const overclaimScanFiles = [...DOC_FILES, ...CONTRACT_MODULES, ...LAB_FILES].filter(
    (f) => !OVERCLAIM_SCAN_EXCLUDE.has(f)
  );

  function lineHasAffirmativeOverclaim(line: string, phrase: string): boolean {
    const lower = line.toLowerCase();
    const phraseLower = phrase.toLowerCase();
    const idx = lower.indexOf(phraseLower);
    if (idx === -1) return false;
    const window = lower.slice(Math.max(0, idx - 96), idx);
    const negated =
      /\b(not|no|never|forbidden|without)\b/.test(window) ||
      /does not|is not|are not|must not|cannot|can't/.test(window) ||
      window.endsWith("—") ||
      window.endsWith("-");
    return !negated;
  }

  let overclaimClean = true;
  for (const phrase of FORBIDDEN_OVERCLAIM) {
    for (const f of overclaimScanFiles) {
      const path = join(ROOT, f);
      if (!existsSync(path)) continue;
      const lines = readFileSync(path, "utf8").split(/\r?\n/);
      for (const line of lines) {
        if (lineHasAffirmativeOverclaim(line, phrase)) {
          fail(`Forbidden overclaim "${phrase}" in ${f}: ${line.trim().slice(0, 120)}`);
          overclaimClean = false;
          pass = false;
        }
      }
    }
  }
  if (overclaimClean) ok("No forbidden overclaims in C0 deliverables");

  const secretScanFiles = [
    ...DOC_FILES,
    ...CONTRACT_MODULES,
    ...LAB_FILES,
    "scripts/verify-crow-core-foundation.ts",
  ];
  let secretsClean = true;
  for (const f of secretScanFiles) {
    const path = join(ROOT, f);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf8");
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        fail(`Possible secret pattern in ${f}`);
        secretsClean = false;
        pass = false;
      }
    }
  }
  if (secretsClean) ok("No raw secret patterns in C0 deliverables");

  const crowCoreIndex = fileText("src/lib/crow-core/index.ts");
  check(!crowCoreIndex.includes("@prisma/client"), "crow-core has no Prisma imports", "crow-core must stay persistence-neutral");

  console.log(pass ? "\nC0 foundation verifier: PASSED\n" : "\nC0 foundation verifier: FAILED\n");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
