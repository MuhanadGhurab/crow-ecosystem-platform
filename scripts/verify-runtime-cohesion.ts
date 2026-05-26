/**
 * G10 — Cross-module runtime cohesion (read-only).
 *
 *   npm run runtime:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { COHESION_CHAINS, RUNTIME_COHESION_FORBIDDEN_CLAIM_PHRASES } from "../src/lib/constants/cross-module-cohesion";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import { EXECUTIVE_ROLLUP_CATEGORIES, type ExecutiveRollupCategoryId } from "../src/lib/constants/reports-bi-readiness-depth";

const ROOT = join(import.meta.dirname, "..");

const EXPECTED_CHAIN_KEYS = [
  "commercial",
  "supply_chain",
  "workforce",
  "control",
  "experience",
  "trust",
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

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

function hasPositiveForbiddenClaim(text: string, phrase: string): boolean {
  const lower = text.toLowerCase();
  const p = phrase.toLowerCase();
  let idx = 0;
  while ((idx = lower.indexOf(p, idx)) !== -1) {
    const before = lower.slice(Math.max(0, idx - 80), idx).replace(/\s+/g, " ");
    if (/\b(not|no|without|nor)(\s+\S+){0,4}\s*$/i.test(before)) {
      idx += p.length;
      continue;
    }
    if (/\bor\s+$/.test(before.slice(-4))) {
      idx += p.length;
      continue;
    }
    return true;
  }
  return false;
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

  console.log("\n=== G10 Runtime cohesion ===\n");

  const cemKeys = new Set(ERP_MODULE_CATALOG.map((e) => e.cemModuleKey));
  const rollupIds = new Set(EXECUTIVE_ROLLUP_CATEGORIES.map((c) => c.id));

  check(COHESION_CHAINS.length === 6, "Six cohesion chains defined", "COHESION_CHAINS length != 6");

  const keys = COHESION_CHAINS.map((c) => c.key);
  for (const k of EXPECTED_CHAIN_KEYS) {
    check(keys.includes(k), `Chain key present: ${k}`, `Missing chain key ${k}`);
  }

  for (const chain of COHESION_CHAINS) {
    for (const mk of chain.cemKeysForCoverage) {
      if (mk === "sarea") continue;
      check(
        cemKeys.has(mk),
        `Chain "${chain.key}" cem key valid: ${mk}`,
        `Chain "${chain.key}" references unknown cemModuleKey: ${mk}`
      );
    }
    for (const rid of chain.relatedRollupIds) {
      check(
        rollupIds.has(rid as ExecutiveRollupCategoryId),
        `Chain "${chain.key}" rollup id valid: ${rid}`,
        `Chain "${chain.key}" references unknown rollup: ${rid}`
      );
    }
    check(chain.requiredHandoffs.length > 0, `Chain "${chain.key}" has handoffs`, `Chain "${chain.key}" handoffs empty`);
  }

  const cohesionPath = "src/lib/constants/cross-module-cohesion.ts";
  check(fileExists(cohesionPath), `${cohesionPath} exists`, "cross-module-cohesion constants missing");

  const servicePath = "src/lib/services/runtime-cohesion.service.ts";
  const serviceSrc = fileText(servicePath);
  check(serviceSrc.includes("getRuntimeCohesionSnapshot"), `${servicePath} exports snapshot`, "runtime-cohesion.service incomplete");

  const panelPath = "src/components/tenant/runtime-cohesion-panel.tsx";
  check(fileText(panelPath).includes("RuntimeCohesionPanel"), `${panelPath} exists`, "runtime cohesion panel missing");

  const modulesSection = "src/components/tenant/tenant-modules-runtime-cohesion-section.tsx";
  check(
    fileText(modulesSection).includes("TenantModulesRuntimeCohesionSection"),
    `${modulesSection} exists`,
    "modules cohesion section missing"
  );

  const adminSummary = "src/components/admin/admin-runtime-cohesion-summary.tsx";
  check(
    fileText(adminSummary).includes("AdminRuntimeCohesionSummary"),
    `${adminSummary} exists`,
    "admin cohesion summary missing"
  );

  const dash = fileText("src/app/[tenant]/dashboard/page.tsx");
  check(
    dash.includes("RuntimeCohesionPanel") && dash.includes("getRuntimeCohesionSnapshot"),
    "Dashboard wires cohesion panel + service",
    "Dashboard missing G10 wiring"
  );

  const modulesPage = fileText("src/app/[tenant]/modules/page.tsx");
  check(
    modulesPage.includes("TenantModulesRuntimeCohesionSection") && modulesPage.includes("getRuntimeCohesionSnapshot"),
    "Modules page wires cohesion section",
    "Modules page missing G10 wiring"
  );

  const adminTenant = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  check(
    adminTenant.includes("AdminRuntimeCohesionSummary") && adminTenant.includes("getRuntimeCohesionSnapshot"),
    "Admin tenant overview wires cohesion summary",
    "Admin tenant page missing G10 wiring"
  );

  check(
    serviceSrc.includes("getReportsBiReadinessSnapshot"),
    "Runtime cohesion reuses G9 BI snapshot (no duplicate scoring)",
    "Service should aggregate via reports-bi-readiness"
  );

  const forbiddenLower = RUNTIME_COHESION_FORBIDDEN_CLAIM_PHRASES.map((p) => p.toLowerCase());
  const adminTenantSrc = fileText("src/app/admin/tenants/[tenantId]/page.tsx").slice(0, 8000);
  const userFacingBundle = [
    fileText(panelPath),
    fileText(modulesSection),
    fileText(adminSummary),
    dash.slice(0, 12000),
    adminTenantSrc,
  ]
    .join("\n")
    .replace(/\s+/g, " ");
  // Do not scan cross-module-cohesion.ts: it lists forbidden phrases for this check.

  for (const phrase of forbiddenLower) {
    check(
      !hasPositiveForbiddenClaim(userFacingBundle, phrase),
      `No positive forbidden claim: "${phrase}"`,
      `Possible overclaim: "${phrase}"`
    );
  }

  const docPath = "docs/internal/G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md";
  try {
    const doc = fileText(docPath);
    check(doc.includes("G10"), `${docPath} documents G10`, "G10 doc missing title");
    check(
      doc.toLowerCase().includes("cybercrow") && doc.toLowerCase().includes("sarea"),
      `${docPath} covers CyberCrow and SAREA posture`,
      "G10 doc missing posture sections"
    );
  } catch {
    fail(`${docPath} not found — create before marking G10 passed`);
    passed = false;
  }

  console.log(passed ? "\nG10 runtime cohesion verify: PASSED\n" : "\nG10 runtime cohesion verify: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
