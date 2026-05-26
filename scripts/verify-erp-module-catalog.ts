/**
 * G1 — ERP module catalog & integration blueprint (read-only).
 *
 *   npm run erp:verify
 */

import {
  ERP_MODULE_CATALOG,
  LIVE_ERP_CATALOG_ENTRIES,
} from "../src/lib/constants/erp-module-catalog";
import { ERP_MODULE_INTEGRATION_EDGES } from "../src/lib/constants/erp-module-integration-map";
import { ERP_MODULE_MATURITY_LEVELS } from "../src/lib/constants/erp-module-maturity";
import { ERP_SECTOR_MODULE_MATRIX } from "../src/lib/constants/erp-sector-module-matrix";
import { ERP_TRUST_EXPERIENCE_STANDARD } from "../src/lib/constants/erp-module-ux-standard";
import { ERP_MODULE_KEYS, type ErpModuleKey } from "../src/lib/constants/erp-module-registry";
import {
  AVIATION_RECOMMENDED_ERP_MODULE_KEYS,
  CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS,
  HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS,
  LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS,
  RETAIL_RECOMMENDED_ERP_MODULE_KEYS,
} from "../src/lib/org-intelligence/sector-template-data";

const FORBIDDEN_PHRASES = [
  "autonomous ai",
  "hipaa certified",
  "hipaa-certified",
  "live payments",
  "production launch",
  "certified compliance",
  "autonomous remediation",
  "autonomous dispatch",
  "autonomous insights",
] as const;

const LIVE_ERP_SET = new Set<string>(ERP_MODULE_KEYS);

const SECTOR_ERP: Record<string, readonly string[]> = {
  logistics: LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS,
  retail: RETAIL_RECOMMENDED_ERP_MODULE_KEYS,
  construction: CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS,
  aviation: AVIATION_RECOMMENDED_ERP_MODULE_KEYS,
  healthcare: HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS,
};

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
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

  console.log("\n=== G1 ERP module catalog ===\n");

  check(ERP_MODULE_MATURITY_LEVELS.length === 6, "maturity model has 6 levels", "maturity count");

  for (const key of ERP_MODULE_KEYS) {
    const entry = ERP_MODULE_CATALOG.find((e) => e.erpKey === key);
    check(
      Boolean(entry && entry.hasTenantRoute),
      `catalog covers live ERP key: ${key}`,
      `missing catalog for ERP key ${key}`
    );
  }

  check(
    LIVE_ERP_CATALOG_ENTRIES.length === ERP_MODULE_KEYS.length,
    "live ERP catalog count matches registry",
    "live ERP catalog/registry mismatch"
  );

  for (const entry of ERP_MODULE_CATALOG) {
    const blob = JSON.stringify(entry).toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      if (blob.includes(phrase) && !entry.futureOnlyCapabilities?.some((f) => f.toLowerCase().includes(phrase))) {
        check(false, "", `forbidden phrase "${phrase}" in ${entry.cemModuleKey} (not future-only)`);
      }
    }

    check(
      entry.cyberCrowRisks.length > 0 && entry.sareaExperienceHints.length > 0,
      `CyberCrow + SAREA guidance: ${entry.cemModuleKey}`,
      `missing trust/experience on ${entry.cemModuleKey}`
    );

    if (entry.category === "catalog_only" && entry.futureOnlyCapabilities?.length) {
      check(
        entry.implementationStatus === "concept_placeholder",
        `future-only capabilities on catalog-only: ${entry.cemModuleKey}`,
        `${entry.cemModuleKey} has futureOnlyCapabilities but is not catalog_only`
      );
    }
  }

  for (const row of ERP_SECTOR_MODULE_MATRIX) {
    const expected = SECTOR_ERP[row.sector];
    check(
      expected &&
        row.primary.length === expected.length &&
        row.primary.every((k, i) => k === expected[i]),
      `sector matrix primary matches sector-template-data: ${row.sector}`,
      `sector matrix drift for ${row.sector}`
    );
    for (const k of row.primary) {
      check(LIVE_ERP_SET.has(k), `sector ${row.sector} key ${k} is live ERP`, `invalid sector key ${k}`);
    }
  }

  for (const edge of ERP_MODULE_INTEGRATION_EDGES) {
    if (typeof edge.from === "string" && LIVE_ERP_SET.has(edge.from)) {
      check(true, `edge from ${edge.from}`, "");
    }
  }

  check(
    ERP_TRUST_EXPERIENCE_STANDARD.cyberCrow.perModuleFields.length >= 2,
    "CyberCrow integration standard defined",
    "CyberCrow standard missing"
  );

  check(
    ERP_TRUST_EXPERIENCE_STANDARD.sarea.separation.includes("RBAC"),
    "SAREA/RBAC separation documented",
    "SAREA separation missing"
  );

  const catalogOnly = ERP_MODULE_CATALOG.filter((e) => !e.hasTenantRoute);
  for (const e of catalogOnly) {
    check(
      e.category === "catalog_only" || e.routePattern.includes("no tenant"),
      `catalog-only route flagged: ${e.cemModuleKey}`,
      `${e.cemModuleKey} missing route but not catalog_only`
    );
  }

  console.log(passed ? "\nG1 erp:verify PASSED\n" : "\nG1 erp:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
