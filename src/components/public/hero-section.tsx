import Link from "next/link";

import {
  HOMEPAGE_HERO_ACCOUNT_NOTE,
  HOMEPAGE_HERO_FEATURE_PILLS,
  HOMEPAGE_HERO_HEADLINE,
  HOMEPAGE_HERO_SUBHEADLINE,
} from "@/lib/constants/homepage";

function ArrowUpRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative px-3 pb-16 pt-24 sm:px-4 sm:pb-20 sm:pt-28 lg:px-6 lg:pb-24 lg:pt-32"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%)]"
        aria-hidden
      />

      <div className="cc-hero-panel">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
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
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {HOMEPAGE_HERO_FEATURE_PILLS.map((pill) => (
              <span key={pill.highlight} className="cc-hero-stat-pill">
                <strong>{pill.highlight}</strong>
                <span className="text-slate-500">·</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>

          <h1
            id="hero-heading"
            className="mx-auto mt-8 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
          >
            {HOMEPAGE_HERO_HEADLINE}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {HOMEPAGE_HERO_SUBHEADLINE}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/request" className="cc-btn-hero-light min-w-[14rem]">
              Start Enterprise Request
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">
                <ArrowUpRightIcon />
              </span>
            </Link>
            <Link
              href="/modules"
              className="inline-flex min-h-[48px] min-w-[12rem] items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              Explore modules
            </Link>
          </div>

          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
            {HOMEPAGE_HERO_ACCOUNT_NOTE}{" "}
            <Link href="/login" className="text-violet-400/90 hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
