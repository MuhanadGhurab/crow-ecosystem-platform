import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateAdaptiveRuleAction } from "@/lib/actions/sarea";
import { listAdaptiveUiRules } from "@/lib/services/sarea.service";

export default async function SareaRulesPage() {
  const rules = await listAdaptiveUiRules();

  return (
    <SareaStudioPage title="Adaptive UI rules" description="Density and adaptive behavior rules.">
      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No adaptive rules yet.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((r) => (
            <li key={r.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
              <p className="text-sm text-white">{r.profile.name}</p>
              <p className="text-xs text-slate-500">
                {r.profile.tenant?.slug ? `/${r.profile.tenant.slug}` : "—"} ·{" "}
                {JSON.stringify(r.configJson)}
              </p>
              <div className="mt-3">
                <SareaEditRow
                  id={r.id}
                  action={updateAdaptiveRuleAction}
                  fields={[{ name: "ruleKey", label: "Rule key", defaultValue: r.ruleKey }]}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
