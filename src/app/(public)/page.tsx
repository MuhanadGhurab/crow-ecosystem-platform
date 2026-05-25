import Link from "next/link";

import { ComingSoonCards } from "@/components/public/coming-soon-cards";
import { HeroSection } from "@/components/public/hero-section";
import { HomepageBuiltFor } from "@/components/public/homepage-built-for";
import { HomepageHowItWorks } from "@/components/public/homepage-how-it-works";
import { HomepageRuntimeEngines } from "@/components/public/homepage-runtime-engines";
import { HomepageTrustProof } from "@/components/public/homepage-trust-proof";
import { PublicLifecycleStrip } from "@/components/public/public-lifecycle-strip";
import { PublicSectionIntro } from "@/components/public/public-section-intro";
import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <HomepageHowItWorks />

      <HomepageRuntimeEngines />

      <HomepageBuiltFor />

      <PublicLifecycleStrip />

      <HomepageTrustProof />

      {/* Discovery & Blueprint — deeper layer (below the fold) */}
      <section className="cc-public-band">
        <div className="cc-safe-x relative mx-auto max-w-6xl">
          <PublicSectionIntro
            badge="Intelligence layer"
            title="Discovery and Blueprint"
            description="Before CEM, CyberCrow, and SAREA run in production, Discovery and Blueprint shape your digital DNA."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="cc-engine-card cc-engine-card--discovery p-6 sm:p-7">
              <span className="cc-entity-badge cc-entity-badge--discovery w-fit">
                {PLATFORM_IDENTITIES.discovery.name}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {PLATFORM_IDENTITIES.discovery.fullName}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {PLATFORM_IDENTITIES.discovery.description}
              </p>
            </article>
            <article className="cc-engine-card cc-engine-card--blueprint p-6 sm:p-7">
              <span className="cc-entity-badge cc-entity-badge--blueprint w-fit">
                {PLATFORM_IDENTITIES.blueprint.name}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {PLATFORM_IDENTITIES.blueprint.fullName}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {PLATFORM_IDENTITIES.blueprint.description}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl py-10 sm:py-14">
        <div className="cc-glass-card border-cyan-500/20 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-400">
            Plans, modules, and security packages align during blueprint and pricing — not hidden after
            go-live.
          </p>
          <Link href="/pricing" className="cc-btn-secondary mt-5 inline-block text-sm">
            See plans →
          </Link>
        </div>
      </section>

      <section className="cc-public-band">
        <div className="cc-safe-x relative mx-auto max-w-6xl">
          <PublicSectionIntro
            badge="AI & extras"
            title="Optional intelligence"
            description="AI-assisted discovery and blueprint insights are optional layers — core governance stays human-reviewed."
          />
          <ComingSoonCards />
        </div>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl py-10 sm:py-14">
        <div className="cc-glass-card border-violet-500/20 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-400">
            Full lifecycle map, surfaces, and engine relationships — for architects and delivery teams.
          </p>
          <Link href="/architecture" className="cc-btn-secondary mt-5 inline-block text-sm">
            Explore architecture →
          </Link>
        </div>
      </section>

      <section className="cc-public-band">
        <div className="cc-safe-x relative mx-auto max-w-6xl">
          <PublicSectionIntro
            badge="Proof"
            title="Case studies"
            description="Sector narratives and outcomes — published when ready."
          />
          <ComingSoonCards />
        </div>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl py-16 sm:py-24">
        <div className="cc-glass-card border-cyan-500/25 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to start your enterprise request?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Tell us about your organization. Crow delivery teams guide discovery, blueprint, and
            governed go-live — without exposing internal customer data on this site.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/request" className="cc-btn-primary min-w-[14rem]">
              Start an Enterprise Request →
            </Link>
            <Link href="/pricing" className="cc-btn-secondary min-w-[14rem]">
              See plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
