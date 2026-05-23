import Link from "next/link";
import { CrowEngineCard } from "@/components/public/crow-engine-card";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSectionIntro } from "@/components/public/public-section-intro";
import {
  PLATFORM_BRAND_NAME,
  PLATFORM_BRAND_TAGLINE,
  PLATFORM_CORE_DEFINITION,
  PLATFORM_IDENTITIES,
  PLATFORM_LIFECYCLE,
} from "@/lib/constants/platform";

const CROW_DEPARTMENTS = [
  {
    key: "platform",
    name: "Platform & delivery",
    lead: "Pipeline owner · CyberAdmin on your tenant after go-live",
    delivers: "Request review, blueprint, pricing, proposal, and governed go-live",
    entity: "cem" as const,
  },
  {
    key: "cybercrow",
    name: "CyberCrow",
    lead: "NCA-aligned security · Microsoft / Entra · tenant posture",
    delivers: "Discovery security, blueprint CyberCrow tab, ongoing compliance narrative",
    entity: "cybercrow" as const,
  },
  {
    key: "sarea",
    name: "SAREA",
    lead: "Experience studio — personas, layouts, adaptive UI",
    delivers: "Discovery experience, SAREA studio, role-appropriate dashboards at runtime",
    entity: "sarea" as const,
  },
] as const;

export default function AboutPage() {
  const engineKeys = ["cem", "cybercrow", "sarea"] as const;

  return (
    <>
      <PublicPageHeader
        badge="Crow Ecosystem"
        title="About Crow"
        description="We deliver one intelligent organization — three engines on your tenant, guided by Crow departments from first request to go-live."
      />
      <div className="cc-public-section space-y-12 sm:space-y-14">
        <section className="cc-glass-card">
          <h2 className="font-display text-lg font-semibold text-white">Our promise to customers</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {PLATFORM_CORE_DEFINITION} You get a clear path: submit a request, collaborate through discovery and
            blueprint, approve pricing, and go live with CEM, CyberCrow, and SAREA — without exposing internal
            architecture complexity on day one.
          </p>
          <p className="mt-4 font-medium text-cc-star">{PLATFORM_BRAND_TAGLINE}</p>
        </section>

        <section>
          <PublicSectionIntro
            badge="Delivery"
            title="Crow departments"
            description="Delivery is organized by department; your tenant receives three engines as siblings under one slug."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {CROW_DEPARTMENTS.map((dept) => (
              <div key={dept.key} id={dept.key === "sarea" ? "sarea" : undefined}>
                <CrowEngineCard
                  entity={dept.entity}
                  name={dept.name}
                  fullName={dept.name}
                  tagline={dept.lead}
                  description={dept.delivers}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <PublicSectionIntro badge="Engines" title="Three engines on your tenant" centered={false} />
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {engineKeys.map((key) => {
              const id = PLATFORM_IDENTITIES[key];
              return (
                <CrowEngineCard
                  key={key}
                  entity={key}
                  name={id.name}
                  fullName={id.fullName}
                  tagline={id.tagline}
                  description={id.description}
                  href={key === "cem" ? "/modules" : key === "cybercrow" ? "/security" : "/architecture"}
                  ctaLabel="Learn more"
                />
              );
            })}
          </div>
        </section>

        <section className="cc-glass-card">
          <h2 className="font-display text-lg font-semibold text-white">How we deliver</h2>
          <ol className="mt-4 space-y-2">
            {PLATFORM_LIFECYCLE.slice(0, 6).map((step, i) => (
              <li key={step} className="cc-list-item">
                <span className="font-mono text-xs font-bold text-cc-star">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            {PLATFORM_BRAND_NAME} — full lifecycle continues through provisioning, security init, and client go-live.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/request" className="cc-btn-primary">
            Start your ecosystem →
          </Link>
          <Link href="/architecture" className="cc-btn-secondary">
            Customer architecture →
          </Link>
        </div>
      </div>
    </>
  );
}
