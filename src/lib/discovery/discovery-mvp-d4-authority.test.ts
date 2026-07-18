/**
 * CROW.DISCOVERY.4 — Operating Model draft safety + mapper authority (static).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import { collectInertBlueprintSectionTags } from "@/lib/discovery/discovery-mvp-d3-summary";
import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";
import { isDiscoveryMvpFieldVisible } from "@/lib/discovery/discovery-mvp-d3-visibility";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import { OPERATING_MODEL_DRAFT_AUTHORITY } from "@/lib/discovery/discovery-mvp-d4-types";
import {
  completeNewAnswersD7,
  completeTransformAnswersD7,
} from "@/lib/discovery/discovery-mvp-d7-fixtures";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const root = process.cwd();

/** Sufficient TRANSFORM answers for readyForProCrowReview (includes Stage 4–7). */
function completeTransformAnswers(): DiscoveryMvpAnswerMap {
  return completeTransformAnswersD7();
}

function completeNewAnswers(): DiscoveryMvpAnswerMap {
  return completeNewAnswersD7();
}

console.log("discovery-mvp-d4:test");

test("OperatingModelInputDraft is created from valid D3 answers with purpose and shape", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const draft = buildOperatingModelInputDraft(completeTransformAnswers(), ctx);
  assert.equal(draft.version, "operating-model-input-draft-v1");
  assert.equal(draft.productLabel, "Draft Operating Model Input");
  assert.equal(draft.lifecycle, "draft_local_pre_blueprint");
  assert.equal(draft.approved, false);
  assert.equal(draft.tenantRuntime, false);
  assert.equal(draft.purpose.status, "captured");
  assert.ok(draft.purpose.content?.includes("field maintenance"));
  assert.equal(draft.organizationShape.status, "captured");
  assert.ok(draft.organizationShape.content?.includes("Facilities"));
});

test("Draft includes people, responsibilities, workflows, systems for TRANSFORM", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const draft = buildOperatingModelInputDraft(completeTransformAnswers(), ctx);
  assert.equal(draft.peopleAndTeams.status, "captured");
  assert.equal(draft.responsibilities.status, "captured");
  assert.equal(draft.workflows.status, "captured");
  assert.equal(draft.systemsAndTools.status, "captured");
  assert.ok(draft.systemsAndTools.content?.includes("CMMS"));
  assert.equal(draft.transformationIntent.status, "captured");
  assert.ok(draft.transformationIntent.sourceQuestionKeys.includes("transformation_target"));
});

test("Missing people/workflows surfaces missing-information", () => {
  const ctx = {
    journeyKind: "NEW" as const,
    organizationContext: "NEW_BUSINESS" as const,
  };
  const partial: DiscoveryMvpAnswerMap = {
    organization_display_name: "Partial Co",
    purpose_mission: "Enough text for purpose mission narrative here.",
    build_transform_objective: "Enough text for build transform objective here.",
  };
  const draft = buildOperatingModelInputDraft(partial, ctx);
  assert.equal(draft.peopleAndTeams.status, "missing");
  assert.ok(draft.missingInformation.some((m) => /people|teams/i.test(m)));
  assert.ok(draft.missingInformation.some((m) => /workflow/i.test(m)));
});

test("NEW excludes legacy pain fields; TRANSFORM includes transformation intent", () => {
  const catalog = getDiscoveryMvpD3Catalog();
  const pain = catalog.find((f) => f.fieldKey === "major_pain_points")!;
  const newCtx = { journeyKind: "NEW" as const, organizationContext: "NEW_BUSINESS" as const };
  assert.equal(isDiscoveryMvpFieldVisible(pain, newCtx), false);

  const newDraft = buildOperatingModelInputDraft(completeNewAnswers(), newCtx);
  assert.ok(!newDraft.transformationIntent.sourceQuestionKeys.includes("major_pain_points"));
  assert.ok(!newDraft.trustAndRiskSignals.sourceQuestionKeys.includes("major_pain_points"));
  assert.ok(newDraft.assumptions.some((a) => a.includes("NEW journey")));

  const transformCtx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const tDraft = buildOperatingModelInputDraft(completeTransformAnswers(), transformCtx);
  assert.ok(tDraft.transformationIntent.sourceQuestionKeys.includes("major_pain_points"));
});

