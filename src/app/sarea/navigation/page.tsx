import Link from "next/link";
import { SareaEditRow } from "@/components/studio/sarea/sarea-edit-row";
import { SareaRbacBanner } from "@/components/studio/sarea/sarea-rbac-banner";
import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { updateNavigationKeysAction } from "@/lib/actions/sarea";
import { SAREA_NAV_KEYS } from "@/lib/constants/sarea-runtime";
import { routes } from "@/lib/routes";
import { listNavigationProfiles } from "@/lib/services/sarea.service";

export default async function SareaNavigationPage() {
  const profiles = await listNavigationProfiles();

  return (
    <SareaStudioPage
      title="Navigation profiles"
      description="Primary navigation keys per persona — experience-level visibility; RBAC still enforces routes."
    >
      <SareaRbacBanner compact />
      <p className="text-xs text-slate-500">
        Navigation items shown here control which links appear in the shell for a mapped role.
        Users only reach modules their RBAC role allows. Valid SAREA keys:{" "}
        {SAREA_NAV_KEYS.join(", ")}. ERP modules are merged at runtime.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No navigation profiles yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {profiles.map((n) => {
            const primary = (
              (n.configJson as { primary?: string[] } | null)?.primary ?? []
            ).join(", ");
            const deviceNote = (n.configJson as { device?: string } | null)?.device;
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
                <dl className="mt-2 grid gap-1 text-xs">
                  <div>
                    <dt className="text-slate-600">Primary nav keys</dt>
                    <dd className="font-mono text-slate-400">{primary || "—"}</dd>
                  </div>
                  {deviceNote ? (
                    <div>
                      <dt className="text-slate-600">Device note</dt>
                      <dd className="text-slate-400">{String(deviceNote)}</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-3">
                  <SareaEditRow
                    id={n.id}
                    action={updateNavigationKeysAction}
                    fields={[
                      {
                        name: "primaryKeys",
                        label: "Primary nav keys (comma-separated)",
                        defaultValue: primary,
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
