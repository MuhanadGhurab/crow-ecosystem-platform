import Link from "next/link";
import { SareaExperienceBoundaryNote } from "@/components/sarea/sarea-experience-boundary-note";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateNavigationKeysAction } from "@/lib/actions/sarea";
import { SAREA_NAV_KEYS } from "@/lib/constants/sarea-runtime";
import { routes } from "@/lib/routes";
import { listNavigationProfiles, listRoleExperienceMaps } from "@/lib/services/sarea.service";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/services/sarea-experience-mapping.service";

export default async function SareaNavigationPage() {
  const [profiles, roleMaps, mapping] = await Promise.all([
    listNavigationProfiles(),
    listRoleExperienceMaps(),
    buildSareaExperienceMappingStudioSnapshot(),
  ]);
  const rolesByProfileId = new Map<string, string[]>();
  for (const m of roleMaps) {
    const list = rolesByProfileId.get(m.profileId) ?? [];
    if (!list.includes(m.roleSlug)) list.push(m.roleSlug);
    rolesByProfileId.set(m.profileId, list);
  }

  return (
    <SareaStudioPage
      area="navigation"
      title="Navigation profiles"
      description="Primary navigation keys per persona — experience-level visibility; RBAC still enforces routes."
      operatorActions={[
        {
          action: "preview_experience",
          href: routes.sarea.preview,
          detail: "Validate shell emphasis after nav key edits",
        },
        {
          action: "map_roles",
          href: routes.sarea.roleMapping,
          detail: "Unmapped roles keep platform defaults",
        },
        {
          action: "compare_rbac_boundary",
          href: routes.sarea.overview,
          detail: "Navigation visibility is not permission control",
        },
      ]}
    >
      <SareaExperienceBoundaryNote variant="navigation" />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="navigation" compact />}
      <SareaRbacBanner compact />
      <p className="text-xs text-slate-500">
        Navigation items shown here control which links appear in the shell for a mapped role.
        Users only reach modules their RBAC role allows. Valid SAREA keys:{" "}
        {SAREA_NAV_KEYS.join(", ")}. ERP modules are merged at runtime.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No navigation profiles yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {profiles.map((n) => {
            const primary = (
              (n.configJson as { primary?: string[] } | null)?.primary ?? []
            ).join(", ");
            const deviceNote = (n.configJson as { device?: string } | null)?.device;
            return (
              <li
                key={n.id}
                className="rounded-cc border border-cyan-500/10 bg-white/5 p-4 text-sm"
              >
                <p className="font-medium text-white">{n.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {n.profile.tenant?.slug ? `/${n.profile.tenant.slug}` : "—"} ·{" "}
                  {n.profile.personaKey}
                </p>
                <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-600">Primary nav keys (route targets)</dt>
                    <dd className="font-mono text-slate-400">{primary || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Mapped RBAC roles</dt>
                    <dd className="text-slate-400">
                      {(rolesByProfileId.get(n.profileId) ?? []).join(", ") || "None — assign in role mapping"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-slate-600">Visibility purpose</dt>
                    <dd className="text-slate-400">
                      Shell emphasis for {n.profile.personaKey} — users still need RBAC permission
                      for each module.
                    </dd>
                  </div>
                  {deviceNote ? (
                    <div>
                      <dt className="text-slate-600">Device relevance</dt>
                      <dd className="text-slate-400">{String(deviceNote)}</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-3">
                  <SareaEditRow
                    id={n.id}
                    action={updateNavigationKeysAction}
                    fields={[
                      {
                        name: "primaryKeys",
                        label: "Primary nav keys (comma-separated)",
                        defaultValue: primary,
                      },
                    ]}
                  />
                </div>
                <Link href={routes.sarea.preview} className="mt-2 inline-block text-xs text-cyan-300">
                  Preview →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
