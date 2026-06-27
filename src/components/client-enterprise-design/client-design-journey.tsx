"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  saveClientEnterpriseDesignAction,
  submitClientEnterpriseDesignAction,
} from "@/lib/actions/client-enterprise-design";
import {
  composeClientEnterpriseDesign,
  draftToInput,
  projectLeanModel,
  projectOperatingPriority,
  CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
  type ClientConfigurationMode,
  type ClientEnterpriseDesignDraft,
  type ClientOperatingPriority,
} from "@/lib/client-enterprise-design";
import {
  CLIENT_GROWTH_INTENTION_OPTIONS,
  CLIENT_TEAM_SIZE_OPTIONS,
  growthToTargetScale,
  teamSizeToCurrentScale,
} from "@/lib/business-field-catalog/team-scale";
import {
  applyBusinessFieldToDraft,
  applyCustomFieldFallback,
  friendlyCapabilityLabel,
} from "@/lib/client-enterprise-design/intake/field-resolution";
import {
  stepHelp,
  stepLabel,
  stepsForConfigurationMode,
  type QuickIntakeStep,
} from "@/lib/client-enterprise-design/intake/quick-intake-steps";
import { purposesForFieldSelection } from "@/lib/services/client-enterprise-design-page.service";
import type { ClientDesignPageModel } from "@/lib/services/client-enterprise-design-page.service";
import { BusinessFieldFinder } from "@/components/client-enterprise-design/business-field-finder";
import { PendingButton } from "@/components/ui/pending-button";
import { SaveStatusIndicator, type SaveStatus } from "@/components/ui/save-status-indicator";
import { routes } from "@/lib/routes";

const CONFIG_MODE_OPTIONS: Array<{ key: ClientConfigurationMode; label: string; description: string }> = [
  {
    key: "RECOMMEND_EVERYTHING",
    label: "Recommend everything for me",
    description: "Crow recommends capabilities, roles, and workflows. Best for most businesses.",
  },
  {
    key: "GUIDE_ME",
    label: "Guide me through the important choices",
    description: "See recommendations and adjust key capabilities with guidance.",
  },
  {
    key: "EXPERT_CONFIGURATION",
    label: "I know what I need",
    description: "Advanced configuration for IT, security, and operations specialists.",
  },
];

