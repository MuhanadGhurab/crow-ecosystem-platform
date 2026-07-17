"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";

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
      className={`rounded-xl border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] p-4 sm:p-5 ${PUBLIC_V2_MOTION_CLASS.panel}`}
      aria-live="polite"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--pv2-text-muted)]">
        Diagram state
      </p>
      <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">{step.diagramCaption}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {nodes[stepId].map((node) => (
          <span
            key={node}
            className="rounded-lg border border-[color-mix(in_srgb,var(--pv2-teal)_25%,var(--pv2-border))] bg-[var(--pv2-teal-soft)] px-2.5 py-1.5 text-xs font-medium text-[var(--pv2-teal)]"
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
    (e: KeyboardEvent, index: number) => {
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
      band="teal"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.15fr] lg:gap-8">
        <div className="pv2-lifecycle-rail">
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
                  className={`pv2-tab w-full text-left ${selected ? "pv2-tab-active" : ""} ${PUBLIC_V2_MOTION_CLASS.tab}`}
                  onClick={() => setActiveId(step.id)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                >
                  <span className="mr-2 text-xs text-[var(--pv2-text-muted)]">{step.order}.</span>
                  {step.label}
                  {selected ? (
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--pv2-cyan)] align-middle" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel`}
          aria-labelledby={`${tablistId}-${activeId}`}
          className="pv2-card space-y-4 p-5 sm:p-6"
        >
          <div>
            <p className="text-lg font-medium text-[var(--pv2-text-primary)]">{active.label}</p>
            <p className="pv2-body mt-2">{active.explanation}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-[color-mix(in_srgb,var(--pv2-violet)_28%,var(--pv2-border))] bg-[var(--pv2-violet-soft)] px-3 py-1 font-medium text-[var(--pv2-violet)]">
              {active.engine}
            </span>
            <span className="rounded-full border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] px-3 py-1 text-[var(--pv2-text-muted)]">
              {active.deeperLinkLabel}
            </span>
          </div>
          <LifecycleDiagram stepId={activeId} />
        </div>
      </div>
    </PublicSection>
  );
}
