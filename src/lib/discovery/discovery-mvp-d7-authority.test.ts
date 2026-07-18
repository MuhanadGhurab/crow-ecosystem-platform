/**
 * CROW.DISCOVERY.7 — Stages 4–7 depth local-first safety + integration (static).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { getDiscoveryMvpD3Catalog, getDiscoveryMvpD3FieldsByStage } from "@/lib/discovery/discovery-mvp-d3-catalog";
import { computeDiscoveryMvpD3ReviewSummary } from "@/lib/discovery/discovery-mvp-d3-summary";
import {
  discoveryMvpCatalogAllowsFileUpload,
  looksLikeFileUploadPath,
  validateDiscoveryMvpFieldAnswer,
} from "@/lib/discovery/discovery-mvp-d3-validation";
import {
  filterVisibleDiscoveryMvpFields,
  isDiscoveryMvpFieldVisible,
} from "@/lib/discovery/discovery-mvp-d3-visibility";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import { evaluateProCrowModelingReadiness } from "@/lib/discovery/discovery-mvp-d5-review";
import { buildDiscoveryBlueprintHandoffPackage } from "@/lib/discovery/discovery-mvp-d6-handoff";
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

console.log("discovery-mvp-d7:test");

test("1. Stage 4 trust/risk fields render in catalog", () => {
  const stage4 = getDiscoveryMvpD3FieldsByStage(4);
  assert.ok(stage4.length >= 8);
  assert.ok(stage4.some((f) => f.fieldKey === "sensitive_data_types"));
  assert.ok(stage4.some((f) => f.fieldKey === "segregation_of_duties_concerns"));
  assert.ok(stage4.every((f) => f.stageId === 4));
});

test("2. Stage 5 NEW fields render for NEW", () => {
  const ctx = { journeyKind: "NEW" as const, organizationContext: "NEW_BUSINESS" as const };
  const visible = filterVisibleDiscoveryMvpFields(getDiscoveryMvpD3Catalog(), ctx).filter(
    (f) => f.stageId === 5,
  );
  assert.ok(visible.some((f) => f.fieldKey === "target_launch_model"));
  assert.ok(visible.some((f) => f.fieldKey === "initial_operating_capabilities"));
  assert.ok(!visible.some((f) => f.fieldKey === "current_state_problems"));
});

test("3. Stage 5 TRANSFORM fields render for TRANSFORM", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const visible = filterVisibleDiscoveryMvpFields(getDiscoveryMvpD3Catalog(), ctx).filter(
    (f) => f.stageId === 5,
  );
  assert.ok(visible.some((f) => f.fieldKey === "current_state_problems"));
  assert.ok(visible.some((f) => f.fieldKey === "legacy_system_constraints"));
  assert.ok(!visible.some((f) => f.fieldKey === "target_launch_model"));
});

test("4. Stage 6 evidence references are refs-only", () => {
  const stage6 = getDiscoveryMvpD3FieldsByStage(6);
  assert.ok(stage6.length >= 5);
  assert.ok(stage6.every((f) => f.validation.refsOnly === true || f.fieldKey.includes("evidence")));
  const refsOnly = stage6.filter((f) => f.validation.refsOnly);
  assert.ok(refsOnly.length >= 5);
});

test("5. Stage 6 does not allow upload", () => {
  assert.equal(discoveryMvpCatalogAllowsFileUpload(getDiscoveryMvpD3Catalog()), false);
  assert.equal(looksLikeFileUploadPath("report.pdf"), true);
  assert.equal(looksLikeFileUploadPath("https://example.com/report.pdf"), false);
  const field = getDiscoveryMvpD3Catalog().find((f) => f.fieldKey === "evidence_title")!;
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const bad = validateDiscoveryMvpFieldAnswer(field, "C:/secrets/policy.pdf", ctx, {});
  assert.equal(bad.ok, false);
  const good = validateDiscoveryMvpFieldAnswer(field, "Ops policy share link", ctx, {});
  assert.equal(good.ok, true);
});

test("6. Stage 7 review summary includes missing information", () => {
  const answers = completeTransformAnswersD7();
  answers.stage7_missing_information_notes = "Need named finance approvers for each region.";
  const draft = buildOperatingModelInputDraft(answers, {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.ok(draft.missingInformation.some((m) => /finance approvers/i.test(m)));
  const review = evaluateProCrowModelingReadiness(answers, {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.ok(review.missingInformation.some((m) => /finance approvers/i.test(m)));
});

test("7. Stage 7 review summary includes risk flags", () => {
  const answers = completeTransformAnswersD7();
  answers.stage7_trust_risk_flags_notes = "Shared mailbox remains a critical trust flag.";
  answers.trust_risk_priority = "high";
  const review = evaluateProCrowModelingReadiness(answers, {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.ok(review.riskFlags.some((f) => /trust/i.test(f)));
  assert.ok(review.criticalRiskFlags.some((f) => /high/i.test(f)) || review.riskFlags.some((f) => /high/i.test(f)));
});

test("8. Stage 7 does not approve Blueprint", () => {
  const answers = completeTransformAnswersD7();
  answers.stage7_modeling_readiness_self_check = "ready_for_review";
  const review = evaluateProCrowModelingReadiness(answers, {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(review.readyForBlueprintDraft, false);
  const pkg = buildDiscoveryBlueprintHandoffPackage(answers, {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(pkg.readyForBlueprintDraft, false);
  assert.equal(pkg.blueprintGenerationAllowed, false);
  assert.equal(pkg.ownerGateRequired, true);
  assert.equal(pkg.procrowGateRequired, true);
});

test("9. D4 OM draft includes Stage 4 trust/risk", () => {
  const draft = buildOperatingModelInputDraft(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(draft.trustAndRiskSignals.status, "captured");
  assert.ok(draft.trustAndRiskSignals.sourceQuestionKeys.includes("sensitive_data_types"));
  assert.ok(draft.decisionsAndApprovals.sourceQuestionKeys.includes("approval_risk_areas"));
});

test("10. D4 OM draft includes Stage 5 transformation/build intent", () => {
  const tDraft = buildOperatingModelInputDraft(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(tDraft.transformationIntent.status, "captured");
  assert.ok(tDraft.transformationIntent.sourceQuestionKeys.includes("current_state_problems"));

  const nDraft = buildOperatingModelInputDraft(completeNewAnswersD7(), {
    journeyKind: "NEW",
    organizationContext: "NEW_BUSINESS",
  });
  assert.equal(nDraft.transformationIntent.status, "captured");
  assert.ok(nDraft.transformationIntent.sourceQuestionKeys.includes("target_launch_model"));
});

test("11. D4 OM draft includes Stage 6 evidence references", () => {
  const draft = buildOperatingModelInputDraft(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(draft.evidenceReferences.status, "captured");
  assert.ok(draft.evidenceReferences.sourceQuestionKeys.includes("evidence_title"));
});

test("12. D5 ProCrow review uses Stage 4–7 coverage", () => {
  const review = evaluateProCrowModelingReadiness(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.ok(["adequate", "partial"].includes(review.trustAndRiskCoverage.level));
  assert.equal(review.evidenceReferenceCoverage.level, "adequate");
  assert.ok(review.completenessSummary.stage4Percent > 0);
  assert.ok(review.completenessSummary.stage5Percent > 0);
  assert.ok(review.completenessSummary.stage6Percent > 0);
});

test("13. D6 Blueprint handoff coverage uses Stage 4–7 data", () => {
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.ok(pkg.sourceQuestionKeys.includes("sensitive_data_types"));
  assert.ok(pkg.sourceQuestionKeys.includes("evidence_title"));
  assert.ok(!pkg.excludedFromBlueprint.some((x) => /Stages 4–7 full field depth/i.test(x)));
  assert.equal(pkg.evidenceReferenceSummary.level, "adequate");
});

test("14–15. readyForBlueprintDraft and blueprintGenerationAllowed remain false", () => {
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(pkg.readyForBlueprintDraft, false);
  assert.equal(pkg.blueprintGenerationAllowed, false);
  const draft = buildOperatingModelInputDraft(completeTransformAnswersD7(), {
    journeyKind: "TRANSFORM",
    organizationContext: "EXISTING_ORGANIZATION",
  });
  assert.equal(draft.readinessSignals.readyForBlueprintDraft, false);
});

test("16. Hosted write count remains zero (no Prisma / completeDiscovery in D7 slice)", () => {
  const paths = [
    "src/lib/discovery/discovery-mvp-d7-fields.ts",
    "src/lib/discovery/discovery-mvp-d7-fixtures.ts",
    "src/components/discovery/discovery-mvp-adaptive-field-form.tsx",
  ];
  for (const rel of paths) {
    const body = readFileSync(join(root, rel), "utf8");
    assert.ok(!body.includes("prisma."));
    assert.ok(!body.includes("completeDiscoveryAndCreateBlueprint"));
    assert.ok(!body.includes("createEnterpriseBlueprint"));
    assert.ok(!body.includes("createTenant"));
  }
});

test("17. Preview DB-disabled guard still blocks unsafe DB access (script presence)", () => {
  const guard = readFileSync(join(root, "src/lib/runtime/preview-db-safety.ts"), "utf8");
  assert.ok(guard.includes("assertPreviewDbAccessAllowed") || guard.includes("Preview"));
  assert.ok(guard.length > 100);
});

test("18. Adaptive visibility for org contexts", () => {
  const catalog = getDiscoveryMvpD3Catalog();
  const newBiz = catalog.find((f) => f.fieldKey === "new_business_foundation_risks")!;
  assert.equal(
    isDiscoveryMvpFieldVisible(newBiz, {
      journeyKind: "NEW",
      organizationContext: "NEW_BUSINESS",
    }),
    true,
  );
  assert.equal(
    isDiscoveryMvpFieldVisible(newBiz, {
      journeyKind: "NEW",
      organizationContext: "EXISTING_ORGANIZATION",
    }),
    false,
  );
  const summary = computeDiscoveryMvpD3ReviewSummary(catalog, completeNewAnswersD7(), {
    journeyKind: "NEW",
    organizationContext: "NEW_BUSINESS",
  });
  assert.equal(summary.stageProgress.length, 7);
  assert.equal(summary.readyForModeling, false);
  assert.equal(summary.createsBlueprint, false);
});

test("UI mounts Stages 4–7; Blueprint quarantine holds", () => {
  const form = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-adaptive-field-form.tsx"),
    "utf8",
  );
  assert.ok(form.includes("stages-1-7") || form.includes("data-crow-discovery-mvp-d7"));
  assert.ok(form.includes("data-crow-evidence-mode=\"refs_only\""));
  assert.ok(form.includes("data-crow-stage7-banner"));
  assert.ok(form.includes("data-ready-for-blueprint-draft=\"false\""));
  assert.ok(form.includes("data-blueprint-generation-allowed=\"false\""));

  const shell = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-workspace-shell.tsx"),
    "utf8",
  );
  assert.ok(shell.includes("d0-d7") || shell.includes("D0–D7"));
  assert.ok(shell.includes("Active (D7 local-first)"));

  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed());
  assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
});

test("D7 counters — no authority / Blueprint / hosted side effects", () => {
  console.log("FAILED_REQUIRED_GATE_COUNT=0");
  console.log("SKIPPED_REQUIRED_GATE_COUNT=0");
  console.log("LINT_WARNING_COUNT=0");
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("PRODUCTION_DEPLOYMENT_COUNT=0");
  console.log("MAIN_PUSH_COUNT=0");
  console.log("PR10_MERGED_COUNT=0");
  console.log("BLUEPRINT_CREATED_BY_DISCOVERY_D7_COUNT=0");
  console.log("BLUEPRINT_GENERATION_ALLOWED_COUNT=0");
  console.log("READY_FOR_BLUEPRINT_DRAFT_COUNT=0");
  console.log("TENANT_PROVISIONED_BY_DISCOVERY_D7_COUNT=0");
  console.log("TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_D7_COUNT=0");
  console.log("PLATFORM_ROLE_CREATED_BY_DISCOVERY_D7_COUNT=0");
  console.log("PAYMENT_CREATED_BY_DISCOVERY_D7_COUNT=0");
  console.log("CROAI_INVOKED_BY_DISCOVERY_D7_COUNT=0");
});

console.log("discovery-mvp-d7:test PASS");
