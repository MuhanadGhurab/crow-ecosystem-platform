"use client";

/**
 * CROW.DISCOVERY.6 — Blueprint handoff boundary panel (local-first).
 * Shows pre-Blueprint handoff package; never creates Blueprint or enables generation.
 */

import { useEffect, useMemo, useState } from "react";
import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";
import { readProCrowModelingReviewDraft } from "@/lib/discovery/discovery-mvp-d5-notes";
import { buildDiscoveryBlueprintHandoffPackage } from "@/lib/discovery/discovery-mvp-d6-handoff";

export function DiscoveryMvpBlueprintHandoffPanel({
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

  useEffect(() => {
    const draft = readProCrowModelingReviewDraft(requestId);
    if (draft) {
      setOperatorNotes(draft.operatorNotesDraft);
      setAcknowledged(draft.acknowledgedRiskFlags);
      setEvidenceNotAvailable(draft.evidenceNotAvailable);
    }
    setHydrated(true);
  }, [requestId, answers]);

  const package_ = useMemo(() => {
    if (!hydrated) {
      return buildDiscoveryBlueprintHandoffPackage(answers, ctx);
    }
    return buildDiscoveryBlueprintHandoffPackage(answers, ctx, {
      operatorNotesDraft: operatorNotes,
      acknowledgedRiskFlags: acknowledged,
      evidenceNotAvailable,
    });
  }, [
    acknowledged,
    answers,
    ctx,
    evidenceNotAvailable,
    hydrated,
    operatorNotes,
  ]);

  return (
    <section
      className="space-y-4 rounded-lg border border-indigo-500/25 bg-indigo-950/10 p-4"
      data-crow-discovery-mvp-d6="blueprint-handoff-boundary"
      data-handoff-status={package_.handoffStatus}
      data-ready-for-blueprint-handoff={package_.readyForBlueprintHandoff ? "true" : "false"}
      data-ready-for-blueprint-draft="false"
      data-blueprint-generation-allowed="false"
      data-owner-gate-required="true"
      data-procrow-gate-required="true"
      data-creates-blueprint="false"
    >
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-300/90">
          Discovery MVP · D6 Blueprint handoff boundary
        </p>
        <h3 className="text-base font-semibold text-slate-100">{package_.productLabel}</h3>
        <p className="text-sm text-slate-400">
          This package is pre-Blueprint, not an approved Blueprint. Blueprint generation remains
          blocked. No tenant runtime is created. ProCrow review and owner authorization are required
          before any future Blueprint drafting.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Handoff status</p>
          <p className="mt-1 text-sm font-semibold text-indigo-200" data-crow-handoff-status>
            {package_.handoffStatus.replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for Blueprint handoff</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {package_.readyForBlueprintHandoff ? "Yes (local package)" : "Not yet"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for Blueprint draft</p>
          <p className="mt-1 text-sm font-semibold text-amber-200">No</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Blueprint generation allowed</p>
          <p className="mt-1 text-sm font-semibold text-amber-200">No</p>
        </div>
      </div>

      <p className="text-sm text-slate-300">
        <span className="font-medium text-slate-200">Recommended next:</span>{" "}
        {package_.recommendedNextAction}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Discovery summary</p>
          <p className="mt-1 text-sm text-slate-200">
            {package_.sourceDiscoverySummary.journeyKind ?? "—"} ·{" "}
            {package_.sourceDiscoverySummary.overallCompletionPercent}%
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Required missing: {package_.sourceDiscoverySummary.requiredMissingCount}
          </p>
        </div>
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Operating Model draft</p>
          <p className="mt-1 text-sm text-slate-200">
            Purpose: {package_.operatingModelInputDraftSummary.purposeStatus}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Shape: {package_.operatingModelInputDraftSummary.organizationShapeStatus}
          </p>
        </div>
        <div className="rounded-md border border-white/5 bg-black/20 p-3">
          <p className="text-xs text-slate-500">ProCrow modeling review</p>
          <p className="mt-1 text-sm text-slate-200">
            {package_.procrowModelingReviewSummary.reviewStatus.replaceAll("_", " ")}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            Ready for modeling:{" "}
            {package_.procrowModelingReviewSummary.readyForModeling ? "yes" : "no"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Required gates</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
          {package_.requiredApprovals.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-xs text-indigo-200/80">
          Owner gate required: yes · ProCrow gate required: yes
          {variant === "operator" ? " · Operator view" : " · Client guidance"}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">
          Future Blueprint section coverage (inert metadata)
        </h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {package_.blueprintSectionCoverage.map((section) => (
            <li
              key={section.sectionKey}
              className="rounded-md border border-white/5 bg-black/20 px-3 py-2 text-sm text-slate-300"
              data-blueprint-section={section.sectionKey}
              data-coverage-level={section.level}
            >
              <span className="font-medium text-slate-200">{section.label}</span>
              <span className="mt-0.5 block text-[11px] text-slate-500">
                {section.level} · {section.capturedCount} captured · {section.missingCount} missing
                {section.inertCatalogTags.length > 0
                  ? ` · tags: ${section.inertCatalogTags.join(", ")}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {package_.missingInformation.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-200">Missing information</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
            {package_.missingInformation.slice(0, 8).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {package_.contradictionFlags.length > 0 || package_.riskFlags.length > 0 ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3">
          <p className="text-xs font-medium text-rose-200">Risk / contradiction blockers</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-rose-100/80">
            {[...package_.contradictionFlags, ...package_.riskFlags.slice(0, 6)].map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
        <p className="text-xs font-medium text-amber-200">Blueprint generation remains blocked</p>
        <p className="mt-1 text-sm text-amber-100/80">
          Even when ready-for-Blueprint-handoff is yes, this milestone does not create Blueprint draft
          records, call completeDiscovery, or enable CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE. No
          tenant runtime is created.
        </p>
      </div>

      <ul className="space-y-1 border-t border-white/10 pt-3">
        {package_.nonClaims.map((line) => (
          <li key={line} className="text-xs text-slate-500">
            · {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
