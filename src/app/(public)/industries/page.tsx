import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { MARKETING_INDUSTRIES } from "@/lib/constants/marketing";

export default function IndustriesPage() {
  return (
    <>
      <PublicPageHeader
        badge="Sectors"
        title="Industries"
        description="Crow Ecosystem adapts discovery, blueprint pricing, and engine activation to sector-specific operating models."
      />
      <div className="cc-public-section space-y-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MARKETING_INDUSTRIES.map((sector) => (
            <article key={sector.key} className={`cc-glass-card cc-engine-card--${sector.entity}`}>
              <span className={`cc-entity-badge cc-entity-badge--${sector.entity}`}>
                {sector.title.split(" ")[0]}
              </span>
              <h2 className="mt-2 font-display text-base font-semibold text-white">{sector.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{sector.summary}</p>
            </article>
          ))}
        </div>

        <section className="cc-glass-card">
          <h2 className="font-display text-lg font-semibold text-white">Not listed?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Discovery templates and blueprint modules extend to your industry during implementation — submit an
            intake request and Crow delivery teams configure the digital DNA.
          </p>
          <Link href="/request" className="cc-btn-primary mt-6 inline-block text-sm">
            Request your ecosystem →
          </Link>
        </section>
      </div>
    </>
  );
}
