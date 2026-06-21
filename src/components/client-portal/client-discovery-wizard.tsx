"use client";

import Link from "next/link";
import { useActionState, useMemo } from "react";
import {
  saveClientDiscoveryDraftAction,
  submitClientDiscoveryForReviewAction,
  type ClientDiscoveryActionResult,
} from "@/lib/actions/client-discovery";
import {
  CLIENT_DISCOVERY_SUBMIT_DISCLAIMER,
  type ClientDiscoveryPageModel,
  type ClientDiscoveryStep,
  discoveryStatusLabel,
} from "@/lib/client-portal/client-discovery-contract";
import {
  DISCOVERY_AUTHORITY_CONFIRMATION_TEXT,
  DISCOVERY_AUTHORITY_CONFIRMATION_VERSION,
  DISCOVERY_COMPLIANCE_BOUNDARY,
  DISCOVERY_SENSITIVE_DATA_WARNING,
} from "@/lib/legal/compliance-positioning";
import { PROCROW_DISCOVERY_CLIENT_CHANGES_PREFIX } from "@/lib/procrow/procrow-discovery-review-contract";
import { CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS } from "@/lib/client-portal/client-company-profile-fields";
import type { ClientDiscoveryStageTemplateDef } from "@/lib/constants/client-discovery-stage-templates";
import { CEM_MODULES } from "@/lib/constants/modules";
import { moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import {
  DISCOVERY_SECURITY_ADVISORY_DOMAINS,
  DISCOVERY_SECURITY_READINESS_OPTIONS,
} from "@/lib/constants/discovery-security-advisory";

const initial: ClientDiscoveryActionResult | null = null;

const STEP_LABELS: Record<ClientDiscoveryStep, string> = {
  company_size: "Company size",
  industry_template: "Industry",
  company_stage: "Company stage",
  departments: "Departments",
  roles: "Roles",
  modules: "Modules",
  workflows: "Workflows",
  security: "Security",
  sarea: "SAREA",
  review_submit: "Review & submit",
};

type IndustryOption = { value: string; label: string; summary: string };

type Props = {
  model: ClientDiscoveryPageModel;
  stageTemplates: readonly ClientDiscoveryStageTemplateDef[];
  industryOptions: IndustryOption[];
  initialStep?: string | null;
};

export function ClientDiscoveryWizard({
  model,
  stageTemplates,
  industryOptions,
  initialStep,
}: Props) {
  const [saveState, saveAction, savePending] = useActionState(
    saveClientDiscoveryDraftAction,
    initial
  );
  const [submitState, submitAction, submitPending] = useActionState(
    submitClientDiscoveryForReviewAction,
    initial
  );

  const activeStep = useMemo(() => {
    const step = initialStep as ClientDiscoveryStep | undefined;
    if (step && step in STEP_LABELS) return step;
    return model.nextStep ?? "company_size";
  }, [initialStep, model.nextStep]);

  const rec = model.recommendations;
  const moduleSet = new Set(model.draft.selectedModules);

  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap gap-2 text-xs">
        {(Object.keys(STEP_LABELS) as ClientDiscoveryStep[]).map((step) => (
          <a
            key={step}
            href={`#${step}`}
            className={`rounded-full border px-3 py-1 ${
              step === activeStep
                ? "border-teal-500/50 bg-teal-500/10 text-teal-200"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            {STEP_LABELS[step]}
          </a>
        ))}
      </nav>

      <ClientDiscoveryStatusBanner model={model} />

      {model.procrowChangeRequest && (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium">{PROCROW_DISCOVERY_CLIENT_CHANGES_PREFIX}</p>
          <p className="mt-2 whitespace-pre-wrap text-amber-50/90">
            {model.procrowChangeRequest.message}
          </p>
          {model.procrowChangeRequest.requestedSections.length > 0 && (
            <p className="mt-2 text-xs text-amber-200/80">
              Please revise:{" "}
              {model.procrowChangeRequest.requestedSections
                .map((s) => STEP_LABELS[s])
                .join(", ")}
            </p>
          )}
          <p className="mt-2 text-xs text-amber-200/70">
            Update your answers below, then resubmit for ProCrow review.
          </p>
        </section>
      )}

      {model.procrowAcceptedMessage && (
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {model.procrowAcceptedMessage}
        </section>
      )}

      {!model.canEdit && model.editBlockedReason && (
        <p className="cc-alert-warning text-sm">{model.editBlockedReason}</p>
      )}

      {(saveState?.ok === false || submitState?.ok === false) && (
        <p className="cc-alert-warning text-sm" role="alert">
          {saveState?.ok === false ? saveState.error : submitState?.ok === false ? submitState.error : null}
        </p>
      )}
      {(saveState?.ok === true || submitState?.ok === true) && (
        <p
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
          role="status"
        >
          {submitState?.ok ? "Discovery submitted for ProCrow review." : "Discovery draft saved."}
        </p>
      )}

      <form action={saveAction} className="space-y-10">
        <input type="hidden" name="request_id" value={model.requestId} />

        <section id="company_size" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="company_size" title="Company size" />
          <div>
            <label htmlFor="employee_band" className="block text-xs font-medium text-slate-500">
              Employee band
            </label>
            <select
              id="employee_band"
              name="employee_band"
              defaultValue={model.draft.employeeBand ?? ""}
              disabled={!model.canEdit}
              className="input-cc mt-1 max-w-md w-full"
            >
              <option value="">Select band</option>
              {CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="expected_users" className="block text-xs font-medium text-slate-500">
              Expected users (optional)
            </label>
            <input
              id="expected_users"
              name="expected_users"
              type="text"
              defaultValue={model.draft.expectedUsers ?? ""}
              disabled={!model.canEdit}
              className="input-cc mt-1 max-w-md w-full"
              placeholder="e.g. 25"
            />
          </div>
        </section>

        <section id="industry_template" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="industry_template" title="Industry template" />
          <p className="text-sm text-slate-400">
            Templates pre-fill advisory departments, roles, modules, and workflows. ProCrow validates
            the official blueprint.
          </p>
          <select
            name="industry_template"
            defaultValue={model.draft.industryTemplate ?? ""}
            disabled={!model.canEdit}
            className="input-cc max-w-lg w-full"
          >
            <option value="">Select industry</option>
            {industryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {rec && (
            <p className="text-xs text-slate-500">{rec.advisoryNote}</p>
          )}
        </section>

        <section id="company_stage" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="company_stage" title="Company stage" />
          <div className="grid gap-3 sm:grid-cols-3">
            {stageTemplates.map((t) => (
              <label
                key={t.key}
                className={`cursor-pointer rounded-xl border p-4 ${
                  model.draft.companyStageTemplate === t.key
                    ? "border-teal-500/40 bg-teal-500/5"
                    : "border-slate-700 bg-slate-900/40"
                }`}
              >
                <input
                  type="radio"
                  name="company_stage_template"
                  value={t.key}
                  defaultChecked={model.draft.companyStageTemplate === t.key}
                  disabled={!model.canEdit}
                  className="sr-only"
                />
                <p className="font-medium text-white">{t.label}</p>
                <p className="mt-2 text-xs text-slate-400">{t.description}</p>
              </label>
            ))}
          </div>
        </section>

        <section id="modules" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="modules" title="Recommended modules" />
          <p className="text-sm text-slate-400">Adjust module selection. Final scope is confirmed by ProCrow.</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CEM_MODULES.map((m) => (
              <label
                key={m.key}
                className="flex items-center gap-2 rounded-lg border border-slate-700/80 px-3 py-2 text-sm text-slate-300"
              >
                <input
                  type="checkbox"
                  name="selected_modules"
                  value={m.key}
                  defaultChecked={moduleSet.has(m.key)}
                  disabled={!model.canEdit}
                />
                {moduleLabel(m.key)}
              </label>
            ))}
          </div>
        </section>

        <section id="departments" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="departments" title="Departments" />
          <p className="text-sm text-slate-400">
            Suggested departments (comma-separated). Add notes in discovery notes if you need a custom
            structure.
          </p>
          <textarea
            name="selected_departments"
            rows={3}
            defaultValue={model.draft.selectedDepartments.join(", ")}
            disabled={!model.canEdit}
            className="input-cc w-full font-mono text-sm"
            placeholder={rec?.departments.join(", ")}
          />
        </section>

        <section id="roles" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="roles" title="Roles" />
          <p className="text-sm text-slate-400">
            Suggested roles (advisory — no user assignment here). Mark roles not needed by removing them.
          </p>
          <textarea
            name="selected_roles"
            rows={3}
            defaultValue={model.draft.selectedRoles.join(", ")}
            disabled={!model.canEdit}
            className="input-cc w-full font-mono text-sm"
            placeholder={rec?.roles.join(", ")}
          />
        </section>

        <section id="workflows" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="workflows" title="Workflows" />
          <p className="text-sm text-slate-400">Confirm or skip advisory workflows.</p>
          <textarea
            name="selected_workflows"
            rows={3}
            defaultValue={model.draft.selectedWorkflows.join(", ")}
            disabled={!model.canEdit}
            className="input-cc w-full font-mono text-sm"
            placeholder={rec?.workflows.join(", ")}
          />
        </section>

        <section id="security" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="security" title="Security & CyberCrow" />
          <p className="text-sm text-slate-400">
            Capture advisory security context for ProCrow review. Selections indicate alignment
            targets and readiness — not certification or compliance verdicts.
          </p>
          <p className="rounded-lg border border-violet-500/20 bg-violet-950/20 px-3 py-2 text-xs text-violet-100/90">
            {DISCOVERY_COMPLIANCE_BOUNDARY}
          </p>
          <div className="space-y-4">
            {DISCOVERY_SECURITY_ADVISORY_DOMAINS.map((domain) => (
              <div key={domain.key}>
                <label
                  htmlFor={`security_advisory_${domain.key}`}
                  className="block text-xs font-medium text-slate-500"
                >
                  {domain.label}
                </label>
                <p className="text-xs text-slate-600">{domain.prompt}</p>
                <select
                  id={`security_advisory_${domain.key}`}
                  name={`security_advisory_${domain.key}`}
                  defaultValue={model.draft.securityAdvisory[domain.key] ?? "Not assessed"}
                  disabled={!model.canEdit}
                  className="input-cc mt-1 max-w-md w-full text-sm"
                >
                  {DISCOVERY_SECURITY_READINESS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="security_preference" className="block text-xs font-medium text-slate-500">
              Additional security notes (optional)
            </label>
            <textarea
              id="security_preference"
              name="security_preference"
              rows={2}
              defaultValue={
                model.draft.securityPreference ?? rec?.security.join("; ") ?? ""
              }
              disabled={!model.canEdit}
              className="input-cc mt-1 w-full text-sm"
            />
          </div>
        </section>

        <section id="sarea" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="sarea" title="SAREA experience" />
          <p className="text-sm text-slate-400">
            SAREA adapts navigation and dashboards. ProCrow configures the final profile.
          </p>
          <textarea
            name="sarea_preference"
            rows={2}
            defaultValue={model.draft.sareaPreference ?? rec?.sarea.join("; ") ?? ""}
            disabled={!model.canEdit}
            className="input-cc w-full text-sm"
          />
        </section>

        <section id="review_submit" className="cc-glass-card scroll-mt-24 space-y-4">
          <SectionHeading step="review_submit" title="Review & submit" />
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <SummaryItem label="Industry" value={model.draft.industryTemplate ?? "—"} />
            <SummaryItem label="Stage" value={model.draft.companyStageTemplate ?? "—"} />
            <SummaryItem label="Employee band" value={model.draft.employeeBand ?? "—"} />
            <SummaryItem label="Modules" value={String(model.draft.selectedModules.length)} />
            <SummaryItem label="Departments" value={String(model.draft.selectedDepartments.length)} />
            <SummaryItem label="Roles" value={String(model.draft.selectedRoles.length)} />
            <SummaryItem label="Workflows" value={String(model.draft.selectedWorkflows.length)} />
          </dl>
          <div>
            <label htmlFor="notes" className="block text-xs font-medium text-slate-500">
              Notes for ProCrow (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={model.draft.notes ?? ""}
              disabled={!model.canEdit}
              className="input-cc mt-1 w-full text-sm"
            />
          </div>
          <p className="text-xs text-slate-500">{model.pricingHonestyCopy}</p>
          <p className="text-xs text-amber-200/90">{CLIENT_DISCOVERY_SUBMIT_DISCLAIMER}</p>
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3 text-sm text-amber-100/90">
            <p className="font-medium">Sensitive information</p>
            <p className="mt-1 text-xs">{DISCOVERY_SENSITIVE_DATA_WARNING}</p>
          </div>
          <div className="rounded-lg border border-slate-600/50 bg-slate-900/40 px-3 py-3 text-sm text-slate-300">
            <p className="text-xs">{DISCOVERY_COMPLIANCE_BOUNDARY}</p>
          </div>
        </section>

        {model.canEdit && (
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="cc-btn-secondary text-sm" disabled={savePending}>
              {savePending ? "Saving…" : "Save draft"}
            </button>
          </div>
        )}
      </form>

      {model.canEdit && (
        <form action={submitAction} className="cc-glass-card space-y-4">
          <input type="hidden" name="request_id" value={model.requestId} />
          <p className="text-sm text-slate-300">
            When you are ready, submit discovery for ProCrow review. This does not approve the blueprint
            or activate billing.
          </p>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              name="authority_confirmed"
              value="true"
              required
              className="mt-1"
            />
            <span>
              {DISCOVERY_AUTHORITY_CONFIRMATION_TEXT}
              <span className="mt-1 block text-xs text-slate-500">
                Confirmation version {DISCOVERY_AUTHORITY_CONFIRMATION_VERSION} · recorded with
                submission timestamp.
              </span>
            </span>
          </label>
          <button
            type="submit"
            className="cc-btn-primary text-sm"
            disabled={submitPending || model.missingSteps.length > 0}
          >
            {submitPending ? "Submitting…" : "Submit discovery for ProCrow review"}
          </button>
          {model.missingSteps.length > 0 && (
            <p className="text-xs text-amber-200/90">
              Complete required sections before submit:{" "}
              {model.missingSteps.map((s) => STEP_LABELS[s]).join(", ")}
            </p>
          )}
        </form>
      )}

      <p className="text-sm text-slate-500">
        <Link href={routes.client.request(model.requestId)} className="text-teal-400 hover:text-teal-300">
          ← Back to request
        </Link>
      </p>
    </div>
  );
}

function SectionHeading({ step, title }: { step: ClientDiscoveryStep; title: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400" id={step}>
      {title}
    </h2>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function ClientDiscoveryStatusBanner({ model }: { model: ClientDiscoveryPageModel }) {
  const tone =
    model.draft.status === "submitted_for_procrow_review" ||
    model.draft.status === "procrow_reviewing"
      ? "warning"
      : model.draft.status === "changes_requested"
        ? "warning"
        : model.draft.status === "accepted_into_blueprint"
          ? "success"
          : model.draft.status === "in_progress"
            ? "info"
            : "default";

  const badgeClass =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
      : tone === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
        : tone === "info"
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
          : "border-slate-600/50 bg-slate-800/50 text-slate-300";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${badgeClass}`}>
      <span className="font-medium">Discovery status:</span>{" "}
      {discoveryStatusLabel(model.draft.status)}
      {model.nextStep && model.canEdit && (
        <span className="mt-1 block text-slate-400">
          Suggested next: {STEP_LABELS[model.nextStep]}
        </span>
      )}
    </div>
  );
}
