import Link from "next/link";
import { ComingSoonCards } from "@/components/public/coming-soon-cards";
import { CrowEngineCard } from "@/components/public/crow-engine-card";
import { CyberCrowCardPreview } from "@/components/public/cybercrow-card-preview";
import { CrowMotif } from "@/components/public/crow-motif";
import { HeroSection } from "@/components/public/hero-section";
import { PlatformCard } from "@/components/public/platform-card";
import { PublicLifecycleStrip } from "@/components/public/public-lifecycle-strip";
import { PublicSectionIntro } from "@/components/public/public-section-intro";
import { EXTRA_SERVICES } from "@/lib/constants/extra-services";
import { CEM_MODULES } from "@/lib/constants/modules";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";
import {
  PLATFORM_BRAND_TAGLINE,
  PLATFORM_CORE_DEFINITION,
  PLATFORM_IDENTITIES,
} from "@/lib/constants/platform";

const STATS = [
  {
    value: String(SUBSCRIPTION_TIERS.length),
    label: "Subscription tiers",
    sub: "Startup → Enterprise",
    accent: "text-cc-star",
    entity: "discovery" as const,
  },
  {
    value: String(CEM_MODULES.length),
    label: "CEM modules",
    sub: "Talent-adaptive via SAREA",
    accent: "text-cyan-300",
    entity: "cem" as const,
  },
  {
    value: String(SECURITY_PACKAGES.length),
    label: "Security packages",
    sub: "NCA-aware CyberCrow",
    accent: "text-violet-300",
    entity: "cybercrow" as const,
  },
] as const;

const INTELLIGENCE_ENGINES = [
  {
    entity: "discovery" as const,
    identity: PLATFORM_IDENTITIES.discovery,
    step: "02",
    cta: "/architecture",
    ctaLabel: "See the customer journey",
    span: "lg:col-span-3",
  },
  {
    entity: "blueprint" as const,
    identity: PLATFORM_IDENTITIES.blueprint,
    step: "03",
    cta: "/architecture",
    ctaLabel: "Blueprint in the flow",
    span: "lg:col-span-3",
  },
] as const;

const RUNTIME_ENGINES = [
  {
    entity: "cem" as const,
    identity: PLATFORM_IDENTITIES.cem,
    step: "05",
    cta: "/modules",
    ctaLabel: "Explore CEM modules",
    span: "lg:col-span-2",
  },
  {
    entity: "cybercrow" as const,
    identity: PLATFORM_IDENTITIES.cybercrow,
    step: "06",
    cta: "/security",
    ctaLabel: "Security packages",
    span: "lg:col-span-2",
  },
  {
    entity: "sarea" as const,
    identity: PLATFORM_IDENTITIES.sarea,
    step: "07",
    cta: "/architecture",
    ctaLabel: "Experience architecture",
    span: "lg:col-span-2",
  },
] as const;

export default function HomePage() {
  const intelligenceKeys = ["discovery", "blueprint"] as const;

  return (
    <>
      <HeroSection />

      <section id="crow-engines" className="cc-public-band scroll-mt-20">
        <CrowMotif
          variant="constellation"
          className="absolute start-[6%] top-12 hidden h-16 w-24 opacity-40 lg:block"
        />
        <CrowMotif variant="wing" className="absolute bottom-8 end-[8%] hidden h-12 w-16 opacity-30 lg:block" />
        <div className="cc-safe-x relative mx-auto max-w-6xl">
          <PublicSectionIntro
            badge="Crow engines"
            title="Discovery · Blueprint · CEM · CyberCrow · SAREA"
            description="Intelligence layers shape digital DNA before your tenant runs — then three engines operate as siblings under one governed shell."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-6 lg:gap-5">
            {INTELLIGENCE_ENGINES.map((engine) => (
              <CrowEngineCard
                key={engine.entity}
                entity={engine.entity}
                name={engine.identity.name}
                fullName={engine.identity.fullName}
                tagline={engine.identity.tagline}
                description={engine.identity.description}
                href={engine.cta}
                ctaLabel={engine.ctaLabel}
                step={engine.step}
                className={engine.span}
              />
            ))}
            {RUNTIME_ENGINES.map((engine) => (
              <CrowEngineCard
                key={engine.entity}
                entity={engine.entity}
                name={engine.identity.name}
                fullName={engine.identity.fullName}
                tagline={engine.identity.tagline}
                description={engine.identity.description}
                href={engine.cta}
                ctaLabel={engine.ctaLabel}
                step={engine.step}
                className={engine.span}
                preview={engine.entity === "cybercrow" ? <CyberCrowCardPreview /> : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cc-safe-x relative mx-auto max-w-6xl py-14 sm:py-20">
        <CrowMotif variant="silhouette" className="absolute -start-2 top-4 h-10 w-12 opacity-50 sm:h-12 sm:w-14" />
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`cc-bento-stat group cc-engine-card--${s.entity} text-center sm:text-start`}
            >
              <p className={`font-display text-4xl font-bold tabular-nums sm:text-5xl ${s.accent}`}>
                {s.value}
              </p>
              <p className="mt-2 font-semibold text-white">{s.label}</p>
              <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicLifecycleStrip />

      <section className="cc-public-band">
        <div className="cc-safe-x relative mx-auto max-w-6xl">
          <PublicSectionIntro
            badge="Intelligence layer"
            title="Digital DNA before go-live"
            description={
              <>
                <span className="font-medium text-slate-200">{PLATFORM_BRAND_TAGLINE}</span> —{" "}
                {PLATFORM_CORE_DEFINITION}
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
            {intelligenceKeys.map((key) => {
              const p = PLATFORM_IDENTITIES[key];
              return (
                <PlatformCard
                  key={p.id}
                  entity={key}
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

      <section className="cc-public-section !pt-0">
        <div className="rounded-2xl border border-white/10 bg-cc-elevated/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Optional extras
              </span>
              <h2 className="cc-section-title mt-2 text-xl sm:text-2xl">AI & add-on services</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Core promise is governed orchestration — not AI overload. Workflow assist, discovery
                acceleration, and industry packs are scoped extras in your blueprint.
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
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/25 hover:text-white"
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

      <section className="cc-public-section !py-8 text-center">
        <Link href="/architecture" className="text-sm text-cyan-400 transition hover:text-cyan-300">
          See how Request → Blueprint → Go-live works →
        </Link>
      </section>

      <section className="cc-public-section !pt-0">
        <PublicSectionIntro
          badge="Customer outcomes"
          title="Case studies"
          description="Sector narratives publish as flagship tenants complete go-live — preview the roadmap below."
        />
        <ComingSoonCards />
        <p className="mt-8 text-center">
          <Link href="/case-studies" className="text-sm text-cyan-400 transition hover:text-cyan-300">
            View case studies page →
          </Link>
        </p>
      </section>

      <section className="cc-public-section !pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 via-cc-elevated/90 to-rose-950/35 p-8 text-center sm:p-12 lg:p-16">
          <CrowMotif
            variant="silhouette"
            className="absolute end-6 top-6 h-14 w-16 opacity-25 sm:end-10 sm:top-8"
          />
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
