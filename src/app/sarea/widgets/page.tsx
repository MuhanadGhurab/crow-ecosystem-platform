import Link from "next/link";
import { SareaExperienceBoundaryNote } from "@/components/sarea/sarea-experience-boundary-note";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateWidgetVisibilityAction } from "@/lib/actions/sarea";
import { routes } from "@/lib/routes";
import { widgetLabel, widgetSourceArea } from "@/lib/sarea/studio-helpers";
import { listWidgetRules } from "@/lib/services/sarea.service";
import { SareaBlueprintExperienceSummary } from "@/components/sarea/sarea-blueprint-experience-summary";
import { buildSareaExperienceMappingStudioSnapshot } from "@/lib/sarea/sarea-experience-studio-loader";

export const dynamic = "force-dynamic";

const VISIBILITY = ["visible", "hidden", "optional"];

export default async function SareaWidgetsPage() {
  const [rules, mapping] = await Promise.all([
    listWidgetRules(),
    buildSareaExperienceMappingStudioSnapshot(),
  ]);

  return (
    <SareaStudioPage
      area="widgets"
      title="Widget rules"
      description="Widget visibility per experience profile — does not change RBAC or module access."
      operatorActions={[
        {
          action: "preview_experience",
          href: routes.sarea.preview,
          detail: "See dashboard density for a persona",
        },
        {
          action: "review_profiles",
          href: routes.sarea.profiles,
          detail: "Widget rules attach to experience profiles",
        },
        {
          action: "compare_rbac_boundary",
          href: routes.sarea.overview,
          detail: "Hidden widgets do not remove module authorization",
        },
      ]}
    >
      <SareaExperienceBoundaryNote variant="widgets" />
      {mapping && <SareaBlueprintExperienceSummary snapshot={mapping} area="widgets" compact />}
      <SareaRbacBanner compact />
      <section className="rounded-lg border border-rose-500/10 bg-rose-950/10 px-4 py-3 text-xs text-slate-400">
        <p>
          Toggle visibility for dashboard blocks (CEM, CyberCrow, operations). Display order is not
          stored in the current schema — not a drag-and-drop page builder.
        </p>
      </section>

      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No widget rules yet — provision a tenant to seed defaults.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((w) => {
            const area = widgetSourceArea(w.widgetKey);
            const label = widgetLabel(w.widgetKey);
            const previewSlug = w.profile.tenant?.slug;
            return (
              <li key={w.id} className="cc-list-item !border-rose-500/15 !bg-rose-500/[0.04]">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="font-mono text-[10px] text-slate-600">{w.widgetKey}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {previewSlug ? `/${previewSlug}` : "—"} · {w.profile.personaKey} ·{" "}
                      {w.profile.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-950/20 px-2 py-0.5 text-[10px] text-cyan-300">
                      {area}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                      {w.visibility}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  Persona {w.profile.personaKey} · Safe edit: visibility only · Hidden widgets do not
                  grant module access.
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
                <div className="mt-2 flex flex-wrap gap-3">
                  {previewSlug ? (
                    <Link
                      href={`/api/sarea/preview?persona=${w.profile.personaKey}&redirect=${routes.tenant(previewSlug).dashboard}`}
                      className="text-xs text-cyan-300"
                    >
                      Preview →
                    </Link>
                  ) : null}
                  <Link href={routes.sarea.profiles} className="text-xs text-rose-300">
                    Profile →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
