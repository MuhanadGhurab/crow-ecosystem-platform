import Link from "next/link";

import { PUBLIC_JOURNEY_DEFINITIONS } from "@/lib/public-v2/journey-definitions";
import type { PublicJourneyKind } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const KIND_ANCHOR: Record<PublicJourneyKind, string> = {
  NEW: "public-v2-journey-new",
  TRANSFORM: "public-v2-journey-transform",
};

const KIND_ACCENT: Record<PublicJourneyKind, string> = {
  NEW: "border-cyan-500/30 bg-gradient-to-br from-cyan-500/[0.08] to-transparent",
  TRANSFORM: "border-violet-500/30 bg-gradient-to-br from-violet-500/[0.08] to-transparent",
};

export function PublicJourneyCard({ kind }: { kind: PublicJourneyKind }) {
  const journey = PUBLIC_JOURNEY_DEFINITIONS[kind];

  return (
    <article
      id={KIND_ANCHOR[kind]}
      className={`scroll-mt-28 rounded-2xl border p-6 sm:p-7 ${KIND_ACCENT[kind]}`}
      aria-labelledby={`journey-${kind}-title`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        JourneyKind · {kind}
      </p>
      <h3 id={`journey-${kind}-title`} className="mt-2 text-xl font-semibold text-white">
        {journey.title}
      </h3>
      <p className="mt-2 text-sm text-slate-400">{journey.subtitle}</p>

      <ol className="mt-5 space-y-2" role="list">
        {journey.steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                kind === "NEW" ? "bg-cyan-500/20 text-cyan-200" : "bg-violet-500/20 text-violet-200"
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
        className={`mt-6 inline-flex min-h-[44px] items-center rounded-xl border border-white/[0.12] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03] ${PUBLIC_V2_MOTION_CLASS.button}`}
        aria-label={`${journey.ctaLabel} — preview anchor until dedicated page ships`}
      >
        {journey.ctaLabel}
      </Link>
    </article>
  );
}
