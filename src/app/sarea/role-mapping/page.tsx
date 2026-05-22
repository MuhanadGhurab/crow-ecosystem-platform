import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateRoleMapAction } from "@/lib/actions/sarea";
import { listRoleExperienceMaps } from "@/lib/services/sarea.service";

export default async function SareaRoleMappingPage() {
  const maps = await listRoleExperienceMaps();

  return (
    <SareaStudioPage
      title="Role mapping"
      description="Maps CEM role slugs to SAREA experience profiles."
    >
      {maps.length === 0 ? (
        <p className="text-sm text-slate-500">No role maps yet.</p>
      ) : (
        <ul className="space-y-4">
          {maps.map((m) => (
            <li key={m.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
              <p className="text-sm text-white">{m.profile.name}</p>
              <p className="text-xs text-slate-500">
                {m.profile.tenant?.slug ? `/${m.profile.tenant.slug}` : "—"} · {m.profile.personaKey}
              </p>
              <div className="mt-3">
                <SareaEditRow
                  id={m.id}
                  action={updateRoleMapAction}
                  fields={[
                    { name: "roleSlug", label: "Role slug", defaultValue: m.roleSlug },
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
