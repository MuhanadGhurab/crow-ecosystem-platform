import Link from "next/link";
import { CrowEngineCard } from "@/components/public/crow-engine-card";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicLifecycleStrip } from "@/components/public/public-lifecycle-strip";
import { PublicSectionIntro } from "@/components/public/public-section-intro";
import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";



const CUSTOMER_PIPELINE = [

  { step: "01", label: "Request", detail: "Plan, modules, and security selection — your commercial front door." },

  { step: "02", label: "Discovery", detail: "Structured org intelligence validated with your teams." },

  { step: "03", label: "Blueprint", detail: "Digital DNA, integrations, and transparent pricing." },

  { step: "04", label: "Proposal", detail: "Review and approve the commercial package." },

  { step: "05", label: "Go-live", detail: "CEM, CyberCrow, and SAREA activate on your tenant." },

] as const;



export default function ArchitecturePage() {

  const engines = ["cem", "cybercrow", "sarea"] as const;



  return (

    <>

      <PublicPageHeader

        badge="Three engines · One journey"

        title="How Crow works"

        description="A simple story: three engines power your organization after a governed path from request to go-live. Deeper technical layers stay in delivery workshops — not on this page."

      />

      <div className="cc-public-section space-y-12 sm:space-y-14">

        <section>
          <PublicSectionIntro
            badge="Runtime"
            title="Three engines"
            description="CEM runs operations. CyberCrow protects with NCA-aware security. SAREA adapts dashboards and navigation to each role — without fragmenting the platform."
            centered={false}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {engines.map((key) => {
              const id = PLATFORM_IDENTITIES[key];
              const href =
                key === "cem" ? "/modules" : key === "cybercrow" ? "/security" : "/about";
              return (
                <CrowEngineCard
                  key={key}
                  entity={key}
                  name={id.name}
                  fullName={id.fullName}
                  tagline={id.tagline}
                  description={id.description}
                  href={href}
                  ctaLabel="Explore"
                />
              );
            })}
          </div>
        </section>



        <section className="cc-glass-card">

          <h2 className="font-display text-lg font-semibold text-white">Request → Blueprint → Go-live</h2>

          <p className="mt-2 text-sm text-slate-400">

            Discovery and Blueprint happen between your request and production — they define digital DNA before engines

            switch on.

          </p>

          <ol className="mt-6 space-y-3">

            {CUSTOMER_PIPELINE.map((item) => (

              <li key={item.label} className="cc-list-item">

                <span className="font-mono text-xs font-bold text-cc-star">{item.step}</span>

                <span className="min-w-0 flex-1">

                  <span className="block font-medium text-white">{item.label}</span>

                  <span className="text-sm text-slate-400">{item.detail}</span>

                </span>

              </li>

            ))}

          </ol>

        </section>



        <PublicLifecycleStrip />



        <div className="flex flex-wrap gap-3">

          <Link href="/request" className="cc-btn-primary">

            Start your request →

          </Link>

          <Link href="/modules" className="cc-btn-secondary">

            Explore modules

          </Link>

          <Link href="/" className="cc-btn-secondary">

            Back to home

          </Link>

        </div>

      </div>

    </>

  );

}

