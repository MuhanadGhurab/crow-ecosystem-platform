"use client";

import { useCallback, useId, useState } from "react";

import { PublicSection } from "@/components/public-v2/public-section";
import {
  PUBLIC_LIFECYCLE_STEPS,
  getPublicLifecycleStep,
} from "@/lib/public-v2/public-lifecycle";
import type { PublicLifecycleStepId } from "@/lib/public-v2/types";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

function LifecycleDiagram({ stepId }: { stepId: PublicLifecycleStepId }) {
  const step = getPublicLifecycleStep(stepId);
  const nodes: Record<PublicLifecycleStepId, string[]> = {
    understand: ["Intent", "Stakeholders", "Constraints"],
    map: ["People", "Responsibilities", "Workflows", "Trust"],
    design: ["Roles", "Personas", "Modules", "Security"],
    review: ["Provenance", "Scope", "Readiness", "Approval"],
    build: ["Blueprint", "Tenant", "Modules", "Baseline"],
    operate: ["Attention", "Work", "Decisions", "Evidence", "Outcomes"],
  };

  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-black/20 p-4 sm:p-5 ${PUBLIC_V2_MOTION_CLASS.panel}`}
      aria-live="polite"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Diagram state</p>
      <p className="mt-2 text-sm text-slate-300">{step.diagramCaption}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {nodes[stepId].map((node) => (
          <span
            key={node}
            className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-100"
          >
            {node}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PublicLifecycleExplorer() {
  const [activeId, setActiveId] = useState<PublicLifecycleStepId>("understand");
  const tablistId = useId();
  const active = getPublicLifecycleStep(activeId);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const ids = PUBLIC_LIFECYCLE_STEPS.map((s) => s.id);
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (index + 1) % ids.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (index - 1 + ids.length) % ids.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = ids.length - 1;
      } else {
        return;
      }
      setActiveId(ids[next]);
      document.getElementById(`${tablistId}-${ids[next]}`)?.focus();
    },
    [tablistId]
  );

  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.howCrowWorks}
      eyebrow="Lifecycle"
      title="How Crow works"
      description="Six accountable steps from understanding your organization to operating on a governed foundation."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8">
        <div
          role="tablist"
          id={tablistId}
          aria-label="Crow lifecycle steps"
          className="flex flex-wrap gap-2 lg:flex-col"
        >
          {PUBLIC_LIFECYCLE_STEPS.map((step, index) => {
            const selected = step.id === activeId;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                id={`${tablistId}-${step.id}`}
                aria-selected={selected}
                aria-controls={`${tablistId}-panel`}
                tabIndex={selected ? 0 : -1}
                className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all ${PUBLIC_V2_MOTION_CLASS.tab} ${
                  selected
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]"
                    : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/[0.14] hover:text-slate-200"
                }`}
                onClick={() => setActiveId(step.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                <span className="mr-2 text-xs text-slate-500">{step.order}.</span>
                {step.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel`}
          aria-labelledby={`${tablistId}-${activeId}`}
          className="space-y-4"
        >
          <div>
            <p className="text-lg font-medium text-white">{active.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{active.explanation}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-violet-200">
              {active.engine}
            </span>
            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-slate-400">
              {active.deeperLinkLabel}
            </span>
          </div>
          <LifecycleDiagram stepId={activeId} />
        </div>
      </div>
    </PublicSection>
  );
}
