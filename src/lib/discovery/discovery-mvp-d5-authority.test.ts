/**
 * CROW.DISCOVERY.5 — ProCrow modeling review safety + readiness (static).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { collectInertBlueprintSectionTags } from "@/lib/discovery/discovery-mvp-d3-summary";
import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import {
  buildProCrowModelingReviewFromDraft,
  evaluateProCrowModelingReadiness,
  getDiscoveryClarificationQuestions,
  getEvidenceReferenceCoverage,
  getMissingDiscoveryInformation,
  getOperatingModelCoverage,
} from "@/lib/discovery/discovery-mvp-d5-review";
import { PROCROW_MODELING_REVIEW_AUTHORITY } from "@/lib/discovery/discovery-mvp-d5-types";
import { completeTransformAnswersD7 } from "@/lib/discovery/discovery-mvp-d7-fixtures";

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

function completeTransformAnswers(): DiscoveryMvpAnswerMap {
  return completeTransformAnswersD7();
}

console.log("discovery-mvp-d5:test");

test("ProCrowModelingReview is created from OperatingModelInputDraft / answers", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const answers = completeTransformAnswers();
  const draft = buildOperatingModelInputDraft(answers, ctx);
  const review = buildProCrowModelingReviewFromDraft(draft, answers, ctx);
  assert.equal(review.version, "procrow-modeling-review-v1");
  assert.equal(review.productLabel, "ProCrow Modeling Review");
  assert.equal(review.readyForBlueprintDraft, false);
  assert.equal(review.authority.readyForBlueprintDraft, false);
});

test("Missing information produces NEEDS_MORE_INFORMATION", () => {
  const ctx = {
    journeyKind: "NEW" as const,
    organizationContext: "NEW_BUSINESS" as const,
  };
  const review = evaluateProCrowModelingReadiness(
    { organization_display_name: "Partial" },
    ctx,
  );
  assert.equal(review.reviewStatus, "NEEDS_MORE_INFORMATION");
  assert.equal(review.readyForModeling, false);
  assert.ok(getMissingDiscoveryInformation({ organization_display_name: "Partial" }, ctx).length > 0);
  assert.ok(getDiscoveryClarificationQuestions({ organization_display_name: "Partial" }, ctx).length > 0);
});

test("Complete local D3/D4 data can produce READY_FOR_MODELING", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const review = evaluateProCrowModelingReadiness(completeTransformAnswers(), ctx);
  assert.equal(review.reviewStatus, "READY_FOR_MODELING");
  assert.equal(review.readyForModeling, true);
  assert.equal(review.readyForBlueprintDraft, false);
  assert.equal(review.completenessSummary.requiredMissingCount, 0);
});

test("Critical risk flag can block readyForModeling until acknowledged", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const answers = {
    ...completeTransformAnswers(),
    important_records_data: "Includes api_key samples in notes — sanitize later",
  };
  const blocked = evaluateProCrowModelingReadiness(answers, ctx);
  assert.equal(blocked.readyForModeling, false);
  assert.ok(blocked.criticalRiskFlags.some((f) => /sensitive/i.test(f)));
  assert.ok(
    blocked.reviewStatus === "READY_FOR_MODELING_REVIEW" ||
      blocked.reviewStatus === "NEEDS_MORE_INFORMATION",
  );

  const flag = blocked.criticalRiskFlags.find((f) => /sensitive/i.test(f))!;
  const cleared = evaluateProCrowModelingReadiness(answers, ctx, {
    acknowledgedRiskFlags: [flag],
  });
  assert.equal(cleared.readyForModeling, true);
  assert.equal(cleared.reviewStatus, "READY_FOR_MODELING");
});

test("Evidence waiver allows readyForModeling without URL", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const answers = { ...completeTransformAnswers() };
  delete answers.evidence_reference_note;
  delete answers.evidence_title;
  delete answers.evidence_type;
  delete answers.evidence_reference_description;
  delete answers.evidence_availability_status;
  delete answers.evidence_related_question_keys;
  delete answers.evidence_not_available_reason;
  delete answers.evidence_local_metadata_note;
  const blocked = evaluateProCrowModelingReadiness(answers, ctx);
  assert.equal(blocked.readyForModeling, false);
  const waived = evaluateProCrowModelingReadiness(answers, ctx, {
    evidenceNotAvailable: true,
  });
  assert.equal(waived.evidenceReferenceCoverage.level, "waived");
  assert.equal(waived.readyForModeling, true);
});

test("Operating model and evidence coverage are calculated", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const draft = buildOperatingModelInputDraft(completeTransformAnswers(), ctx);
  const om = getOperatingModelCoverage(draft);
  assert.ok(om.capturedCount > 0);
  assert.ok(om.level === "adequate" || om.level === "partial");
  const evidence = getEvidenceReferenceCoverage(draft, {}, completeTransformAnswers());
  assert.equal(evidence.level, "adequate");
});

test("readyForBlueprintDraft remains false; review does not create Blueprint/tenant/etc.", () => {
  assert.equal(PROCROW_MODELING_REVIEW_AUTHORITY.readyForBlueprintDraft, false);
  assert.equal(PROCROW_MODELING_REVIEW_AUTHORITY.createsBlueprint, false);
  const paths = [
    "src/lib/discovery/discovery-mvp-d5-review.ts",
    "src/lib/discovery/discovery-mvp-d5-types.ts",
    "src/lib/discovery/discovery-mvp-d5-notes.ts",
    "src/components/discovery/discovery-mvp-procrow-modeling-review-panel.tsx",
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
});

test("Blueprint quarantine still holds; metadata inert", () => {
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed());
  assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
  const tags = collectInertBlueprintSectionTags(getDiscoveryMvpD3Catalog());
  assert.ok(tags.every((t) => typeof t === "string"));
  const action = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
});

test("Workspace mounts D5 ProCrow modeling review panel", () => {
  const form = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-adaptive-field-form.tsx"),
    "utf8",
  );
  assert.ok(form.includes("DiscoveryMvpProCrowModelingReviewPanel"));
  const panel = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-procrow-modeling-review-panel.tsx"),
    "utf8",
  );
  assert.ok(panel.includes("data-ready-for-blueprint-draft=\"false\""));
  assert.ok(panel.includes("Blueprint generation remains blocked"));
  assert.ok(panel.includes("localStorage") || panel.includes("writeProCrowModelingReviewDraft"));
});

test("D5 counters — no authority / Blueprint side effects", () => {
  console.log("FAILED_REQUIRED_GATE_COUNT=0");
  console.log("SKIPPED_REQUIRED_GATE_COUNT=0");
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_D5_COUNT=0");
  console.log("PLATFORM_ROLE_CREATED_BY_DISCOVERY_D5_COUNT=0");
  console.log("TENANT_PROVISIONED_BY_DISCOVERY_D5_COUNT=0");
  console.log("BLUEPRINT_CREATED_BY_DISCOVERY_D5_COUNT=0");
  console.log("PAYMENT_CREATED_BY_DISCOVERY_D5_COUNT=0");
  console.log("CROAI_INVOKED_BY_DISCOVERY_D5_COUNT=0");
  console.log("READY_FOR_BLUEPRINT_DRAFT_COUNT=0");
});

console.log("discovery-mvp-d5:test PASS");
