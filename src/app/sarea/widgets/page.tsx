import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateWidgetVisibilityAction } from "@/lib/actions/sarea";
import { routes } from "@/lib/routes";
import { listWidgetRules } from "@/lib/services/sarea.service";

const VISIBILITY = ["visible", "hidden", "optional"];

export default async function SareaWidgetsPage() {
  const rules = await listWidgetRules();

  return (
    <SareaStudioPage
      title="Widget rules"
      description="Widget visibility per experience profile — does not change RBAC or module access."
    >
      <SareaRbacBanner compact />
      <p className="text-xs text-slate-500">
        Widgets adapt dashboard density and focus (CEM ops, CyberCrow, SAREA chrome). Route guards and
        permissions still apply at runtime.
      </p>

      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No widget rules yet — provision a tenant to seed defaults.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((w) => (
            <li key={w.id} className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04]">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">{w.widgetKey}</p>
                  <p className="text-xs text-slate-500">
                    {w.profile.tenant?.slug ? `/${w.profile.tenant.slug}` : "—"} ·{" "}
                    {w.profile.personaKey} · {w.profile.name}
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                  {w.visibility}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                Persona relevance: {w.profile.personaKey} experience — safe edit: visibility only.
              </p>
              <div className="mt-3">
                <SareaEditRow
                  id={w.id}
                  action={updateWidgetVisibilityAction}
                  fields={[
                    {
                      name: "visibility",
                      label: "Visibility",
                      defaultValue: w.visibility,
                      type: "select",
                      options: VISIBILITY,
                    },
                  ]}
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