export function ClientDesignJourney({
  model,
  initialStep = "field",
}: {
  model: ClientDesignPageModel;
  initialStep?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ClientEnterpriseDesignDraft>(model.draft);
  const steps = useMemo(() => stepsForConfigurationMode(draft.configurationMode), [draft.configurationMode]);
  const [step, setStep] = useState<QuickIntakeStep>(
    steps.includes(initialStep as QuickIntakeStep) ? (initialStep as QuickIntakeStep) : "field",
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("unsaved");
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [profileUpdatedAt, setProfileUpdatedAt] = useState(model.profileUpdatedAt);

  const snapshot = useMemo(
    () => composeClientEnterpriseDesign(draftToInput(draft)),
    [draft],
  );

  const filteredPurposes = useMemo(() => {
    const fromField = purposesForFieldSelection(draft.primaryIndustry, draft.specialistDomains);
    const list = fromField.length > 0 ? fromField : model.purposes;
    return list.filter((p): p is NonNullable<(typeof list)[number]> => Boolean(p));
  }, [draft.primaryIndustry, draft.specialistDomains, model.purposes]);

  const stepIndex = steps.indexOf(step);
  const lean = projectLeanModel(snapshot.leanModel);

  function go(next: QuickIntakeStep) {
    setStep(next);
    router.replace(`${routes.client.requestDiscoveryDesign(model.requestId)}?step=${next}`);
  }

  function updateDraft(patch: Partial<ClientEnterpriseDesignDraft>) {
    setSaveStatus("unsaved");
    setDraft((d) => ({ ...d, ...patch, designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION }));
  }

  function saveDraft() {
    setSaveStatus("saving");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("requestId", model.requestId);
      fd.set("draftJson", JSON.stringify(draft));
      if (profileUpdatedAt) fd.set("expectedProfileUpdatedAt", profileUpdatedAt);
      const res = await saveClientEnterpriseDesignAction(null, fd);
      if (!res.ok) {
        setSaveStatus(res.error?.includes("updated elsewhere") ? "conflict" : "failed");
        setMessage(res.error);
      } else {
        setSaveStatus("saved");
        if (res.profileUpdatedAt) setProfileUpdatedAt(res.profileUpdatedAt);
      }
    });
  }

  function submitDesign() {
    setSubmitStatus("Submitting your request…");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("requestId", model.requestId);
      fd.set("draftJson", JSON.stringify({ ...draft, status: "SUBMITTED" }));
      if (profileUpdatedAt) fd.set("expectedProfileUpdatedAt", profileUpdatedAt);
      const res = await submitClientEnterpriseDesignAction(null, fd);
      if (!res.ok) {
        setSubmitStatus(null);
        setMessage(res.error);
      } else {
        setSubmitStatus("Submitted");
        router.push(routes.client.requestDiscoverySummary(model.requestId));
      }
    });
  }

  function canAdvanceFromCurrentStep(): boolean {
    switch (step) {
      case "field":
        return Boolean(
          draft.primaryBusinessFieldKey ||
            draft.customFieldDescription?.trim() ||
            draft.primaryIndustry,
        );
      case "purpose":
        return Boolean(draft.primaryPurposeKey || draft.customPurposeDescription?.trim());
      case "team":
        return Boolean(draft.teamSizeRange);
      case "mode":
        return Boolean(draft.configurationMode);
      default:
        return true;
    }
  }

  return (
    <div className="space-y-6 motion-safe:transition-opacity motion-reduce:transition-none">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h2 className="text-lg font-semibold text-white">{stepLabel(step)}</h2>
        <p className="text-sm text-slate-400">{stepHelp(step)}</p>
      </header>

      <SaveStatusIndicator status={saveStatus} />
      {submitStatus && (
        <p role="status" aria-live="polite" className="text-sm text-cyan-300">
          {submitStatus}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200" role="alert">
          {message}
        </p>
      )}

      {step === "field" && (
        <section className="cc-glass-card">
          <BusinessFieldFinder
            selectedPrimaryKey={draft.primaryBusinessFieldKey}
            selectedSecondaryKeys={draft.secondaryBusinessFieldKeys}
            customDescription={draft.customFieldDescription}
            showCustomFallback={draft.fieldResolutionStatus === "CUSTOM_UNRESOLVED"}
            onSelectPrimary={(key) => updateDraft(applyBusinessFieldToDraft(draft, key))}
            onToggleSecondary={(key) => updateDraft(applyBusinessFieldToDraft(draft, key, true))}
            onCustomFallback={(desc, suggested) =>
              updateDraft(applyCustomFieldFallback(draft, desc, suggested))
            }
            onClearCustom={() =>
              updateDraft({
                customFieldDescription: null,
                fieldResolutionStatus: null,
                requiresProcrowFieldReview: false,
              })
            }
          />
        </section>
      )}

      {step === "purpose" && (
        <section className="cc-glass-card space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredPurposes.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() =>
                  updateDraft({
                    businessPurposes: [p.key],
                    primaryPurposeKey: p.key,
                    customPurposeDescription: null,
                  })
                }
                className={`rounded-xl border p-4 text-left ${
                  draft.primaryPurposeKey === p.key ? "border-cyan-500" : "border-slate-700"
                }`}
              >
                <p className="font-medium text-white">{p.displayName}</p>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </button>
            ))}
          </div>
          <details className="rounded-xl border border-slate-700 p-4">
            <summary className="cursor-pointer text-sm font-medium text-amber-400">
              My purpose is not listed
            </summary>
            <textarea
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
              rows={2}
              placeholder="Describe what your business is trying to accomplish…"
              value={draft.customPurposeDescription ?? ""}
              onChange={(e) =>
                updateDraft({
                  customPurposeDescription: e.target.value,
                  primaryPurposeKey: e.target.value ? "custom_purpose" : draft.primaryPurposeKey,
                  businessPurposes: e.target.value ? ["custom_purpose"] : draft.businessPurposes,
                })
              }
            />
          </details>
        </section>
      )}

      {step === "team" && (
        <section className="cc-glass-card space-y-6">
          <fieldset>
            <legend className="text-sm font-medium text-white">How many people are currently involved?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {CLIENT_TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    updateDraft({
                      teamSizeRange: opt.key,
                      currentScale: teamSizeToCurrentScale(opt.key),
                    })
                  }
                  className={`rounded-xl border p-3 text-left text-sm ${
                    draft.teamSizeRange === opt.key ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-white">Do you expect the organization to grow?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {CLIENT_GROWTH_INTENTION_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    updateDraft({
                      growthIntention: opt.key,
                      targetScale: growthToTargetScale(opt.key),
                    })
                  }
                  className={`rounded-xl border p-3 text-left text-sm ${
                    draft.growthIntention === opt.key ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        </section>
      )}

      {step === "mode" && (
        <section className="cc-glass-card space-y-3">
          {CONFIG_MODE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() =>
                updateDraft({
                  configurationMode: opt.key,
                  letProcrowDecideTechnical: opt.key === "RECOMMEND_EVERYTHING" ? true : draft.letProcrowDecideTechnical,
                })
              }
              className={`block w-full rounded-xl border p-4 text-left ${
                draft.configurationMode === opt.key ? "border-violet-500 bg-violet-950/30" : "border-slate-700"
              }`}
            >
              <p className="font-medium text-white">{opt.label}</p>
              <p className="mt-1 text-sm text-slate-400">{opt.description}</p>
              {opt.key === "EXPERT_CONFIGURATION" && (
                <p className="mt-2 text-xs text-amber-400">Advanced configuration · Recommended for IT or system specialists</p>
              )}
            </button>
          ))}
        </section>
      )}

      {step === "capabilities" && (
        <section className="cc-glass-card space-y-4">
          <p className="text-sm text-slate-400">Recommended capabilities appear first. Add or remove as needed.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {model.capabilities.slice(0, 24).map((c) => {
              const recommended = snapshot.recommendedCapabilities.includes(c.key);
              const checked = draft.selectedCapabilities.includes(c.key) || recommended;
              return (
                <label key={c.key} className="flex gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...new Set([...draft.selectedCapabilities, c.key])]
                        : draft.selectedCapabilities.filter((k) => k !== c.key);
                      updateDraft({ selectedCapabilities: next, letProcrowDecideTechnical: false });
                    }}
                  />
                  <span>
                    {friendlyCapabilityLabel(c.key)}
                    {recommended && <span className="ml-2 text-xs text-violet-400">Recommended</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {step === "priority" && (
        <section className="cc-glass-card space-y-4">
          <p className="text-xs text-amber-400">Advanced configuration</p>
          {(["LEAN_RESPONSIBLE", "BALANCED_GROWTH", "CONTROL_FIRST", "AUTOMATION_FORWARD"] as ClientOperatingPriority[]).map(
            (p) => {
              const proj = projectOperatingPriority(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateDraft({ operatingPriority: p })}
                  className={`block w-full rounded-xl border p-4 text-left ${
                    draft.operatingPriority === p ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  <p className="font-medium text-white">{proj.displayName}</p>
                  <p className="text-sm text-slate-400">{proj.summary}</p>
                </button>
              );
            },
          )}
        </section>
      )}

      {step === "compare" && (
        <section className="cc-glass-card space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {snapshot.variants
              .filter((v) => v.key !== "CUSTOM")
              .map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => updateDraft({ selectedModelVariant: v.key })}
                  className={`rounded-xl border p-4 text-left ${
                    draft.selectedModelVariant === v.key ? "border-cyan-500" : "border-slate-700"
                  }`}
                >
                  <p className="font-semibold text-white">{v.displayName}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Team range: {v.estimatedCoreTeamRange.min}–{v.estimatedCoreTeamRange.max}
                  </p>
                </button>
              ))}
          </div>
        </section>
      )}

      {step === "workflows" && (
        <section className="cc-glass-card space-y-3">
          {snapshot.workflowSummaries.map((w) => (
            <article key={w.key} className="rounded-lg border border-slate-800 p-4">
              <p className="font-medium text-white">{w.displayName}</p>
              <p className="text-sm text-slate-400">{w.purpose}</p>
              <p className="mt-2 text-xs text-slate-500">Stages: {w.stages.join(" → ")}</p>
            </article>
          ))}
        </section>
      )}

      {step === "customize" && (
        <section className="cc-glass-card space-y-4">
          <p className="text-xs text-amber-400">Advanced configuration · Expert mode</p>
          <p className="text-sm text-slate-400">
            Security policies, integrations, and workflow topology can be decided by ProCrow unless you specify
            preferences here in a future release.
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={draft.letProcrowDecideTechnical}
              onChange={(e) => updateDraft({ letProcrowDecideTechnical: e.target.checked })}
            />
            Let ProCrow choose the technical configuration
          </label>
        </section>
      )}

      {step === "recommendations" && (
        <section className="cc-glass-card space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Essential now</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
              {snapshot.recommendedCapabilities.slice(0, 5).map((k) => (
                <li key={k}>{friendlyCapabilityLabel(k)}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Who handles what</h3>
            <p className="mt-1 text-2xl font-semibold text-cyan-300">{lean.estimatedTeamRange}</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
              {lean.merges.slice(0, 3).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Key workflows</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {snapshot.workflowSummaries.slice(0, 3).map((w) => (
                <li key={w.key}>{w.displayName}</li>
              ))}
            </ul>
          </div>
          <label className="flex items-start gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={draft.letProcrowDecideTechnical}
              onChange={(e) => updateDraft({ letProcrowDecideTechnical: e.target.checked })}
            />
            <span>
              Let ProCrow choose security policies, integrations, permission bundles, and workflow topology.
            </span>
          </label>
        </section>
      )}

      {step === "review" && (
        <section className="cc-glass-card space-y-4">
          <p className="text-sm text-slate-400">
            This submits your design for ProCrow review. No tenant or Blueprint is created automatically.
          </p>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Field: {draft.primaryBusinessFieldKey ?? draft.customFieldDescription ?? draft.primaryIndustry ?? "—"}</li>
            <li>
              Secondary: {draft.secondaryBusinessFieldKeys.join(", ") || "—"}
            </li>
            <li>Purpose: {draft.primaryPurposeKey ?? draft.customPurposeDescription ?? "—"}</li>
            <li>Team: {draft.teamSizeRange ?? "—"} · Growth: {draft.growthIntention ?? "—"}</li>
            <li>Mode: {draft.configurationMode.replace(/_/g, " ")}</li>
            <li>ProCrow decides technical: {draft.letProcrowDecideTechnical ? "Yes" : "No"}</li>
          </ul>
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
            placeholder="Optional notes in plain language"
            value={draft.clientNotes ?? ""}
            onChange={(e) => updateDraft({ clientNotes: e.target.value })}
          />
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={stepIndex <= 0}
          onClick={() => go(steps[stepIndex - 1]!)}
          className="cc-btn-secondary"
        >
          Back
        </button>
        {stepIndex < steps.length - 1 ? (
          <PendingButton
            pending={pending}
            pendingLabel="Loading…"
            disabled={!canAdvanceFromCurrentStep()}
            onClick={() => {
              saveDraft();
              go(steps[stepIndex + 1]!);
            }}
          >
            Continue
          </PendingButton>
        ) : (
          <PendingButton
            pending={pending}
            pendingLabel="Submitting your request…"
            disabled={!model.canEdit}
            onClick={submitDesign}
          >
            Submit to Discovery
          </PendingButton>
        )}
        <PendingButton
          pending={pending && saveStatus === "saving"}
          pendingLabel="Saving your design…"
          disabled={!model.canEdit}
          onClick={saveDraft}
          className="cc-btn-secondary"
        >
          Save draft
        </PendingButton>
        {draft.configurationMode !== "RECOMMEND_EVERYTHING" && (
          <button
            type="button"
            className="text-sm text-cyan-400 hover:underline"
            onClick={() => updateDraft({ configurationMode: "RECOMMEND_EVERYTHING", letProcrowDecideTechnical: true })}
          >
            Switch to recommendations
          </button>
        )}
        <Link href={routes.client.request(model.requestId)} className="cc-btn-secondary">
          Save and return later
        </Link>
      </div>
    </div>
  );
}
