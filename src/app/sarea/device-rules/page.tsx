import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateDeviceCompactAction, updateDeviceRuleAction } from "@/lib/actions/sarea";
import { listDeviceExperienceRules } from "@/lib/services/sarea.service";

export default async function SareaDeviceRulesPage() {
  const rules = await listDeviceExperienceRules();

  return (
    <SareaStudioPage title="Device rules" description="Mobile vs desktop experience rules.">
      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">No device rules yet.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((r) => {
            const compact = Boolean(
              (r.rulesJson as { compact?: boolean } | null)?.compact
            );
            return (
              <li key={r.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
                <p className="text-sm text-white">{r.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {r.profile.tenant?.slug ? `/${r.profile.tenant.slug}` : "—"} ·{" "}
                  {r.profile.personaKey}
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  <SareaEditRow
                    id={r.id}
                    action={updateDeviceRuleAction}
                    fields={[
                      { name: "deviceType", label: "Device", defaultValue: r.deviceType },
                    ]}
                  />
                  <SareaEditRow
                    id={r.id}
                    action={updateDeviceCompactAction}
                    fields={[
                      {
                        name: "compact",
                        label: "Compact UI",
                        defaultValue: compact ? "true" : "false",
                        type: "select",
                        options: ["true", "false"],
                      },
                    ]}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
