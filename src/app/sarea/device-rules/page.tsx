import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateDeviceCompactAction, updateDeviceRuleAction } from "@/lib/actions/sarea";
import { routes } from "@/lib/routes";
import { listDeviceExperienceRules } from "@/lib/services/sarea.service";

export default async function SareaDeviceRulesPage() {
  const rules = await listDeviceExperienceRules();

  return (
    <SareaStudioPage
      title="Device rules"
      description="Advisory desktop, tablet, and mobile presentation — not a full responsive engine."
    >
      <SareaRbacBanner compact />
      <section className="rounded-lg border border-amber-500/15 bg-amber-950/15 px-4 py-3 text-xs text-slate-400">
        <p className="font-medium text-amber-200">Advisory only (F14)</p>
        <p className="mt-1">
          Rules describe intended density: desktop (full nav), tablet (reduced columns), mobile /
          frontline (compact flag). Runtime honors compact JSON when present; full responsive CSS is
          not enforced in this phase — validate with preview on a narrow viewport.
        </p>
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
            const touch = (r.rulesJson as { touchTargets?: string } | null)?.touchTargets;
            return (
              <li key={r.id} className="rounded-cc border border-cyan-500/10 bg-white/5 p-4">
                <p className="text-sm text-white">{r.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {r.profile.tenant?.slug ? `/${r.profile.tenant.slug}` : "—"} ·{" "}
                  {r.profile.personaKey}
                </p>
                <dl className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-600">Device type</dt>
                    <dd className="text-slate-300">{r.deviceType}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Compact UI</dt>
                    <dd className="text-slate-300">{compact ? "Yes" : "No"}</dd>
                  </div>
                  {touch ? (
                    <div className="sm:col-span-2">
                      <dt className="text-slate-600">Touch targets</dt>
                      <dd className="text-slate-300">{touch}</dd>
                    </div>
                  ) : null}
                </dl>
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
                <Link href={routes.sarea.preview} className="mt-2 inline-block text-xs text-cyan-300">
                  Preview →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SareaStudioPage>
  );
}
