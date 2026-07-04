"use client";

import {
  PUBLIC_FOUNDATION_LAYERS,
  PUBLIC_TRUST_EVIDENCE,
  REPRESENTATIVE_ORG_NAME,
} from "@/lib/public-v2/representative-data";

const LAYER_POSITION: Record<string, string> = {
  cem: "left-0 top-1/2 -translate-y-1/2",
  cybercrow: "right-0 top-1/2 -translate-y-1/2",
  sarea: "bottom-0 left-1/2 -translate-x-1/2",
  procrow: "top-0 left-1/2 -translate-x-1/2",
};

const LAYER_ACCENT: Record<string, string> = {
  cem: "border-[color-mix(in_srgb,var(--pv2-cyan)_35%,var(--pv2-border))] bg-[var(--pv2-cyan-soft)] text-[#0e7490]",
  cybercrow:
    "border-[color-mix(in_srgb,var(--pv2-amber)_35%,var(--pv2-border))] bg-[var(--pv2-amber-soft)] text-[var(--pv2-amber)]",
  sarea:
    "border-[color-mix(in_srgb,var(--pv2-violet)_35%,var(--pv2-border))] bg-[var(--pv2-violet-soft)] text-[var(--pv2-violet)]",
  procrow: "border-[var(--pv2-border-strong)] bg-[var(--pv2-surface-muted)] text-[var(--pv2-text-secondary)]",
};

export function PublicFoundationDiagram() {
  return (
    <figure aria-labelledby="foundation-diagram-title" aria-describedby="foundation-diagram-desc">
      <figcaption className="sr-only">
        <span id="foundation-diagram-title">One governed foundation</span>
        <span id="foundation-diagram-desc">
          Organization at center supported by CEM, CyberCrow, SAREA, and ProCrow coordinated
          responsibilities.
        </span>
      </figcaption>

      <div className="relative mx-auto aspect-square max-w-md sm:max-w-lg">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden>
          <line
            x1="200"
            y1="200"
            x2="70"
            y2="200"
            stroke="var(--pv2-cyan)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <line
            x1="200"
            y1="200"
            x2="330"
            y2="200"
            stroke="var(--pv2-amber)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="70"
            stroke="var(--pv2-border-strong)"
            strokeWidth="1.5"
          />
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="330"
            stroke="var(--pv2-violet)"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--pv2-border)] bg-[var(--pv2-surface)] p-4 text-center shadow-[var(--pv2-shadow)]">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
            Organization
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--pv2-text-primary)]">
            {REPRESENTATIVE_ORG_NAME}
          </p>
          <p className="mt-1 text-xs text-[var(--pv2-text-secondary)]">Operating model at center</p>
        </div>

        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={`absolute z-20 w-[38%] max-w-[160px] rounded-xl border p-3 text-center transition-shadow duration-[220ms] hover:shadow-md sm:max-w-[180px] sm:p-3.5 ${LAYER_POSITION[layer.id]} ${LAYER_ACCENT[layer.id]}`}
          >
            <p className="text-xs font-bold">{layer.label}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wide opacity-80">{layer.role}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] p-3"
          >
            <p className="text-xs font-semibold text-[var(--pv2-text-primary)]">
              {layer.label} · {layer.role}
            </p>
            <p className="pv2-body mt-1">{layer.description}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
