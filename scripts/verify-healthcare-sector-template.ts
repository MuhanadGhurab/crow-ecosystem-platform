/**
 * Read-only verification for Healthcare operating model depth (F36) + privacy/safety readiness.
 *
 *   npm run healthcare:verify
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
  HEALTHCARE_FUTURE_READINESS_KEYS,
  HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS,
  HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS,
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

  console.log("\n=== Healthcare sector template (org intelligence) ===\n");

  const model = getSectorTemplateModel("healthcare");
  check(
    model.sectorTemplateKey === "healthcare",
    "sectorTemplateKey is healthcare",
    `Expected healthcare, got ${model.sectorTemplateKey}`
  );
  check(model.departments.length >= 12, `${model.departments.length} departments`, "Too few departments");
  check(model.positions.length >= 15, `${model.positions.length} positions/roles`, "Too few positions");
  check(model.workflows.length >= 12, `${model.workflows.length} workflows`, "Too few workflows");
  check(
    model.cybercrowBaselines.length >= 8,
    `${model.cybercrowBaselines.length} CyberCrow baselines`,
    "Too few CyberCrow baselines"
  );
  check(
    model.sareaProfiles.length >= 10,
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
    "Healthcare Operations",
    "Patient Services",
    "Front Desk",
    "Nursing",
    "Pharmacy",
    "Procurement",
    "Privacy",
    "Quality",
    "CyberCrow",
    "Reporting",
  ];
  for (const fragment of requiredDeptNames) {
    const found = model.departments.some((d) => d.name.includes(fragment));
    check(found, `Department contains "${fragment}"`, `Missing department hint: ${fragment}`);
  }

  const requiredWorkflowFragments = [
    "Patient service",
    "Appointment",
    "escalation",
    "workforce",
    "Supplies",
    "Supplier",
    "safety",
    "Quality",
    "Privacy",
    "Billing",
    "access",
    "Monthly healthcare",
    "CyberCrow incident",
  ];
  for (const fragment of requiredWorkflowFragments) {
    const found = model.workflows.some((w) => w.name.toLowerCase().includes(fragment.toLowerCase()));
    check(found, `Workflow includes "${fragment}"`, `Missing workflow hint: ${fragment}`);
  }

  const hipaaInModel = [...model.positions, ...model.cybercrowBaselines].some((item) => {
    const blob = JSON.stringify(item).toLowerCase();
    return blob.includes("hipaa");
  });
  check(!hipaaInModel, "Sector template avoids HIPAA as a compliance claim", "HIPAA reference in sector template");

  console.log("\n=== Module recommendations (live vs future) ===\n");

  for (const key of HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS) {
    check(VALID_CEM.has(key), `CEM module "${key}" exists`, `Invalid CEM module key: ${key}`);
  }

  for (const erpKey of HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS) {
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

  for (const futureKey of HEALTHCARE_FUTURE_READINESS_KEYS) {
    check(
      !VALID_CEM.has(futureKey),
      `Future-only key "${futureKey}" is not a live CEM module`,
      `Future key "${futureKey}" must not be a live CEM module`
    );
  }

  const forbiddenStackModules = ["logistics", "warehouse", "inventory"];
  for (const mod of forbiddenStackModules) {
    check(
      !HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS.includes(
        mod as (typeof HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS)[number]
      ),
      `Healthcare CEM recommendations exclude "${mod}"`,
      `Healthcare should not recommend stack module "${mod}"`
    );
  }

  console.log("\n=== Sector isolation (no logistics/retail/construction/aviation leakage) ===\n");

  const logisticsLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("dispatch") ||
      d.name.toLowerCase().includes("fleet") ||
      d.name.toLowerCase().includes("warehouse operations")
  );
  const retailLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("store management") ||
      d.name.toLowerCase().includes("merchandising")
  );
  const constructionLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("site operations") ||
      d.name.toLowerCase().includes("project management") ||
      d.name.toLowerCase().includes("document control")
  );
  const aviationLeak = model.departments.some(
    (d) =>
      d.name.toLowerCase().includes("ground operations") ||
      d.name.toLowerCase().includes("passenger / customer service") ||
      d.name.toLowerCase().includes("aviation operations")
  );
  check(
    !logisticsLeak,
    "No logistics-specific department names in healthcare model",
    "Logistics leakage in healthcare departments"
  );
  check(
    !retailLeak,
    "No retail-specific department names in healthcare model",
    "Retail leakage in healthcare departments"
  );
  check(
    !constructionLeak,
    "No construction-specific department names in healthcare model",
    "Construction leakage in healthcare departments"
  );
  check(
    !aviationLeak,
    "No aviation-specific department names in healthcare model",
    "Aviation leakage in healthcare departments"
  );

  console.log("\n=== Discovery JSON pack ===\n");

  const healthcareJsonPath = join(process.cwd(), "src/lib/discovery-templates/healthcare.json");
  const healthcareJson = JSON.parse(readFileSync(healthcareJsonPath, "utf8")) as {
    key: string;
    moduleKeys: string[];
    departments: { name: string }[];
    workflows: { name: string }[];
    security?: { ncaAlignment?: string };
    organization?: { discoveryNotes?: string };
  };
  check(
    healthcareJson.key === "healthcare",
    "healthcare.json key is healthcare",
    "healthcare.json key mismatch"
  );
  check(
    healthcareJson.departments.length >= 12,
    `healthcare.json has ${healthcareJson.departments.length} departments`,
    "healthcare.json too few departments"
  );
  for (const mod of healthcareJson.moduleKeys) {
    check(
      VALID_CEM.has(mod),
      `healthcare.json module "${mod}" is valid CEM`,
      `Invalid module in healthcare.json: ${mod}`
    );
  }
  check(
    healthcareJson.security?.ncaAlignment === "readiness_notes_only",
    "healthcare.json uses readiness_notes_only compliance posture",
    "healthcare.json should not imply live compliance certification"
  );
  const notes = healthcareJson.organization?.discoveryNotes?.toLowerCase() ?? "";
  check(
    notes.includes("emr") || notes.includes("clinical decision"),
    "healthcare.json notes clarify not EMR/clinical decision tool",
    "healthcare.json should note EMR/clinical boundary"
  );

  console.log("\n=== Discovery guidance & blueprint hints ===\n");

  const guidance = resolveSectorGuidance({ sectorTemplateKey: "healthcare" });
  check(
    guidance.sectorKey === "healthcare",
    "Sector guidance resolves for healthcare",
    "Guidance sector mismatch"
  );
  check(
    guidance.blueprintNotes.length >= 4,
    `${guidance.blueprintNotes.length} blueprint notes`,
    "Too few blueprint notes"
  );
  const forbiddenClaims = [
    "hipaa compliant",
    "hipaa certified",
    "nphies integrated",
    "medical compliance certified",
    "clinical safety certified",
    "guarantees patient data protection",
    "siem integrated",
    "autonomous ai detection is live",
    "autonomous ai is live",
    "trusted by",
    "live customer",
    "production launch",
    "replaces your emr",
  ];
  const hintLines = [
    ...guidance.cybercrowHints,
    ...guidance.sareaHints,
    ...guidance.blueprintNotes,
    ...guidance.securityHints,
    guidance.whyItMatters,
    ...guidance.departmentHints,
  ];
  const negationBefore = (line: string, phrase: string) => {
    const lower = line.toLowerCase();
    const idx = lower.indexOf(phrase);
    if (idx < 0) return false;
    const before = lower.slice(Math.max(0, idx - 96), idx);
    return (
      before.includes("do not claim") ||
      before.includes("don't claim") ||
      before.includes("not claim") ||
      before.includes("without implying") ||
      before.includes("not certified") ||
      before.includes("not a live") ||
      before.includes("not ") ||
      before.endsWith("not")
    );
  };
  const positiveForbidden = forbiddenClaims.filter((phrase) =>
    hintLines.some((line) => {
      const lower = line.toLowerCase();
      return lower.includes(phrase) && !negationBefore(line, phrase);
    })
  );
  check(
    positiveForbidden.length === 0,
    "Guidance avoids forbidden HIPAA/NPHIES/certification/SIEM claims",
    `Guidance contains forbidden claim phrasing: ${positiveForbidden.join(", ")}`
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
  check(
    guidance.securityHints.some((h) => h.toLowerCase().includes("emr") || h.toLowerCase().includes("ehr")),
    "Security hints clarify EMR/EHR boundary",
    "Missing EMR/EHR boundary in security hints"
  );

  console.log("\n=== Summary ===\n");
  if (passed) {
    console.log("Healthcare sector template verification PASSED.\n");
    process.exit(0);
  } else {
    console.error("Healthcare sector template verification FAILED.\n");
    process.exit(1);
  }
}

main();
