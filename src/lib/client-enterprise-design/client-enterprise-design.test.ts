import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { buildScaleProfile } from "@/lib/model-forge/scale/tenant-scale";
import {
  assertIndustryPurposeCoverage,
  BUSINESS_PURPOSE_FAMILY_COUNT,
  analyzeClientDesignImpact,
  composeClientEnterpriseDesign,
  normalizeDesignInputForHash,
  emptyClientEnterpriseDesignDraft,
  draftToInput,
  buildLeanResponsibleOperatingModel,
  sanitizeDraftForPersistence,
} from "@/lib/client-enterprise-design";
import { MODEL_VARIANT_BASELINES } from "@/lib/client-enterprise-design/comparisons/model-variants";

const baseInput = {
  primaryIndustry: "professional_services",
  secondaryIndustries: [] as string[],
  specialistDomains: ["legal_services"],
  businessPurposes: ["manage_cases", "deliver_professional_services"],
  primaryPurposeKey: "manage_cases",
  currentScale: "SMALL_TEAM",
  targetScale: "GROWING_ORGANIZATION",
  scaleDimensions: {},
  operatingPriority: "LEAN_RESPONSIBLE" as const,
  selectedCapabilities: ["case_management", "crm"],
  selectedModelVariant: "STARTER" as const,
};

const coverage = assertIndustryPurposeCoverage();
assert.equal(coverage.gaps.length, 0, `purpose coverage gaps: ${coverage.gaps.join(", ")}`);
assert.ok(BUSINESS_PURPOSE_FAMILY_COUNT >= 20);

const a = composeClientEnterpriseDesign(baseInput);
const b = composeClientEnterpriseDesign(baseInput);
assert.equal(normalizeDesignInputForHash(baseInput), normalizeDesignInputForHash(baseInput));
assert.equal(a.recommendedVariant, b.recommendedVariant);
assert.deepEqual(a.recommendedCapabilities, b.recommendedCapabilities);

const purposeChanged = composeClientEnterpriseDesign({
  ...baseInput,
  businessPurposes: ["operate_logistics"],
  primaryPurposeKey: "operate_logistics",
});
assert.notDeepEqual(a.recommendedCapabilities, purposeChanged.recommendedCapabilities);

const lean = buildLeanResponsibleOperatingModel({
  input: baseInput,
  variant: MODEL_VARIANT_BASELINES.STARTER,
  personaKeys: a.recommendedPersonaKeys,
  currentScale: buildScaleProfile("SMALL_TEAM"),
  targetScale: buildScaleProfile("GROWING_ORGANIZATION"),
});
assert.ok(lean.estimatedCoreTeamRange.min <= lean.estimatedCoreTeamRange.max);
assert.ok(lean.disclaimer.includes("not legal"));
assert.ok(lean.disclaimer.includes("guarantee"));

const impact = analyzeClientDesignImpact({
  baselineInput: baseInput,
  action: { id: "1", kind: "remove_capability", targetKey: "crm" },
});
assert.ok(impact.workforceImpact.length > 0);
assert.ok(impact.simpleSummary.length > 0);

const draft = emptyClientEnterpriseDesignDraft("req_test");
const snapshotHash = createHash("sha256")
  .update(JSON.stringify(sanitizeDraftForPersistence(draft)))
  .digest("hex")
  .slice(0, 16);
assert.equal(snapshotHash.length, 16);
assert.equal(draftToInput(draft).operatingPriority, "LEAN_RESPONSIBLE");

console.log("client-enterprise-design: PASS");
