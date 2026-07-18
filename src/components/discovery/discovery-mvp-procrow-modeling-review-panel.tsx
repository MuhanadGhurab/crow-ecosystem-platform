"use client";

/**
 * CROW.DISCOVERY.5 — ProCrow modeling review panel (local-first).
 */

import { useEffect, useMemo, useState, useTransition } from "react";
import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";
import {
  readProCrowModelingReviewDraft,
  writeProCrowModelingReviewDraft,
} from "@/lib/discovery/discovery-mvp-d5-notes";
import { evaluateProCrowModelingReadiness } from "@/lib/discovery/discovery-mvp-d5-review";

export function DiscoveryMvpProCrowModelingReviewPanel({
  requestId,
  answers,
  journeyKind,
  organizationContext,
  variant = "client",
}: {
  requestId: string;
  answers: DiscoveryMvpAnswerMap;
  journeyKind: RequestJourneyKind | null;
  organizationContext: OrganizationContextKind | null;
  variant?: "client" | "operator";
}) {
  const ctx = useMemo(
    () => ({ journeyKind, organizationContext }),
    [journeyKind, organizationContext],
  );
  const [operatorNotes, setOperatorNotes] = useState("");
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [evidenceNotAvailable, setEvidenceNotAvailable] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const draft = readProCrowModelingReviewDraft(requestId);
    if (draft) {
      setOperatorNotes(draft.operatorNotesDraft);
      setAcknowledged(draft.acknowledgedRiskFlags);
      setEvidenceNotAvailable(draft.evidenceNotAvailable);
    }
    setHydrated(true);
  }, [requestId]);

  useEffect(() => {
    if (!hydrated) return;
    writeProCrowModelingReviewDraft(requestId, {
      operatorNotesDraft: operatorNotes,
      acknowledgedRiskFlags: acknowledged,
      evidenceNotAvailable,
    });
  }, [acknowledged, evidenceNotAvailable, hydrated, operatorNotes, requestId]);

  const review = useMemo(
    () =>
      evaluateProCrowModelingReadiness(answers, ctx, {
        operatorNotesDraft: operatorNotes,
        acknowledgedRiskFlags: acknowledged,
        evidenceNotAvailable,
      }),
    [acknowledged, answers, ctx, evidenceNotAvailable, operatorNotes],
  );

  const toggleAck = (flag: string) => {
    startTransition(() => {
      setAcknowledged((prev) =>
        prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
      );
    });
  };

  const readOnlyClient = variant === "client";

  return (
    <section
      className="space-y-4 rounded-lg border border-teal-500/25 bg-teal-950/10 p-4"
      data-crow-discovery-mvp-d5="procrow-modeling-review"
      data-review-status={review.reviewStatus}
      data-ready-for-modeling={review.readyForModeling ? "true" : "false"}
      data-ready-for-blueprint-draft="false"
      data-creates-blueprint="false"
    >
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-400/90">
          Discovery MVP · D5 ProCrow modeling review
        </p>
        <h3 className="text-base font-semibold text-slate-100">{review.productLabel}</h3>
        <p className="text-sm text-slate-400">
          This is not approval, not tenant build, not authority. Ready-for-modeling does not generate
          Blueprint. ProCrow review is required before Blueprint.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Review status</p>
          <p className="mt-1 text-sm font-semibold text-cyan-200" data-crow-review-status>
            {review.reviewStatus.replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for modeling</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {review.readyForModeling ? "Yes (local)" : "Not yet"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for Blueprint draft</p>
          <p className="mt-1 text-sm font-semibold text-amber-200">No</p>
        </div>
      </div>

      <p className="text-sm text-slate-300">
        <span className="font-medium text-slate-200">Recommended next:</span>{" "}
        {review.recommendedNextAction}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Operating model coverage</p>
          <p className="mt-1 text-sm text-slate-200">{review.operatingModelCoverage.level}</p>
          <p className="mt-1 text-[11px] text-slate-600">
            {review.operatingModelCoverage.capturedCount} captured ·{" "}
            {review.operatingModelCoverage.missingCount} missing
          </p>
        </div>
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Trust / risk coverage</p>
          <p className="mt-1 text-sm text-slate-200">{review.trustAndRiskCoverage.level}</p>
        </div>
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Evidence references</p>
          <p className="mt-1 text-sm text-slate-200">{review.evidenceReferenceCoverage.level}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Missing information</h4>
        {review.missingInformation.length === 0 ? (
          <p className="text-sm text-slate-500">No missing-information items flagged.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
            {review.missingInformation.slice(0, 8).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Clarification questions</h4>
        {review.clarificationQuestions.length === 0 ? (
          <p className="text-sm text-slate-500">No clarification prompts right now.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
            {review.clarificationQuestions.slice(0, 8).map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        )}
      </div>

      {review.contradictionFlags.length > 0 ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3">
          <p className="text-xs font-medium text-rose-200">Contradiction blockers</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-rose-100/80">
            {review.contradictionFlags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {review.criticalRiskFlags.length > 0 || review.riskFlags.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-200">Risk flags</h4>
          <ul className="space-y-2 text-sm text-amber-100/80">
            {[...new Set([...review.criticalRiskFlags, ...review.riskFlags])].map((flag) => (
              <li key={flag} className="flex flex-wrap items-start gap-2">
                <span className="flex-1">· {flag}</span>
                {!readOnlyClient && review.criticalRiskFlags.includes(flag) ? (
                  <button
                    type="button"
                    className="text-[11px] text-teal-300 hover:text-teal-200"
                    onClick={() => toggleAck(flag)}
                    data-crow-ack-risk={flag}
                  >
                    {acknowledged.includes(flag) ? "Unacknowledge" : "Acknowledge locally"}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!readOnlyClient ? (
        <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={evidenceNotAvailable}
              onChange={(e) => setEvidenceNotAvailable(e.target.checked)}
              data-crow-evidence-not-available
            />
            Evidence references not available (local waiver)
          </label>
          <div>
            <label htmlFor="d5-operator-notes" className="text-xs text-slate-500">
              Operator notes (local draft only)
            </label>
            <textarea
              id="d5-operator-notes"
              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
              rows={3}
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Local notes for ProCrow — not persisted to hosted DB."
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Operator tools (notes, risk acknowledgment, evidence waiver) appear on the ProCrow /
          operator Discovery surface.
        </p>
      )}

      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
        <p className="text-xs font-medium text-amber-200">Blueprint generation remains blocked</p>
        <p className="mt-1 text-sm text-amber-100/80">
          Even when ready-for-modeling is yes, Blueprint draft creation stays out of scope until a future
          owner-authorized milestone. D6 shows the handoff boundary package only.
        </p>
      </div>

      <ul className="space-y-1 border-t border-white/10 pt-3">
        {review.nonClaims.map((line) => (
          <li key={line} className="text-xs text-slate-500">
            · {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
