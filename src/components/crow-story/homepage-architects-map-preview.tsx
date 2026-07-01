import Link from "next/link";

import { routes } from "@/lib/routes";

/** CROW.STORY.P1A — lightweight homepage preview (no full story bundle). */
export function HomepageArchitectsMapPreview() {
  return (
    <section
      id="architects-map-preview"
      className="cc-home-section scroll-mt-24 border-t border-white/[0.04]"
      aria-labelledby="architects-map-preview-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080c12]">
          <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
            <defs>
              <pattern id="hp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="#080c12" />
            <rect width="400" height="300" fill="url(#hp-grid)" />
            <line x1="40" y1="240" x2="360" y2="240" stroke="rgba(148,163,184,0.2)" />
            <circle
              cx="200"
              cy="120"
              r="14"
              fill="#22d3ee"
              fillOpacity="0.45"
              className="motion-safe:animate-[cc-pulse-soft_3s_ease-in-out_infinite]"
            />
            <circle cx="200" cy="120" r="22" fill="none" stroke="#22d3ee" strokeOpacity="0.15" />
            <circle cx="120" cy="180" r="4" fill="#a78bfa" fillOpacity="0.35" />
            <circle cx="280" cy="170" r="4" fill="#a78bfa" fillOpacity="0.35" />
            <line x1="120" y1="180" x2="200" y2="120" stroke="#a78bfa" strokeOpacity="0.2" />
            <line x1="280" y1="170" x2="200" y2="120" stroke="#a78bfa" strokeOpacity="0.2" />
          </svg>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
            The Architect&apos;s Map
          </p>
          <h2
            id="architects-map-preview-heading"
            className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl"
          >
            Every organization begins with something it wants to achieve.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Crow designs how work should operate — not only which modules to buy.
          </p>
          <Link
            href={routes.story.architectsMap}
            className="cc-btn-secondary mt-8 inline-flex min-h-[48px] items-center text-sm"
          >
            See How Crow Designs
          </Link>
        </div>
      </div>
    </section>
  );
}
