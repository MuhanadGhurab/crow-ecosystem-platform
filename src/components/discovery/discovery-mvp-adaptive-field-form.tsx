"use client";

/**
 * CROW.DISCOVERY.3 — local-first adaptive Stages 1–3 form foundation.
 */

import { useEffect, useMemo, useState, useTransition } from "react";
import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import {
  readDiscoveryMvpD3Draft,
  writeDiscoveryMvpD3Draft,
} from "@/lib/discovery/discovery-mvp-d3-answers";
import { computeDiscoveryMvpD3ReviewSummary } from "@/lib/discovery/discovery-mvp-d3-summary";
import type { DiscoveryMvpAnswerMap, DiscoveryMvpFieldDefinition } from "@/lib/discovery/discovery-mvp-d3-types";
import { validateDiscoveryMvpFieldAnswer } from "@/lib/discovery/discovery-mvp-d3-validation";
import {
  filterVisibleDiscoveryMvpFields,
  isDiscoveryMvpFieldRequired,
} from "@/lib/discovery/discovery-mvp-d3-visibility";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";
import { DiscoveryMvpOperatingModelDraftPreview } from "@/components/discovery/discovery-mvp-operating-model-draft-preview";
import { DiscoveryMvpProCrowModelingReviewPanel } from "@/components/discovery/discovery-mvp-procrow-modeling-review-panel";
import { DISCOVERY_MVP_STAGES } from "@/lib/discovery/discovery-mvp-boundaries";

const STAGE_TITLES = Object.fromEntries(
  DISCOVERY_MVP_STAGES.filter((s) => s.id <= 3).map((s) => [s.id, s.title]),
) as Record<1 | 2 | 3, string>;

