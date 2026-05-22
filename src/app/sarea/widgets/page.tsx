import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateWidgetVisibilityAction } from "@/lib/actions/sarea";
import { listWidgetRules } from "@/lib/services/sarea.service";

const VISIBILITY = ["visible", "hidden", "optional"];

export default async function SareaWidgetsPage() {
  const rules = await listWidgetRules();

  return (
    <SareaStudioPage title="Widget rules" description="Widget visibility per experience profile.">
      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No widget rules yet.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((w) => (
            <li key={w.id} className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04]">
              <p className="text-sm font-medium text-white">
                {w.widgetKey} · {w.profile.personaKey}
              </p>
              <p className="text-xs text-slate-500">
                {w.profile.tenant?.slug ? `/${w.profile.tenant.slug}` : "—"} · {w.profile.name}
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
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
