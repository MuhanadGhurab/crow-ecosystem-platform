import Link from "next/link";
import { IndustryCatalogCard } from "@/components/public/industry-catalog-card";
import { PublicPageHeader } from "@/components/public/public-page-header";
import {
  FUTURE_SECTOR_READINESS,
  getModeledSectorModuleLabels,
  MODELED_SECTOR_CATALOG,
} from "@/lib/constants/sector-catalog";
import { PUBLIC_INDUSTRIES_INTRO } from "@/lib/constants/public-client-ux";
import { PublicRequestGateNote } from "@/components/public/public-request-gate-note";

export default function IndustriesPage() {
  return (
    <>
      <PublicPageHeader
        badge="Operating models"
        title="Industries"
        description="Five validated sector operating models on staging — discovery templates, org intelligence, blueprint readiness, and advisory CyberCrow / SAREA posture. Wording is readiness-oriented, not production or compliance claims."
      />
      <div className="cc-public-section space-y-12">
        <PublicRequestGateNote />
        <section>
          <h2 className="font-display text-xl font-semibold text-white">Validated operating models</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{PUBLIC_INDUSTRIES_INTRO}</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {MODELED_SECTOR_CATALOG.map((sector) => (
              <IndustryCatalogCard
                key={sector.key}
                sector={sector}
                moduleLabels={getModeledSectorModuleLabels(sector.key)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-white">Template-ready / future expansion</h2>
          <p className="mt-2 text-sm text-slate-400">
            These sectors appear in marketing and discovery extensibility — they are not the same depth as
            the five validated models above.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {FUTURE_SECTOR_READINESS.map((item) => (
              <article key={item.key} className={`cc-glass-card cc-engine-card--${item.entity}`}>
                <span className={`cc-entity-badge cc-entity-badge--${item.entity}`}>Readiness</span>
                <h3 className="mt-2 font-display text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cc-glass-card">
          <h2 className="font-display text-lg font-semibold text-white">Not sure which sector fits?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Submit an implementation request with Other / Not sure. Discovery starts with a general
            baseline; your operator can switch the sector template on the organization model page after
            review.
          </p>
          <Link href="/request" className="cc-btn-primary mt-6 inline-block text-sm" title="Sign in required">
            Start Enterprise Request →
          </Link>
        </section>
      </div>
    </>
  );
}
