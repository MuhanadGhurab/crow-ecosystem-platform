"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  saveClientEnterpriseDesignAction,
  submitClientEnterpriseDesignAction,
} from "@/lib/actions/client-enterprise-design";
import {
  analyzeClientDesignImpact,
  composeClientEnterpriseDesign,
  draftToInput,
  projectLeanModel,
  projectOperatingPriority,
  CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
  type ClientEnterpriseDesignDraft,
  type ClientOperatingPriority,
} from "@/lib/client-enterprise-design";
import type { ClientDesignPageModel } from "@/lib/services/client-enterprise-design-page.service";
import { routes } from "@/lib/routes";

const STEPS = [
  "field",
  "purpose",
  "scale",
  "capabilities",
  "priority",
  "compare",
  "workforce",
  "workflows",
  "customize",
  "review",
] as const;

type Step = (typeof STEPS)[number];

export function ClientDesignJourney({
  model,
  initialStep = "field",
}: {
  model: ClientDesignPageModel;
  initialStep?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ClientEnterpriseDesignDraft>(model.draft);
  const [step, setStep] = useState<Step>(STEPS.includes(initialStep as Step) ? (initialStep as Step) : "field");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [profileUpdatedAt, setProfileUpdatedAt] = useState(model.profileUpdatedAt);

  const snapshot = useMemo(
    () => composeClientEnterpriseDesign(draftToInput(draft)),
    [draft],
  );

  const stepIndex = STEPS.indexOf(step);

  function go(next: Step) {
    setStep(next);
    router.replace(`${routes.client.requestDiscoveryDesign(model.requestId)}?step=${next}`);
  }

  function updateDraft(patch: Partial<ClientEnterpriseDesignDraft>) {
    setDraft((d) => ({ ...d, ...patch, designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION }));
  }

  function saveDraft() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("requestId", model.requestId);
      fd.set("draftJson", JSON.stringify(draft));
      if (profileUpdatedAt) fd.set("expectedProfileUpdatedAt", profileUpdatedAt);
      const res = await saveClientEnterpriseDesignAction(null, fd);
      if (!res.ok) setMessage(res.error);
      else {
        setMessage("Draft saved.");
        if (res.profileUpdatedAt) setProfileUpdatedAt(res.profileUpdatedAt);
      }
    });
  }

  function submitDesign() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("requestId", model.requestId);
      fd.set("draftJson", JSON.stringify({ ...draft, status: "SUBMITTED" }));
      if (profileUpdatedAt) fd.set("expectedProfileUpdatedAt", profileUpdatedAt);
      const res = await submitClientEnterpriseDesignAction(null, fd);
      if (!res.ok) setMessage(res.error);
      else {
        setMessage("Design submitted to Discovery for ProCrow review.");
        router.push(routes.client.requestDiscoverySummary(model.requestId));
      }
    });
  }

  const lean = projectLeanModel(snapshot.leanModel);

  return (
    <div className="space-y-6 motion-safe:transition-opacity motion-reduce:transition-none">
      <nav aria-label="Design journey progress" className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              s === step ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {i + 1}. {s}
          </button>
        ))}
      </nav>

      {message && (
        <p className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
          {message}
        </p>
      )}

      {step === "field" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Choose your field</h2>
          <p className="text-sm text-slate-400">Select a primary industry and optional specialist domains.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {model.industries.map((ind) => (
              <button
                key={ind.key}
                type="button"
                onClick={() => updateDraft({ primaryIndustry: ind.key })}
                className={`rounded-xl border p-4 text-left motion-safe:transition-colors ${
                  draft.primaryIndustry === ind.key
                    ? "border-violet-500 bg-violet-950/40"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <p className="font-medium text-white">{ind.displayName}</p>
                <p className="mt-1 text-xs text-slate-400">{ind.commonOperatingModel}</p>
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {model.domains.slice(0, 12).map((d) => (
              <label key={d.key} className="flex items-start gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={draft.specialistDomains.includes(d.key)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...draft.specialistDomains, d.key]
                      : draft.specialistDomains.filter((k) => k !== d.key);
                    updateDraft({ specialistDomains: next });
                  }}
                />
                <span>{d.displayName}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {step === "purpose" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Define your purpose</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {model.purposes.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() =>
                  updateDraft({
                    businessPurposes: draft.businessPurposes.includes(p.key)
                      ? draft.businessPurposes
                      : [...draft.businessPurposes, p.key],
                    primaryPurposeKey: draft.primaryPurposeKey ?? p.key,
                  })
                }
                className={`rounded-xl border p-4 text-left ${
                  draft.businessPurposes.includes(p.key) ? "border-cyan-500" : "border-slate-700"
                }`}
              >
                <p className="font-medium text-white">{p.displayName}</p>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "scale" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Current and target scale</h2>
          <label className="block text-sm text-slate-300">
            Current scale
            <select
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
              value={draft.currentScale ?? "SMALL_TEAM"}
              onChange={(e) => updateDraft({ currentScale: e.target.value })}
            >
              {["SOLO", "MICRO", "SMALL_TEAM", "GROWING_ORGANIZATION", "ENTERPRISE"].map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Target scale
            <select
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
              value={draft.targetScale ?? "GROWING_ORGANIZATION"}
              onChange={(e) => updateDraft({ targetScale: e.target.value })}
            >
              {["SMALL_TEAM", "GROWING_ORGANIZATION", "MULTI_BRANCH", "ENTERPRISE"].map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </section>
      )}

      {step === "capabilities" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Operating capabilities</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {model.capabilities.slice(0, 24).map((c) => (
              <label key={c.key} className="flex gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={
                    draft.selectedCapabilities.includes(c.key) ||
                    snapshot.recommendedCapabilities.includes(c.key)
                  }
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...new Set([...draft.selectedCapabilities, c.key])]
                      : draft.selectedCapabilities.filter((k) => k !== c.key);
                    updateDraft({ selectedCapabilities: next });
                  }}
                />
                <span>
                  {c.displayName}
                  {snapshot.recommendedCapabilities.includes(c.key) && (
                    <span className="ml-2 text-xs text-violet-400">Recommended</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      {step === "priority" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Operating priority</h2>
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
          <h2 className="text-lg font-semibold text-white">Compare operating models</h2>
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
                  <p className="text-xs text-slate-500">
                    Workflow {v.workflowDepth} · Approvals {v.approvalDepth}
                  </p>
                </button>
              ))}
          </div>
        </section>
      )}

      {step === "workforce" && (
        <section className="cc-glass-card space-y-3">
          <h2 className="text-lg font-semibold text-white">Lean responsible workforce</h2>
          <p className="text-2xl font-semibold text-cyan-300">{lean.estimatedTeamRange}</p>
          <p className="text-xs text-slate-500">{lean.disclaimer}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {lean.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <h3 className="text-sm font-medium text-white">May combine</h3>
          <ul className="list-disc pl-5 text-sm text-slate-400">
            {lean.merges.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <h3 className="text-sm font-medium text-white">Keep separate</h3>
          <ul className="list-disc pl-5 text-sm text-slate-400">
            {lean.separations.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {step === "workflows" && (
        <section className="cc-glass-card space-y-3">
          <h2 className="text-lg font-semibold text-white">Workflows</h2>
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
          <h2 className="text-lg font-semibold text-white">Customize</h2>
          <button
            type="button"
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm"
            onClick={() => {
              const impact = analyzeClientDesignImpact({
                baselineInput: draftToInput(draft),
                action: {
                  id: "demo-add-crm",
                  kind: "add_capability",
                  targetKey: "crm",
                },
              });
              setMessage(impact.simpleSummary);
            }}
          >
            Preview adding CRM (impact panel)
          </button>
        </section>
      )}

      {step === "review" && (
        <section className="cc-glass-card space-y-4">
          <h2 className="text-lg font-semibold text-white">Review and submit</h2>
          <p className="text-sm text-slate-400">
            This is an enterprise-design Discovery submission. It is not a final contract, does not
            provision software, and does not grant authority. ProCrow will review before Blueprint
            finalization.
          </p>
          <ul className="text-sm text-slate-300">
            <li>Field: {draft.primaryIndustry ?? "—"}</li>
            <li>Purposes: {draft.businessPurposes.join(", ") || "—"}</li>
            <li>Variant: {draft.selectedModelVariant}</li>
            <li>Team range: {lean.estimatedTeamRange}</li>
          </ul>
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
            placeholder="Client notes (optional)"
            value={draft.clientNotes ?? ""}
            onChange={(e) => updateDraft({ clientNotes: e.target.value })}
          />
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={stepIndex <= 0}
          onClick={() => go(STEPS[stepIndex - 1]!)}
          className="cc-btn-secondary"
        >
          Back
        </button>
        {stepIndex < STEPS.length - 1 ? (
          <button type="button" onClick={() => go(STEPS[stepIndex + 1]!)} className="cc-btn-primary">
            Continue
          </button>
        ) : (
          <button type="button" disabled={pending || !model.canEdit} onClick={submitDesign} className="cc-btn-primary">
            Submit to Discovery
          </button>
        )}
        <button type="button" disabled={pending || !model.canEdit} onClick={saveDraft} className="cc-btn-secondary">
          Save draft
        </button>
        <Link href={routes.client.requestDiscoveryCompare(model.requestId)} className="cc-btn-secondary">
          Open comparison view
        </Link>
      </div>
    </div>
  );
}
