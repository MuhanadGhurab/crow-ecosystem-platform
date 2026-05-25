import Link from "next/link";
import { CyberCrowCardPreview } from "@/components/public/cybercrow-card-preview";
import {
  HOMEPAGE_RBAC_SAREA_LINE,
  HOMEPAGE_RUNTIME_ENGINES,
} from "@/lib/constants/homepage";
import { PublicSectionIntro } from "@/components/public/public-section-intro";

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
    <section id="three-engines" className="cc-safe-x relative mx-auto max-w-6xl scroll-mt-20 py-14 sm:py-20">
      <PublicSectionIntro
        badge="Three engines"
        title="CEM · CyberCrow · SAREA"
        description="After blueprint and provisioning, three sibling engines run under one governed tenant shell."
      />
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium text-slate-300">
        {HOMEPAGE_RBAC_SAREA_LINE}
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {HOMEPAGE_RUNTIME_ENGINES.map((engine) => (
          <article
            key={engine.id}
            className={`cc-engine-card cc-engine-card--${engine.id} flex flex-col p-6 sm:p-7`}
          >
            <span className={`cc-entity-badge ${BADGE_CLASS[engine.id] ?? ""} w-fit`}>
              {engine.name}
            </span>
            <h3 className="mt-3 font-display text-xl font-bold text-white">{engine.fullName}</h3>
            {engine.id === "cybercrow" ? (
              <div className="mt-4">
                <CyberCrowCardPreview />
              </div>
            ) : null}
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
    </section>
  );
}
