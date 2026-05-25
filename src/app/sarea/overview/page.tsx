import Link from "next/link";
import { SareaAcceptanceHub } from "@/components/studio/sarea/sarea-acceptance-hub";
import { SareaExperienceFlowBanner, SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { getSareaStudioHealthSummary } from "@/lib/services/sarea-studio.service";
import { getSareaStudioSummary } from "@/lib/services/sarea.service";

const STUDIO_LINKS = [
  { href: routes.sarea.profiles, label: "Profiles", desc: "Persona visibility & safe edits" },
  { href: routes.sarea.roleMapping, label: "Role mapping", desc: "Role → profile chain" },
  { href: routes.sarea.layouts, label: "Layouts", desc: "Dashboard compositions" },
  { href: routes.sarea.navigation, label: "Navigation", desc: "Nav keys per profile" },
  { href: routes.sarea.widgets, label: "Widgets", desc: "Visibility per profile" },
  { href: routes.sarea.deviceRules, label: "Device rules", desc: "Desktop / tablet / mobile" },
  { href: routes.sarea.rules, label: "Rules", desc: "Adaptive UI density" },
  { href: routes.sarea.preview, label: "Preview", desc: "Tenant-backed vs fallback" },
] as const;

export default async function SareaOverviewPage() {
  let summary: Awaited<ReturnType<typeof getSareaStudioSummary>> | null = null;
  let health: Awaited<ReturnType<typeof getSareaStudioHealthSummary>> | null = null;
  let dbError: string | null = null;

  try {
    [summary, health] = await Promise.all([getSareaStudioSummary(), getSareaStudioHealthSummary()]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database unavailable";
  }

  if (dbError || !summary || !health) {
    return (
      <div className="space-y-4">
        <p className="rounded-cc border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          SAREA studio could not load live data: {dbError}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/35 via-cc-elevated/90 to-amber-950/25 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl"
          aria-hidden
        />
        <span className="cc-entity-badge cc-entity-badge--sarea relative">SAREA Studio</span>
        <h2 className="cc-section-title relative mt-4">Experience visibility & safe controls</h2>
        <p className="relative mt-2 max-w-2xl text-sm text-slate-400">
          Inspect tenant-backed personas, role mappings, layouts, navigation, and widgets.
          Platform staff can adjust low-risk presentation fields only — no layout builder, no RBAC
          override.
        </p>
      </section>

      <SareaRbacBanner />
      <SareaExperienceFlowBanner />
      <SareaAcceptanceHub />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Experience profiles" value={summary.profileCount} entity="sarea" accent="rose" />
        <StatCard
          label="Tenants with SAREA"
          value={summary.tenantsWithProfiles}
          entity="sarea"
          accent="amber"
        />
        <StatCard label="Role mappings" value={health.roleMapCount} entity="sarea" accent="rose" />
        <StatCard label="Dashboard layouts" value={summary.layoutCount} entity="sarea" accent="amber" />
        <StatCard
          label="Navigation profiles"
          value={summary.navigationProfileCount}
          entity="sarea"
          accent="rose"
        />
        <StatCard label="Widget rules" value={summary.widgetRuleCount} entity="sarea" accent="amber" />
        <StatCard label="Device rules" value={summary.deviceRuleCount} entity="sarea" accent="rose" />
        <StatCard
          label="Adaptive UI rules"
          value={summary.adaptiveRuleCount}
          entity="sarea"
          accent="amber"
        />
      </section>

      <section className="cc-glass-card space-y-3">
        <h3 className="text-sm font-medium text-rose-300">Materialization health</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-cc border border-teal-500/15 bg-teal-950/15 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-teal-300">{health.tenantBackedPersonas}</p>
            <p className="text-[10px] text-slate-500">Tenant-backed personas</p>
          </div>
          <div className="rounded-cc border border-amber-500/15 bg-amber-950/15 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-amber-300">{health.partialPersonas}</p>
            <p className="text-[10px] text-slate-500">Partial (needs backfill)</p>
          </div>
          <div className="rounded-cc border border-violet-500/15 bg-violet-950/15 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-violet-300">{health.fallbackPersonas}</p>
            <p className="text-[10px] text-slate-500">Recommended fallback only</p>
          </div>
          <div className="rounded-cc border border-slate-500/20 bg-white/5 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-slate-300">{health.tenantsNeedingReview}</p>
            <p className="text-[10px] text-slate-500">Lighthouse tenants needing review</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs">
          {health.lighthouseTenants.map((t) => (
            <li
              key={t.slug}
              className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-rose-200"
            >
              <Link href={`${routes.admin.tenant(t.id)}?tab=sarea`} className="hover:text-rose-100">
                {t.displayName}
              </Link>
              {" · "}
              {t.backed}/{t.total} backed
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STUDIO_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="cc-bento-card group border-rose-500/15 !p-5 hover:border-rose-400/30"
          >
            <span className="font-display text-base font-semibold text-white group-hover:text-rose-100">
              {link.label}
            </span>
            <span className="mt-1 block text-sm text-slate-500">{link.desc}</span>
          </Link>
        ))}
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href={routes.sarea.profiles}
          className="cc-btn-primary text-sm !from-rose-600 !via-rose-500 !to-amber-400"
        >
          All profiles →
        </Link>
        <Link href={routes.sarea.roleMapping} className="cc-btn-secondary text-sm">
          Role mapping
        </Link>
        <Link href={routes.admin.tenants} className="cc-btn-secondary text-sm">
          Tenants
        </Link>
      </section>
    </div>
  );
}
