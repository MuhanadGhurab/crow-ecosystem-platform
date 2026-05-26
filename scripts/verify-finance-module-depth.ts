/**
 * G3 — Finance module depth (read-only).
 *
 *   npm run finance:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  FINANCE_FORBIDDEN_CLAIM_PHRASES,
  FINANCE_RECOMMENDED_WORKFLOWS,
  FINANCE_SAREA_PERSONAS,
  FINANCE_SECTOR_NOTES,
} from "../src/lib/constants/finance-module-depth";

const ROOT = join(import.meta.dirname, "..");

const FINANCE_FORBIDDEN_EXTRA = [
  "stripe checkout enabled",
  "payment gateway activated",
  "vat engine",
  "general ledger engine",
  "bank integration",
  "payment reconciliation automation",
  "fraud detection",
  "full accounting system",
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

  console.log("\n=== G3 Finance module depth ===\n");

  const finance = ERP_MODULE_CATALOG.find((e) => e.erpKey === "finance");
  check(Boolean(finance), "Finance catalog entry exists", "missing finance in erp-module-catalog");
  if (!finance) {
    process.exit(1);
  }

  check(finance.hasTenantRoute === true, "Finance has tenant route", "Finance route flag");
  check(
    finance.dependencies.includes("sales") &&
      finance.dependencies.includes("procurement") &&
      finance.dependencies.includes("tasks") &&
      finance.dependencies.includes("reports"),
    "Finance dependencies include sales/procurement/tasks/reports",
    "Finance dependencies incomplete"
  );
  check(
    finance.dependencies.includes("cybercrow"),
    "Finance dependencies include cybercrow",
    "Finance missing cybercrow dep"
  );
  check(
    (finance.cyberCrowRisks?.length ?? 0) >= 3 && (finance.sareaExperienceHints?.length ?? 0) >= 2,
    "Finance catalog has CyberCrow and SAREA hints",
    "Finance catalog missing posture hints"
  );
  check(
    Object.keys(finance.sectorRelevance).length >= 5,
    "Finance sector relevance covers modeled sectors",
    "Finance sector relevance thin"
  );
  check(
    (finance.futureOnlyCapabilities?.length ?? 0) >= 3,
    "Finance future-only capabilities documented (payments/tax/GL)",
    "Finance missing future-only guardrails"
  );
  check(
    !finance.shortDescription.toLowerCase().includes("full accounting"),
    "Finance short description avoids full accounting claim",
    "Finance short description overclaims accounting"
  );

  check(
    FINANCE_RECOMMENDED_WORKFLOWS.length >= 8,
    `Finance recommended workflows (${FINANCE_RECOMMENDED_WORKFLOWS.length})`,
    "Finance workflow readiness list too short"
  );
  check(
    FINANCE_SAREA_PERSONAS.length >= 6,
    "SAREA finance personas defined",
    "SAREA personas missing"
  );
  check(
    FINANCE_SECTOR_NOTES.length === 5,
    "sector finance notes for 5 sectors",
    "sector notes count"
  );

  const financePage = fileText("src/app/[tenant]/finance/page.tsx");
  check(
    financePage.includes("FinanceOperationsReadinessPanel") &&
      financePage.includes("getFinanceOperationsReadinessSnapshot"),
    "Finance page uses readiness service and panel",
    "Finance page missing G3 depth"
  );
  check(
    fileText("src/lib/services/finance-readiness.service.ts").includes(
      "getFinanceOperationsReadinessSnapshot"
    ),
    "finance-readiness.service exported",
    "missing finance-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/finance/page.tsx",
    "src/components/tenant/finance/finance-operations-readiness-panel.tsx",
    "src/components/tenant/finance/finance-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();
  const forbidden = [...FINANCE_FORBIDDEN_CLAIM_PHRASES, ...FINANCE_FORBIDDEN_EXTRA];
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
      (phrase === "full accounting system" &&
        userFacing.includes("not a full accounting platform"));
    check(
      negated,
      `phrase "${phrase}" only appears negated in user-facing Finance UI`,
      `forbidden Finance claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/finance/finance-linkage-banner.tsx").includes(
      "FinanceLinkageBanner"
    ),
    "Finance linkage banner component",
    "missing finance-linkage-banner"
  );

  check(
    fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"finance"'),
    "tenant runtime cross-links include finance",
    "cross-links missing finance"
  );

  console.log(passed ? "\nG3 finance:verify PASSED\n" : "\nG3 finance:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
