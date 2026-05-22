import Link from "next/link";
import { PlatformCybercrowPostureStrip } from "@/components/admin/platform-cybercrow-posture";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { PLATFORM_IDENTITIES, PLATFORM_LIFECYCLE } from "@/lib/constants/platform";
import { routes } from "@/lib/routes";
import { getPlatformCybercrowPosture } from "@/lib/services/cybercrow-platform.service";
import { getPlatformPipelineStats } from "@/lib/services/platform-pipeline-stats.service";

function pipelineCountLabel(
  stats: Awaited<ReturnType<typeof getPlatformPipelineStats>>,
  value: number,
  fallback: string
) {
  if (!stats.live) return fallback;
  return value === 1 ? "1" : String(value);
}

const PIPELINE_CARD_DEFS = [
  {
    href: routes.admin.requests,
    label: "Implementation requests",
    fallbackCount: "Queue",
    countKey: "requestCount" as const,
    dept: { hasSecurity: true, hasModules: true, showSarea: false },
    entity: "cem" as const,
  },
  {
    href: routes.admin.discovery,
    label: "Active discovery",
    fallbackCount: "In progress",
    countKey: "discoveryCount" as const,
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "cem" as const,
  },
  {
    href: routes.admin.blueprints,
    label: "Blueprints",
    fallbackCount: "Pricing",
    countKey: "blueprintCount" as const,
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "cybercrow" as const,
  },
  {
    href: routes.admin.tenants,
    label: "Live tenants",
    fallbackCount: "CEM runtime",
    countKey: "liveTenantCount" as const,
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "sarea" as const,
  },
  {
    href: routes.admin.audit,
    label: "Audit & notifications",
    fallbackCount: "Pipeline log",
    countKey: null,
    dept: { hasSecurity: true, hasModules: false, showSarea: false },
    entity: "cybercrow" as const,
  },
] as const;

export default async function AdminOverviewPage() {
  const [posture, pipelineStats] = await Promise.all([
    getPlatformCybercrowPosture(),
    getPlatformPipelineStats(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        badge="Platform Admin"
        title="Overview"
        description="Crow Admin Console — pipeline health from request through go-live."
      />

      <PlatformCybercrowPostureStrip posture={posture} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Platform identities" value={Object.keys(PLATFORM_IDENTITIES).length} accent="cyan" />
        <StatCard label="Lifecycle steps" value={PLATFORM_LIFECYCLE.length} accent="star" />
        <StatCard label="Engines" value="3" hint="CEM · CyberCrow · SAREA" accent="teal" />
      </div>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Pipeline
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PIPELINE_CARD_DEFS.map((card) => {
            const count =
              card.countKey != null
                ? pipelineCountLabel(
                    pipelineStats,
                    pipelineStats[card.countKey],
                    card.fallbackCount
                  )
                : card.fallbackCount;
            return (
            <Link
              key={card.href}
              href={card.href}
              className={`cc-pipeline-card border-l-2 ${
                card.entity === "cem"
                  ? "border-l-cyan-500/60"
                  : card.entity === "cybercrow"
                    ? "border-l-violet-500/60"
                    : "border-l-rose-500/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-white">{card.label}</p>
                <span className="font-mono text-xs tabular-nums text-slate-500">{count}</span>
              </div>
              <DeptChips {...card.dept} className="mt-2" />
              <span className="mt-3 text-sm text-cyan-400">Open →</span>
            </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Platform stack
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(PLATFORM_IDENTITIES).map((p) => (
            <div
              key={p.id}
              className={`cc-glass-card !p-5 ${
                p.id === "cem"
                  ? "cc-entity-block--cem"
                  : p.id === "cybercrow"
                    ? "cc-entity-block--cybercrow"
                    : p.id === "sarea"
                      ? "cc-entity-block--sarea"
                      : ""
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">{p.name}</p>
              <p className="mt-2 font-medium text-white">{p.tagline}</p>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cc-glass-card !p-6 border border-teal-500/15">
        <h2 className="font-display text-sm font-semibold text-white">Cloud & SaaS (M7 / M8)</h2>
        <p className="mt-2 text-sm text-slate-400">
          Production deploy and paying-customer onboarding — MEEM stays lighthouse; customer #2+ uses
          blueprint provision.
        </p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <a href="/api/health" className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noreferrer">
              API health →
            </a>
            <span className="text-slate-500"> · deployReady flag</span>
          </li>
          <li>
            <a href="/api/billing/status" className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noreferrer">
              Billing status →
            </a>
          </li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Docs: M7_CLOUD_DEPLOY.md · M8_SAAS_CUSTOMER.md · npm run deploy:check · npm run onboard:tenant
        </p>
      </section>

      <section className="cc-glass-card !p-6">
        <h2 className="font-display text-sm font-semibold text-white">Lifecycle</h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {PLATFORM_LIFECYCLE.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-cc-sm border border-cyan-500/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-400"
            >
              <span className="font-mono text-xs font-bold text-cc-star">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
