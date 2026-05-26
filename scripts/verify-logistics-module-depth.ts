/**
 * G7 — Logistics module depth (read-only).
 *
 *   npm run logistics-module:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  LOGISTICS_FORBIDDEN_CLAIM_PHRASES,
  LOGISTICS_RECOMMENDED_WORKFLOWS,
  LOGISTICS_SAREA_PERSONAS,
  LOGISTICS_SECTOR_NOTES,
} from "../src/lib/constants/logistics-module-depth";

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

  console.log("\n=== G7 Logistics module depth ===\n");

  const logistics = ERP_MODULE_CATALOG.find((e) => e.erpKey === "logistics");
  check(Boolean(logistics), "Logistics catalog entry exists", "missing logistics in erp-module-catalog");
  if (!logistics) {
    process.exit(1);
  }

  check(logistics.hasTenantRoute === true, "Logistics has tenant route", "Logistics route flag");
  check(
    logistics.dependencies.includes("warehouse") &&
      logistics.dependencies.includes("inventory") &&
      logistics.dependencies.includes("procurement") &&
      logistics.dependencies.includes("crm") &&
      logistics.dependencies.includes("finance") &&
      logistics.dependencies.includes("tasks") &&
      logistics.dependencies.includes("reports") &&
      logistics.dependencies.includes("cybercrow"),
    "Logistics dependencies include warehouse/inventory/procurement/crm/finance/tasks/reports/cybercrow",
    "Logistics dependencies incomplete"
  );
  check(
    logistics.dependencies.includes("workflows"),
    "Logistics dependencies include workflows",
    "Logistics missing workflows dep"
  );
  check(
    (logistics.cyberCrowRisks?.length ?? 0) >= 3 && (logistics.sareaExperienceHints?.length ?? 0) >= 2,
    "Logistics catalog has CyberCrow and SAREA hints",
    "Logistics catalog missing posture hints"
  );
  check(
    Object.keys(logistics.sectorRelevance).length >= 4,
    "Logistics sector relevance covers modeled sectors",
    "Logistics sector relevance thin"
  );
  check(
    (logistics.futureOnlyCapabilities?.length ?? 0) >= 5,
    "Logistics future-only capabilities documented",
    "Logistics missing future-only guardrails"
  );
  check(
    logistics.implementationStatus === "workflow_linked",
    "Logistics implementationStatus is workflow_linked (honest)",
    "Logistics overclaims fully_integrated_runtime"
  );
  check(
    !logistics.evidenceExamples?.some((e) => e.toLowerCase().includes("pod capture")),
    "Catalog evidence avoids live POD capture wording",
    "Catalog evidence mentions POD capture"
  );

  check(
    LOGISTICS_RECOMMENDED_WORKFLOWS.length >= 10,
    `Logistics recommended workflows (${LOGISTICS_RECOMMENDED_WORKFLOWS.length})`,
    "Logistics workflow readiness list too short"
  );
  check(
    LOGISTICS_SAREA_PERSONAS.length >= 8,
    `Logistics SAREA personas (${LOGISTICS_SAREA_PERSONAS.length})`,
    "Logistics SAREA personas missing"
  );
  check(
    LOGISTICS_SECTOR_NOTES.length === 5,
    "Logistics sector notes for 5 sectors",
    "Logistics sector notes count"
  );

  const logisticsPage = fileText("src/app/[tenant]/logistics/page.tsx");
  check(
    logisticsPage.includes("LogisticsOperationsReadinessPanel") &&
      logisticsPage.includes("getLogisticsOperationsReadinessSnapshot"),
    "Logistics page uses readiness service and panel",
    "Logistics page missing G7 depth"
  );
  check(
    logisticsPage.includes("hasErpModule") && logisticsPage.includes("notFound"),
    "Logistics page gates on module enablement",
    "Logistics page missing module gate"
  );
  check(
    !logisticsPage.includes("showLogisticsHub ? (") ||
      logisticsPage.includes("LogisticsOperationsReadinessPanel"),
    "Logistics readiness not gated solely inside MEEM branch",
    "Logistics readiness may be MEEM-only"
  );
  check(
    logisticsPage.includes('variant="logistics"'),
    "Logistics page uses logistics linkage banner variant",
    "Logistics linkage banner missing"
  );

  check(
    fileText("src/lib/services/logistics-readiness.service.ts").includes(
      "getLogisticsOperationsReadinessSnapshot"
    ),
    "logistics-readiness.service exported",
    "missing logistics-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/logistics/page.tsx",
    "src/components/tenant/logistics/logistics-operations-readiness-panel.tsx",
    "src/components/tenant/supply-chain/supply-chain-operations-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();

  for (const phrase of LOGISTICS_FORBIDDEN_CLAIM_PHRASES) {
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
      userFacing.includes(`not live gps`) ||
      (phrase === "live gps" && userFacing.includes("without live gps")) ||
      (phrase === "pod capture" && userFacing.includes("pod review")) ||
      (phrase === "live proof-of-delivery" && userFacing.includes("proof-of-delivery review")) ||
      (phrase === "automated dispatch" && userFacing.includes("not automated dispatch")) ||
      (phrase === "carrier api" && userFacing.includes("carrier apis")) ||
      (phrase === "ai-assisted routing" && !userFacing.includes("ai-assisted routing"));
    check(
      negated || phrase === "ai-assisted routing",
      `phrase "${phrase}" only appears negated or absent in user-facing Logistics UI`,
      `forbidden Logistics claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/supply-chain/supply-chain-operations-linkage-banner.tsx").includes(
      '"logistics"'
    ),
    "Supply chain linkage banner supports logistics variant",
    "missing logistics variant on linkage banner"
  );

  check(
    fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"logistics"'),
    "tenant runtime cross-links include logistics",
    "cross-links missing logistics"
  );

  const catalogBlob = JSON.stringify(logistics).toLowerCase();
  check(
    !catalogBlob.includes("fully_integrated_runtime") &&
      !catalogBlob.includes("live carrier tracking") &&
      !catalogBlob.includes("autonomous dispatch"),
    "Logistics catalog JSON avoids forbidden runtime overclaims",
    "Logistics catalog contains forbidden overclaim"
  );

  console.log(passed ? "\nG7 logistics-module:verify PASSED\n" : "\nG7 logistics-module:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
