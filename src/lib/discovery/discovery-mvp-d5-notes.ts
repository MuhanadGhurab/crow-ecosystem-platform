/**
 * CROW.DISCOVERY.5 — browser-local ProCrow review notes (no hosted writes).
 */

import type { ProCrowModelingReviewOptions } from "@/lib/discovery/discovery-mvp-d5-types";

export const PROCROW_MODELING_REVIEW_DRAFT_PREFIX = "crow-discovery-mvp-d5-review-v1" as const;

export type ProCrowModelingReviewLocalDraft = {
  schemaVersion: typeof PROCROW_MODELING_REVIEW_DRAFT_PREFIX;
  requestId: string;
  updatedAt: string;
  operatorNotesDraft: string;
  acknowledgedRiskFlags: string[];
  evidenceNotAvailable: boolean;
  /** Explicit non-authority markers. */
  createsBlueprint: false;
  provisionsTenant: false;
  invokesCroAI: false;
};

export function procrowModelingReviewDraftStorageKey(requestId: string): string {
  return `${PROCROW_MODELING_REVIEW_DRAFT_PREFIX}:${requestId}`;
}

function localStore(): Storage | null {
  return typeof globalThis.localStorage !== "undefined" ? globalThis.localStorage : null;
}

export function readProCrowModelingReviewDraft(
  requestId: string,
): ProCrowModelingReviewLocalDraft | null {
  const store = localStore();
  if (!store) return null;
  try {
    const raw = store.getItem(procrowModelingReviewDraftStorageKey(requestId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProCrowModelingReviewLocalDraft;
    if (parsed.schemaVersion !== PROCROW_MODELING_REVIEW_DRAFT_PREFIX) return null;
    if (parsed.requestId !== requestId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeProCrowModelingReviewDraft(
  requestId: string,
  input: Pick<
    ProCrowModelingReviewLocalDraft,
    "operatorNotesDraft" | "acknowledgedRiskFlags" | "evidenceNotAvailable"
  >,
): ProCrowModelingReviewLocalDraft | null {
  const store = localStore();
  if (!store) return null;
  const payload: ProCrowModelingReviewLocalDraft = {
    schemaVersion: PROCROW_MODELING_REVIEW_DRAFT_PREFIX,
    requestId,
    updatedAt: new Date().toISOString(),
    operatorNotesDraft: input.operatorNotesDraft,
    acknowledgedRiskFlags: input.acknowledgedRiskFlags,
    evidenceNotAvailable: input.evidenceNotAvailable,
    createsBlueprint: false,
    provisionsTenant: false,
    invokesCroAI: false,
  };
  store.setItem(procrowModelingReviewDraftStorageKey(requestId), JSON.stringify(payload));
  return payload;
}

export function reviewOptionsFromLocalDraft(
  draft: ProCrowModelingReviewLocalDraft | null,
): ProCrowModelingReviewOptions {
  if (!draft) return {};
  return {
    operatorNotesDraft: draft.operatorNotesDraft,
    acknowledgedRiskFlags: draft.acknowledgedRiskFlags,
    evidenceNotAvailable: draft.evidenceNotAvailable,
  };
}
