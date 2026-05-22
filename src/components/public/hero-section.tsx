import Link from "next/link";

import {

  FULL_PLATFORM_LIFECYCLE,

  PLATFORM_BRAND_TAGLINE,

  PLATFORM_HERO_STATEMENT,

  PLATFORM_IDENTITIES,

} from "@/lib/constants/platform";



const HERO_IDENTITIES = [

  PLATFORM_IDENTITIES.cem,

  PLATFORM_IDENTITIES.cybercrow,

  PLATFORM_IDENTITIES.sarea,

] as const;



const IDENTITY_STYLES: Record<

  string,

  { ring: string; label: string; glow: string; border: string; badge: string }

> = {

  cem: {

    ring: "from-cyan-600/25 to-teal-500/10",

    label: "text-cyan-400",

    glow: "shadow-cc-glow-cem",

    border: "hover:border-cyan-400/35",

    badge: "cc-entity-badge--cem",

  },

  cybercrow: {

    ring: "from-violet-600/30 to-indigo-500/12",

    label: "text-violet-400",

    glow: "shadow-cc-glow-cybercrow",

    border: "hover:border-violet-400/35",

    badge: "cc-entity-badge--cybercrow",

  },

  sarea: {

    ring: "from-rose-600/25 to-amber-500/10",

    label: "text-rose-300",

    glow: "shadow-cc-glow-sarea",

    border: "hover:border-rose-400/35",

    badge: "cc-entity-badge--sarea",

  },

};



export function HeroSection() {

  return (

    <section

      className="relative min-h-[90vh] overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:min-h-[92vh] lg:px-8"

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

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(139,92,246,0.18),transparent_60%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(34,211,238,0.1),transparent_50%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,rgba(251,113,133,0.08),transparent_50%)]" />



      <div className="relative mx-auto max-w-6xl">

        <div className="flex flex-col items-center text-center">

          <span className="cc-star-badge">NCA-aligned · Enterprise-grade</span>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 sm:text-xs">

            Kingdom of Saudi Arabia · GCC

          </p>

          <h1

            id="hero-heading"

            className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"

          >

            Crow Ecosystem

            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-cyan-300 to-rose-300 bg-clip-text text-transparent">

              Platform

            </span>

          </h1>

          <p className="mt-5 max-w-2xl text-lg font-medium text-slate-200 sm:text-xl">

            {PLATFORM_BRAND_TAGLINE}

          </p>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">

            {PLATFORM_HERO_STATEMENT}

          </p>



          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">

            <Link href="/request" className="cc-btn-primary w-full px-8 sm:w-auto">

              Start your ecosystem →

            </Link>

            <Link href="/architecture" className="cc-btn-secondary w-full sm:w-auto">

              See the architecture

            </Link>

          </div>

        </div>



        <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">

          {HERO_IDENTITIES.map((identity, index) => {

            const style = IDENTITY_STYLES[identity.id] ?? IDENTITY_STYLES.cem;

            const featured = index === 1;

            return (

              <article

                key={identity.id}

                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${style.ring} p-6 backdrop-blur-xl transition duration-300 ${style.border} ${style.glow} ${featured ? "sm:-mt-4 sm:pb-8" : ""}`}

              >

                <div className="absolute right-4 top-4 font-mono text-[10px] text-slate-600">

                  {String(index + 1).padStart(2, "0")}

                </div>

                <span className={`cc-entity-badge ${style.badge} mb-3`}>{identity.name}</span>

                <h2 className="font-display text-xl font-bold text-white">{identity.fullName}</h2>

                <p className="mt-2 text-sm italic text-slate-300">{identity.tagline}</p>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">{identity.description}</p>

              </article>

            );

          })}

        </div>



        <div className="mt-16 sm:mt-20">

          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">

            One path · Eight milestones

          </p>

          <div className="cc-scroll-chips mt-6 justify-center lg:flex-wrap lg:overflow-visible lg:pb-0">

            <ol className="flex gap-2 lg:flex-wrap lg:justify-center">

              {FULL_PLATFORM_LIFECYCLE.map((label, index) => (

                <li key={label}>

                  <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md transition hover:border-cyan-400/30 hover:text-white">

                    <span className="font-mono text-xs font-bold text-cc-star">

                      {String(index + 1).padStart(2, "0")}

                    </span>

                    {label}

                  </span>

                </li>

              ))}

            </ol>

          </div>

        </div>

      </div>

    </section>

  );

}

