import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateDensityLevelAction } from "@/lib/actions/sarea";
import { listAdaptiveUiRules } from "@/lib/services/sarea.service";

export default async function SareaRulesPage() {
  const rules = await listAdaptiveUiRules();

  return (
    <SareaStudioPage title="Adaptive UI rules" description="Density and adaptive behavior rules.">
      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No adaptive rules yet.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((r) => {
            const level =
              ((r.configJson as { level?: string } | null)?.level as string) ?? "comfortable";
            return (
              <li key={r.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
                <p className="text-sm text-white">{r.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {r.profile.tenant?.slug ? `/${r.profile.tenant.slug}` : "—"} · {r.ruleKey}
                </p>
                <div className="mt-3">
                  {r.ruleKey === "density" ? (
                    <SareaEditRow
                      id={r.id}
                      action={updateDensityLevelAction}
                      fields={[
                        {
                          name: "level",
                          label: "Density level",
                          defaultValue: level,
                          type: "select",
                          options: ["spacious", "comfortable", "compact"],
                        },
                      ]}
                    />
                  ) : (
                    <p className="text-xs text-slate-500">Rule key: {r.ruleKey}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
