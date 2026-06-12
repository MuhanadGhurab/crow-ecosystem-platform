import { CASE_STUDY_PLACEHOLDERS } from "@/components/public/coming-soon-cards";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

export function HomepageRoadmap() {
  const [featured, ...rest] = CASE_STUDY_PLACEHOLDERS;

  return (
    <section id="roadmap" className="cc-home-section scroll-mt-24 border-t border-white/[0.04]">
      <HomepageSectionHeader
        eyebrow="Roadmap"
        title="Sector stories & optional intelligence"
        description="Case studies and AI-assisted discovery insights are in progress — optional layers on top of human-reviewed discovery and blueprint. Core governance is not autonomous."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <article className="cc-home-card min-h-[240px] lg:min-h-[320px]">
          <span className="cc-home-card-badge text-violet-300">{featured.status}</span>
          <h3 className="mt-4 font-display text-xl font-semibold text-white">{featured.sector}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">{featured.summary}</p>
        </article>

        <div className="flex flex-col gap-4">
          {rest.map((card) => (
            <article key={card.sector} className="cc-home-card flex-1">
              <span className="cc-home-card-badge">{card.status}</span>
              <h3 className="mt-3 font-display text-base font-semibold text-white">{card.sector}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
