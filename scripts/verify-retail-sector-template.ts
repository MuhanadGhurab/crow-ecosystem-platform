/**
 * Read-only verification for Retail operating model pack (F32).
 *
 *   npm run retail:verify
 *
 * Does not write to the database. For DB sync after template changes:
 *   npm run db:seed:sectors   (operator-approved, idempotent upsert)
 */

import { CEM_MODULES } from "../src/lib/constants/modules";
import { getErpModuleDef } from "../src/lib/constants/erp-module-registry";
import { resolveSectorGuidance } from "../src/lib/discovery-intelligence/sector-guidance";
import {
  getSectorTemplateModel,
  RETAIL_FUTURE_READINESS_KEYS,
  RETAIL_RECOMMENDED_CEM_MODULE_KEYS,
  RETAIL_RECOMMENDED_ERP_MODULE_KEYS,
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

  console.log("\n=== Retail sector template (org intelligence) ===\n");

  const model = getSectorTemplateModel("retail");
  check(
    model.sectorTemplateKey === "retail",
    "sectorTemplateKey is retail",
    `Expected retail, got ${model.sectorTemplateKey}`
  );
  check(model.departments.length >= 10, `${model.departments.length} departments`, "Too few departments");
  check(model.positions.length >= 12, `${model.positions.length} positions/roles`, "Too few positions");
  check(model.workflows.length >= 10, `${model.workflows.length} workflows`, "Too few workflows");
  check(
    model.cybercrowBaselines.length >= 6,
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
    "Retail Operations",
    "Store Management",
    "Merchandising",
    "Inventory",
    "Procurement",
    "Customer Service",
    "Finance",
    "CyberCrow",
  ];
  for (const fragment of requiredDeptNames) {
    const found = model.departments.some((d) => d.name.includes(fragment));
    check(found, `Department contains "${fragment}"`, `Missing department hint: ${fragment}`);
  }

  const requiredWorkflowFragments = [
    "catalog",
    "receiving",
    "adjustment",
    "Replenishment",
    "Return",
    "promotion",
    "reconciliation",
    "incident",
  ];
  for (const fragment of requiredWorkflowFragments) {
    const found = model.workflows.some((w) => w.name.toLowerCase().includes(fragment.toLowerCase()));
    check(found, `Workflow includes "${fragment}"`, `Missing workflow hint: ${fragment}`);
  }

  console.log("\n=== Module recommendations (live vs future) ===\n");

  for (const key of RETAIL_RECOMMENDED_CEM_MODULE_KEYS) {
    check(VALID_CEM.has(key), `CEM module "${key}" exists`, `Invalid CEM module key: ${key}`);
  }

  for (const erpKey of RETAIL_RECOMMENDED_ERP_MODULE_KEYS) {
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

  for (const futureKey of RETAIL_FUTURE_READINESS_KEYS) {
    check(
      !VALID_CEM.has(futureKey),
      `Future-only key "${futureKey}" is not a live CEM module`,
      `Future key "${futureKey}" must not be a live CEM module`
    );
  }

  console.log("\n=== Discovery guidance & blueprint hints ===\n");

  const guidance = resolveSectorGuidance({ sectorTemplateKey: "retail" });
  check(guidance.sectorKey === "retail", "Sector guidance resolves for retail", "Guidance sector mismatch");
  check(
    guidance.blueprintNotes.length >= 3,
    `${guidance.blueprintNotes.length} blueprint notes`,
    "Too few blueprint notes"
  );
  const forbiddenClaims = ["pci compliant", "pci dss certified", "gs1 integration is active", "payment processing is live"];
  const hintBlob = guidance.cybercrowHints.join(" ").toLowerCase();
  const hasForbidden = forbiddenClaims.some((phrase) => hintBlob.includes(phrase));
  check(!hasForbidden, "CyberCrow hints avoid forbidden compliance/payment claims", "CyberCrow hints contain forbidden claim phrasing");

  console.log("\n=== Summary ===\n");
  if (passed) {
    console.log("Retail sector template verification PASSED.\n");
    process.exit(0);
  } else {
    console.error("Retail sector template verification FAILED.\n");
    process.exit(1);
  }
}

main();
