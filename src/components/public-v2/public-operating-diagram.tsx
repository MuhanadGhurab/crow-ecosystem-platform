"use client";

import { useId, useState } from "react";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";
import type { PublicOperatingStageId } from "@/lib/public-v2/types";

const STAGES = [
  {
    id: "intent" as const,
    label: "Organizational Intent",
    short: "Intent",
    accent: "violet" as const,
    description: "Purpose, scope, and outcomes the organization must achieve.",
  },
  {
    id: "operating" as const,
    label: "Operating Model",
    short: "Operating Model",
    accent: "cyan" as const,
    description: "People, responsibilities, workflows, and trust requirements connected as one model.",
    nested: true,
  },
  {
    id: "blueprint" as const,
    label: "Enterprise Blueprint",
    short: "Blueprint",
    accent: "violet" as const,
    description: "Reviewed build source — approved before tenant construction.",
  },
  {
    id: "runtime" as const,
    label: "Operational Runtime",
    short: "Runtime",
    accent: "cyan" as const,
    description: "CEM work, CyberCrow trust, and SAREA-permitted workspace in operation.",
  },
] satisfies readonly {
  id: PublicOperatingStageId;
  label: string;
  short: string;
  accent: "cyan" | "violet";
  description: string;
  nested?: boolean;
}[];

const OPERATING_ELEMENTS = ["People", "Responsibilities", "Workflows", "Trust"] as const;

function stageSelectedClass(accent: "cyan" | "violet", selected: boolean): string {
  if (!selected) return "pv2-diagram-stage";
  return accent === "cyan" ? "pv2-diagram-stage is-selected" : "pv2-diagram-stage is-selected-violet";
}

export function PublicOperatingDiagram() {
  const [selectedId, setSelectedId] = useState<PublicOperatingStageId>("operating");
  const descId = useId();
  const selected = STAGES.find((s) => s.id === selectedId) ?? STAGES[1];

  return (
    <figure className="relative w-full" aria-labelledby="public-v2-operating-diagram-title">
      <figcaption className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            id="public-v2-operating-diagram-title"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pv2-text-muted)]"
          >
            Operating transformation
          </p>
          <p id={descId} className="mt-2 text-sm text-[var(--pv2-text-secondary)]">
            {selected.description}
          </p>
        </div>
        <CrowMarkSvg
          variant="watermark"
          className="h-8 w-8 shrink-0 opacity-[0.18]"
          labeled={false}
          aria-hidden
        />
      </figcaption>

      {/* Desktop flow */}
      <div className="hidden sm:block">
        <svg
          viewBox="0 0 720 48"
          className={`mb-3 h-auto w-full max-h-[48px] ${PUBLIC_V2_MOTION_CLASS.diagram}`}
          aria-hidden
        >
          <path
            d="M108 24 H168"
            stroke="var(--pv2-violet)"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#pv2-arrow)"
          />
          <path
            d="M312 24 H372"
            stroke="var(--pv2-cyan)"
            strokeOpacity="0.4"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#pv2-arrow)"
          />
          <path
            d="M516 24 H576"
            stroke="var(--pv2-violet)"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#pv2-arrow)"
          />
          <defs>
            <marker id="pv2-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--pv2-cyan)" fillOpacity="0.7" />
            </marker>
          </defs>
        </svg>

        <div className="grid min-w-0 grid-cols-4 gap-2 lg:gap-3" role="group" aria-label="Transformation stages">
          {STAGES.map((stage) => {
            const selected = stage.id === selectedId;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={selected}
                aria-label={`${stage.label}. ${stage.description}`}
                className={`${stageSelectedClass(stage.accent, selected)} flex min-h-[72px] min-w-0 flex-col items-center justify-center px-2 py-3 text-center sm:min-h-[88px] lg:min-h-[96px] ${PUBLIC_V2_MOTION_CLASS.diagram}`}
                onClick={() => setSelectedId(stage.id)}
              >
                <span
                  className={`max-w-full break-words text-[10px] font-semibold uppercase leading-tight tracking-wide sm:text-xs ${
                    stage.accent === "cyan" ? "text-[var(--pv2-cyan)]" : "text-[var(--pv2-violet)]"
                  }`}
                >
                  {stage.short}
                </span>
                {stage.nested ? (
                  <>
                    <div className="mt-2 hidden w-full grid-cols-2 gap-1 lg:grid">
                      {OPERATING_ELEMENTS.map((el) => (
                        <span
                          key={el}
                          className="rounded-md border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] px-1 py-0.5 text-[10px] font-medium leading-tight text-[var(--pv2-text-secondary)] sm:text-[11px]"
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                    <span className="mt-1 text-[10px] text-[var(--pv2-text-muted)] lg:hidden">
                      People · Responsibilities · Workflows · Trust
                    </span>
                  </>
                ) : (
                  <span className="mt-1 text-[10px] text-[var(--pv2-text-muted)]">{stage.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="flex flex-col gap-2 sm:hidden" role="group" aria-label="Transformation stages">
        {STAGES.map((stage, i) => {
          const isSelected = stage.id === selectedId;
          return (
            <div key={stage.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                className={`${stageSelectedClass(stage.accent, isSelected)} w-full px-3 py-3 text-left ${PUBLIC_V2_MOTION_CLASS.diagram}`}
                onClick={() => setSelectedId(stage.id)}
              >
                <span className="text-xs font-semibold text-[var(--pv2-text-primary)]">{stage.label}</span>
                {stage.nested ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {OPERATING_ELEMENTS.map((el) => (
                      <span
                        key={el}
                        className="rounded-md border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] px-2 py-0.5 text-[10px] text-[var(--pv2-text-secondary)]"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
              {i < STAGES.length - 1 ? (
                <div className="flex justify-center py-1 text-[var(--pv2-cyan)]" aria-hidden>
                  ↓
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
