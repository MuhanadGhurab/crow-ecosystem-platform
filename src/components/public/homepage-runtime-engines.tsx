import Link from "next/link";
import {
  HOMEPAGE_RBAC_SAREA_LINE,
  HOMEPAGE_RUNTIME_ENGINES,
} from "@/lib/constants/homepage";

const BADGE_CLASS: Record<string, string> = {
  cem: "cc-entity-badge--cem",
  cybercrow: "cc-entity-badge--cybercrow",
  sarea: "cc-entity-badge--sarea",
};

const LINK_CLASS: Record<string, string> = {
  cem: "text-cyan-400 hover:text-cyan-300",
  cybercrow: "text-violet-400 hover:text-violet-300",
  sarea: "text-rose-400 hover:text-rose-300",
};

export function HomepageRuntimeEngines() {
  return (
    <section
      id="product-engines"
      className="cc-public-band scroll-mt-20 border-t border-white/[0.04]"
    >
      <div className="cc-safe-x relative mx-auto max-w-6xl py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="cc-star-badge">Product engines</span>
          <h2 className="cc-section-title mt-4">Operations, trust, and experience</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Three sibling engines under one governed tenant shell — each with a clear job.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-slate-300">
            {HOMEPAGE_RBAC_SAREA_LINE}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {HOMEPAGE_RUNTIME_ENGINES.map((engine) => (
            <article
              key={engine.id}
              className={`cc-engine-card cc-engine-card--${engine.id} flex flex-col p-6 sm:p-7`}
            >
              <span className={`cc-entity-badge ${BADGE_CLASS[engine.id] ?? ""} w-fit`}>
                {engine.name}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-white sm:text-xl">
                {engine.fullName}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">{engine.summary}</p>
              <Link
                href={engine.href}
                className={`mt-5 inline-flex text-sm font-medium ${LINK_CLASS[engine.id] ?? ""}`}
              >
                {engine.cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
