"use client";

/**
 * CROW.DISCOVERY.4 — Operating Model draft preview (pre-Blueprint, not approved).
 */

import type { OperatingModelDraftSection, OperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-types";

function SectionBlock({
  title,
  section,
}: {
  title: string;
  section: OperatingModelDraftSection;
}) {
  return (
    <div className="rounded-md border border-white/5 bg-black/20 p-3" data-om-section-status={section.status}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium text-slate-300">{title}</p>
        <p className="text-[10px] uppercase tracking-wide text-slate-600">{section.status}</p>
      </div>
      {section.content ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{section.content}</p>
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          {section.status === "not_applicable"
            ? "Not applicable for this journey / organization context."
            : "Missing — ProCrow may request clarification."}
        </p>
      )}
      {section.sourceQuestionKeys.length > 0 ? (
        <p className="mt-2 text-[10px] text-slate-600" data-om-source-keys={section.sourceQuestionKeys.join(",")}>
          Source: {section.sourceQuestionKeys.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export function DiscoveryMvpOperatingModelDraftPreview({
  draft,
  variant = "client",
}: {
  draft: OperatingModelInputDraft;
  variant?: "client" | "operator";
}) {
  const ready = draft.readinessSignals.readyForProCrowReview;

  return (
    <section
      className="space-y-4 rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-4"
      data-crow-discovery-mvp-d4="operating-model-draft"
      data-ready-for-blueprint-draft="false"
      data-ready-for-procrow-review={ready ? "true" : "false"}
      data-creates-blueprint="false"
      data-tenant-runtime="false"
    >
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-cyan-400/90">
          Discovery MVP · D4 Operating Model capture
        </p>
        <h3 className="text-base font-semibold text-slate-100">{draft.productLabel}</h3>
        <p className="text-sm text-slate-400">
          Pre-Blueprint · For ProCrow review · Not approved · Not tenant runtime. Derived from local
          Discovery answers only.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Overall completion</p>
          <p className="mt-1 text-lg font-semibold text-cyan-200">
            {draft.readinessSignals.overallCompletionPercent}%
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for ProCrow review</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{ready ? "Yes" : "Not yet"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Ready for Blueprint draft</p>
          <p className="mt-1 text-lg font-semibold text-amber-200" data-ready-for-blueprint-draft-value="false">
            No
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SectionBlock title="Purpose" section={draft.purpose} />
        <SectionBlock title="Operating context" section={draft.operatingContext} />
        <SectionBlock title="Organization shape" section={draft.organizationShape} />
        <SectionBlock title="People and teams" section={draft.peopleAndTeams} />
        <SectionBlock title="Responsibilities" section={draft.responsibilities} />
        <SectionBlock title="Workflows" section={draft.workflows} />
        <SectionBlock title="Systems and tools" section={draft.systemsAndTools} />
        <SectionBlock title="Data and records" section={draft.dataAndRecords} />
        <SectionBlock title="Trust and risk signals" section={draft.trustAndRiskSignals} />
        <SectionBlock title="Transformation / launch intent" section={draft.transformationIntent} />
        <SectionBlock title="Evidence references" section={draft.evidenceReferences} />
        <SectionBlock title="Decisions and approvals" section={draft.decisionsAndApprovals} />
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
        <p className="text-xs font-medium text-amber-200">Blueprint generation is blocked</p>
        <p className="mt-1 text-sm text-amber-100/80">
          This draft does not create a Blueprint. ProCrow review is required before deeper modeling.
          Tenant build, payment, and CroAI are out of scope.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Missing information</h4>
        {draft.missingInformation.length === 0 ? (
          <p className="text-sm text-slate-500">No missing-information items flagged for Stages 1–3 core.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
            {draft.missingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Readiness signals</h4>
        <ul className="space-y-1 text-sm text-slate-400">
          <li>
            Stages 1–3 completeness: {draft.readinessSignals.stageCompletenessPercent.stage1}% /{" "}
            {draft.readinessSignals.stageCompletenessPercent.stage2}% /{" "}
            {draft.readinessSignals.stageCompletenessPercent.stage3}%
          </li>
          <li>Missing core Discovery fields: {draft.readinessSignals.missingCoreFieldCount}</li>
          <li>Missing OM sections: {draft.readinessSignals.missingOperatingModelFieldCount}</li>
          <li>Risk flags: {draft.readinessSignals.riskFlagCount}</li>
        </ul>
      </div>

      {draft.riskFlags.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-200">Risk flags</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-100/80">
            {draft.riskFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {variant === "operator" ? (
        <div
          className="rounded-lg border border-teal-500/20 bg-teal-950/20 p-3"
          data-crow-discovery-d4-operator-prep
        >
          <h4 className="text-sm font-medium text-teal-200">ProCrow / operator preparation</h4>
          <p className="mt-1 text-xs text-slate-500">
            What Crow understood from Discovery — not a final approval. D5 review workflow is next.
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {draft.clarificationPrompts.map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-slate-600">
            Traceability keys: {draft.sourceQuestionKeys.join(", ") || "none yet"}
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          ProCrow will review this draft before any modeling or Blueprint work. Traceability:{" "}
          {draft.sourceQuestionKeys.length} source field(s).
        </p>
      )}
    </section>
  );
}
