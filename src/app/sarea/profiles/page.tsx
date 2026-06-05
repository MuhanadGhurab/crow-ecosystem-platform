import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaExperienceBoundaryNote } from "@/components/sarea/sarea-experience-boundary-note";
import { SareaMaterializationBadge } from "@/components/studio/sarea/sarea-materialization-badge";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateProfileConfigAction, updateProfileNameAction } from "@/lib/actions/sarea";
import { routes } from "@/lib/routes";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/services/sarea-experience-mapping.service";
import { listProfilesForStudio } from "@/lib/services/sarea-studio.service";

const COMPLEXITY_OPTIONS = ["low", "medium", "high", "adaptive"];

export default async function SareaProfilesPage() {
  const [rows, mapping] = await Promise.all([
    listProfilesForStudio(),
    buildSareaExperienceMappingStudioSnapshot(),
  ]);

  return (
    <SareaStudioPage
      area="profiles"
      title="Experience profiles"
      description="Persona-based presentation per tenant — visibility and limited safe edits. Each profile shapes dashboard layout, navigation emphasis, and widget visibility for mapped roles."
      operatorActions={[
        {
          action: "map_roles",
          href: routes.sarea.roleMapping,
          detail: "Assign RBAC roles to profiles before preview",
        },
        {
          action: "preview_experience",
          href: routes.sarea.preview,
          detail: "Validate presentation on lighthouse tenants",
        },
        {
          action: "confirm_tenant_backed_state",
          href: routes.sarea.overview,
          detail: "Review materialization health on overview",
        },
      ]}
    >
      <SareaExperienceBoundaryNote variant="default" />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="profiles" compact />}
      <SareaRbacBanner compact />

      {rows.length === 0 ? (
        <section className="rounded-lg border border-slate-500/20 bg-white/5 px-4 py-8 text-center">
          <p className="text-sm text-slate-400">No SAREA profiles in the database yet.</p>
          <p className="mt-2 text-xs text-slate-500">
            Provision a tenant from an approved blueprint, run{" "}
            <span className="font-mono text-slate-400">sarea:backfill-seed</span>, or open a tenant
            admin tab to review materialization.
          </p>
          <Link href={routes.admin.tenants} className="mt-4 inline-block text-sm text-rose-300">
            Tenants →
          </Link>
        </section>
      ) : (
        <ul className="space-y-4">
          {rows.map(({ profile: p, config, state, def }) => (
            <li
              key={p.id}
              className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04] !p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{p.name}</p>
                    <SareaMaterializationBadge state={state} />
                  </div>
                  <p className="font-mono text-xs text-slate-500">{p.personaKey}</p>
                  {p.tenant ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {p.tenant.organization.displayName} ·{" "}
                      <Link
                        href={`${routes.admin.tenant(p.tenant.id)}?tab=sarea`}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        /{p.tenant.slug}
                      </Link>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">Platform template (no tenant)</p>
                  )}
                  {config.purpose ? (
                    <p className="mt-2 text-xs text-slate-400">{config.purpose}</p>
                  ) : def?.roleContext ? (
                    <p className="mt-2 text-xs text-slate-400">{def.roleContext}</p>
                  ) : null}
                </div>
                <dl className="grid shrink-0 gap-1 text-right text-xs text-slate-500">
                  <div>
                    <dt className="text-slate-600">Role maps</dt>
                    <dd>{p._count.roleExperienceMaps}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Layouts · widgets · nav</dt>
                    <dd>
                      {p._count.dashboardLayouts} · {p._count.widgetRules} ·{" "}
                      {p._count.navigationProfiles}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Device rules</dt>
                    <dd>{p._count.deviceRules}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.tenant?.slug ? (
                  <Link
                    href={`/api/sarea/preview?persona=${p.personaKey}&redirect=${routes.tenant(p.tenant.slug).dashboard}`}
                    className="text-xs text-cyan-300 hover:text-cyan-200"
                  >
                    Preview on /{p.tenant.slug} →
                  </Link>
                ) : null}
                <Link href={routes.sarea.roleMapping} className="text-xs text-rose-300">
                  Role mapping →
                </Link>
              </div>

              <div className="mt-4 space-y-3 border-t border-rose-500/10 pt-4">
                <p className="text-[10px] uppercase tracking-wide text-slate-600">Safe edits</p>
                <SareaEditRow
                  id={p.id}
                  action={updateProfileNameAction}
                  fields={[{ name: "name", label: "Display name", defaultValue: p.name }]}
                />
                <SareaEditRow
                  id={p.id}
                  action={updateProfileConfigAction}
                  fields={[
                    {
                      name: "complexity",
                      label: "Density / complexity label",
                      defaultValue: String(config.complexity ?? def?.complexity ?? "medium"),
                      type: "select",
                      options: COMPLEXITY_OPTIONS,
                    },
                  ]}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
