import Link from "next/link";

import { EnterpriseOperatingModelCard } from "@/components/public/enterprise-operating-model-card";
import { CrowMotif } from "@/components/public/crow-motif";
import {
  HOMEPAGE_HERO_EXPLAINER,
  HOMEPAGE_HERO_HEADLINE,
  HOMEPAGE_HERO_SUBHEADLINE,
} from "@/lib/constants/homepage";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[72vh] overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:min-h-[78vh] lg:px-8 lg:pb-24 lg:pt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none absolute left-[14%] top-[12%] h-3 w-3 animate-cc-pulse-soft rounded-full bg-white shadow-cc-star"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[18%] top-[22%] hidden h-2 w-2 animate-cc-pulse-soft rounded-full bg-cyan-400/80 md:block"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(139,92,246,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(34,211,238,0.1),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,rgba(251,113,133,0.08),transparent_50%)]" />
      <CrowMotif
        variant="silhouette"
        className="pointer-events-none absolute end-[8%] top-[20%] hidden h-14 w-20 opacity-25 md:block"
      />
      <CrowMotif
        variant="constellation"
        className="pointer-events-none absolute start-[6%] top-[32%] hidden h-12 w-16 opacity-20 lg:block"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-14">
          <div className="order-1 flex min-w-0 flex-col items-center text-center lg:items-start lg:text-start">
            <span className="cc-star-badge">Crow Ecosystem · Enterprise orchestration</span>
            <h1
              id="hero-heading"
              className="mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:max-w-none lg:text-[3.25rem] lg:leading-[1.06]"
            >
              {HOMEPAGE_HERO_HEADLINE}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-snug text-slate-300 sm:text-xl">
              {HOMEPAGE_HERO_SUBHEADLINE}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {HOMEPAGE_HERO_EXPLAINER}
            </p>

            <div className="mt-12 flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link href="/request" className="cc-btn-primary w-full px-8 sm:w-auto">
                Start Enterprise Request →
              </Link>
              <Link href="/modules" className="cc-btn-secondary w-full sm:w-auto">
                Explore modules
              </Link>
              <Link
                href="/industries"
                className="w-full text-center text-sm font-medium text-cyan-400 transition hover:text-cyan-300 sm:w-auto sm:px-4"
              >
                View industries →
              </Link>
              <p className="w-full text-center text-xs text-slate-500 sm:text-start">
                Sign in required to submit — browse pricing, security, and architecture first.
              </p>
            </div>
          </div>

          <div className="order-2 flex min-w-0 justify-center pt-2 lg:order-2 lg:justify-end lg:pt-0">
            <EnterpriseOperatingModelCard />
          </div>
        </div>
      </div>
    </section>
  );
}
