import { SareaExperienceBoundaryNote } from "@/components/sarea/sarea-experience-boundary-note";
import { SareaPersonaMaterializationPanel } from "@/components/studio/sarea/sarea-persona-materialization-panel";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaRoleMapAssign } from "@/components/studio/sarea/sarea-role-map-assign";
import { SareaMaterializationBadge } from "@/components/studio/sarea/sarea-materialization-badge";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  getLighthouseMaterialization,
  listRoleMapsForStudio,
} from "@/lib/services/sarea-studio.service";
import { listSareaExperienceProfiles } from "@/lib/services/sarea.service";
import { materializationStateHint } from "@/lib/services/sarea-materialization.service";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/sarea/sarea-experience-studio-loader";

export const dynamic = "force-dynamic";

export default async function SareaRoleMappingPage() {
  const [maps, profiles, lighthouse, mapping] = await Promise.all([
    listRoleMapsForStudio(),
    listSareaExperienceProfiles(),
    getLighthouseMaterialization(),
    buildSareaExperienceMappingStudioSnapshot(),
  ]);

  const profilesByTenant = new Map<string, typeof profiles>();
  for (const p of profiles) {
    const tid = p.tenantId ?? "global";
    const list = profilesByTenant.get(tid) ?? [];
    list.push(p);
    profilesByTenant.set(tid, list);
  }

  return (
    <SareaStudioPage
      area="role_mapping"
      title="Role mapping"
      description="Maps CEM role slugs (RBAC) to SAREA experience profiles — presentation only."
      operatorActions={[
        {
          action: "preview_experience",
          href: routes.sarea.preview,
          detail: "After mapping, preview shell for a persona",
        },
        {
          action: "compare_rbac_boundary",
          href: routes.sarea.overview,
          detail: "RBAC controls access; SAREA controls experience",
        },
        {
          action: "review_profiles",
          href: routes.sarea.profiles,
          detail: `${profiles.length} profile(s) available`,
        },
      ]}
    >
      <SareaExperienceBoundaryNote variant="mapping" />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="role_mapping" />}
      <SareaRbacBanner compact />

      <section className="rounded-lg border border-cyan-500/15 bg-cyan-950/15 px-4 py-3 text-xs text-slate-400">
        <p className="font-medium text-cyan-200">Experience chain</p>
        <p className="mt-1">
          Role slug (RBAC permissions) → SAREA profile → dashboard layout → navigation profile →
          widget rules → device behavior →{" "}
          <Link href={routes.sarea.preview} className="text-cyan-300">
            preview
          </Link>
          . Changing the mapped profile adjusts presentation only — it does not grant module access.
        </p>
      </section>

      {lighthouse.map(({ slug, rows }) => (
        <section key={slug} className="space-y-2">
          <h3 className="text-sm font-medium text-rose-300">
            {slug} · persona materialization
          </h3>
          <SareaPersonaMaterializationPanel rows={rows} tenantSlug={slug} compact />
        </section>
      ))}

      {maps.length === 0 ? (
        <div className="space-y-2 text-sm text-slate-500">
          <p>No role maps in the database yet.</p>
          <p className="text-xs">
            Use tenant provisioning or recommended slugs in the lighthouse panels above. Assign each
            RBAC role slug to an existing SAREA profile after personas are materialized.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {maps.map((m) => {
            const tenantId = m.tenantId ?? "global";
            const tenantProfiles = (profilesByTenant.get(tenantId) ?? []).map((p) => ({
              id: p.id,
              label: `${p.name} (${p.personaKey})`,
            }));
            const previewSlug = m.profile.tenant?.slug;
            return (
              <li key={m.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm text-white">{m.roleSlug}</p>
                  <span className="text-xs text-slate-500">RBAC slug</span>
                  {m.materialization ? (
                    <SareaMaterializationBadge state={m.materialization} />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-300">→ {m.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {previewSlug ? `/${previewSlug}` : "—"} · persona {m.profile.personaKey}
                </p>
                <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt className="text-slate-600">Tenant</dt>
                    <dd className="text-slate-400">{previewSlug ? `/${previewSlug}` : "Global"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Recommended profile</dt>
                    <dd className="text-slate-400">
                      {m.recommendedProfileName
                        ? `${m.recommendedProfileName} (${m.recommendedPersonaKey})`
                        : m.recommendedPersonaKey
                          ? `Persona ${m.recommendedPersonaKey} (not materialized)`
                          : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Mapping alignment</dt>
                    <dd
                      className={
                        m.mappingAlignment === "aligned"
                          ? "text-teal-400"
                          : m.mappingAlignment === "review"
                            ? "text-amber-300"
                            : "text-slate-400"
                      }
                    >
                      {m.mappingAlignment === "aligned"
                        ? "Aligned with recommended persona"
                        : m.mappingAlignment === "review"
                          ? "Review — role slug suggests different persona"
                          : "No recommended alias for this slug"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Layouts · widgets · nav</dt>
                    <dd className="text-slate-400">
                      {m.profileCounts?.dashboardLayouts ?? "—"} ·{" "}
                      {m.profileCounts?.widgetRules ?? "—"} ·{" "}
                      {m.profileCounts?.navigationProfiles ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Materialization</dt>
                    <dd className="text-slate-400">{materializationStateHint(m.materialization)}</dd>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <dt className="text-slate-600">RBAC · experience impact</dt>
                    <dd className="text-slate-400">
                      {m.rbacSummary} {m.experienceImpact}
                    </dd>
                  </div>
                </dl>
                {previewSlug ? (
                  <Link
                    href={`/api/sarea/preview?persona=${m.profile.personaKey}&redirect=${routes.tenant(previewSlug).dashboard}`}
                    className="mt-2 inline-block text-xs text-cyan-300"
                  >
                    Preview as {m.profile.personaKey} →
                  </Link>
                ) : null}
                {tenantProfiles.length > 1 ? (
                  <SareaRoleMapAssign
                    mapId={m.id}
                    currentProfileId={m.profileId}
                    currentProfileLabel={`${m.profile.name} (${m.profile.personaKey})`}
                    roleSlug={m.roleSlug}
                    recommendedProfileName={m.recommendedProfileName}
                    profileOptions={tenantProfiles}
                  />
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Only one profile on this tenant — mapping change not applicable.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
