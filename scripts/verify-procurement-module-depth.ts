/**
 * G5 — Procurement module depth (read-only).
 *
 *   npm run procurement:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  PROCUREMENT_FORBIDDEN_CLAIM_PHRASES,
  PROCUREMENT_RECOMMENDED_WORKFLOWS,
  PROCUREMENT_SAREA_PERSONAS,
  PROCUREMENT_SECTOR_NOTES,
} from "../src/lib/constants/procurement-module-depth";

const ROOT = join(import.meta.dirname, "..");

const PROCUREMENT_FORBIDDEN_EXTRA = [
  "vendor marketplace",
  "supplier risk scoring",
  "live supplier payments",
  "payment gateway activated",
  "procurement automation engine",
  "fraud detection",
  "certified audit",
  "contract signing",
  "bank integration",
  "full purchasing suite",
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

  console.log("\n=== G5 Procurement module depth ===\n");

  const procurement = ERP_MODULE_CATALOG.find((e) => e.erpKey === "procurement");
  check(
    Boolean(procurement),
    "Procurement catalog entry exists",
    "missing procurement in erp-module-catalog"
  );
  if (!procurement) {
    process.exit(1);
  }

  check(procurement.hasTenantRoute === true, "Procurement has tenant route", "Procurement route flag");
  check(
    procurement.dependencies.includes("finance") &&
      procurement.dependencies.includes("inventory") &&
      procurement.dependencies.includes("warehouse") &&
      procurement.dependencies.includes("tasks") &&
      procurement.dependencies.includes("reports"),
    "Procurement dependencies include finance/inventory/warehouse/tasks/reports",
    "Procurement dependencies incomplete"
  );
  check(
    procurement.dependencies.includes("cybercrow") &&
      procurement.dependencies.includes("workflows"),
    "Procurement dependencies include cybercrow and workflows",
    "Procurement missing cybercrow/workflows dep"
  );
  check(
    (procurement.cyberCrowRisks?.length ?? 0) >= 3 &&
      (procurement.sareaExperienceHints?.length ?? 0) >= 2,
    "Procurement catalog has CyberCrow and SAREA hints",
    "Procurement catalog missing posture hints"
  );
  check(
    Object.keys(procurement.sectorRelevance).length >= 5,
    "Procurement sector relevance covers modeled sectors",
    "Procurement sector relevance thin"
  );
  check(
    (procurement.futureOnlyCapabilities?.length ?? 0) >= 5,
    "Procurement future-only capabilities documented",
    "Procurement missing future-only guardrails"
  );
  check(
    !procurement.shortDescription.toLowerCase().includes("vendor marketplace"),
    "Procurement short description avoids marketplace claim",
    "Procurement short description overclaims marketplace"
  );

  check(
    PROCUREMENT_RECOMMENDED_WORKFLOWS.length >= 8,
    `Procurement recommended workflows (${PROCUREMENT_RECOMMENDED_WORKFLOWS.length})`,
    "Procurement workflow readiness list too short"
  );
  check(
    PROCUREMENT_SAREA_PERSONAS.length >= 6,
    "SAREA procurement personas defined",
    "SAREA personas missing"
  );
  check(
    PROCUREMENT_SECTOR_NOTES.length === 5,
    "sector procurement notes for 5 sectors",
    "sector notes count"
  );

  const procurementPage = fileText("src/app/[tenant]/procurement/page.tsx");
  check(
    procurementPage.includes("ProcurementOperationsReadinessPanel") &&
      procurementPage.includes("getProcurementOperationsReadinessSnapshot"),
    "Procurement page uses readiness service and panel",
    "Procurement page missing G5 depth"
  );
  check(
    !procurementPage.includes("showMeemHub ? (") ||
      procurementPage.includes("ProcurementOperationsReadinessPanel"),
    "Procurement readiness not gated solely inside MEEM branch",
    "Procurement readiness may be MEEM-only"
  );

  check(
    fileText("src/lib/services/procurement-readiness.service.ts").includes(
      "getProcurementOperationsReadinessSnapshot"
    ),
    "procurement-readiness.service exported",
    "missing procurement-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/procurement/page.tsx",
    "src/components/tenant/procurement/procurement-operations-readiness-panel.tsx",
    "src/components/tenant/procurement/procurement-supply-linkage-banner.tsx",
    "src/components/tenant/finance/finance-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();
  const forbidden = [...PROCUREMENT_FORBIDDEN_CLAIM_PHRASES, ...PROCUREMENT_FORBIDDEN_EXTRA];
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
      (phrase === "vendor marketplace" && userFacing.includes("not a vendor marketplace")) ||
      (phrase === "live supplier payments" && userFacing.includes("without live supplier payments")) ||
      (phrase === "supplier risk scoring" && userFacing.includes("not supplier risk scoring")) ||
      (phrase === "contract signing" && userFacing.includes("not contract signing"));
    check(
      negated,
      `phrase "${phrase}" only appears negated in user-facing Procurement UI`,
      `forbidden Procurement claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/procurement/procurement-supply-linkage-banner.tsx").includes(
      "ProcurementSupplyLinkageBanner"
    ),
    "Procurement supply linkage banner component",
    "missing procurement-supply-linkage-banner"
  );

  check(
    fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"procurement"'),
    "tenant runtime cross-links include procurement",
    "cross-links missing procurement"
  );

  console.log(passed ? "\nG5 procurement:verify PASSED\n" : "\nG5 procurement:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
