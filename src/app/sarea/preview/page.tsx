import Link from "next/link";
import { SareaExperienceBoundaryNote } from "@/components/sarea/sarea-experience-boundary-note";
import { SareaAcceptanceHub } from "@/components/studio/sarea/sarea-acceptance-hub";
import { SareaPersonaMaterializationPanel } from "@/components/studio/sarea/sarea-persona-materialization-panel";
import { SareaPreviewImpactPanel } from "@/components/studio/sarea/sarea-preview-impact-panel";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";
import { SAREA_PERSONA_DEFINITIONS } from "@/lib/constants/sarea-personas";
import { routes } from "@/lib/routes";
import { getLighthouseMaterialization } from "@/lib/services/sarea-studio.service";
import {
  getSareaStudioSummary,
  listSareaExperienceProfiles,
} from "@/lib/services/sarea.service";
import {
  materializationStateLabel,
} from "@/lib/services/sarea-materialization.service";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/services/sarea-experience-mapping.service";

const PREVIEW_TENANTS = [
  { slug: MEEM_TENANT_SLUG, label: "MEEM logistics" },
  { slug: RIMAL_TENANT_SLUG, label: "Rimal construction" },
] as const;

export default async function SareaPreviewPage() {
  const [summary, profiles, lighthouse, mapping] = await Promise.all([
    getSareaStudioSummary(),
    listSareaExperienceProfiles(),
    getLighthouseMaterialization(),
    buildSareaExperienceMappingStudioSnapshot(),
  ]);

  return (
    <SareaStudioPage
      area="preview"
      title="Studio preview"
      description="Experience adaptation preview — RBAC and route guards unchanged. Preview shapes navigation, widgets, and layout density for the selected persona."
      operatorActions={[
        {
          action: "map_roles",
          href: routes.sarea.roleMapping,
          detail: "Ensure roles map to profiles before external walkthrough",
        },
        {
          action: "validate_navigation",
          href: routes.sarea.navigation,
          detail: "Confirm nav keys match preview persona",
        },
        {
          action: "validate_widgets",
          href: routes.sarea.widgets,
          detail: "Confirm widget visibility for preview persona",
        },
      ]}
    >
      <SareaExperienceBoundaryNote variant="preview" />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="preview" />}
      <SareaRbacBanner />

      {lighthouse.map(({ slug, rows }) => {
        const label = PREVIEW_TENANTS.find((t) => t.slug === slug)?.label ?? slug;
        const tenantDashboard = routes.tenant(slug).dashboard;
        const byKey = new Map(rows.map((r) => [r.personaKey, r]));
        return (
          <section key={slug} className="space-y-3">
            <h3 className="text-sm font-medium text-rose-300">{label}</h3>
            <SareaPersonaMaterializationPanel rows={rows} tenantSlug={slug} compact />
            <SareaPreviewImpactPanel slug={slug} label={label} rows={rows} />
            <div className="flex flex-wrap gap-2">
              {SAREA_PERSONA_DEFINITIONS.map((p) => {
                const mat = byKey.get(p.key);
                const backed = mat?.state === "tenant_backed";
                return (
                  <Link
                    key={`${slug}-${p.key}`}
                    href={`/api/sarea/preview?persona=${p.key}&redirect=${tenantDashboard}`}
                    className="cc-btn-secondary text-sm"
                    title={
                      mat
                        ? `${materializationStateLabel(mat.state)} — layout ${mat.layoutCount}, widgets ${mat.widgetCount}`
                        : "Unknown materialization"
                    }
                  >
                    {p.label}
                    {!backed ? " (fallback)" : ""}
                  </Link>
                );
              })}
              <Link
                href={`/api/sarea/preview?redirect=${tenantDashboard}`}
                className="text-sm text-slate-400 underline"
              >
                Clear preview
              </Link>
            </div>
            <dl className="grid gap-2 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-slate-600">Dashboard layout source</dt>
                <dd className="text-slate-400">Tenant-backed layout row when materialized</dd>
              </div>
              <div>
                <dt className="text-slate-600">Navigation / widgets</dt>
                <dd className="text-slate-400">Studio navigation profile + widget rules</dd>
              </div>
              <div>
                <dt className="text-slate-600">Device behavior</dt>
                <dd className="text-slate-400">Device rules JSON (advisory)</dd>
              </div>
            </dl>
          </section>
        );
      })}

      <SareaAcceptanceHub compact />

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-rose-300">Persona reference (all tenants)</h3>
        {SAREA_PERSONA_DEFINITIONS.map((p) => (
          <article key={p.key} className="cc-glass-card text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-white">{p.label}</h4>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                {p.complexity} complexity
              </span>
              {p.previewMode === "recommended_mapping" ? (
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-300">
                  May use recommended fallback until tenant profile exists
                </span>
              ) : (
                <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] text-teal-300">
                  Live cookie preview when profile exists
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">{p.roleContext}</p>
            <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Dashboard purpose</dt>
                <dd className="text-slate-300">{p.dashboardPurpose}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Navigation focus</dt>
                <dd className="text-slate-300">{p.navFocus}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Widgets</dt>
                <dd className="text-slate-300">{p.widgetFocus}</dd>
              </div>
              <div>
                <dt className="text-slate-500">RBAC note</dt>
                <dd className="text-slate-400">{p.rbacNote}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.layoutCount}</p>
          <p className="text-xs text-slate-500">Layouts (global)</p>
        </div>
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.widgetRuleCount}</p>
          <p className="text-xs text-slate-500">Widget rules</p>
        </div>
        <div className="cc-glass-card text-center">
          <p className="text-xl font-bold text-cyan-300">{summary.deviceRuleCount}</p>
          <p className="text-xs text-slate-500">Device rules</p>
        </div>
      </section>

      <ul className="space-y-2">
        {profiles.slice(0, 12).map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap justify-between gap-2 rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
          >
            <span className="text-white">{p.name}</span>
            <span className="text-slate-500">
              {p.tenant?.slug ? `/${p.tenant.slug}` : "global"} · {p.personaKey}
            </span>
          </li>
        ))}
      </ul>
      {profiles.length > 12 ? (
        <Link href={routes.sarea.profiles} className="text-xs text-rose-300">
          All profiles →
        </Link>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href={routes.sarea.roleMapping} className="cc-btn-secondary text-sm">
          Role mapping
        </Link>
        <Link href={routes.sarea.profiles} className="cc-btn-secondary text-sm">
          Profiles
        </Link>
      </div>
    </SareaStudioPage>
  );
}
