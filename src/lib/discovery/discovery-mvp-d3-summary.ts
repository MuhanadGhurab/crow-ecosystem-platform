/**
 * CROW.DISCOVERY.3 — local ProCrow review preparation summary (pure).
 * Does not mark ready-for-modeling or create Blueprint.
 */

import type {
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpAnswerMap,
  DiscoveryMvpFieldDefinition,
  DiscoveryMvpStageProgress,
} from "@/lib/discovery/discovery-mvp-d3-types";
import {
  isDiscoveryMvpFieldRequired,
  isDiscoveryMvpFieldVisible,
} from "@/lib/discovery/discovery-mvp-d3-visibility";
import { isAnswerPresent } from "@/lib/discovery/discovery-mvp-d3-validation";

export type DiscoveryMvpD3ReviewSummary = {
  visibleFieldCount: number;
  answeredFieldCount: number;
  requiredFieldCount: number;
  missingRequiredCount: number;
  missingRequiredKeys: string[];
  completionPercent: number;
  procrowReviewFlaggedKeys: string[];
  stageProgress: DiscoveryMvpStageProgress[];
  /** Explicit non-claim for Stage 7 / Blueprint. */
  readyForModeling: false;
  createsBlueprint: false;
};

export function computeDiscoveryMvpD3ReviewSummary(
  catalog: readonly DiscoveryMvpFieldDefinition[],
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryMvpD3ReviewSummary {
  const visible = catalog.filter((f) => isDiscoveryMvpFieldVisible(f, ctx));
  const missingRequiredKeys = visible
    .filter((f) => isDiscoveryMvpFieldRequired(f, ctx) && !isAnswerPresent(answers[f.fieldKey]))
    .map((f) => f.fieldKey);
  const answeredFieldCount = visible.filter((f) => isAnswerPresent(answers[f.fieldKey])).length;
  const requiredFieldCount = visible.filter((f) => isDiscoveryMvpFieldRequired(f, ctx)).length;
  const completionPercent =
    visible.length === 0 ? 0 : Math.round((answeredFieldCount / visible.length) * 100);

  const procrowReviewFlaggedKeys = visible
    .filter((f) => f.procrowReviewFlag === "review" || f.procrowReviewFlag === "blocking_if_missing")
    .map((f) => f.fieldKey);

  const stageProgress: DiscoveryMvpStageProgress[] = ([1, 2, 3, 4, 5, 6, 7] as const).map(
    (stageId) => {
      const stageFields = visible.filter((f) => f.stageId === stageId);
      const missing = stageFields
        .filter((f) => isDiscoveryMvpFieldRequired(f, ctx) && !isAnswerPresent(answers[f.fieldKey]))
        .map((f) => f.fieldKey);
      return {
        stageId,
        visibleCount: stageFields.length,
        answeredCount: stageFields.filter((f) => isAnswerPresent(answers[f.fieldKey])).length,
        requiredCount: stageFields.filter((f) => isDiscoveryMvpFieldRequired(f, ctx)).length,
        missingRequiredKeys: missing,
      };
    },
  );

  return {
    visibleFieldCount: visible.length,
    answeredFieldCount,
    requiredFieldCount,
    missingRequiredCount: missingRequiredKeys.length,
    missingRequiredKeys,
    completionPercent,
    procrowReviewFlaggedKeys,
    stageProgress,
    readyForModeling: false,
    createsBlueprint: false,
  };
}

/** Prove Blueprint mapping metadata is inert (string tags only). */
export function collectInertBlueprintSectionTags(
  catalog: readonly DiscoveryMvpFieldDefinition[],
): string[] {
  return [...new Set(catalog.map((f) => f.mapsToBlueprintSection))];
}