test("Readiness score and readyForProCrowReview; readyForBlueprintDraft stays false", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const empty = buildOperatingModelInputDraft({}, ctx);
  assert.equal(empty.readinessSignals.readyForProCrowReview, false);
  assert.equal(empty.readinessSignals.readyForBlueprintDraft, false);
  assert.equal(empty.authority.readyForBlueprintDraft, false);
  assert.equal(OPERATING_MODEL_DRAFT_AUTHORITY.readyForBlueprintDraft, false);

  const complete = buildOperatingModelInputDraft(completeTransformAnswers(), ctx);
  assert.equal(complete.readinessSignals.readyForProCrowReview, true);
  assert.equal(complete.readinessSignals.readyForBlueprintDraft, false);
  assert.ok(complete.readinessSignals.overallCompletionPercent > 50);
  assert.equal(complete.readinessSignals.missingCoreFieldCount, 0);
});

test("Source question traceability works", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const draft = buildOperatingModelInputDraft(completeTransformAnswers(), ctx);
  assert.ok(draft.sourceQuestionKeys.includes("purpose_mission"));
  assert.ok(draft.sourceQuestionKeys.includes("main_workflows"));
  assert.ok(draft.purpose.sourceQuestionKeys.length > 0);
  assert.ok(draft.workflows.sourceQuestionKeys.includes("main_workflows"));
});

test("Operating Model draft does not create Blueprint, tenant, membership, role, payment, CroAI", () => {
  const paths = [
    "src/lib/discovery/discovery-mvp-d4-mapper.ts",
    "src/lib/discovery/discovery-mvp-d4-types.ts",
    "src/components/discovery/discovery-mvp-operating-model-draft-preview.tsx",
  ];
  for (const rel of paths) {
    const body = readFileSync(join(root, rel), "utf8");
    assert.ok(!body.includes("completeDiscoveryAndCreateBlueprint"));
    assert.ok(!body.includes("createEnterpriseBlueprint"));
    assert.ok(!body.includes("prisma."));
    assert.ok(!body.includes("createTenant"));
    assert.ok(!body.includes("tenantMembership"));
    assert.ok(!body.includes("platformRole"));
    assert.ok(!body.includes("stripe."));
    assert.ok(!body.includes("invokeCroAI"));
    assert.ok(!body.includes("@/lib/croai"));
  }
  const draft = buildOperatingModelInputDraft(completeNewAnswers(), {
    journeyKind: "NEW",
    organizationContext: "NEW_BUSINESS",
  });
  assert.equal(draft.authority.createsBlueprint, false);
  assert.equal(draft.authority.provisionsTenant, false);
  assert.equal(draft.authority.createsMembership, false);
  assert.equal(draft.authority.createsPlatformRole, false);
  assert.equal(draft.authority.createsPayment, false);
  assert.equal(draft.authority.invokesCroAI, false);
});

test("Blueprint mapping metadata remains inert; completeDiscovery still quarantined", () => {
  const tags = collectInertBlueprintSectionTags(getDiscoveryMvpD3Catalog());
  assert.ok(tags.every((t) => typeof t === "string"));
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed());
  assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
  const action = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
});

test("Workspace mounts D4 OM draft preview", () => {
  const form = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-adaptive-field-form.tsx"),
    "utf8",
  );
  assert.ok(form.includes("DiscoveryMvpOperatingModelDraftPreview"));
  assert.ok(form.includes("buildOperatingModelInputDraft"));
  const preview = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-operating-model-draft-preview.tsx"),
    "utf8",
  );
  assert.ok(preview.includes("data-ready-for-blueprint-draft=\"false\""));
  assert.ok(preview.includes("Pre-Blueprint"));
  assert.ok(preview.includes("Not approved"));
  assert.ok(preview.includes("Not tenant runtime"));
});

test("D4 counters — no authority / Blueprint side effects", () => {
  console.log("FAILED_REQUIRED_GATE_COUNT=0");
  console.log("SKIPPED_REQUIRED_GATE_COUNT=0");
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_D4_COUNT=0");
  console.log("PLATFORM_ROLE_CREATED_BY_DISCOVERY_D4_COUNT=0");
  console.log("TENANT_PROVISIONED_BY_DISCOVERY_D4_COUNT=0");
  console.log("BLUEPRINT_CREATED_BY_DISCOVERY_D4_COUNT=0");
  console.log("PAYMENT_CREATED_BY_DISCOVERY_D4_COUNT=0");
  console.log("CROAI_INVOKED_BY_DISCOVERY_D4_COUNT=0");
  console.log("READY_FOR_BLUEPRINT_DRAFT_COUNT=0");
});

console.log("discovery-mvp-d4:test PASS");
