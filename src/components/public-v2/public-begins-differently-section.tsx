import type { ReactNode } from "react";

import { PublicSection } from "@/components/public-v2/public-section";
import { CROW_APPROACH_POINTS, TRADITIONAL_SOFTWARE_POINTS } from "@/lib/public-v2/journey-definitions";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

function TraditionalVisual() {
  return (
    <div className="mt-5 flex flex-col gap-2" aria-hidden>
      {["Apps", "Roles", "Instance", "Tools"].map((box) => (
        <div key={box} className="flex items-center gap-2">
          <div className="h-9 flex-1 rounded-lg border border-dashed border-[var(--pv2-border-strong)] bg-[var(--pv2-surface-muted)] px-3 py-2 text-xs text-[var(--pv2-text-muted)]">
            {box}
          </div>
        </div>
      ))}
    </div>
  );
}

function CrowVisual() {
  return (
    <div className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--pv2-cyan)_25%,var(--pv2-border))] bg-[var(--pv2-cyan-soft)] p-4" aria-hidden>
      <div className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface)] px-3 py-2 text-center text-xs font-semibold text-[var(--pv2-cyan)]">
        Operating Model
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {["Intent", "Blueprint", "Runtime", "Trust"].map((n) => (
          <div
            key={n}
            className="rounded-md border border-[var(--pv2-border)] bg-[var(--pv2-surface)] px-2 py-1.5 text-center text-[10px] font-medium text-[var(--pv2-text-secondary)]"
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonColumn({
  title,
  tone,
  points,
  visual,
}: {
  title: string;
  tone: "neutral" | "crow";
  points: readonly string[];
  visual: ReactNode;
}) {
  const cardClass =
    tone === "crow"
      ? "border-[color-mix(in_srgb,var(--pv2-cyan)_22%,var(--pv2-border))] bg-gradient-to-br from-[var(--pv2-cyan-soft)] to-[var(--pv2-surface)]"
      : "border-[var(--pv2-border)] bg-[var(--pv2-surface)]";

  return (
    <article
      className={`pv2-card p-5 transition-shadow duration-[220ms] hover:shadow-[var(--pv2-shadow-lift)] sm:p-6 ${cardClass}`}
    >
      <h3
        className={`text-sm font-semibold uppercase tracking-wide ${
          tone === "crow" ? "text-[var(--pv2-cyan)]" : "text-[var(--pv2-text-muted)]"
        }`}
      >
        {title}
      </h3>
      {visual}
      <ul className="mt-5 space-y-3" role="list">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-[var(--pv2-text-secondary)]">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                tone === "crow" ? "bg-[var(--pv2-cyan)]" : "bg-[var(--pv2-border-strong)]"
              }`}
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PublicBeginsDifferentlySection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.beginsDifferently}
      eyebrow="Why Crow"
      title="Crow begins differently"
      description="A fair comparison — Crow is designed around how organizations actually operate, not around a catalog of modules."
      band="muted"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        <ComparisonColumn
          title="Traditional business software"
          tone="neutral"
          points={TRADITIONAL_SOFTWARE_POINTS}
          visual={<TraditionalVisual />}
        />
        <ComparisonColumn
          title="Crow"
          tone="crow"
          points={CROW_APPROACH_POINTS}
          visual={<CrowVisual />}
        />
      </div>
    </PublicSection>
  );
}
