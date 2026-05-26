/**
 * Read-only verification for Aviation operating model depth (F35) + Najm intake alignment.
 *
 *   npm run aviation:verify
 *
 * Does not write to the database. For DB sync after template changes:
 *   npm run db:seed:sectors   (operator-approved, idempotent upsert)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CEM_MODULES } from "../src/lib/constants/modules";
import { getErpModuleDef } from "../src/lib/constants/erp-module-registry";
import { resolveSectorGuidance } from "../src/lib/discovery-intelligence/sector-guidance";
import {
  getSectorTemplateModel,
  AVIATION_FUTURE_READINESS_KEYS,
  AVIATION_RECOMMENDED_CEM_MODULE_KEYS,
  AVIATION_RECOMMENDED_ERP_MODULE_KEYS,
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

  console.log("\n=== Aviation sector template (org intelligence) ===\n");

  const model = getSectorTemplateModel("aviation");
  check(
    model.sectorTemplateKey === "aviation",
    "sectorTemplateKey is aviation",
    `Expected aviation, got ${model.sectorTemplateKey}`
  );
  check(model.departments.length >= 10, `${model.departments.length} departments`, "Too few departments");
  check(model.positions.length >= 14, `${model.positions.length} positions/roles`, "Too few positions");
  check(model.workflows.length >= 10, `${model.workflows.length} workflows`, "Too few workflows");
  check(
    model.cybercrowBaselines.length >= 8,
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
    "Aviation Operations",
    "Ground Operations",
    "Passenger",
    "Maintenance",
    "Safety",
    "Procurement",
    "Finance",
    "Quality",
    "CyberCrow",
    "Reporting",
  ];
  for (const fragment of requiredDeptNames) {
    const found = model.departments.some((d) => d.name.includes(fragment));
    check(found, `Department contains "${fragment}"`, `Missing department hint: ${fragment}`);
  }

  const requiredWorkflowFragments = [
    "Service request",
    "escalation",
    "Ground operation",
    "Maintenance request",
    "Supplier request",
    "Safety incident",
    "Quality",
    "Workforce",
    "Access",
    "Finance",
    "Monthly aviation",
    "CyberCrow incident",
  ];
  for (const fragment of requiredWorkflowFragments) {
    const found = model.workflows.some((w) => w.name.toLowerCase().includes(fragment.toLowerCase()));
    check(found, `Workflow includes "${fragment}"`, `Missing workflow hint: ${fragment}`);
  }

  console.log("\n=== Module recommendations (live vs future) ===\n");

  for (const key of AVIATION_RECOMMENDED_CEM_MODULE_KEYS) {
    check(VALID_CEM.has(key), `CEM module "${key}" exists`, `Invalid CEM module key: ${key}`);
  }

  for (const erpKey of AVIATION_RECOMMENDED_ERP_MODULE_KEYS) {
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

  for (const futureKey of AVIATION_FUTURE_READINESS_KEYS) {
    check(
      !VALID_CEM.has(futureKey),
      `Future-only key "${futureKey}" is not a live CEM module`,
      `Future key "${futureKey}" must not be a live CEM module`
    );
  }

  const forbiddenStackModules = ["logistics", "warehouse", "inventory"];
  for (const mod of forbiddenStackModules) {
    check(
      !AVIATION_RECOMMENDED_CEM_MODULE_KEYS.includes(
        mod as (typeof AVIATION_RECOMMENDED_CEM_MODULE_KEYS)[number]
      ),
      `Aviation CEM recommendations exclude "${mod}"`,
      `Aviation should not recommend stack module "${mod}"`
    );
  }

  console.log("\n=== Sector isolation (no logistics/retail/construction leakage) ===\n");

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
  const constructionLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("site operations") ||
      d.name.toLowerCase().includes("project management") ||
      d.name.toLowerCase().includes("document control")
  );
  check(
    !logisticsLeak,
    "No logistics-specific department names in aviation model",
    "Logistics leakage in aviation departments"
  );
  check(
    !retailLeak,
    "No retail-specific department names in aviation model",
    "Retail leakage in aviation departments"
  );
  check(
    !constructionLeak,
    "No construction-specific department names in aviation model",
    "Construction leakage in aviation departments"
  );

  console.log("\n=== Discovery JSON pack ===\n");

  const aviationJsonPath = join(process.cwd(), "src/lib/discovery-templates/aviation.json");
  const aviationJson = JSON.parse(readFileSync(aviationJsonPath, "utf8")) as {
    key: string;
    moduleKeys: string[];
    departments: { name: string }[];
    workflows: { name: string }[];
    security?: { ncaAlignment?: string };
  };
  check(aviationJson.key === "aviation", "aviation.json key is aviation", "aviation.json key mismatch");
  check(
    aviationJson.departments.length >= 10,
    `aviation.json has ${aviationJson.departments.length} departments`,
    "aviation.json too few departments"
  );
  for (const mod of aviationJson.moduleKeys) {
    check(VALID_CEM.has(mod), `aviation.json module "${mod}" is valid CEM`, `Invalid module in aviation.json: ${mod}`);
  }
  check(
    aviationJson.security?.ncaAlignment === "readiness_notes_only",
    "aviation.json uses readiness_notes_only compliance posture",
    "aviation.json should not imply live compliance certification"
  );

  console.log("\n=== Najm organic intake assumptions ===\n");

  const najmPayloadPath = join(process.cwd(), "scripts/f11-najm-payload.json");
  const najmPayload = JSON.parse(readFileSync(najmPayloadPath, "utf8")) as {
    industry: string;
    organizationName: string;
    notes: string;
  };
  check(najmPayload.industry === "aviation", "F11 Najm payload industry is aviation", "Najm payload industry mismatch");
  check(
    najmPayload.notes.toLowerCase().includes("synthetic") ||
      najmPayload.notes.toLowerCase().includes("validation"),
    "Najm payload notes are synthetic/validation (not customer claim)",
    "Najm payload should state synthetic validation"
  );

  console.log("\n=== Discovery guidance & blueprint hints ===\n");

  const guidance = resolveSectorGuidance({ sectorTemplateKey: "aviation" });
  check(
    guidance.sectorKey === "aviation",
    "Sector guidance resolves for aviation",
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
    "trusted by najm",
    "live customer",
    "production launch",
    "aviation regulatory certification",
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
    "Guidance avoids forbidden SIEM/customer/autonomous-AI/certification claims",
    "Guidance contains forbidden claim phrasing"
  );
  check(
    guidance.sareaHints.some(
      (h) =>
        h.toLowerCase().includes("najm") ||
        h.toLowerCase().includes("staging") ||
        h.toLowerCase().includes("organic")
    ),
    "SAREA hints reference Najm/staging/organic intake honestly",
    "Missing honest Najm/staging note in SAREA hints"
  );
  check(
    guidance.cybercrowHints.some((h) => h.toLowerCase().includes("evidence")),
    "CyberCrow hints include evidence readiness language",
    "Missing evidence readiness in CyberCrow hints"
  );
  check(
    guidance.blueprintNotes.some((n) => n.toLowerCase().includes("no automatic tenant")),
    "Blueprint notes clarify no automatic tenant provisioning",
    "Missing no-auto-tenant note in blueprint guidance"
  );

  console.log("\n=== Summary ===\n");
  if (passed) {
    console.log("Aviation sector template verification PASSED.\n");
    process.exit(0);
  } else {
    console.error("Aviation sector template verification FAILED.\n");
    process.exit(1);
  }
}

main();
