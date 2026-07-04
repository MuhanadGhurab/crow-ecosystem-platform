import Link from "next/link";

import { PUBLIC_JOURNEY_DEFINITIONS } from "@/lib/public-v2/journey-definitions";
import { buildSignupHandoffUrl, PUBLIC_JOURNEY_PAGES } from "@/lib/public/journey-handoff";
import type { PublicJourneyKind } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";
import { PUBLIC_V2_JOURNEY_CTA_CLASS } from "@/lib/public-v2/tokens";

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
                  ? "bg-[var(--pv2-gold-soft)] text-[var(--pv2-gold)]"
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

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={PUBLIC_JOURNEY_PAGES[kind].path}
          className={`pv2-btn-secondary flex-1 text-center ${PUBLIC_V2_MOTION_CLASS.button}`}
        >
          Explore journey
        </Link>
        <Link
          href={buildSignupHandoffUrl(kind)}
          className={`${PUBLIC_V2_JOURNEY_CTA_CLASS} flex-1 text-center ${PUBLIC_V2_MOTION_CLASS.button}`}
        >
          {journey.ctaLabel}
        </Link>
      </div>

      <p className="pv2-journey-bridge">→ Approved Blueprint & governed tenant</p>
    </article>
  );
}
