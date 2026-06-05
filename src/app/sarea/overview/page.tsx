import Link from "next/link";
import { ProCrowCapabilityFraming } from "@/components/procrow/procrow-capability-framing";
import { SareaOperatorNextActions } from "@/components/sarea/sarea-operator-next-actions";
import { SareaPageHeader } from "@/components/sarea/sarea-page-header";
import { SareaProfileSummary } from "@/components/sarea/sarea-profile-summary";
import { SareaScopeNote } from "@/components/sarea/sarea-scope-note";
import { SareaStudioStrip } from "@/components/sarea/sarea-studio-strip";
import { SareaAcceptanceHub } from "@/components/studio/sarea/sarea-acceptance-hub";
import { SareaExperienceFlowBanner, SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/sarea/sarea-experience-studio-loader";
import { getSareaStudioHealthSummary } from "@/lib/services/sarea-studio.service";
import { getSareaStudioSummary } from "@/lib/services/sarea.service";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";

export const dynamic = "force-dynamic";

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

  let mapping: Awaited<ReturnType<typeof buildSareaExperienceMappingStudioSnapshot>> = null;

  try {
    [summary, health, mapping] = await Promise.all([
      getSareaStudioSummary(),
      getSareaStudioHealthSummary(),
      buildSareaExperienceMappingStudioSnapshot(),
    ]);
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
      <SareaPageHeader
        area="overview"
        title="SAREA Experience Studio"
        description="Inspect tenant-backed personas, role mappings, layouts, navigation, and widgets. Platform staff adjust low-risk presentation fields only — no layout builder, no RBAC override, no self-serve personalization engine."
      />
      <SareaStudioStrip />
      <ProCrowCapabilityFraming capability="sarea" />
      <SareaRbacBanner />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="overview" />}
      <SareaScopeNote compact />
      <SareaExperienceFlowBanner />
      <SareaAcceptanceHub />

      <SareaProfileSummary
        tenantBackedPersonas={health.tenantBackedPersonas}
        fallbackPersonas={health.fallbackPersonas}
        partialPersonas={health.partialPersonas}
        notMaterializedPersonas={health.notMaterializedPersonas}
        roleMapCount={health.roleMapCount}
        navigationProfileCount={health.navigationProfileCount}
        widgetRuleCount={health.widgetRuleCount}
        tenantsNeedingReview={health.tenantsNeedingReview}
      />

      <SareaOperatorNextActions
        items={[
          {
            action: "review_profiles",
            href: routes.sarea.profiles,
            detail: `${health.tenantBackedPersonas} tenant-backed · ${health.fallbackPersonas} fallback`,
          },
          {
            action: "map_roles",
            href: routes.sarea.roleMapping,
            detail: `${health.roleMapCount} role map(s) configured`,
          },
          {
            action: "preview_experience",
            href: routes.sarea.preview,
            detail: "Preview does not change permissions",
          },
          {
            action: "validate_navigation",
            href: routes.sarea.navigation,
            detail: `${health.navigationProfileCount} navigation profile(s)`,
          },
          {
            action: "validate_widgets",
            href: routes.sarea.widgets,
            detail: `${health.widgetRuleCount} widget rule(s)`,
          },
        ]}
      />

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
        <h3 className="text-sm font-medium text-rose-300">Lighthouse tenants</h3>
        <p className="text-xs text-slate-500">
          Operator-reviewed materialization on MEEM and Rimal — confirm tenant-backed state before
          external demos.
        </p>
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
