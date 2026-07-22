/**
 * Nest readiness domain — scoring, catalogue helpers, zero-impact invariants.
 * Gate: GHV.IMPLEMENTATION.0E · Server-authoritative only.
 * Fixture status: TECHNICAL / LOCAL TEST ONLY — NOT production content.
 */

import { NEST_READINESS_CATALOGUE_VERSION } from "@ghuravia/contracts/schemas";
import type { NestReadinessBand } from "@ghuravia/contracts/schemas";
import {
  NEST_READINESS_ITEMS,
  getNestReadinessItem as getItem,
  type NestReadinessItem,
  type NestReadinessOption,
} from "./nest-readiness-catalogue";

export {
  NEST_READINESS_ITEMS,
  nestReadinessCapabilityCoverage,
  nestReadinessTotalItems,
  type NestCapabilityId,
  type NestReadinessItem,
  type NestReadinessOption,
} from "./nest-readiness-catalogue";

export const NEST_READINESS_CATALOGUE = NEST_READINESS_ITEMS;

export type NestAnswerRecord = {
  itemId: string;
  optionId: string;
  correct: boolean;
  capabilityIds: readonly string[];
};

export type NestScoreResult = {
  correctCount: number;
  totalCount: number;
  /** Integer percentage: round((correct / total) * 100) */
  score: number;
  band: NestReadinessBand;
  weakCapabilityIds: readonly string[];
};

export function getNestReadinessItem(
  itemId: string,
): NestReadinessItem | undefined {
  return getItem(itemId);
}

export function getNestReadinessOption(
  itemId: string,
  optionId: string,
): NestReadinessOption | undefined {
  const item = getItem(itemId);
  return item?.options.find((o) => o.id === optionId);
}

export function requireNestReadinessCatalogue(
  version: string | undefined,
): void {
  if (version === undefined) {
    throw new Error(
      "CATALOGUE_VERSION_CONFLICT: nestReadinessCatalogueVersion required",
    );
  }
  if (version !== NEST_READINESS_CATALOGUE_VERSION) {
    throw new Error("CATALOGUE_VERSION_CONFLICT: nest readiness catalogue");
  }
}

/**
 * Binding Scope Baseline §3.5 thresholds (unchanged).
 * 49 → NEST_RECOMMENDED · 50 → GUIDED_SKIP · 69 → GUIDED_SKIP · 70 → READY_TO_FLY
 */
export function computeReadinessBand(score: number): NestReadinessBand {
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error("VALIDATION_ERROR: score must be integer 0..100");
  }
  if (score >= 70) return "READY_TO_FLY";
  if (score >= 50) return "GUIDED_SKIP";
  return "NEST_RECOMMENDED";
}

/**
 * Rounding rule: Math.round((correctAnswers / totalItems) * 100).
 */
export function scorePercentage(
  correctCount: number,
  totalCount: number,
): number {
  if (totalCount <= 0) {
    throw new Error("VALIDATION_ERROR: totalCount must be positive");
  }
  return Math.round((correctCount / totalCount) * 100);
}

/** Alias used by onboarding domain */
export function scoreAttempt(
  answers: readonly { itemId: string; optionId: string }[],
  catalogue: readonly NestReadinessItem[] = NEST_READINESS_ITEMS,
): NestScoreResult {
  return scoreNestAttempt(
    answers.map((a) => ({
      itemId: a.itemId,
      selectedOptionId: a.optionId,
    })),
    catalogue,
  );
}

export function scoreNestAttempt(
  answers: readonly { itemId: string; selectedOptionId: string }[],
  catalogue: readonly NestReadinessItem[] = NEST_READINESS_ITEMS,
): NestScoreResult {
  const totalCount = catalogue.length;
  if (answers.length !== totalCount) {
    throw new Error(
      "VALIDATION_ERROR: incomplete assessment — all items required",
    );
  }
  const byItem = new Map(answers.map((a) => [a.itemId, a]));
  if (byItem.size !== totalCount) {
    throw new Error("VALIDATION_ERROR: duplicate or missing item answers");
  }

  let correctCount = 0;
  const weak = new Set<string>();

  for (const item of catalogue) {
    const answer = byItem.get(item.id);
    if (!answer) {
      throw new Error(`VALIDATION_ERROR: missing answer for ${item.id}`);
    }
    const optionOk = item.options.some((o) => o.id === answer.selectedOptionId);
    if (!optionOk) {
      throw new Error(`VALIDATION_ERROR: invalid option for ${item.id}`);
    }
    const correct = answer.selectedOptionId === item.correctOptionId;
    if (correct) {
      correctCount += 1;
    } else {
      for (const c of item.capabilityIds) weak.add(c);
    }
  }

  const score = scorePercentage(correctCount, totalCount);
  const band = computeReadinessBand(score);
  const weakCapabilityIds = [...weak].sort();

  return { correctCount, totalCount, score, band, weakCapabilityIds };
}

export function buildAnswerRecord(
  itemId: string,
  optionId: string,
): NestAnswerRecord {
  const item = getItem(itemId);
  if (!item) throw new Error(`VALIDATION_ERROR: unknown item ${itemId}`);
  if (!item.options.some((o) => o.id === optionId)) {
    throw new Error(`VALIDATION_ERROR: invalid option for ${itemId}`);
  }
  return {
    itemId,
    optionId,
    correct: optionId === item.correctOptionId,
    capabilityIds: [...item.capabilityIds],
  };
}

export function nestReadinessProgressionImpact(): {
  xp: 0;
  mastery: 0;
  rank: 0;
  prestige: 0;
  trust: 0;
} {
  return { xp: 0, mastery: 0, rank: 0, prestige: 0, trust: 0 };
}

export function nestReadinessIdentityImpact(): {
  lineageAwarded: false;
  crossWingMajorCreated: false;
  evidenceSealIssued: false;
  fusionSignatureIssued: false;
  paymentEntitlementChanged: false;
} {
  return {
    lineageAwarded: false,
    crossWingMajorCreated: false,
    evidenceSealIssued: false,
    fusionSignatureIssued: false,
    paymentEntitlementChanged: false,
  };
}
