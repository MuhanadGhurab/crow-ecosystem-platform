/**
 * CROW.DISCOVERY.5 — pure ProCrow modeling review helpers (local/test-safe).
 */

import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import { computeDiscoveryMvpD3ReviewSummary } from "@/lib/discovery/discovery-mvp-d3-summary";
import type {
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpAnswerMap,
} from "@/lib/discovery/discovery-mvp-d3-types";
import { isAnswerPresent } from "@/lib/discovery/discovery-mvp-d3-validation";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import type { OperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-types";
import {
  PROCROW_MODELING_REVIEW_AUTHORITY,
  PROCROW_MODELING_REVIEW_NON_CLAIMS,
  PROCROW_MODELING_REVIEW_VERSION,
  type CoverageSummary,
  type ProCrowModelingReview,
  type ProCrowModelingReviewOptions,
  type ProCrowModelingReviewStatus,
} from "@/lib/discovery/discovery-mvp-d5-types";

const SENSITIVE_SAMPLE_RE = /secret|password|ssn|api[_-]?key/i;

function coverageFromSections(
  draft: OperatingModelInputDraft,
  keys: Array<keyof OperatingModelInputDraft>,
  notes: string[] = [],
): CoverageSummary {
  let captured = 0;
  let missing = 0;
  for (const key of keys) {
    const section = draft[key];
    if (!section || typeof section !== "object" || !("status" in section)) continue;
    if (section.status === "captured") captured += 1;
    else if (section.status === "missing") missing += 1;
  }
  const total = captured + missing;
  let level: CoverageSummary["level"] = "none";
  if (total === 0) level = "none";
  else if (missing === 0 && captured > 0) level = "adequate";
  else if (captured > 0) level = "partial";
  else level = "none";
  return { level, capturedCount: captured, missingCount: missing, notes };
}

export function getMissingDiscoveryInformation(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): string[] {
  const draft = buildOperatingModelInputDraft(answers, ctx);
  return [...draft.missingInformation];
}

export function getDiscoveryClarificationQuestions(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): string[] {
  const draft = buildOperatingModelInputDraft(answers, ctx);
  const questions = [...draft.clarificationPrompts];
  const catalog = getDiscoveryMvpD3Catalog();
  const d3 = computeDiscoveryMvpD3ReviewSummary(catalog, answers, ctx);
  for (const key of d3.missingRequiredKeys) {
    const label = catalog.find((f) => f.fieldKey === key)?.label ?? key;
    questions.push(`Please provide: ${label}.`);
  }
  return [...new Set(questions)];
}

export function getOperatingModelCoverage(
  draft: OperatingModelInputDraft,
): CoverageSummary {
  return coverageFromSections(draft, [
    "purpose",
    "operatingContext",
    "organizationShape",
    "peopleAndTeams",
    "responsibilities",
    "workflows",
    "systemsAndTools",
    "dataAndRecords",
    "transformationIntent",
  ]);
}

export function getTrustRiskCoverage(draft: OperatingModelInputDraft): CoverageSummary {
  return coverageFromSections(draft, ["trustAndRiskSignals", "dataAndRecords", "decisionsAndApprovals"], [
    "Stage 4 trust/risk depth feeds ProCrow modeling review.",
  ]);
}

export function getEvidenceReferenceCoverage(
  draft: OperatingModelInputDraft,
  options: ProCrowModelingReviewOptions = {},
  answers: DiscoveryMvpAnswerMap = {},
): CoverageSummary {
  const availability = answers.evidence_availability_status
    ? String(answers.evidence_availability_status).trim()
    : "";
  if (options.evidenceNotAvailable || availability === "not_available_yet") {
    return {
      level: "waived",
      capturedCount: 0,
      missingCount: 0,
      notes: [
        availability === "not_available_yet"
          ? "Evidence availability marked not available yet (Stage 6 local waiver)."
          : "Evidence references explicitly marked not available (local waiver).",
      ],
    };
  }
  if (draft.evidenceReferences.status === "captured") {
    const hasStage6 =
      isAnswerPresent(answers.evidence_title) ||
      isAnswerPresent(answers.evidence_reference_description) ||
      isAnswerPresent(answers.evidence_reference_note) ||
      isAnswerPresent(answers.evidence_availability_status);
    return {
      level: "adequate",
      capturedCount: 1,
      missingCount: 0,
      notes: [
        hasStage6
          ? "Stage 6 evidence reference fields captured (refs-only)."
          : "Evidence references captured on Operating Model draft (refs-only).",
      ],
    };
  }
  return {
    level: "none",
    capturedCount: 0,
    missingCount: 1,
    notes: ["No evidence reference yet — provide Stage 6 refs or mark not available yet."],
  };
}

function detectContradictionFlags(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  draft: OperatingModelInputDraft,
): string[] {
  const flags: string[] = [];
  if (ctx.journeyKind === "NEW" && isAnswerPresent(answers.major_pain_points)) {
    flags.push("NEW journey has legacy pain-point answers that should not be required");
  }
  if (
    ctx.journeyKind === "TRANSFORM" &&
    draft.systemsAndTools.status === "not_applicable"
  ) {
    flags.push("TRANSFORM journey unexpectedly marked systems/tools as not applicable");
  }
  if (draft.purpose.status === "captured" && !ctx.journeyKind) {
    flags.push("Purpose captured without JourneyKind on request brief");
  }
  if (
    draft.readinessSignals.readyForProCrowReview &&
    draft.readinessSignals.missingCoreFieldCount > 0
  ) {
    flags.push("Internal contradiction: readyForProCrowReview with missing core fields");
  }
  return flags;
}

function detectCriticalRiskFlags(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  draft: OperatingModelInputDraft,
  evidence: CoverageSummary,
): string[] {
  const critical: string[] = [];
  if (draft.readinessSignals.missingCoreFieldCount > 0) {
    critical.push(
      `${draft.readinessSignals.missingCoreFieldCount} required Discovery field(s) still missing`,
    );
  }
  if (draft.purpose.status !== "captured") {
    critical.push("Purpose / mission objective not captured");
  }
  if (draft.organizationShape.status !== "captured") {
    critical.push("Organization shape not captured");
  }
  if (ctx.journeyKind === "TRANSFORM" && draft.systemsAndTools.status !== "captured") {
    critical.push("Transform journey without current systems/tools inventory");
  }
  if (ctx.journeyKind === "TRANSFORM" && !isAnswerPresent(answers.major_pain_points)) {
    critical.push("Transform journey without major pain points");
  }
  const records = answers.important_records_data;
  if (isAnswerPresent(records) && SENSITIVE_SAMPLE_RE.test(String(records))) {
    critical.push(
      "Data/records answer may contain sensitive sample values — ProCrow should sanitize",
    );
  }
  if (isAnswerPresent(answers.sensitive_data_types) && SENSITIVE_SAMPLE_RE.test(String(answers.sensitive_data_types))) {
    critical.push(
      "Sensitive data types answer may contain sample secrets — ProCrow should sanitize",
    );
  }
  if (isAnswerPresent(answers.trust_risk_priority) && String(answers.trust_risk_priority) === "high") {
    critical.push("Trust/risk priority marked high");
  }
  if (evidence.level === "none") {
    critical.push("Evidence references missing and not waived");
  }
  return critical;
}

/**
 * Evaluate ProCrow modeling readiness from Discovery answers + OM draft.
 * readyForBlueprintDraft is always false.
 */
export function evaluateProCrowModelingReadiness(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  options: ProCrowModelingReviewOptions = {},
): ProCrowModelingReview {
  const catalog = getDiscoveryMvpD3Catalog();
  const d3 = computeDiscoveryMvpD3ReviewSummary(catalog, answers, ctx);
  const draft = buildOperatingModelInputDraft(answers, ctx);
  const acknowledged = new Set(options.acknowledgedRiskFlags ?? []);

  const missingInformation = getMissingDiscoveryInformation(answers, ctx);
  const clarificationQuestions = getDiscoveryClarificationQuestions(answers, ctx);
  const operatingModelCoverage = getOperatingModelCoverage(draft);
  const trustAndRiskCoverage = getTrustRiskCoverage(draft);
  const evidenceReferenceCoverage = getEvidenceReferenceCoverage(draft, options, answers);
  const contradictionFlags = detectContradictionFlags(answers, ctx, draft);
  const criticalRiskFlagsAll = detectCriticalRiskFlags(
    answers,
    ctx,
    draft,
    evidenceReferenceCoverage,
  );
  const criticalRiskFlags = criticalRiskFlagsAll.filter((f) => !acknowledged.has(f));
  const riskFlags = [...new Set([...draft.riskFlags, ...criticalRiskFlagsAll])];

  const stagesComplete =
    d3.missingRequiredCount === 0 &&
    draft.purpose.status === "captured" &&
    draft.operatingContext.status === "captured" &&
    draft.organizationShape.status === "captured";

  const omCoreReady =
    draft.peopleAndTeams.status === "captured" &&
    draft.responsibilities.status === "captured" &&
    draft.workflows.status === "captured";

  const evidenceOk =
    evidenceReferenceCoverage.level === "adequate" ||
    evidenceReferenceCoverage.level === "waived";

  const noBlockers =
    criticalRiskFlags.length === 0 && contradictionFlags.length === 0 && evidenceOk;

  const readyForModeling = Boolean(
    ctx.journeyKind && stagesComplete && omCoreReady && noBlockers,
  );

  let reviewStatus: ProCrowModelingReviewStatus;
  if (!ctx.journeyKind) {
    reviewStatus = "NOT_READY";
  } else if (d3.missingRequiredCount > 0 || !stagesComplete || contradictionFlags.length > 0) {
    reviewStatus = "NEEDS_MORE_INFORMATION";
  } else if (readyForModeling) {
    reviewStatus = "READY_FOR_MODELING";
  } else if (draft.readinessSignals.readyForProCrowReview || stagesComplete) {
    reviewStatus = "READY_FOR_MODELING_REVIEW";
  } else {
    reviewStatus = "NEEDS_MORE_INFORMATION";
  }

  let recommendedNextAction: string;
  switch (reviewStatus) {
    case "NOT_READY":
      recommendedNextAction =
        "Ensure JourneyKind is present on the linked request brief before modeling review.";
      break;
    case "NEEDS_MORE_INFORMATION":
      recommendedNextAction =
        "Collect missing Discovery fields and resolve contradiction blockers with the client.";
      break;
    case "READY_FOR_MODELING_REVIEW":
      recommendedNextAction =
        "Acknowledge remaining critical risks or waive evidence, then confirm ready-for-modeling locally.";
      break;
    case "READY_FOR_MODELING":
      recommendedNextAction =
        "Package is locally ready for deeper modeling. Blueprint generation remains blocked (D6).";
      break;
    default: {
      const _exhaustive: never = reviewStatus;
      recommendedNextAction = _exhaustive;
    }
  }

  return {
    version: PROCROW_MODELING_REVIEW_VERSION,
    productLabel: "ProCrow Modeling Review",
    reviewStatus,
    completenessSummary: {
      stage1Percent: draft.readinessSignals.stageCompletenessPercent.stage1,
      stage2Percent: draft.readinessSignals.stageCompletenessPercent.stage2,
      stage3Percent: draft.readinessSignals.stageCompletenessPercent.stage3,
      stage4Percent: draft.readinessSignals.stageCompletenessPercent.stage4,
      stage5Percent: draft.readinessSignals.stageCompletenessPercent.stage5,
      stage6Percent: draft.readinessSignals.stageCompletenessPercent.stage6,
      stage7Percent: draft.readinessSignals.stageCompletenessPercent.stage7,
      overallCompletionPercent: draft.readinessSignals.overallCompletionPercent,
      requiredMissingCount: draft.readinessSignals.missingCoreFieldCount,
      omSectionsMissingCount: draft.readinessSignals.missingOperatingModelFieldCount,
    },
    missingInformation,
    riskFlags,
    criticalRiskFlags,
    contradictionFlags,
    clarificationQuestions,
    operatingModelCoverage,
    trustAndRiskCoverage,
    evidenceReferenceCoverage,
    recommendedNextAction,
    sourceQuestionKeys: draft.sourceQuestionKeys,
    operatorNotesDraft: options.operatorNotesDraft?.trim() ?? "",
    readyForModeling,
    readyForBlueprintDraft: false,
    authority: PROCROW_MODELING_REVIEW_AUTHORITY,
    nonClaims: PROCROW_MODELING_REVIEW_NON_CLAIMS,
  };
}

/** Convenience: evaluate from an existing OM draft + answers. */
export function buildProCrowModelingReviewFromDraft(
  draft: OperatingModelInputDraft,
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  options: ProCrowModelingReviewOptions = {},
): ProCrowModelingReview {
  void draft;
  return evaluateProCrowModelingReadiness(answers, ctx, options);
}
