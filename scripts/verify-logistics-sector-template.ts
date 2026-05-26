/**
 * Read-only verification for Logistics operating model depth (F33) + MEEM lighthouse alignment.
 *
 *   npm run logistics:verify
 *
 * Does not write to the database. For DB sync after template changes:
 *   npm run db:seed:sectors   (operator-approved, idempotent upsert)
 */

import { CEM_MODULES } from "../src/lib/constants/modules";
import { MEEM_MODULE_KEYS } from "../src/lib/constants/meem";
import { getErpModuleDef } from "../src/lib/constants/erp-module-registry";
import { resolveSectorGuidance } from "../src/lib/discovery-intelligence/sector-guidance";
import {
  getSectorTemplateModel,
  LOGISTICS_FUTURE_READINESS_KEYS,
  LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS,
  LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS,
} from "../src/lib/org-intelligence/sector-template-data";

const VALID_CEM = new Set(CEM_MODULES.map((m) => m.key));

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

  console.log("\n=== Logistics sector template (org intelligence) ===\n");

  const model = getSectorTemplateModel("logistics");
  check(
    model.sectorTemplateKey === "logistics",
    "sectorTemplateKey is logistics",
    `Expected logistics, got ${model.sectorTemplateKey}`
  );
  check(model.departments.length >= 10, `${model.departments.length} departments`, "Too few departments");
  check(model.positions.length >= 12, `${model.positions.length} positions/roles`, "Too few positions");
  check(model.workflows.length >= 12, `${model.workflows.length} workflows`, "Too few workflows");
  check(
    model.cybercrowBaselines.length >= 8,
    `${model.cybercrowBaselines.length} CyberCrow baselines`,
    "Too few CyberCrow baselines"
  );
  check(
    model.sareaProfiles.length >= 6,
    `${model.sareaProfiles.length} SAREA profile hints`,
    "Too few SAREA profiles"
  );

  const deptKeys = new Set(model.departments.map((d) => d.key));
  for (const pos of model.positions) {
    if (!deptKeys.has(pos.departmentKey)) {
      check(false, "", `Position ${pos.key} references unknown department ${pos.departmentKey}`);
    }
  }

  const requiredDeptNames = [
    "Logistics Operations",
    "Dispatch",
    "Fleet",
    "Warehouse",
    "Inventory",
    "Procurement",
    "Customer Accounts",
    "Compliance",
    "CyberCrow",
  ];
  for (const fragment of requiredDeptNames) {
    const found = model.departments.some((d) => d.name.includes(fragment));
    check(found, `Department contains "${fragment}"`, `Missing department hint: ${fragment}`);
  }

  const requiredWorkflowFragments = [
    "Delivery request",
    "Dispatch assignment",
    "Driver task",
    "Shipment status",
    "Warehouse receiving",
    "Inventory movement",
    "Supplier purchase",
    "Delivery exception",
    "Proof-of-delivery",
    "performance review",
    "Access review",
  ];
  for (const fragment of requiredWorkflowFragments) {
    const found = model.workflows.some((w) => w.name.toLowerCase().includes(fragment.toLowerCase()));
    check(found, `Workflow includes "${fragment}"`, `Missing workflow hint: ${fragment}`);
  }

  console.log("\n=== Module recommendations (live vs future) ===\n");

  for (const key of LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS) {
    check(VALID_CEM.has(key), `CEM module "${key}" exists`, `Invalid CEM module key: ${key}`);
  }

  for (const erpKey of LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS) {
    const def = getErpModuleDef(erpKey);
    if (!def) {
      check(
        (VALID_CEM as Set<string>).has(erpKey),
        `Module "${erpKey}" is CEM-backed (no ERP chain entry yet)`,
        `Unknown module key (not ERP registry or CEM): ${erpKey}`
      );
      continue;
    }
    check(
      VALID_CEM.has(def.cemModuleKey),
      `ERP "${erpKey}" maps to valid CEM "${def.cemModuleKey}"`,
      `Invalid CEM key ${def.cemModuleKey} for ERP ${erpKey}`
    );
  }

  for (const futureKey of LOGISTICS_FUTURE_READINESS_KEYS) {
    check(
      !VALID_CEM.has(futureKey),
      `Future-only key "${futureKey}" is not a live CEM module`,
      `Future key "${futureKey}" must not be a live CEM module`
    );
  }

  console.log("\n=== MEEM lighthouse module alignment ===\n");

  const cemSet = new Set(LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS);
  for (const meemKey of MEEM_MODULE_KEYS) {
    const erpDef = getErpModuleDef(meemKey);
    const cemKey = erpDef?.cemModuleKey ?? meemKey;
    check(
      cemSet.has(cemKey as (typeof LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS)[number]),
      `MEEM module "${meemKey}" (CEM: ${cemKey}) is in logistics recommendations`,
      `MEEM module "${meemKey}" not covered by logistics CEM recommendations`
    );
  }

  const retailLeak = model.departments.some(
    (d) => d.name.toLowerCase().includes("store management") || d.name.toLowerCase().includes("merchandising")
  );
  const constructionLeak = model.departments.some((d) =>
    d.name.toLowerCase().includes("flight operations")
  );
  check(!retailLeak, "No retail-specific department names in logistics model", "Retail leakage in logistics departments");
  check(
    !constructionLeak,
    "No construction/aviation department names in logistics model",
    "Construction/aviation leakage in logistics departments"
  );

  console.log("\n=== Discovery guidance & blueprint hints ===\n");

  const guidance = resolveSectorGuidance({ sectorTemplateKey: "logistics" });
  check(guidance.sectorKey === "logistics", "Sector guidance resolves for logistics", "Guidance sector mismatch");
  check(
    guidance.blueprintNotes.length >= 4,
    `${guidance.blueprintNotes.length} blueprint notes`,
    "Too few blueprint notes"
  );
  const forbiddenClaims = [
    "siem integrated",
    "autonomous ai dispatch is live",
    "certified compliance",
    "trusted by meem",
    "live customer",
    "production launch",
  ];
  const hintBlob = [
    ...guidance.cybercrowHints,
    ...guidance.sareaHints,
    ...guidance.blueprintNotes,
  ]
    .join(" ")
    .toLowerCase();
  const hasForbidden = forbiddenClaims.some((phrase) => hintBlob.includes(phrase));
  check(
    !hasForbidden,
    "Guidance avoids forbidden SIEM/customer/autonomous-AI claims",
    "Guidance contains forbidden claim phrasing"
  );
  check(
    guidance.sareaHints.some((h) => h.toLowerCase().includes("meem") || h.toLowerCase().includes("lighthouse")),
    "SAREA hints reference MEEM/lighthouse staging honestly",
    "Missing honest MEEM/lighthouse staging note in SAREA hints"
  );

  console.log("\n=== Summary ===\n");
  if (passed) {
    console.log("Logistics sector template verification PASSED.\n");
    process.exit(0);
  } else {
    console.error("Logistics sector template verification FAILED.\n");
    process.exit(1);
  }
}

main();
