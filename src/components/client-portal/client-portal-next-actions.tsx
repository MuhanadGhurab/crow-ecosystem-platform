import type { ClientPortalDashboardSnapshot } from "@/lib/client-portal/client-portal-contract";

export function ClientPortalNextActions({ snapshot }: { snapshot: ClientPortalDashboardSnapshot }) {
  if (snapshot.nextActions.length === 0) return null;

  return (
    <section className="cc-glass-card border-cyan-500/20 bg-cyan-500/5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
        Next steps
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {snapshot.nextActions.map((action) => (
          <li key={action} className="flex gap-2">
            <span className="text-cyan-400" aria-hidden>
              →
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
