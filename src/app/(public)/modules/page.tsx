import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";

import { EXTRA_SERVICES } from "@/lib/constants/extra-services";

import { talentLabelsForModule } from "@/lib/constants/module-talent-profiles";

import { CEM_MODULES } from "@/lib/constants/modules";

import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";



export default function ModulesPage() {

  return (

    <div className="cc-entity-cem min-h-screen">

      <PublicPageHeader

        badge="CEM operational modules"

        title="Enterprise modules"

        description="Talent-adaptive modules provisioned from your approved blueprint — SAREA adjusts dashboards and density per role."

      />

      <div className="cc-public-section">

        <p className="mb-8 text-sm text-cyan-200/90">

          <span className="cc-entity-badge cc-entity-badge--cem !inline-flex !py-0.5">CEM</span> —{" "}

          {PLATFORM_IDENTITIES.cem.description}

        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {CEM_MODULES.map((m) => {

            const profiles = talentLabelsForModule(m.key);

            return (

              <article key={m.key} className="cc-glass-card cc-engine-card--cem flex flex-col">

                <span className="text-2xl">{m.icon}</span>

                <h2 className="mt-2 font-semibold text-white">{m.nameEn}</h2>

                <p className="text-sm text-slate-500">{m.nameAr}</p>

                {profiles.length > 0 && (

                  <div className="mt-3 flex flex-wrap gap-1.5">

                    {profiles.map((label) => (

                      <span

                        key={label}

                        className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-200/90"

                      >

                        {label}

                      </span>

                    ))}

                  </div>

                )}

                <p className="mt-auto pt-3 text-sm font-medium text-cyan-400">

                  +{m.monthlyAddonSar.toLocaleString()} SAR/mo

                </p>

              </article>

            );

          })}

        </div>



        <section className="mt-14 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/30 via-cc-elevated/80 to-rose-950/20 p-6 sm:p-8">

          <span className="cc-star-badge">Extra services</span>

          <h2 className="mt-3 font-display text-lg font-semibold text-white">AI & optional add-ons</h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">

            Not included in every base tier — scoped during discovery and quoted on your blueprint. CyberCrow-aligned

            when touching security or compliance data.

          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">

            {EXTRA_SERVICES.map((s) => (

              <li key={s.key} className={`cc-glass-card cc-engine-card--${s.entity} p-4`}>

                <h3 className="font-medium text-white">{s.name}</h3>

                <p className="mt-1 text-sm text-slate-500">{s.summary}</p>

              </li>

            ))}

          </ul>

        </section>



        <Link href="/request" className="cc-btn-primary mt-10 inline-block">

          Configure modules in request →

        </Link>

      </div>

    </div>

  );

}

