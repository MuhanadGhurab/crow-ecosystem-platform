import Link from "next/link";
import { ComingSoonCards } from "@/components/public/coming-soon-cards";
import { HeroSection } from "@/components/public/hero-section";
import { PlatformCard } from "@/components/public/platform-card";
import { PublicLifecycleStrip } from "@/components/public/public-lifecycle-strip";
import {
  PLATFORM_BRAND_TAGLINE,
  PLATFORM_CORE_DEFINITION,
  PLATFORM_IDENTITIES,
} from "@/lib/constants/platform";
import { EXTRA_SERVICES } from "@/lib/constants/extra-services";
import { CEM_MODULES } from "@/lib/constants/modules";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";

const STATS = [
  { value: String(SUBSCRIPTION_TIERS.length), label: "Subscription tiers", sub: "Startup → Enterprise", accent: "text-cc-star" },
  { value: String(CEM_MODULES.length), label: "CEM modules", sub: "Talent-adaptive via SAREA", accent: "text-cyan-300" },
  { value: String(SECURITY_PACKAGES.length), label: "Security packages", sub: "NCA-aware CyberCrow", accent: "text-violet-300" },
] as const;

const CORE_ENGINES = [
  {
    id: "cem" as const,
    identity: PLATFORM_IDENTITIES.cem,
    cardClass: "cc-engine-card--cem cc-entity-cem",
    linkClass: "text-cyan-400 hover:text-cyan-300",
    cta: "/modules",
    ctaLabel: "Explore CEM modules",
  },
  {
    id: "cybercrow" as const,
    identity: PLATFORM_IDENTITIES.cybercrow,
    cardClass: "cc-engine-card--cybercrow cc-entity-cybercrow",
    linkClass: "text-violet-400 hover:text-violet-300",
    cta: "/security",
    ctaLabel: "Security packages",
  },
  {
    id: "sarea" as const,
    identity: PLATFORM_IDENTITIES.sarea,
    cardClass: "cc-engine-card--sarea cc-entity-sarea",
    linkClass: "text-rose-400 hover:text-rose-300",
    cta: "/architecture",
    ctaLabel: "Experience architecture",
  },
] as const;

export default function HomePage() {
  const intelligenceKeys = ["discovery", "blueprint"] as const;

  return (
    <>
      <HeroSection />

      <section className="border-y border-cyan-500/10 bg-cc-elevated/30 py-16 sm:py-24">
        <div className="cc-safe-x mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="cc-star-badge">Three core engines</span>
            <h2 className="cc-section-title mt-4">CEM · CyberCrow · SAREA</h2>
            <p className="mt-4 text-slate-400">
              One platform shell — operations, security, and role-adaptive experience. CEM modules scale to your
              org; SAREA adjusts density per talent profile.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {CORE_ENGINES.map((engine) => (
              <article
                key={engine.id}
                className={`cc-engine-card ${engine.cardClass} group flex flex-col`}
              >
                <span className={`cc-entity-badge cc-entity-badge--${engine.id}`}>
                  {engine.identity.name}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-white">
                  {engine.identity.fullName}
                </h3>
                <p className="mt-2 text-sm italic text-slate-400">{engine.identity.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {engine.identity.description}
                </p>
                <Link
                  href={engine.cta}
                  className={`mt-5 inline-flex text-sm font-medium transition group-hover:opacity-90 ${engine.linkClass}`}
                >
                  {engine.ctaLabel} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cc-safe-x relative mx-auto max-w-6xl py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="cc-bento-card group text-center sm:text-left">
              <p className={`font-display text-4xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
              <p className="mt-2 font-semibold text-white">{s.label}</p>
              <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicLifecycleStrip />

      <section className="border-y border-cyan-500/10 bg-cc-elevated/30 py-16 sm:py-24">
        <div className="cc-safe-x mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="cc-star-badge">Intelligence layer</span>
            <h2 className="cc-section-title mt-4">Digital DNA before go-live</h2>
            <p className="mt-4 text-slate-400">
              <span className="font-medium text-slate-200">{PLATFORM_BRAND_TAGLINE}</span> —{" "}
              {PLATFORM_CORE_DEFINITION}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {intelligenceKeys.map((key) => {
              const p = PLATFORM_IDENTITIES[key];
              return (
                <PlatformCard
                  key={p.id}
                  name={p.name}
                  fullName={p.fullName}
                  tagline={p.tagline}
                  description={p.description}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl py-12 sm:py-16">
        <div className="rounded-2xl border border-white/10 bg-cc-elevated/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Optional extras
              </span>
              <h2 className="cc-section-title mt-2 text-xl sm:text-2xl">AI & add-on services</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Core promise is governed orchestration — not AI overload. Workflow assist, discovery acceleration, and
                industry packs are scoped extras in your blueprint.
              </p>
            </div>
            <Link href="/modules" className="cc-btn-secondary shrink-0 text-sm">
              Modules & extras →
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {EXTRA_SERVICES.slice(0, 4).map((s) => (
              <li
                key={s.key}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
              >
                {s.name}
              </li>
            ))}
            <li className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs text-slate-500">
              +{EXTRA_SERVICES.length - 4} more at proposal
            </li>
          </ul>
        </div>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl pb-8 text-center sm:pb-12">
        <Link href="/architecture" className="text-sm text-cyan-400 hover:text-cyan-300">
          See how Request → Blueprint → Go-live works →
        </Link>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl py-8 sm:py-12">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Customer outcomes
          </span>
          <h2 className="cc-section-title mt-2">Case studies</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Sector narratives publish as flagship tenants complete go-live — preview the roadmap below.
          </p>
        </div>
        <ComingSoonCards />
        <p className="mt-6 text-center">
          <Link href="/case-studies" className="text-sm text-cyan-400 hover:text-cyan-300">
            View case studies page →
          </Link>
        </p>
      </section>

      <section className="cc-safe-x mx-auto max-w-6xl pb-8 pt-8 sm:pb-12">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 via-cc-elevated/90 to-rose-950/35 p-8 text-center sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-8 right-1/4 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl"
            aria-hidden
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-cc-star">
            Your north star
          </p>
          <h2 className="relative mt-4 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to become an intelligent organization?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-400">
            Submit an implementation request. Our team reviews, discovery begins, and your ecosystem
            takes shape.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/request" className="cc-btn-primary min-w-[14rem]">
              Request your ecosystem
            </Link>
            <Link href="/pricing" className="cc-btn-secondary min-w-[14rem]">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