function AdaptiveFieldInput({
  field,
  value,
  error,
  required,
  onChange,
}: {
  field: DiscoveryMvpFieldDefinition;
  value: string;
  error: string | null;
  required: boolean;
  onChange: (next: string) => void;
}) {
  const id = `d3-${field.fieldKey}`;
  const common = "mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100";

  return (
    <div data-crow-discovery-field={field.fieldKey} data-field-required={required ? "true" : "false"}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {field.label}
        {required ? <span className="ml-1 text-amber-300">*</span> : null}
      </label>
      <p className="mt-0.5 text-xs text-slate-500">{field.helperText}</p>
      {field.fieldType === "long_text" ? (
        <textarea
          id={id}
          className={`${common} min-h-[88px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.fieldType === "single_select" ? (
        <select id={id} className={common} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.fieldType === "number" ? "number" : "text"}
          className={common}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.validation.refsOnly ? (
        <p className="mt-1 text-[11px] text-slate-500" data-crow-evidence-refs-only="true">
          References only — no file upload.
        </p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-amber-300">{error}</p> : null}
      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
        Adaptive · {field.journeyApplicability}
        {field.organizationContextApplicability === "ALL"
          ? " · all org contexts"
          : ` · ${field.organizationContextApplicability.join(", ")}`}
        {field.mapsToBlueprintSection
          ? ` · blueprint map (inert): ${field.mapsToBlueprintSection}`
          : ""}
      </p>
    </div>
  );
}

export function DiscoveryMvpAdaptiveFieldForm({
  requestId,
  journeyKind,
  organizationContext,
  variant = "client",
}: {
  requestId: string;
  journeyKind: RequestJourneyKind | null;
  organizationContext: OrganizationContextKind | null;
  variant?: "client" | "operator";
}) {
  const catalog = getDiscoveryMvpD3Catalog();
  const ctx = useMemo(
    () => ({ journeyKind, organizationContext }),
    [journeyKind, organizationContext],
  );
  const [answers, setAnswers] = useState<DiscoveryMvpAnswerMap>({});
  const [hydrated, setHydrated] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const draft = readDiscoveryMvpD3Draft(requestId);
    if (draft?.answers) {
      setAnswers(draft.answers);
    }
    setHydrated(true);
  }, [requestId]);

  useEffect(() => {
    if (!hydrated) return;
    writeDiscoveryMvpD3Draft(requestId, answers);
  }, [answers, hydrated, requestId]);

  const visible = useMemo(
    () => filterVisibleDiscoveryMvpFields(catalog, ctx),
    [catalog, ctx],
  );
  const summary = useMemo(
    () => computeDiscoveryMvpD3ReviewSummary(catalog, answers, ctx),
    [catalog, answers, ctx],
  );
  const operatingModelDraft = useMemo(
    () => buildOperatingModelInputDraft(answers, ctx),
    [answers, ctx],
  );

  const setField = (fieldKey: string, value: string) => {
    startTransition(() => {
      setAnswers((prev) => ({ ...prev, [fieldKey]: value }));
    });
  };

  if (!journeyKind) {
    return (
      <div
        className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-4"
        data-crow-discovery-mvp-d3="awaiting-journey"
      >
        <p className="text-sm text-amber-100/90">
          Journey kind is missing on the linked request brief. Adaptive fields unlock after
          JourneyKind (NEW / TRANSFORM) is present.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-crow-discovery-mvp-d3="stages-1-3" data-variant={variant}>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-400/90">
          Discovery MVP · D3 adaptive fields
        </p>
        <h3 className="text-base font-semibold text-slate-100">
          Crow is learning how this organization should operate
        </h3>
        <p className="text-sm text-slate-400">
          Stages 1–3 capture context, shape, and operating reality. Answers stay in this browser
          (local draft) — no Blueprint, tenant, payment, or CroAI from this form.
        </p>
      </div>

      <div
        className="grid gap-3 sm:grid-cols-4"
        data-crow-discovery-d3-progress
        data-completion-percent={summary.completionPercent}
      >
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Completion</p>
          <p className="mt-1 text-lg font-semibold text-cyan-200">{summary.completionPercent}%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Visible fields</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{summary.visibleFieldCount}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Answered</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{summary.answeredFieldCount}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Missing required</p>
          <p className="mt-1 text-lg font-semibold text-amber-200">{summary.missingRequiredCount}</p>
        </div>
      </div>

      {([1, 2, 3] as const).map((stageId) => {
        const stageFields = visible.filter((f) => f.stageId === stageId);
        const progress = summary.stageProgress.find((s) => s.stageId === stageId);
        return (
          <section
            key={stageId}
            className="space-y-4 rounded-lg border border-white/10 bg-black/15 p-4"
            data-crow-discovery-d3-stage={stageId}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Stage {stageId} — {STAGE_TITLES[stageId]}
              </h4>
              <p className="text-xs text-slate-500">
                {progress?.answeredCount ?? 0}/{progress?.visibleCount ?? 0} answered
                {(progress?.missingRequiredKeys.length ?? 0) > 0
                  ? ` · ${progress?.missingRequiredKeys.length} required missing`
                  : ""}
              </p>
            </div>
            {stageFields.length === 0 ? (
              <p className="text-sm text-slate-500">No fields visible for this adaptive context.</p>
            ) : (
              <div className="space-y-4">
                {stageFields.map((field) => {
                  const raw = answers[field.fieldKey];
                  const value = raw === null || raw === undefined ? "" : String(raw);
                  const required = isDiscoveryMvpFieldRequired(field, ctx);
                  const result = validateDiscoveryMvpFieldAnswer(field, raw, ctx);
                  return (
                    <AdaptiveFieldInput
                      key={field.fieldKey}
                      field={field}
                      value={value}
                      required={required}
                      error={result.ok ? null : result.message}
                      onChange={(next) => setField(field.fieldKey, next)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <div
        className="rounded-lg border border-white/10 bg-black/20 p-4"
        data-crow-discovery-d3-procrow-prep
      >
        <h4 className="text-sm font-medium text-slate-200">ProCrow review preparation</h4>
        <p className="mt-1 text-xs text-slate-500">
          Stage 7 final review is not implemented yet. D4 produces a draft Operating Model input for
          ProCrow — not ready-for-Blueprint.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-400">
          <li>Missing required: {summary.missingRequiredCount}</li>
          <li>Fields flagged for ProCrow review: {summary.procrowReviewFlaggedKeys.length}</li>
          <li data-ready-for-procrow-review={operatingModelDraft.readinessSignals.readyForProCrowReview ? "true" : "false"}>
            Ready for ProCrow review:{" "}
            {operatingModelDraft.readinessSignals.readyForProCrowReview ? "yes" : "not yet"}
          </li>
          <li data-ready-for-modeling="false">Ready for modeling approval: no (D5)</li>
          <li data-creates-blueprint="false">Creates Blueprint: no</li>
          <li data-ready-for-blueprint-draft="false">Ready for Blueprint draft: no</li>
        </ul>
        {variant === "operator" ? (
          <p className="mt-2 text-xs text-teal-300/90">
            Operator hint: clarify missing required fields with the client before modeling.
          </p>
        ) : null}
      </div>

      <DiscoveryMvpOperatingModelDraftPreview draft={operatingModelDraft} variant={variant} />

      <DiscoveryMvpProCrowModelingReviewPanel
        requestId={requestId}
        answers={answers}
        journeyKind={journeyKind}
        organizationContext={organizationContext}
        variant={variant}
      />

      <div className="rounded-lg border border-dashed border-white/15 p-3">
        <p className="text-xs font-medium text-slate-300">D6 — Blueprint handoff coming next</p>
        <p className="mt-1 text-sm text-slate-500">
          Intentional Blueprint handoff remains out of scope. Stages 4–7 field depth and hosted
          persistence stay deferred.
        </p>
      </div>
    </div>
  );
}
