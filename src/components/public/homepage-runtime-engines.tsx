import Link from "next/link";
import {
  HOMEPAGE_RBAC_SAREA_LINE,
  HOMEPAGE_RUNTIME_ENGINES,
} from "@/lib/constants/homepage";
import { HomepageCardArrow } from "@/components/public/homepage-card-arrow";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

const BADGE_CLASS: Record<string, string> = {
  cem: "cc-entity-badge--cem",
  cybercrow: "cc-entity-badge--cybercrow",
  sarea: "cc-entity-badge--sarea",
};

const ECOSYSTEM_ACCENT: Record<string, string> = {
  cem: "Operational fabric",
  cybercrow: "Observation & protection",
  sarea: "Adaptive intelligence",
};

export function HomepageRuntimeEngines() {
  const [featured, ...rest] = HOMEPAGE_RUNTIME_ENGINES;

  return (
    <section id="product-engines" className="cc-home-section scroll-mt-24 border-t border-white/[0.04]">
      <HomepageSectionHeader
        eyebrow="Product engines"
        title="Operations, trust, and experience"
        description="Three sibling engines under one governed tenant shell — each with a clear job."
      />
      <p className="mx-auto mt-4 max-w-xl text-center text-sm font-medium text-slate-300">
        {HOMEPAGE_RBAC_SAREA_LINE}
      </p>

      <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
        <article className="cc-home-card lg:row-span-2">
          <span className={`cc-entity-badge ${BADGE_CLASS[featured.id] ?? ""} w-fit`}>
            {featured.name}
          </span>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-cyan-500/70">
            {ECOSYSTEM_ACCENT[featured.id]}
          </p>
          <h3 className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">
            {featured.fullName}
          </h3>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400 sm:text-base">
            {featured.summary}
          </p>
          <Link
            href={featured.href}
            className="mt-8 flex items-end justify-between gap-3"
            aria-label={featured.cta}
          >
            <span className="text-sm font-medium text-slate-300">{featured.cta}</span>
            <HomepageCardArrow />
          </Link>
        </article>

        {rest.map((engine) => (
          <article key={engine.id} className="cc-home-card">
            <span className={`cc-entity-badge ${BADGE_CLASS[engine.id] ?? ""} w-fit`}>
              {engine.name}
            </span>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-cyan-500/60">
              {ECOSYSTEM_ACCENT[engine.id]}
            </p>
            <h3 className="mt-3 font-display text-lg font-bold text-white">{engine.fullName}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{engine.summary}</p>
            <Link
              href={engine.href}
              className="mt-5 flex items-end justify-between gap-3"
              aria-label={engine.cta}
            >
              <span className="text-sm font-medium text-slate-400">{engine.cta}</span>
              <HomepageCardArrow />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
