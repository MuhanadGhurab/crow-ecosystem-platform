import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

export function HomepageDiscoveryBlueprint() {
  return (
    <section id="discovery-blueprint" className="cc-home-section scroll-mt-24 border-t border-white/[0.04]">
      <HomepageSectionHeader
        eyebrow="Intelligence layer"
        title="Discovery and Blueprint"
        description="Discovery and Blueprint shape your operating model before go-live. This site is a staging-first portfolio — production deployment stays F23-gated."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <article className="cc-home-card cc-engine-card--discovery">
          <span className="cc-entity-badge cc-entity-badge--discovery w-fit">
            {PLATFORM_IDENTITIES.discovery.name}
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">
            {PLATFORM_IDENTITIES.discovery.fullName}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {PLATFORM_IDENTITIES.discovery.description}
          </p>
        </article>
        <article className="cc-home-card cc-engine-card--blueprint">
          <span className="cc-entity-badge cc-entity-badge--blueprint w-fit">
            {PLATFORM_IDENTITIES.blueprint.name}
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">
            {PLATFORM_IDENTITIES.blueprint.fullName}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {PLATFORM_IDENTITIES.blueprint.description}
          </p>
        </article>
      </div>
    </section>
  );
}
