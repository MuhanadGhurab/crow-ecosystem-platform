import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateNavigationKeysAction } from "@/lib/actions/sarea";
import { SAREA_NAV_KEYS } from "@/lib/constants/sarea-runtime";
import { listNavigationProfiles } from "@/lib/services/sarea.service";

export default async function SareaNavigationPage() {
  const profiles = await listNavigationProfiles();

  return (
    <SareaStudioPage
      title="Navigation profiles"
      description="Primary navigation keys per experience profile — comma-separated SAREA nav keys."
    >
      <p className="text-xs text-slate-500">
        Valid keys: {SAREA_NAV_KEYS.join(", ")}. ERP module links are merged at runtime.
      </p>
      {profiles.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No navigation profiles yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {profiles.map((n) => {
            const primary = (
              (n.configJson as { primary?: string[] } | null)?.primary ?? []
            ).join(", ");
            return (
              <li
                key={n.id}
                className="rounded-cc border border-cyan-500/10 bg-white/5 p-4 text-sm"
              >
                <p className="font-medium text-white">{n.profile.name}</p>
                <p className="text-xs text-slate-500">
                  {n.profile.tenant?.slug ? `/${n.profile.tenant.slug}` : "—"} ·{" "}
                  {n.profile.personaKey}
                </p>
                <div className="mt-3">
                  <SareaEditRow
                    id={n.id}
                    action={updateNavigationKeysAction}
                    fields={[
                      {
                        name: "primaryKeys",
                        label: "Primary nav keys",
                        defaultValue: primary,
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
