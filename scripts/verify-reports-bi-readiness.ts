/**
 * G9 — Reports / BI readiness layer (read-only).
 *
 *   npm run reports:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  EXECUTIVE_ROLLUP_CATEGORIES,
  REPORTS_BI_FORBIDDEN_CLAIM_PHRASES,
  REPORTS_BI_RECOMMENDED_WORKFLOWS,
  REPORTS_BI_SAREA_PERSONAS,
  REPORTS_BI_SECTOR_NOTES,
} from "../src/lib/constants/reports-bi-readiness-depth";

const ROOT = join(import.meta.dirname, "..");

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

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== G9 Reports / BI readiness ===\n");

  const reportsEntry = ERP_MODULE_CATALOG.find((e) => e.erpKey === "reports");

  check(Boolean(reportsEntry), "Reports / BI catalog entry exists", "missing reports in catalog");

  if (reportsEntry) {
    check(
      reportsEntry.dependencies.includes("hr") &&
        reportsEntry.dependencies.includes("finance") &&
        reportsEntry.dependencies.includes("procurement") &&
        reportsEntry.dependencies.includes("logistics") &&
        reportsEntry.dependencies.includes("tasks") &&
        reportsEntry.dependencies.includes("cybercrow"),
      "Reports dependencies span G2–G8 modules, tasks, and CyberCrow",
      "Reports dependencies incomplete"
    );
    check(
      (reportsEntry.cyberCrowRisks?.length ?? 0) >= 3 &&
        (reportsEntry.sareaExperienceHints?.length ?? 0) >= 3,
      "Reports catalog has CyberCrow and SAREA hints",
      "Reports catalog missing posture hints"
    );
    check(
      (reportsEntry.futureOnlyCapabilities?.length ?? 0) >= 6,
      "Reports catalog lists future-only capabilities (no warehouse/AI claims)",
      "Reports futureOnlyCapabilities thin"
    );
  }

  check(
    EXECUTIVE_ROLLUP_CATEGORIES.length >= 9,
    "Executive rollup categories defined",
    "EXECUTIVE_ROLLUP_CATEGORIES too small"
  );

  const rollupIds = EXECUTIVE_ROLLUP_CATEGORIES.map((c) => c.id);
  check(
    rollupIds.includes("cybercrow") && rollupIds.includes("sarea"),
    "Executive rollup includes CyberCrow and SAREA",
    "Missing CyberCrow or SAREA rollup"
  );

  check(
    REPORTS_BI_RECOMMENDED_WORKFLOWS.length >= 8,
    "Recommended report workflows defined",
    "REPORTS_BI_RECOMMENDED_WORKFLOWS thin"
  );
  check(
    REPORTS_BI_SAREA_PERSONAS.length >= 4,
    "SAREA reporting personas defined",
    "SAREA personas thin"
  );
  check(
    REPORTS_BI_SECTOR_NOTES.length >= 5,
    "Sector notes for reports/BI",
    "Sector notes thin"
  );

  const constantsPath = "src/lib/constants/reports-bi-readiness-depth.ts";
  check(
    fileText(constantsPath).includes("EXECUTIVE_ROLLUP_CATEGORIES"),
    `${constantsPath} exists`,
    "reports-bi-readiness-depth constants missing"
  );

  const servicePath = "src/lib/services/reports-bi-readiness.service.ts";
  check(
    fileText(servicePath).includes("getReportsBiReadinessSnapshot"),
    `${servicePath} exports snapshot`,
    "reports-bi-readiness.service missing"
  );

  const panelPath = "src/components/tenant/reports/reports-bi-operations-readiness-panel.tsx";
  check(
    fileText(panelPath).includes("ReportsBiOperationsReadinessPanel"),
    `${panelPath} exists`,
    "readiness panel missing"
  );

  const reportsPage = fileText("src/app/[tenant]/reports/page.tsx");
  check(
    reportsPage.includes("ReportsBiOperationsReadinessPanel") &&
      reportsPage.includes("getReportsBiReadinessSnapshot"),
    "Reports page wires G9 readiness",
    "Reports page missing G9 panel"
  );

  check(
    reportsPage.includes("Executive roll-up") || fileText(panelPath).includes("Executive roll-up"),
    "Executive rollup section present",
    "Executive rollup section missing"
  );

  check(
    fileText(panelPath).includes("CyberCrow reporting posture"),
    "CyberCrow reporting posture section",
    "CyberCrow posture section missing"
  );

  check(
    fileText(panelPath).includes("SAREA experience posture"),
    "SAREA reporting posture section",
    "SAREA posture section missing"
  );

  const forbiddenLower = REPORTS_BI_FORBIDDEN_CLAIM_PHRASES.map((p) => p.toLowerCase());
  const userFacingBundle = [reportsPage, fileText(panelPath)].join("\n").replace(/\s+/g, " ");
  const catalogPurpose = (reportsEntry?.businessPurpose ?? "").replace(/\s+/g, " ");

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

  for (const phrase of forbiddenLower) {
    check(
      !hasPositiveForbiddenClaim(userFacingBundle, phrase) &&
        !hasPositiveForbiddenClaim(catalogPurpose, phrase),
      `No positive forbidden claim: "${phrase}"`,
      `Possible overclaim: "${phrase}"`
    );
  }

  const docPath = "docs/internal/G9_REPORTS_BI_READINESS_LAYER.md";
  try {
    const doc = fileText(docPath);
    check(doc.includes("G9"), `${docPath} documents G9`, "G9 doc missing title");
    check(doc.includes("audit"), `${docPath} includes audit`, "G9 doc missing audit section");
  } catch {
    fail(`${docPath} not found — create before marking G9 passed`);
    passed = false;
  }

  console.log(passed ? "\nG9 reports-bi verify: PASSED\n" : "\nG9 reports-bi verify: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
