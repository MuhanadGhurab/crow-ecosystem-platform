"use client";

import {
  PUBLIC_FOUNDATION_LAYERS,
  REPRESENTATIVE_ORG_NAME,
} from "@/lib/public-v2/representative-data";

const LAYER_ACCENT: Record<string, string> = {
  cem: "pv2-foundation-accent-teal",
  cybercrow: "pv2-foundation-accent-gold",
  sarea: "pv2-foundation-accent-purple",
  procrow: "pv2-foundation-accent-navy",
};

export function PublicFoundationDiagram({ variant = "full" }: { variant?: "full" | "orbit" }) {
  const showDetails = variant === "full";
  return (
    <figure aria-labelledby="foundation-diagram-title" aria-describedby="foundation-diagram-desc">
      <figcaption className="sr-only">
        <span id="foundation-diagram-title">One governed foundation</span>
        <span id="foundation-diagram-desc">
          Organization at center supported by CEM, CyberCrow, SAREA, and ProCrow coordinated
          responsibilities.
        </span>
      </figcaption>

      {/* Desktop / tablet — CSS grid (no absolute overlap) */}
      <div className="pv2-foundation-grid mx-auto hidden max-w-xl sm:grid">
        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={`pv2-foundation-node ${LAYER_ACCENT[layer.id]} pv2-foundation-node-${layer.id}`}
          >
            <p className="text-xs font-bold text-[var(--pv2-text-primary)]">{layer.label}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--pv2-text-muted)]">
              {layer.role}
            </p>
          </div>
        ))}
        <div className="pv2-foundation-node pv2-foundation-node-core">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
            Organization
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--pv2-text-primary)]">
            {REPRESENTATIVE_ORG_NAME}
          </p>
          <p className="mt-1 text-xs text-[var(--pv2-text-secondary)]">Operating model at center</p>
        </div>
      </div>

      {/* Mobile — stacked cards (no orbit collision) */}
      <div className="space-y-3 sm:hidden" role="list">
        <div className="pv2-foundation-node pv2-foundation-node-core" role="listitem">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
            Organization
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--pv2-text-primary)]">
            {REPRESENTATIVE_ORG_NAME}
          </p>
        </div>
        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={`pv2-foundation-node ${LAYER_ACCENT[layer.id]}`}
            role="listitem"
          >
            <p className="text-sm font-semibold text-[var(--pv2-text-primary)]">{layer.label}</p>
            <p className="text-xs text-[var(--pv2-text-muted)]">{layer.role}</p>
          </div>
        ))}
      </div>

      {showDetails ? (
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
      ) : null}
    </figure>
  );
}
