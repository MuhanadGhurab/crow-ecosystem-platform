import Link from "next/link";

import { PUBLIC_JOURNEY_DEFINITIONS } from "@/lib/public-v2/journey-definitions";
import type { PublicJourneyKind } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const KIND_ANCHOR: Record<PublicJourneyKind, string> = {
  NEW: "public-v2-journey-new",
  TRANSFORM: "public-v2-journey-transform",
};

const KIND_STYLE: Record<PublicJourneyKind, string> = {
  NEW: "border-[color-mix(in_srgb,var(--pv2-cyan)_28%,var(--pv2-border))] from-[var(--pv2-cyan-soft)]",
  TRANSFORM:
    "border-[color-mix(in_srgb,var(--pv2-violet)_28%,var(--pv2-border))] from-[var(--pv2-violet-soft)]",
};

export function PublicJourneyCard({ kind }: { kind: PublicJourneyKind }) {
  const journey = PUBLIC_JOURNEY_DEFINITIONS[kind];

  return (
    <article
      id={KIND_ANCHOR[kind]}
      className={`pv2-card scroll-mt-28 bg-gradient-to-br to-[var(--pv2-surface)] p-6 transition-shadow duration-[220ms] hover:shadow-[var(--pv2-shadow-lift)] sm:p-7 ${KIND_STYLE[kind]}`}
      aria-labelledby={`journey-${kind}-title`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--pv2-text-muted)]">
        JourneyKind · {kind}
      </p>
      <h3 id={`journey-${kind}-title`} className="mt-2 text-xl font-semibold text-[var(--pv2-text-primary)]">
        {journey.title}
      </h3>
      <p className="pv2-body mt-2">{journey.subtitle}</p>

      <ol className="mt-5 space-y-2" role="list">
        {journey.steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3 text-sm text-[var(--pv2-text-secondary)]">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                kind === "NEW"
                  ? "bg-[var(--pv2-cyan-soft)] text-[#0e7490]"
                  : "bg-[var(--pv2-violet-soft)] text-[var(--pv2-violet)]"
              }`}
              aria-hidden
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <Link
        href={`#${KIND_ANCHOR[kind]}`}
        className={`pv2-btn-ghost mt-6 ${PUBLIC_V2_MOTION_CLASS.button}`}
        aria-label={`${journey.ctaLabel} — preview anchor until dedicated page ships`}
      >
        {journey.ctaLabel}
      </Link>

      <p className="pv2-journey-bridge">→ Approved Blueprint & governed tenant</p>
    </article>
  );
}
