/**
 * CROW.DISCOVERY.6 — pure Blueprint handoff helpers (local/test-safe).
 * Does not create Blueprint, call completeDiscovery, or enable generation.
 */

import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import type {
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpAnswerMap,
} from "@/lib/discovery/discovery-mvp-d3-types";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import type { OperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-types";
import { evaluateProCrowModelingReadiness } from "@/lib/discovery/discovery-mvp-d5-review";
import type {
  ProCrowModelingReview,
  ProCrowModelingReviewOptions,
} from "@/lib/discovery/discovery-mvp-d5-types";
import {
  DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY,
  DISCOVERY_BLUEPRINT_HANDOFF_NON_CLAIMS,
  DISCOVERY_BLUEPRINT_HANDOFF_VERSION,
  FUTURE_BLUEPRINT_HANDOFF_SECTIONS,
  type BlueprintSectionCoverageItem,
  type DiscoveryBlueprintHandoffPackage,
  type DiscoveryBlueprintHandoffStatus,
} from "@/lib/discovery/discovery-mvp-d6-types";

export type BlueprintHandoffOptions = ProCrowModelingReviewOptions;

export function getBlueprintHandoffRequiredApprovals(): string[] {
  return [
    "ProCrow modeling review (ready-for-modeling)",
    "Owner authorization for any future Blueprint drafting milestone",
    "Future Blueprint drafting milestone (not D6)",
    "GAP-004 Preview/Production DB isolation before hosted Blueprint persistence",
  ];
}

export function getBlueprintHandoffBlockers(
  review: ProCrowModelingReview,
): string[] {
  const blockers: string[] = [];
  if (!review.readyForModeling) {
    blockers.push("D5 readyForModeling is false");
  }
  if (review.completenessSummary.requiredMissingCount > 0) {
    blockers.push(
      `${review.completenessSummary.requiredMissingCount} required Discovery field(s) missing`,
    );
  }
  for (const flag of review.criticalRiskFlags) {
    blockers.push(`Critical risk: ${flag}`);
  }
  for (const flag of review.contradictionFlags) {
    blockers.push(`Contradiction: ${flag}`);
  }
  if (
    review.evidenceReferenceCoverage.level !== "adequate" &&
    review.evidenceReferenceCoverage.level !== "waived"
  ) {
    blockers.push("Evidence references missing and not waived");
  }
  return blockers;
}

export function getBlueprintSectionCoverage(
  draft: OperatingModelInputDraft,
  answers: DiscoveryMvpAnswerMap,
): BlueprintSectionCoverageItem[] {
  const catalog = getDiscoveryMvpD3Catalog();
  return FUTURE_BLUEPRINT_HANDOFF_SECTIONS.map((section) => {
    let captured = 0;
    let missing = 0;
    const sourceQuestionKeys: string[] = [];
    for (const key of section.omKeys) {
      const omSection = draft[key];
      if (!omSection || typeof omSection !== "object" || !("status" in omSection)) {
        continue;
      }
      sourceQuestionKeys.push(...omSection.sourceQuestionKeys);
      if (omSection.status === "captured") captured += 1;
      else if (omSection.status === "missing") missing += 1;
    }
    const inertCatalogTags = [
      ...new Set(
        catalog
          .filter((f) =>
            (section.catalogTags as readonly string[]).includes(f.mapsToBlueprintSection),
          )
          .map((f) => f.mapsToBlueprintSection),
      ),
    ];
    // Prove answers exist for traced keys without mutating Blueprint systems.
    void answers;
    let level: BlueprintSectionCoverageItem["level"] = "none";
    const total = captured + missing;
    if (section.sectionKey === "evidence_and_assumptions" && draft.evidenceReferences.status === "captured") {
      level = "adequate";
    } else if (total === 0) {
      level = "none";
    } else if (missing === 0 && captured > 0) {
      level = "adequate";
    } else if (captured > 0) {
      level = "partial";
    } else {
      level = "none";
    }
    return {
      sectionKey: section.sectionKey,
      label: section.label,
      level,
      capturedCount: captured,
      missingCount: missing,
      sourceQuestionKeys: [...new Set(sourceQuestionKeys)],
      inertCatalogTags,
    };
  });
}

function resolveHandoffStatus(
  review: ProCrowModelingReview,
  readyForBlueprintHandoff: boolean,
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryBlueprintHandoffStatus {
  if (!ctx.journeyKind) return "NOT_READY";
  if (readyForBlueprintHandoff) return "READY_FOR_FUTURE_BLUEPRINT_DRAFTING";
  if (review.readyForModeling) return "OWNER_GATE_REQUIRED";
  if (
    review.reviewStatus === "READY_FOR_MODELING" ||
    review.reviewStatus === "READY_FOR_MODELING_REVIEW"
  ) {
    return "READY_FOR_MODELING";
  }
  if (review.reviewStatus === "NOT_READY") return "NOT_READY";
  return "NEEDS_MORE_INFORMATION";
}

/**
 * Evaluate whether Discovery may produce a pre-Blueprint handoff package.
 * Never sets readyForBlueprintDraft or blueprintGenerationAllowed true.
 */
export function evaluateBlueprintHandoffReadiness(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  options: BlueprintHandoffOptions = {},
): {
  readyForBlueprintHandoff: boolean;
  blockers: string[];
  review: ProCrowModelingReview;
  draft: OperatingModelInputDraft;
} {
  const draft = buildOperatingModelInputDraft(answers, ctx);
  const review = evaluateProCrowModelingReadiness(answers, ctx, options);
  const blockers = getBlueprintHandoffBlockers(review);
  const omExists =
    draft.purpose.status === "captured" ||
    draft.organizationShape.status === "captured" ||
    draft.sourceQuestionKeys.length > 0;
  const readyForBlueprintHandoff = Boolean(
    review.readyForModeling &&
      omExists &&
      blockers.length === 0 &&
      review.contradictionFlags.length === 0,
  );
  return { readyForBlueprintHandoff, blockers, review, draft };
}

/**
 * Build the local Discovery → Blueprint handoff package.
 * Pure / test-safe — does not persist, migrate, or generate Blueprint.
 */
export function buildDiscoveryBlueprintHandoffPackage(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  options: BlueprintHandoffOptions = {},
): DiscoveryBlueprintHandoffPackage {
  const { readyForBlueprintHandoff, blockers, review, draft } =
    evaluateBlueprintHandoffReadiness(answers, ctx, options);
  const handoffStatus = resolveHandoffStatus(review, readyForBlueprintHandoff, ctx);
  const blueprintSectionCoverage = getBlueprintSectionCoverage(draft, answers);
  const requiredApprovals = getBlueprintHandoffRequiredApprovals();

  let recommendedNextAction: string;
  switch (handoffStatus) {
    case "NOT_READY":
      recommendedNextAction =
        "Ensure JourneyKind is present and Discovery Stages 1–7 have started before handoff.";
      break;
    case "NEEDS_MORE_INFORMATION":
      recommendedNextAction =
        "Resolve missing information, contradictions, and critical risks in D5 review before handoff.";
      break;
    case "READY_FOR_MODELING":
      recommendedNextAction =
        "Complete local ready-for-modeling criteria (acknowledge risks / waive evidence as needed).";
      break;
    case "OWNER_GATE_REQUIRED":
      recommendedNextAction =
        "Handoff package is prepared; owner and ProCrow gates remain required before any future Blueprint drafting.";
      break;
    case "READY_FOR_FUTURE_BLUEPRINT_DRAFTING":
      recommendedNextAction =
        "Local handoff package is ready for a future owner-authorized Blueprint drafting milestone. Generation remains blocked in D6.";
      break;
    default: {
      const _exhaustive: never = handoffStatus;
      recommendedNextAction = _exhaustive;
    }
  }

  if (blockers.length > 0 && handoffStatus !== "READY_FOR_FUTURE_BLUEPRINT_DRAFTING") {
    recommendedNextAction = `${recommendedNextAction} Blockers: ${blockers.slice(0, 3).join("; ")}.`;
  }

  return {
    version: DISCOVERY_BLUEPRINT_HANDOFF_VERSION,
    productLabel: "Discovery Blueprint Handoff Package",
    lifecycle: "pre_blueprint_local_handoff",
    handoffStatus,
    sourceDiscoverySummary: {
      journeyKind: ctx.journeyKind,
      organizationContext: ctx.organizationContext,
      overallCompletionPercent: review.completenessSummary.overallCompletionPercent,
      requiredMissingCount: review.completenessSummary.requiredMissingCount,
      answeredFieldHint: `${review.sourceQuestionKeys.length} source question key(s) traced`,
    },
    operatingModelInputDraftSummary: {
      productLabel: draft.productLabel,
      lifecycle: draft.lifecycle,
      purposeStatus: draft.purpose.status,
      organizationShapeStatus: draft.organizationShape.status,
      readyForProCrowReview: draft.readinessSignals.readyForProCrowReview,
      missingInformationCount: draft.missingInformation.length,
    },
    procrowModelingReviewSummary: {
      reviewStatus: review.reviewStatus,
      readyForModeling: review.readyForModeling,
      criticalRiskCount: review.criticalRiskFlags.length,
      contradictionCount: review.contradictionFlags.length,
      recommendedNextAction: review.recommendedNextAction,
    },
    requiredApprovals,
    missingInformation: [...review.missingInformation],
    riskFlags: [...review.riskFlags],
    contradictionFlags: [...review.contradictionFlags],
    evidenceReferenceSummary: {
      level: review.evidenceReferenceCoverage.level,
      notes: [...review.evidenceReferenceCoverage.notes],
    },
    sourceQuestionKeys: [...new Set([...draft.sourceQuestionKeys, ...review.sourceQuestionKeys])],
    blueprintSectionCoverage,
    excludedFromBlueprint: [
      "Enterprise Blueprint record creation",
      "Blueprint draft persistence",
      "Discovery Complete → Blueprint path",
      "Tenant provisioning",
      "Tenant membership / platform roles",
      "Payment / CroAI",
      "Hosted evidence file storage / uploads",
    ],
    assumptions: [
      ...draft.assumptions,
      "Handoff is local-first and advisory only.",
      "Owner gate and ProCrow gate remain mandatory before Blueprint drafting.",
    ],
    ownerGateRequired: true,
    procrowGateRequired: true,
    readyForBlueprintHandoff,
    readyForBlueprintDraft: false,
    blueprintGenerationAllowed: false,
    recommendedNextAction,
    authority: DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY,
    nonClaims: DISCOVERY_BLUEPRINT_HANDOFF_NON_CLAIMS,
  };
}
