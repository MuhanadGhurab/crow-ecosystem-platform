import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateLayoutNameAction } from "@/lib/actions/sarea";
import { listDashboardLayouts } from "@/lib/services/sarea.service";

export default async function SareaLayoutsPage() {
  const layouts = await listDashboardLayouts();

  return (
    <SareaStudioPage
      title="Dashboard layouts"
      description="Layout definitions per experience profile. Edit names inline."
    >
      {layouts.length === 0 ? (
        <p className="text-sm text-slate-500">No layouts. Provision a tenant to seed SAREA defaults.</p>
      ) : (
        <ul className="space-y-4">
          {layouts.map((l) => (
            <li
              key={l.id}
              className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04]"
            >
              <p className="text-sm font-medium text-white">{l.profile.name}</p>
              <p className="font-mono text-xs text-slate-500">
                {l.profile.tenant?.slug ? `/${l.profile.tenant.slug}` : "—"} · {l.profile.personaKey}
              </p>
              <div className="mt-3">
                <SareaEditRow
                  id={l.id}
                  action={updateLayoutNameAction}
                  fields={[{ name: "name", label: "Layout name", defaultValue: l.name }]}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
