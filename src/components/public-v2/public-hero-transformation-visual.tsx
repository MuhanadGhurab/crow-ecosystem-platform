"use client";

import { useId, useState } from "react";

import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";
import type { PublicOperatingStageId } from "@/lib/public-v2/types";

const OPERATING_FACETS = ["People", "Responsibilities", "Workflows", "Trust"] as const;

const STAGES = [
  {
    id: "intent" as const,
    label: "Organizational Intent",
    short: "Intent",
    tone: "violet" as const,
    description: "Purpose, scope, and outcomes the organization must achieve.",
  },
  {
    id: "operating" as const,
    label: "Operating Model",
    short: "Operating Model",
    tone: "teal" as const,
    description:
      "People, responsibilities, workflows, and trust requirements—connected as one governed model.",
    dominant: true,
  },
  {
    id: "blueprint" as const,
    label: "Enterprise Blueprint",
    short: "Blueprint",
    tone: "gold" as const,
    description: "Reviewed build source—approved before tenant construction.",
  },
  {
    id: "runtime" as const,
    label: "Operational Runtime",
    short: "Runtime",
    tone: "teal" as const,
    description: "CEM work, CyberCrow trust, and SAREA-permitted workspace in operation.",
  },
] as const;

function stageClass(id: PublicOperatingStageId, active: PublicOperatingStageId): string {
  const base = id === "operating" ? "pv2-hero-stage pv2-hero-stage-operating" : "pv2-hero-stage pv2-hero-stage-side";
  const tone = STAGES.find((s) => s.id === id)?.tone ?? "teal";
  const activeClass = active === id ? " is-active" : "";
  return `${base} pv2-hero-stage-${tone}${activeClass}`;
}

export function PublicHeroTransformationVisual() {
  const [activeId, setActiveId] = useState<PublicOperatingStageId>("operating");
  const captionId = useId();
  const active = STAGES.find((s) => s.id === activeId) ?? STAGES[1];

  return (
    <figure className="pv2-hero-transformation" aria-labelledby="pv2-hero-transformation-title">
      <figcaption className="sr-only">
        <span id="pv2-hero-transformation-title">Operating transformation</span>
        Organizational Intent flows into the Operating Model, then Enterprise Blueprint and
        Operational Runtime.
      </figcaption>

      {/* Desktop / tablet — horizontal canvas */}
      <div className="pv2-hero-transformation-canvas hidden md:block">
        <div className="pv2-hero-transformation-grid" role="group" aria-label="Transformation stages">
          {STAGES.map((stage, index) => (
            <div key={stage.id} className="contents">
              {index > 0 ? (
                <div className="pv2-hero-stage-connector" aria-hidden>
                  <span className="pv2-hero-stage-connector-line" />
                  <span className="pv2-hero-stage-connector-arrow">→</span>
                </div>
              ) : null}
              <button
                type="button"
                aria-pressed={activeId === stage.id}
                aria-label={`${stage.label}. ${stage.description}`}
                className={`${stageClass(stage.id, activeId)} ${PUBLIC_V2_MOTION_CLASS.diagram}`}
                onClick={() => setActiveId(stage.id)}
              >
                <span className="pv2-hero-stage-eyebrow">{stage.short}</span>
                {stage.id === "operating" ? (
                  <>
                    <p className="pv2-hero-stage-title">{stage.label}</p>
                    <p className="pv2-hero-stage-subcopy">
                      Crow&apos;s operating engine—where intent becomes structure.
                    </p>
                    <ul className="pv2-hero-facet-grid" role="list">
                      {OPERATING_FACETS.map((facet) => (
                        <li key={facet} className="pv2-hero-facet">
                          {facet}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="pv2-hero-stage-title-sm">{stage.label}</p>
                    <p className="pv2-hero-stage-subcopy-sm">{stage.description}</p>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — stacked, operating model expanded */}
      <div className="flex flex-col gap-3 md:hidden" role="group" aria-label="Transformation stages">
        {STAGES.map((stage, index) => (
          <div key={stage.id}>
            <button
              type="button"
              aria-pressed={activeId === stage.id}
              className={`${stageClass(stage.id, activeId)} w-full text-left ${PUBLIC_V2_MOTION_CLASS.diagram}`}
              onClick={() => setActiveId(stage.id)}
            >
              <span className="pv2-hero-stage-eyebrow">{stage.short}</span>
              <p className="pv2-hero-stage-title-sm">{stage.label}</p>
              {stage.id === "operating" ? (
                <ul className="pv2-hero-facet-grid mt-3" role="list">
                  {OPERATING_FACETS.map((facet) => (
                    <li key={facet} className="pv2-hero-facet">
                      {facet}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pv2-hero-stage-subcopy-sm mt-2">{stage.description}</p>
              )}
            </button>
            {index < STAGES.length - 1 ? (
              <div className="flex justify-center py-1 text-[var(--pv2-teal)]" aria-hidden>
                ↓
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <p id={captionId} className="pv2-hero-transformation-caption">
        <span className="font-medium text-[var(--pv2-text-primary)]">{active.label}:</span>{" "}
        {active.description}
      </p>

      <ol className="pv2-hero-flow-strip" aria-label="Transformation flow summary">
        {STAGES.map((stage) => (
          <li key={stage.id} className={stage.id === "operating" ? "is-emphasis" : undefined}>
            {stage.short}
          </li>
        ))}
      </ol>
    </figure>
  );
}
