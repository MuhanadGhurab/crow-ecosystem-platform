import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { PLATFORM_IDENTITIES, PLATFORM_LIFECYCLE } from "@/lib/constants/platform";
import { routes } from "@/lib/routes";

const PIPELINE_CARDS = [
  {
    href: routes.admin.requests,
    label: "Implementation requests",
    count: "Queue",
    dept: { hasSecurity: true, hasModules: true, showSarea: false },
    entity: "cem" as const,
  },
  {
    href: routes.admin.discovery,
    label: "Active discovery",
    count: "In progress",
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "cem" as const,
  },
  {
    href: routes.admin.blueprints,
    label: "Blueprints",
    count: "Pricing",
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "cybercrow" as const,
  },
  {
    href: routes.admin.tenants,
    label: "Live tenants",
    count: "CEM runtime",
    dept: { hasSecurity: true, hasModules: true, showSarea: true },
    entity: "sarea" as const,
  },
  {
    href: routes.admin.audit,
    label: "Audit & notifications",
    count: "Pipeline log",
    dept: { hasSecurity: true, hasModules: false, showSarea: false },
    entity: "cybercrow" as const,
  },
] as const;

export default function AdminOverviewPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Platform Admin"
        title="Overview"
        description="Crow Admin Console — pipeline health from request through go-live."
      />

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
          {PIPELINE_CARDS.map((card) => (
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
                <span className="text-xs text-slate-500">{card.count}</span>
              </div>
              <DeptChips {...card.dept} className="mt-2" />
              <span className="mt-3 text-sm text-cyan-400">Open →</span>
            </Link>
          ))}
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
