import Link from "next/link";
import type { ClientPortalDashboardSnapshot } from "@/lib/client-portal/client-portal-contract";
import { routes } from "@/lib/routes";

export function ClientNextActionPanel({ snapshot }: { snapshot: ClientPortalDashboardSnapshot }) {
  const primary = snapshot.nextActions[0];
  if (!primary) return null;

  const href =
    snapshot.requests.length > 0
      ? routes.client.request(snapshot.requests[0]!.requestId)
      : routes.client.profile;

  return (
    <div className="cc-glass-card flex flex-wrap items-center justify-between gap-4 border-teal-500/25 !p-4 sm:!p-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Your next step</p>
        <p className="mt-1 font-medium text-white">{primary}</p>
        {snapshot.nextActions.length > 1 && (
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            {snapshot.nextActions.slice(1, 3).map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        )}
      </div>
      <Link href={href} className="cc-btn-primary shrink-0 text-sm">
        Continue →
      </Link>
    </div>
  );
}
