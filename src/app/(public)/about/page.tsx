import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";

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

  return (

    <>

      <PublicPageHeader

        badge="Crow Ecosystem"

        title="About Crow"

        description="We deliver one intelligent organization — three engines on your tenant, guided by Crow departments from first request to go-live."

      />

      <div className="cc-public-section space-y-10">

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

          <h2 className="font-display text-lg font-semibold text-white">Crow departments</h2>

          <p className="mt-2 text-sm text-slate-400">

            Delivery is organized by department; your tenant receives three engines as siblings under one slug.

          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {CROW_DEPARTMENTS.map((dept) => (

              <article key={dept.key} className={`cc-glass-card cc-engine-card--${dept.entity}`}>

                <span className={`cc-entity-badge cc-entity-badge--${dept.entity}`}>{dept.name}</span>

                <p className="mt-2 text-xs font-medium text-slate-300">{dept.lead}</p>

                <p className="mt-3 text-sm text-slate-500">{dept.delivers}</p>

              </article>

            ))}

          </div>

        </section>



        <section>

          <h2 className="font-display text-lg font-semibold text-white">Three engines on your tenant</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {(["cem", "cybercrow", "sarea"] as const).map((key) => {

              const id = PLATFORM_IDENTITIES[key];

              return (

                <article key={key} className={`cc-glass-card cc-engine-card--${key}`}>

                  <span className={`cc-entity-badge cc-entity-badge--${key}`}>{id.name}</span>

                  <h3 className="mt-2 font-semibold text-white">{id.fullName}</h3>

                  <p className="mt-2 text-sm italic text-slate-400">{id.tagline}</p>

                </article>

              );

            })}

          </div>

        </section>



        <section>

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

