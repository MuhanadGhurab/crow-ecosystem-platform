"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BusinessFieldFinder } from "@/components/client-enterprise-design/business-field-finder";
import { PendingButton } from "@/components/ui/pending-button";
import { submitClientServiceRequestAction } from "@/lib/actions/client-service-request";
import {
  CLIENT_GROWTH_INTENTION_OPTIONS,
  CLIENT_TEAM_SIZE_OPTIONS,
} from "@/lib/business-field-catalog/team-scale";
import type { ClientConfigurationMode } from "@/lib/client-enterprise-design/types";
import { listBusinessPurposes } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import { buildDefaultRequestBrief } from "@/lib/client-service-request/constants";
import { REQUEST_JOURNEY_KIND_LABELS, type RequestJourneyKind } from "@/lib/client-service-request/journey";
import { ORGANIZATION_CONTEXT_OPTIONS } from "@/lib/client-service-request/org-context-labels";
import { buildPreliminaryRequestRecommendation } from "@/lib/client-service-request/preliminary-recommendation";
import {
  clearRequestWizardDraft,
  loadRequestWizardDraft,
  saveRequestWizardDraft,
} from "@/lib/client-service-request/draft-storage";
import type {
  ClientServiceRequestBrief,
  ClientServiceRequestBriefInput,
  OrganizationContextKind,
} from "@/lib/client-service-request/types";
import { routes } from "@/lib/routes";
import {
  clearCrowStoryState,
  defaultOrganizationContextForJourney,
  parseJourneyUrlParam,
} from "@/lib/crow-story/journey-state";

const STEPS = ["field", "purpose", "team", "mode", "understanding", "review"] as const;
type Step = (typeof STEPS)[number];

const CONFIG_MODES: Array<{ key: ClientConfigurationMode; label: string; description: string }> = [
  {
    key: "RECOMMEND_EVERYTHING",
    label: "Recommend everything for me",
    description: "Crow and ProCrow recommend capabilities, responsibilities, workflows, security and integrations.",
  },
  {
    key: "GUIDE_ME",
    label: "Guide me through the important choices",
    description: "Crow recommends key choices and allows controlled customization during Discovery.",
  },
  {
    key: "EXPERT_CONFIGURATION",
    label: "I know what I need",
    description: "Recommended for IT specialists, cybersecurity specialists, consultants or experienced system buyers.",
  },
];

const JOURNEY_OPTIONS: Array<{ key: RequestJourneyKind; label: string }> = [
  { key: "NEW", label: REQUEST_JOURNEY_KIND_LABELS.NEW },
  { key: "TRANSFORM", label: REQUEST_JOURNEY_KIND_LABELS.TRANSFORM },
];

