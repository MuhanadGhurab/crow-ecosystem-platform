/**
 * Read-only verification for Construction operating model depth (F34) + Rimal alignment.
 *
 *   npm run construction:verify
 *
 * Does not write to the database. For DB sync after template changes:
 *   npm run db:seed:sectors   (operator-approved, idempotent upsert)
 */

import { CEM_MODULES } from "../src/lib/constants/modules";
import { RIMAL_MODULE_KEYS } from "../src/lib/constants/rimal";
import { getErpModuleDef } from "../src/lib/constants/erp-module-registry";
import { resolveSectorGuidance } from "../src/lib/discovery-intelligence/sector-guidance";
import {
  getSectorTemplateModel,
  CONSTRUCTION_FUTURE_READINESS_KEYS,
  CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS,
  CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS,
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

  console.log("\n=== Construction sector template (org intelligence) ===\n");

  const model = getSectorTemplateModel("construction");
  check(
    model.sectorTemplateKey === "construction",
    "sectorTemplateKey is construction",
    `Expected construction, got ${model.sectorTemplateKey}`
  );
  check(model.departments.length >= 10, `${model.departments.length} departments`, "Too few departments");
  check(model.positions.length >= 14, `${model.positions.length} positions/roles`, "Too few positions");
  check(model.workflows.length >= 14, `${model.workflows.length} workflows`, "Too few workflows");
  check(
    model.cybercrowBaselines.length >= 10,
    `${model.cybercrowBaselines.length} CyberCrow baselines`,
    "Too few CyberCrow baselines"
  );
  check(
    model.sareaProfiles.length >= 8,
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
    "Project Management",
    "Site Operations",
    "Engineering",
    "Procurement",
    "Materials",
    "Finance",
    "Safety",
    "Quality",
    "Document Control",
    "CyberCrow",
  ];
  for (const fragment of requiredDeptNames) {
    const found = model.departments.some((d) => d.name.includes(fragment));
    check(found, `Department contains "${fragment}"`, `Missing department hint: ${fragment}`);
  }

  const requiredWorkflowFragments = [
    "Project kickoff",
    "Site mobilization",
    "Material request",
    "Purchase request",
    "Supplier approval",
    "Material receiving",
    "Site task",
    "Daily site",
    "HSE incident",
    "Quality inspection",
    "Variation",
    "Document",
    "Cost review",
    "Workforce",
    "performance review",
    "Access",
  ];
  for (const fragment of requiredWorkflowFragments) {
    const found = model.workflows.some((w) => w.name.toLowerCase().includes(fragment.toLowerCase()));
    check(found, `Workflow includes "${fragment}"`, `Missing workflow hint: ${fragment}`);
  }

  console.log("\n=== Module recommendations (live vs future) ===\n");

  for (const key of CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS) {
    check(VALID_CEM.has(key), `CEM module "${key}" exists`, `Invalid CEM module key: ${key}`);
  }

  for (const erpKey of CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS) {
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

  for (const futureKey of CONSTRUCTION_FUTURE_READINESS_KEYS) {
    check(
      !VALID_CEM.has(futureKey),
      `Future-only key "${futureKey}" is not a live CEM module`,
      `Future key "${futureKey}" must not be a live CEM module`
    );
  }

  console.log("\n=== Rimal staging module alignment ===\n");

  const cemSet = new Set(CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS);
  for (const rimalKey of RIMAL_MODULE_KEYS) {
    const erpDef = getErpModuleDef(rimalKey);
    const cemKey = erpDef?.cemModuleKey ?? rimalKey;
    check(
      cemSet.has(cemKey as (typeof CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS)[number]),
      `Rimal module "${rimalKey}" (CEM: ${cemKey}) is in construction recommendations`,
      `Rimal module "${rimalKey}" not covered by construction CEM recommendations`
    );
  }
  check(
    !RIMAL_MODULE_KEYS.includes("logistics" as (typeof RIMAL_MODULE_KEYS)[number]),
    "Rimal module set excludes logistics",
    "Rimal should not include logistics module key"
  );
  check(
    !RIMAL_MODULE_KEYS.includes("warehouse" as (typeof RIMAL_MODULE_KEYS)[number]),
    "Rimal module set excludes warehouse",
    "Rimal should not include warehouse module key"
  );

  const logisticsLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("dispatch") ||
      d.name.toLowerCase().includes("fleet") ||
      d.name.toLowerCase().includes("warehouse operations")
  );
  const retailLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("store management") ||
      d.name.toLowerCase().includes("merchandising") ||
      d.name.toLowerCase().includes("pos")
  );
  check(
    !logisticsLeak,
    "No logistics-specific department names in construction model",
    "Logistics leakage in construction departments"
  );
  check(
    !retailLeak,
    "No retail-specific department names in construction model",
    "Retail leakage in construction departments"
  );

  const forbiddenLogisticsModules = ["logistics", "warehouse"];
  for (const mod of forbiddenLogisticsModules) {
    check(
      !CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS.includes(
        mod as (typeof CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS)[number]
      ),
      `Construction CEM recommendations exclude "${mod}"`,
      `Construction should not recommend logistics stack module "${mod}"`
    );
  }

  console.log("\n=== Discovery guidance & blueprint hints ===\n");

  const guidance = resolveSectorGuidance({ sectorTemplateKey: "construction" });
  check(
    guidance.sectorKey === "construction",
    "Sector guidance resolves for construction",
    "Guidance sector mismatch"
  );
  check(
    guidance.blueprintNotes.length >= 4,
    `${guidance.blueprintNotes.length} blueprint notes`,
    "Too few blueprint notes"
  );
  const forbiddenClaims = [
    "siem integrated",
    "autonomous ai dispatch is live",
    "autonomous ai is live",
    "certified compliance",
    "trusted by rimal",
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
    guidance.sareaHints.some((h) => h.toLowerCase().includes("rimal") || h.toLowerCase().includes("staging")),
    "SAREA hints reference Rimal/staging honestly",
    "Missing honest Rimal/staging note in SAREA hints"
  );
  check(
    guidance.cybercrowHints.some((h) => h.toLowerCase().includes("evidence")),
    "CyberCrow hints include evidence readiness language",
    "Missing evidence readiness in CyberCrow hints"
  );

  console.log("\n=== Summary ===\n");
  if (passed) {
    console.log("Construction sector template verification PASSED.\n");
    process.exit(0);
  } else {
    console.error("Construction sector template verification FAILED.\n");
    process.exit(1);
  }
}

main();
