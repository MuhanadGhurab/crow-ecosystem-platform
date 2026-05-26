/**
 * G2 — HR module depth (read-only).
 *
 *   npm run hr:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  HR_FORBIDDEN_CLAIM_PHRASES,
  HR_RECOMMENDED_WORKFLOWS,
  HR_SAREA_PERSONAS,
  HR_SECTOR_WORKFORCE_NOTES,
} from "../src/lib/constants/hr-module-depth";

const ROOT = join(import.meta.dirname, "..");

const HR_FORBIDDEN_EXTRA = [
  "payroll engine",
  "salary processing",
  "full hrms",
  "automated compliance",
  "certified compliance",
  "hipaa certified",
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

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== G2 HR module depth ===\n");

  const hr = ERP_MODULE_CATALOG.find((e) => e.erpKey === "hr");
  check(Boolean(hr), "HR catalog entry exists", "missing HR in erp-module-catalog");
  if (!hr) {
    process.exit(1);
  }

  check(hr.hasTenantRoute === true, "HR has tenant route", "HR route flag");
  check(
    hr.dependencies.includes("users") &&
      hr.dependencies.includes("roles") &&
      hr.dependencies.includes("departments"),
    "HR dependencies include users/roles/departments",
    "HR dependencies incomplete"
  );
  check(
    hr.dependencies.includes("tasks") && hr.dependencies.includes("reports"),
    "HR dependencies include tasks and reports",
    "HR missing tasks/reports deps"
  );
  check(
    (hr.cyberCrowRisks?.length ?? 0) >= 2 && (hr.sareaExperienceHints?.length ?? 0) >= 2,
    "HR catalog has CyberCrow and SAREA hints",
    "HR catalog missing posture hints"
  );
  check(
    Object.keys(hr.sectorRelevance).length >= 5,
    "HR sector relevance covers modeled sectors",
    "HR sector relevance thin"
  );
  check(
    !hr.shortDescription.toLowerCase().includes("payroll processing"),
    "HR short description avoids payroll processing claim",
    "HR short description overclaims payroll"
  );

  check(
    HR_RECOMMENDED_WORKFLOWS.length >= 6,
    `HR recommended workflows (${HR_RECOMMENDED_WORKFLOWS.length})`,
    "HR workflow readiness list too short"
  );
  check(HR_SAREA_PERSONAS.length >= 5, "SAREA HR personas defined", "SAREA personas missing");
  check(
    HR_SECTOR_WORKFORCE_NOTES.length === 5,
    "sector workforce notes for 5 sectors",
    "sector notes count"
  );

  const hrPage = fileText("src/app/[tenant]/hr/page.tsx");
  check(
    hrPage.includes("HrWorkforceReadinessPanel") &&
      hrPage.includes("getHrWorkforceReadinessSnapshot"),
    "HR page uses readiness service and panel",
    "HR page missing G2 depth"
  );
  check(
    fileText("src/lib/services/hr-readiness.service.ts").includes("getHrWorkforceReadinessSnapshot"),
    "hr-readiness.service exported",
    "missing hr-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/hr/page.tsx",
    "src/components/tenant/hr/hr-workforce-readiness-panel.tsx",
    "src/components/tenant/hr/hr-org-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();
  const forbidden = [...HR_FORBIDDEN_CLAIM_PHRASES, ...HR_FORBIDDEN_EXTRA];
  for (const phrase of forbidden) {
    if (!userFacing.includes(phrase)) {
      ok(`user-facing copy avoids: ${phrase}`);
      continue;
    }
    const negated =
      userFacing.includes(`not ${phrase}`) ||
      userFacing.includes(`no ${phrase}`) ||
      userFacing.includes(`without ${phrase}`) ||
      (phrase === "full hrms" && userFacing.includes("enterprise hrms scope"));
    check(
      negated,
      `phrase "${phrase}" only appears negated in user-facing HR UI`,
      `forbidden HR claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/hr/hr-org-linkage-banner.tsx").includes("HrOrgLinkageBanner"),
    "HR org linkage banner component",
    "missing hr-org-linkage-banner"
  );

  console.log(passed ? "\nG2 hr:verify PASSED\n" : "\nG2 hr:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
