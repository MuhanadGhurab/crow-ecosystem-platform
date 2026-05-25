import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateLayoutNameAction } from "@/lib/actions/sarea";
import { routes } from "@/lib/routes";
import { listDashboardLayouts } from "@/lib/services/sarea.service";

export default async function SareaLayoutsPage() {
  const layouts = await listDashboardLayouts();

  return (
    <SareaStudioPage
      title="Dashboard layouts"
      description="Layout definitions per experience profile — rename only in F14."
    >
      <SareaRbacBanner compact />
      <p className="text-xs text-slate-500">
        Layout records tie a persona to dashboard composition. Drag-and-drop builder deferred to a
        later phase.
      </p>

      {layouts.length === 0 ? (
        <p className="text-sm text-slate-500">No layouts. Provision a tenant to seed SAREA defaults.</p>
      ) : (
        <ul className="space-y-4">
          {layouts.map((l) => (
            <li key={l.id} className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04]">
              <p className="text-sm font-medium text-white">{l.name}</p>
              <p className="font-mono text-xs text-slate-500">
                {l.profile.tenant?.slug ? `/${l.profile.tenant.slug}` : "—"} · {l.profile.personaKey}{" "}
                · {l.profile.name}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">Source: tenant-backed layout row</p>
              <div className="mt-3">
                <SareaEditRow
                  id={l.id}
                  action={updateLayoutNameAction}
                  fields={[{ name: "name", label: "Layout name", defaultValue: l.name }]}
                />
              </div>
              <Link href={routes.sarea.profiles} className="mt-2 inline-block text-xs text-rose-300">
                Profile →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
