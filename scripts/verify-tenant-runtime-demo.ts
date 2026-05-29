/**
 * K1 — Tenant Runtime / CEM demo rehearsal guards.
 *
 *   npm run tenant-demo:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_PHRASES = [
  "pay now",
  "live checkout",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision tenant",
  "production go-live approved",
  "certified compliant",
  "autonomous validation",
  "ai-powered governance",
  "legally binding",
] as const;

const REQUIRED_FILES = [
  "docs/internal/K1_TENANT_RUNTIME_DEMO_REHEARSAL.md",
  "docs/internal/K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md",
  "docs/internal/K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md",
  "docs/internal/TENANT_RUNTIME_DEMO_RUNBOOK.md",
  "src/lib/constants/tenant-runtime-demo.ts",
  "src/components/tenant/tenant-runtime-demo-hint.tsx",
  "src/components/tenant/tenant-runtime-page-header.tsx",
  "scripts/verify-tenant-runtime-demo.ts",
] as const;

const K1_SURFACES = [
  "src/lib/constants/tenant-runtime-demo.ts",
  "src/components/tenant/tenant-runtime-demo-hint.tsx",
  "src/app/[tenant]/dashboard/page.tsx",
  "src/app/[tenant]/modules/page.tsx",
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

function scanForbidden(rel: string): string | null {
  const lower = fileText(rel).toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== K1 Tenant Runtime demo ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"tenant-demo:verify"'), "package.json defines tenant-demo:verify", "Add tenant-demo:verify");

  const constants = fileText("src/lib/constants/tenant-runtime-demo.ts");
  check(
    constants.includes("MEEM_TENANT_SLUG") || constants.includes("meem-global"),
    "Recommended tenant slug documented",
    "Missing MEEM tenant slug reference"
  );
  check(constants.includes("TENANT_RUNTIME_DEFINITION"), "Runtime definition constant", "Missing definition");

  const playbook = fileText("docs/internal/K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md");
  check(playbook.includes("/dashboard"), "Playbook references dashboard route", "Playbook missing dashboard");
  check(playbook.includes("cybercrow"), "Playbook references CyberCrow", "Playbook missing CyberCrow");
  check(playbook.includes("sarea"), "Playbook references SAREA", "Playbook missing SAREA");
  check(playbook.includes("Do not claim"), "Playbook has safe wording section", "Playbook missing disclaimers");

  const dashboard = fileText("src/app/[tenant]/dashboard/page.tsx");
  check(
    dashboard.includes("TenantRuntimeDemoHint") && dashboard.includes("Tenant Runtime / CEM"),
    "Dashboard uses K1 runtime framing",
    "Dashboard missing K1 components"
  );

  const modules = fileText("src/app/[tenant]/modules/page.tsx");
  check(
    modules.includes("TenantRuntimePageHeader"),
    "Modules page uses TenantRuntimePageHeader",
    "Modules missing K1 header"
  );

  for (const rel of K1_SURFACES) {
    const hit = scanForbidden(rel);
    check(!hit, `No forbidden phrase in ${rel}`, `Forbidden "${hit}" in ${rel}`);
  }

  const phaseDoc = fileText("docs/internal/K1_TENANT_RUNTIME_DEMO_REHEARSAL.md");
  check(phaseDoc.includes("PASSED") || phaseDoc.includes("K1 decision"), "K1 phase doc has decision section", "Missing decision");

  const milestones = fileText("docs/internal/MILESTONES.md");
  check(milestones.includes("K1"), "MILESTONES.md includes K1", "Update MILESTONES.md");

  console.log(passed ? "\nK1 tenant-demo: PASSED\n" : "\nK1 tenant-demo: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
