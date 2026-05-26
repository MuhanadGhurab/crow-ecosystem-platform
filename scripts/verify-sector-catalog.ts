/**
 * F37 — Cross-sector catalog consistency (read-only).
 *
 *   npm run sector:verify
 *
 * Complements per-sector scripts (logistics:verify, retail:verify, …).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CEM_MODULES } from "../src/lib/constants/modules";
import {
  MODELED_SECTOR_CATALOG,
  REQUEST_INDUSTRY_OPTIONS,
} from "../src/lib/constants/sector-catalog";
import { listDiscoveryTemplateKeys } from "../src/lib/constants/industry-templates";
import {
  getSectorTemplateModel,
  LOGISTICS_FUTURE_READINESS_KEYS,
  RETAIL_FUTURE_READINESS_KEYS,
  CONSTRUCTION_FUTURE_READINESS_KEYS,
  AVIATION_FUTURE_READINESS_KEYS,
  HEALTHCARE_FUTURE_READINESS_KEYS,
} from "../src/lib/org-intelligence/sector-template-data";

const MODELED_KEYS = ["logistics", "retail", "construction", "aviation", "healthcare"] as const;

const FUTURE_KEY_SETS: Record<string, readonly string[]> = {
  logistics: LOGISTICS_FUTURE_READINESS_KEYS,
  retail: RETAIL_FUTURE_READINESS_KEYS,
  construction: CONSTRUCTION_FUTURE_READINESS_KEYS,
  aviation: AVIATION_FUTURE_READINESS_KEYS,
  healthcare: HEALTHCARE_FUTURE_READINESS_KEYS,
};

const VALID_CEM = new Set(CEM_MODULES.map((m) => m.key));

const FORBIDDEN_PUBLIC_PHRASES = [
  "trusted by",
  "live customers",
  "hipaa-certified",
  "hipaa certified",
  "certified compliance",
  "production healthcare",
  "emr replacement",
  "ehr replacement",
] as const;

const PUBLIC_SCAN_FILES = [
  "src/lib/constants/sector-catalog.ts",
  "src/app/(public)/industries/page.tsx",
  "src/components/public/industry-catalog-card.tsx",
  "src/components/public/request-industry-preview.tsx",
] as const;

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

  console.log("\n=== F37 sector catalog ===\n");

  check(
    MODELED_SECTOR_CATALOG.length === 5,
    "MODELED_SECTOR_CATALOG has 5 entries",
    `Expected 5 modeled sectors, got ${MODELED_SECTOR_CATALOG.length}`
  );

  for (const key of MODELED_KEYS) {
    const catalogEntry = MODELED_SECTOR_CATALOG.find((e) => e.key === key);
    check(Boolean(catalogEntry), `Catalog entry for ${key}`, `Missing catalog entry: ${key}`);

    const templateKeys = listDiscoveryTemplateKeys();
    check(
      templateKeys.includes(key),
      `Discovery template registered: ${key}`,
      `Missing discovery template key: ${key}`
    );

    const model = getSectorTemplateModel(key);
    check(
      model.sectorTemplateKey === key,
      `sector-template-data key ${key}`,
      `Template model key mismatch for ${key}`
    );
    check(
      model.departments.length >= 8,
      `${key}: ${model.departments.length} departments`,
      `${key}: too few departments`
    );
    check(
      model.positions.length >= 8,
      `${key}: ${model.positions.length} roles`,
      `${key}: too few roles`
    );
    check(
      model.workflows.length >= 8,
      `${key}: ${model.workflows.length} workflows`,
      `${key}: too few workflows`
    );
    check(
      model.sareaProfiles.length >= 4,
      `${key}: ${model.sareaProfiles.length} SAREA hints`,
      `${key}: too few SAREA profiles`
    );
    check(
      model.cybercrowBaselines.length >= 4,
      `${key}: ${model.cybercrowBaselines.length} CyberCrow baselines`,
      `${key}: too few CyberCrow baselines`
    );

    const futureKeys = FUTURE_KEY_SETS[key] ?? [];
    for (const modKey of catalogEntry?.cemModuleKeys ?? []) {
      check(
        VALID_CEM.has(modKey),
        `${key}: live module ${modKey}`,
        `${key}: unknown CEM module ${modKey}`
      );
      check(
        !futureKeys.includes(modKey),
        `${key}: ${modKey} not in future-only list`,
        `${key}: future-only module ${modKey} in live recommendations`
      );
    }
  }

  const requestValues = REQUEST_INDUSTRY_OPTIONS.map((o) => o.value).filter(Boolean);
  check(
    requestValues.length === 5,
    "REQUEST_INDUSTRY_OPTIONS has 5 modeled values (+ Other)",
    `Expected 5 modeled request values, got ${requestValues.join(",")}`
  );
  for (const key of MODELED_KEYS) {
    check(
      requestValues.includes(key),
      `Request selector includes ${key}`,
      `Request selector missing ${key}`
    );
  }
  const otherOption = REQUEST_INDUSTRY_OPTIONS.find((o) => o.value === "");
  check(
    otherOption?.label.toLowerCase().includes("not sure") ?? false,
    'Request selector has "Other / Not sure"',
    "Missing Other / Not sure option"
  );

  console.log("\n=== Public wording scan (forbidden claims) ===\n");

  for (const rel of PUBLIC_SCAN_FILES) {
    const abs = join(process.cwd(), rel);
    const text = readFileSync(abs, "utf8").toLowerCase();
    for (const phrase of FORBIDDEN_PUBLIC_PHRASES) {
      const idx = text.indexOf(phrase);
      if (idx === -1) continue;
      const lineStart = text.lastIndexOf("\n", idx) + 1;
      const line = text.slice(lineStart, text.indexOf("\n", idx));
      const negated =
        line.includes("do not") ||
        line.includes("not ") ||
        line.includes("without ") ||
        line.includes("avoid ");
      check(
        negated,
        `${rel}: "${phrase}" only in negation context`,
        `${rel}: forbidden phrase "${phrase}" may be a public claim`
      );
    }
  }

  console.log(passed ? "\nsector:verify PASSED\n" : "\nsector:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
