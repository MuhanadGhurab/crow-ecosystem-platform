import Link from "next/link";

import {
  HOMEPAGE_HERO_ACCOUNT_NOTE,
  HOMEPAGE_HERO_BADGE,
  HOMEPAGE_HERO_HEADLINE,
  HOMEPAGE_HERO_SUBHEADLINE,
} from "@/lib/constants/homepage";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background — subtle grid + radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(34,211,238,0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="cc-star-badge uppercase tracking-[0.18em]">{HOMEPAGE_HERO_BADGE}</span>

        <h1
          id="hero-heading"
          className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.1] lg:text-[3.25rem]"
        >
          {HOMEPAGE_HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          {HOMEPAGE_HERO_SUBHEADLINE}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/request" className="cc-btn-primary min-w-[12rem] px-8">
            Start Enterprise Request →
          </Link>
          <Link href="/modules" className="cc-btn-secondary min-w-[12rem]">
            Explore modules
          </Link>
        </div>

        <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
          {HOMEPAGE_HERO_ACCOUNT_NOTE}{" "}
          <Link href="/login" className="text-cyan-400/90 hover:text-cyan-300">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
