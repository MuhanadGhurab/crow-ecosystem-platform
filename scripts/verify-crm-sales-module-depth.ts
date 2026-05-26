/**
 * G4 — CRM + Sales module depth (read-only).
 *
 *   npm run crm-sales:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  CRM_RECOMMENDED_WORKFLOWS,
  CRM_SALES_FORBIDDEN_CLAIM_PHRASES,
  CRM_SAREA_PERSONAS,
  CRM_SECTOR_NOTES,
  SALES_RECOMMENDED_WORKFLOWS,
  SALES_SAREA_PERSONAS,
  SALES_SECTOR_NOTES,
} from "../src/lib/constants/crm-sales-module-depth";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_EXTRA = [
  "payment gateway activated",
  "stripe checkout enabled",
  "sales force automation",
  "revenue automation",
  "external crm sync",
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

  console.log("\n=== G4 CRM + Sales module depth ===\n");

  const crm = ERP_MODULE_CATALOG.find((e) => e.erpKey === "crm");
  const sales = ERP_MODULE_CATALOG.find((e) => e.erpKey === "sales");
  check(Boolean(crm), "CRM catalog entry exists", "missing crm in erp-module-catalog");
  check(Boolean(sales), "Sales catalog entry exists", "missing sales in erp-module-catalog");
  if (!crm || !sales) {
    process.exit(1);
  }

  check(crm.hasTenantRoute === true, "CRM has tenant route", "CRM route flag");
  check(sales.hasTenantRoute === true, "Sales has tenant route", "Sales route flag");

  check(
    crm.dependencies.includes("finance") &&
      crm.dependencies.includes("tasks") &&
      crm.dependencies.includes("reports") &&
      crm.dependencies.includes("cybercrow"),
    "CRM dependencies include finance/tasks/reports/cybercrow",
    "CRM dependencies incomplete"
  );
  check(
    sales.dependencies.includes("crm") &&
      sales.dependencies.includes("finance") &&
      sales.dependencies.includes("tasks") &&
      sales.dependencies.includes("reports"),
    "Sales dependencies include crm/finance/tasks/reports",
    "Sales dependencies incomplete"
  );

  check(
    (crm.cyberCrowRisks?.length ?? 0) >= 4 && (crm.sareaExperienceHints?.length ?? 0) >= 3,
    "CRM catalog has CyberCrow and SAREA hints",
    "CRM catalog missing posture hints"
  );
  check(
    (sales.cyberCrowRisks?.length ?? 0) >= 4 && (sales.sareaExperienceHints?.length ?? 0) >= 3,
    "Sales catalog has CyberCrow and SAREA hints",
    "Sales catalog missing posture hints"
  );
  check(
    Object.keys(crm.sectorRelevance).length >= 5 && Object.keys(sales.sectorRelevance).length >= 5,
    "CRM/Sales sector relevance covers modeled sectors",
    "sector relevance thin"
  );
  check(
    (crm.futureOnlyCapabilities?.length ?? 0) >= 4 && (sales.futureOnlyCapabilities?.length ?? 0) >= 4,
    "CRM/Sales future-only capabilities documented",
    "missing future-only guardrails"
  );
  check(
    !crm.shortDescription.toLowerCase().includes("full crm") ||
      crm.shortDescription.toLowerCase().includes("not a full"),
    "CRM short description avoids unqualified full CRM claim",
    "CRM short description overclaims"
  );

  check(
    CRM_RECOMMENDED_WORKFLOWS.length >= 6,
    `CRM recommended workflows (${CRM_RECOMMENDED_WORKFLOWS.length})`,
    "CRM workflow readiness list too short"
  );
  check(
    SALES_RECOMMENDED_WORKFLOWS.length >= 6,
    `Sales recommended workflows (${SALES_RECOMMENDED_WORKFLOWS.length})`,
    "Sales workflow readiness list too short"
  );
  check(CRM_SAREA_PERSONAS.length >= 6, "SAREA CRM personas defined", "CRM SAREA personas missing");
  check(
    SALES_SAREA_PERSONAS.length >= 6,
    "SAREA Sales personas defined",
    "Sales SAREA personas missing"
  );
  check(CRM_SECTOR_NOTES.length === 5, "CRM sector notes for 5 sectors", "CRM sector notes count");
  check(
    SALES_SECTOR_NOTES.length === 5,
    "Sales sector notes for 5 sectors",
    "Sales sector notes count"
  );

  const crmPage = fileText("src/app/[tenant]/crm/page.tsx");
  check(
    crmPage.includes("CrmOperationsReadinessPanel") &&
      crmPage.includes("getCrmCommercialReadinessSnapshot"),
    "CRM page uses readiness service and panel",
    "CRM page missing G4 depth"
  );

  const salesPage = fileText("src/app/[tenant]/sales/page.tsx");
  check(
    salesPage.includes("SalesCommercialReadinessPanel") &&
      salesPage.includes("getSalesCommercialReadinessSnapshot"),
    "Sales page uses readiness service and panel",
    "Sales page missing G4 depth"
  );
  check(
    fileText("src/lib/services/crm-sales-readiness.service.ts").includes(
      "getCrmCommercialReadinessSnapshot"
    ) &&
      fileText("src/lib/services/crm-sales-readiness.service.ts").includes(
        "getSalesCommercialReadinessSnapshot"
      ),
    "crm-sales-readiness.service exported",
    "missing crm-sales-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/crm/page.tsx",
    "src/app/[tenant]/sales/page.tsx",
    "src/components/tenant/crm/crm-operations-readiness-panel.tsx",
    "src/components/tenant/sales/sales-commercial-readiness-panel.tsx",
    "src/components/tenant/crm-sales/commercial-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();

  const forbidden = [...CRM_SALES_FORBIDDEN_CLAIM_PHRASES, ...FORBIDDEN_EXTRA];
  for (const phrase of forbidden) {
    if (!userFacing.includes(phrase)) {
      ok(`user-facing copy avoids: ${phrase}`);
      continue;
    }
    const negated =
      userFacing.includes(`not ${phrase}`) ||
      userFacing.includes(`no ${phrase}`) ||
      userFacing.includes(`without ${phrase}`) ||
      userFacing.includes(`not a ${phrase}`) ||
      userFacing.includes(`not live ${phrase}`) ||
      (phrase === "live payment" && userFacing.includes("not live payments")) ||
      (phrase === "full crm replacement" && userFacing.includes("not a full crm")) ||
      (phrase === "marketing automation" && userFacing.includes("not marketing")) ||
      (phrase === "ai lead scoring" && userFacing.includes("not ai lead scoring"));
    check(
      negated,
      `phrase "${phrase}" only appears negated in user-facing CRM/Sales UI`,
      `forbidden CRM/Sales claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/crm-sales/commercial-linkage-banner.tsx").includes(
      "CommercialLinkageBanner"
    ),
    "Commercial linkage banner component",
    "missing commercial-linkage-banner"
  );

  check(
    fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"crm"') &&
      fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"sales"'),
    "tenant runtime cross-links include crm and sales",
    "cross-links missing crm/sales"
  );

  console.log(passed ? "\nG4 crm-sales:verify PASSED\n" : "\nG4 crm-sales:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
