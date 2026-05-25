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
      <section className="rounded-lg border border-cyan-500/15 bg-cyan-950/15 px-4 py-3 text-xs text-slate-400">
        Chain: <span className="text-slate-300">Role slug</span> → profile → dashboard layout →
        navigation profile → widget rules. Editing role slug is supported; layout/nav/widget links are
        read-only in studio — configure on layouts, navigation, and widgets pages.
      </section>

      {maps.length === 0 ? (
        <div className="space-y-2 text-sm text-slate-500">
          <p>No role maps yet.</p>
          <p className="text-xs">
            Suggested slugs: <span className="font-mono text-slate-400">executive</span>,{" "}
            <span className="font-mono text-slate-400">manager</span>,{" "}
            <span className="font-mono text-slate-400">frontline</span>,{" "}
            <span className="font-mono text-slate-400">analyst</span>,{" "}
            <span className="font-mono text-slate-400">tenant_admin</span> — map each to a tenant
            profile after provisioning.
          </p>
        </div>
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