export function ServiceRequestWizard({ accountScopeKey }: { accountScopeKey: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("field");
  const [brief, setBrief] = useState<ClientServiceRequestBrief>(() => buildDefaultRequestBrief());
  const [draftNotice, setDraftNotice] = useState<"resume" | "saved" | null>(null);
  const [allowDraftSave, setAllowDraftSave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const existing = loadRequestWizardDraft(accountScopeKey);
    if (existing) {
      setDraftNotice("resume");
    } else {
      setAllowDraftSave(true);
    }
  }, [accountScopeKey]);

  useEffect(() => {
    const journey = parseJourneyUrlParam(searchParams.get("journey"));
    if (!journey) return;
    const defaultCtx = defaultOrganizationContextForJourney(journey) as OrganizationContextKind;
    setBrief((b) => ({
      ...b,
      journeyKind: b.journeyKind ?? journey,
      organizationContext: b.organizationContext ?? defaultCtx,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (!allowDraftSave) return;
    const t = window.setTimeout(() => {
      saveRequestWizardDraft(accountScopeKey, { step, brief });
      setDraftNotice("saved");
    }, 500);
    return () => window.clearTimeout(t);
  }, [accountScopeKey, step, brief, allowDraftSave]);

  const stepIndex = STEPS.indexOf(step);
  const purposes = listBusinessPurposes();

  const preview = useMemo(() => {
    if (stepIndex < STEPS.indexOf("understanding")) return null;
    const input: ClientServiceRequestBriefInput = {
      idempotencyKey: brief.idempotencyKey,
      primaryBusinessFieldKey: brief.primaryBusinessFieldKey,
      secondaryBusinessFieldKeys: brief.secondaryBusinessFieldKeys,
      customFieldDescription: brief.customFieldDescription,
      fieldResolutionStatus: brief.fieldResolutionStatus,
      customFieldSuggestedMatches: brief.customFieldSuggestedMatches,
      requiresProcrowFieldReview: brief.requiresProcrowFieldReview,
      primaryPurposeKey: brief.primaryPurposeKey,
      secondaryPurposeKeys: brief.secondaryPurposeKeys,
      customPurposeDescription: brief.customPurposeDescription,
      currentTeamRange: brief.currentTeamRange,
      growthIntention: brief.growthIntention,
      journeyKind: brief.journeyKind,
      organizationContext: brief.organizationContext,
      configurationMode: brief.configurationMode,
      plainLanguageGoal: brief.plainLanguageGoal,
      letProcrowDecideTechnical: brief.letProcrowDecideTechnical,
      clientAcknowledgements: brief.clientAcknowledgements,
    };
    return buildPreliminaryRequestRecommendation(input);
  }, [brief, stepIndex]);

  function patch(p: Partial<ClientServiceRequestBrief>) {
    setBrief((b) => ({ ...b, ...p }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case "field":
        return Boolean(brief.primaryBusinessFieldKey || brief.customFieldDescription?.trim());
      case "purpose":
        return Boolean(brief.primaryPurposeKey || brief.customPurposeDescription?.trim());
      case "team":
        return Boolean(brief.currentTeamRange && brief.growthIntention && brief.journeyKind);
      case "mode":
        return Boolean(brief.configurationMode);
      case "understanding":
        return true;
      case "review":
        return brief.clientAcknowledgements.understandsNoTenantProvisioning;
      default:
        return true;
    }
  }

  function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    startTransition(async () => {
      const input: ClientServiceRequestBriefInput = {
        idempotencyKey: brief.idempotencyKey,
        primaryBusinessFieldKey: brief.primaryBusinessFieldKey,
        secondaryBusinessFieldKeys: brief.secondaryBusinessFieldKeys,
        customFieldDescription: brief.customFieldDescription,
        fieldResolutionStatus: brief.fieldResolutionStatus,
        customFieldSuggestedMatches: brief.customFieldSuggestedMatches,
        requiresProcrowFieldReview: brief.requiresProcrowFieldReview,
        primaryPurposeKey: brief.primaryPurposeKey,
        secondaryPurposeKeys: brief.secondaryPurposeKeys,
        customPurposeDescription: brief.customPurposeDescription,
        currentTeamRange: brief.currentTeamRange,
        growthIntention: brief.growthIntention,
        journeyKind: brief.journeyKind,
        organizationContext: brief.organizationContext,
        configurationMode: brief.configurationMode,
        plainLanguageGoal: brief.plainLanguageGoal,
        letProcrowDecideTechnical: brief.letProcrowDecideTechnical,
        clientAcknowledgements: brief.clientAcknowledgements,
      };
      const res = await submitClientServiceRequestAction(input);
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      clearRequestWizardDraft(accountScopeKey);
      clearCrowStoryState();
      router.push(routes.client.requestConfirmation(res.requestId));
    });
  }

  return (
    <div className="cc-wizard-shell space-y-6">
      <p className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-4 py-3 text-sm text-cyan-100/90">
        Start by telling Crow what your business does. You do not need to know which ERP modules you need — Crow and
        ProCrow can recommend the technical configuration during Discovery.
      </p>

      {draftNotice === "resume" && (
        <div className="cc-glass-card flex flex-wrap items-center justify-between gap-3" role="status" aria-live="polite">
          <p className="text-sm text-slate-300">Draft saved on this device — resume where you left off?</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="cc-btn-primary text-sm"
              onClick={() => {
                const existing = loadRequestWizardDraft(accountScopeKey);
                if (existing) {
                  setBrief(existing.brief);
                  setStep(existing.step as Step);
                }
                setAllowDraftSave(true);
                setDraftNotice(null);
              }}
            >
              Resume draft
            </button>
            <button
              type="button"
              className="cc-btn-secondary text-sm"
              onClick={() => {
                clearRequestWizardDraft(accountScopeKey);
                setBrief(buildDefaultRequestBrief());
                setStep("field");
                setAllowDraftSave(true);
                setDraftNotice(null);
              }}
            >
              Discard draft
            </button>
          </div>
        </div>
      )}

      {draftNotice === "saved" && (
        <p className="text-xs text-slate-500" role="status" aria-live="polite">
          Draft saved on this device (not stored on Crow servers).
        </p>
      )}

      <header>
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          {step === "field" && "What kind of business is this?"}
          {step === "purpose" && "What do you want to accomplish?"}
          {step === "team" && "Team and growth"}
          {step === "mode" && "How should Crow help?"}
          {step === "understanding" && "Preliminary understanding"}
          {step === "review" && "Review and submit"}
        </h2>
      </header>

      {error && (
        <p role="alert" className="cc-alert-warning text-sm">
          {error}
        </p>
      )}

      {step === "field" && (
        <section className="cc-glass-card">
          <BusinessFieldFinder
            selectedPrimaryKey={brief.primaryBusinessFieldKey}
            selectedSecondaryKeys={brief.secondaryBusinessFieldKeys}
            customDescription={brief.customFieldDescription}
            showCustomFallback={brief.fieldResolutionStatus === "CUSTOM_UNRESOLVED"}
            onSelectPrimary={(key) =>
              patch({
                primaryBusinessFieldKey: key,
                fieldResolutionStatus: "CATALOG_MATCH",
                customFieldDescription: null,
                requiresProcrowFieldReview: false,
              })
            }
            onToggleSecondary={(key) => {
              const next = brief.secondaryBusinessFieldKeys.includes(key)
                ? brief.secondaryBusinessFieldKeys.filter((k) => k !== key)
                : [...brief.secondaryBusinessFieldKeys, key];
              patch({ secondaryBusinessFieldKeys: next });
            }}
            onCustomFallback={(desc, suggested) =>
              patch({
                customFieldDescription: desc,
                fieldResolutionStatus: "CUSTOM_UNRESOLVED",
                customFieldSuggestedMatches: suggested,
                requiresProcrowFieldReview: true,
                primaryBusinessFieldKey: null,
              })
            }
            onClearCustom={() =>
              patch({
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
            {purposes.slice(0, 16).map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() =>
                  patch({
                    primaryPurposeKey: p.key,
                    customPurposeDescription: null,
                    secondaryPurposeKeys: [],
                  })
                }
                className={`rounded-xl border p-4 text-left ${
                  brief.primaryPurposeKey === p.key ? "border-cyan-500" : "border-slate-700"
                }`}
              >
                <p className="font-medium text-white">{p.displayName}</p>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </button>
            ))}
          </div>
          <details className="rounded-xl border border-slate-700 p-4">
            <summary className="cursor-pointer text-sm font-medium text-amber-400">My purpose is not listed</summary>
            <textarea
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
              rows={2}
              value={brief.customPurposeDescription ?? ""}
              onChange={(e) =>
                patch({
                  customPurposeDescription: e.target.value,
                  primaryPurposeKey: e.target.value ? null : brief.primaryPurposeKey,
                })
              }
              placeholder="Describe what your organization is trying to achieve…"
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
                  onClick={() => patch({ currentTeamRange: opt.key })}
                  className={`rounded-xl border p-3 text-left text-sm ${
                    brief.currentTeamRange === opt.key ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-white">How do you expect the organization to grow?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {CLIENT_GROWTH_INTENTION_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => patch({ growthIntention: opt.key })}
                  className={`rounded-xl border p-3 text-left text-sm ${
                    brief.growthIntention === opt.key ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-white">Journey</legend>
            <p className="mt-1 text-xs text-slate-400">
              Build New vs Transform Existing — required and saved with your request.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {JOURNEY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    const defaultCtx = defaultOrganizationContextForJourney(opt.key) as OrganizationContextKind;
                    patch({
                      journeyKind: opt.key,
                      organizationContext: brief.organizationContext ?? defaultCtx,
                    });
                  }}
                  className={`rounded-xl border p-3 text-left text-sm ${
                    brief.journeyKind === opt.key ? "border-cyan-500" : "border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-white">Organization context</legend>
            <p className="mt-1 text-xs text-slate-400">
              Optional detail within your journey (new business/division vs existing/modernization).
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ORGANIZATION_CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => patch({ organizationContext: opt.key, journeyKind: brief.journeyKind ?? opt.typicalJourney })}
                  className={`rounded-xl border p-3 text-left text-sm ${
                    brief.organizationContext === opt.key ? "border-violet-500" : "border-slate-700"
                  }`}
                >
                  <span className="block font-medium text-white">{opt.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">{opt.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm text-slate-300">
            Plain-language goal (optional)
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
              rows={2}
              value={brief.plainLanguageGoal ?? ""}
              onChange={(e) => patch({ plainLanguageGoal: e.target.value })}
              placeholder="Anything else Crow should know in your own words…"
            />
          </label>
        </section>
      )}

      {step === "mode" && (
        <section className="cc-glass-card space-y-3">
          {CONFIG_MODES.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() =>
                patch({
                  configurationMode: opt.key,
                  letProcrowDecideTechnical: opt.key === "RECOMMEND_EVERYTHING",
                })
              }
              className={`block w-full rounded-xl border p-4 text-left ${
                brief.configurationMode === opt.key ? "border-violet-500 bg-violet-950/30" : "border-slate-700"
              }`}
            >
              <p className="font-medium text-white">{opt.label}</p>
              <p className="mt-1 text-sm text-slate-400">{opt.description}</p>
              {opt.key === "EXPERT_CONFIGURATION" && (
                <p className="mt-2 text-xs text-amber-400">Advanced configuration appears during Discovery only.</p>
              )}
            </button>
          ))}
        </section>
      )}

      {step === "understanding" && preview && (
        <section className="cc-glass-card space-y-4">
          <p className="text-sm text-cyan-300">
            Preliminary understanding — ProCrow will verify this during Discovery.
          </p>
          <p className="text-sm text-slate-300">{preview.summary}</p>
          <div>
            <h3 className="text-sm font-semibold text-white">Likely essential capabilities</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
              {preview.essentialCapabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          {preview.procrowReviewAreas.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white">Areas ProCrow should review</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
                {preview.procrowReviewAreas.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {step === "review" && (
        <section className="cc-glass-card space-y-4">
          <p className="text-sm text-slate-400">
            Submitting this request does not create a tenant, grant access, approve a final design or create a Blueprint.
            It creates a service request for Crow and ProCrow to review.
          </p>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>
              Journey:{" "}
              {brief.journeyKind ? REQUEST_JOURNEY_KIND_LABELS[brief.journeyKind] : "— (required)"}
            </li>
            <li>
              Organization context:{" "}
              {ORGANIZATION_CONTEXT_OPTIONS.find((o) => o.key === brief.organizationContext)?.label ?? "—"}
            </li>
            <li>Field: {brief.primaryBusinessFieldKey ?? brief.customFieldDescription ?? "—"}</li>
            <li>Purpose: {brief.primaryPurposeKey ?? brief.customPurposeDescription ?? "—"}</li>
            <li>Team: {brief.currentTeamRange ?? "—"}</li>
            <li>Growth: {brief.growthIntention ?? "—"}</li>
            <li>Guidance: {brief.configurationMode.replace(/_/g, " ")}</li>
          </ul>
          <label className="flex items-start gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={brief.clientAcknowledgements.understandsNoTenantProvisioning}
              onChange={(e) =>
                patch({
                  clientAcknowledgements: {
                    ...brief.clientAcknowledgements,
                    understandsNoTenantProvisioning: e.target.checked,
                    understandsProcrowReview: e.target.checked,
                  },
                })
              }
            />
            I understand this submits a service request for review — not a live tenant or Blueprint.
          </label>
        </section>
      )}

      <div className="cc-wizard-actions flex flex-wrap gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={stepIndex <= 0}
          onClick={() => setStep(STEPS[stepIndex - 1]!)}
          className="cc-btn-secondary"
        >
          Back
        </button>
        {stepIndex < STEPS.length - 1 ? (
          <PendingButton pending={pending} pendingLabel="Loading…" disabled={!canAdvance()} onClick={() => setStep(STEPS[stepIndex + 1]!)}>
            Continue
          </PendingButton>
        ) : (
          <PendingButton
            pending={pending || submitting}
            pendingLabel="Submitting request…"
            disabled={!canAdvance() || submitting}
            onClick={submit}
          >
            Submit Request
          </PendingButton>
        )}
      </div>
    </div>
  );
}
