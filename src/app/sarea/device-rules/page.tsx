import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateDeviceCompactAction, updateDeviceRuleAction } from "@/lib/actions/sarea";
import { listDeviceExperienceRules } from "@/lib/services/sarea.service";

export default async function SareaDeviceRulesPage() {
  const rules = await listDeviceExperienceRules();

  return (
    <SareaStudioPage title="Device rules" description="Mobile vs desktop experience rules.">
      <section className="rounded-lg border border-amber-500/15 bg-amber-950/15 px-4 py-3 text-xs text-slate-400">
        Advisory device breakpoints: desktop (full nav), tablet (reduced columns), mobile (compact
        flag). Runtime honors compact JSON when present; responsive CSS is not fully enforced in this
        phase — use preview on a narrow viewport to validate.
      </section>

      {rules.length === 0 ? (
        <p className="text-sm text-slate-500">
          No device rules yet. Add rules per profile for desktop, tablet, or mobile density.
        </p>
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
