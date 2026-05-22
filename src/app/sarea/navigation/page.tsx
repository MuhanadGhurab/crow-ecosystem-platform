import { SareaStudioPage } from "@/components/studio/sarea/sarea-studio-page";
import { listNavigationProfiles } from "@/lib/services/sarea.service";

export default async function SareaNavigationPage() {
  const profiles = await listNavigationProfiles();

  return (
    <SareaStudioPage
      title="Navigation profiles"
      description="Primary navigation config per experience profile (read-only for now)."
    >
      {profiles.length === 0 ? (
        <p className="text-sm text-slate-500">No navigation profiles yet.</p>
      ) : (
        <ul className="space-y-3">
          {profiles.map((n) => (
            <li
              key={n.id}
              className="rounded-cc border border-cyan-500/10 bg-white/5 p-4 text-sm"
            >
              <p className="font-medium text-white">{n.profile.name}</p>
              <p className="text-xs text-slate-500">
                {n.profile.tenant?.slug ? `/${n.profile.tenant.slug}` : "—"} · {n.profile.personaKey}
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-black/30 p-2 text-xs text-slate-400">
                {JSON.stringify(n.configJson, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </SareaStudioPage>
  );
}
