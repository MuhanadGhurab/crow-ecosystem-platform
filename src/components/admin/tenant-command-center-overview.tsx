import Link from "next/link";
import {
  TENANT_COMMAND_CENTER_NEXT_ACTIONS,
  TENANT_WORKFORCE_SECTION_ID,
} from "@/lib/constants/tenant-command-center";
import { routes } from "@/lib/routes";

type TenantCommandCenterOverviewProps = {
  tenantId: string;
  tenantSlug: string;
  healthLabel: string;
  runtimeReady: boolean;
  workforcePendingCount: number;
  workforceAcceptedCount: number;
  portalAccessLabel: string;
  activeMembershipCount: number;
};

export function TenantCommandCenterOverview({
  tenantId,
  tenantSlug,
  healthLabel,
  runtimeReady,
  workforcePendingCount,
  workforceAcceptedCount,
  portalAccessLabel,
  activeMembershipCount,
}: TenantCommandCenterOverviewProps) {
  const base = routes.admin.tenant(tenantId);
  const workforceHref = `${base}?tab=workforce#${TENANT_WORKFORCE_SECTION_ID}`;

  const actionHrefs: Record<string, string> = {
    "create-invite": workforceHref,
    "confirm-acceptance": `${base}?tab=workforce#${TENANT_WORKFORCE_SECTION_ID}`,
    "open-portal": routes.tenant(tenantSlug).dashboard,
    "go-no-go": routes.admin.goNoGo,
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4">
          <p className="text-xs text-slate-500">Tenant health</p>
          <p className="mt-1 text-sm font-medium text-white">{healthLabel}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4">
          <p className="text-xs text-slate-500">Runtime readiness</p>
          <p className="mt-1 text-sm font-medium text-white">
            {runtimeReady ? "Prepared for operations" : "Needs preparation"}
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/25 bg-cyan-950/15 p-4">
          <p className="text-xs text-cyan-300/80">Workforce activation</p>
          <p className="mt-1 text-sm font-medium text-cyan-100">
            {workforcePendingCount} pending · {workforceAcceptedCount} accepted
          </p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4">
          <p className="text-xs text-slate-500">Business Portal access</p>
          <p className="mt-1 text-sm font-medium text-white">{portalAccessLabel}</p>
          <p className="mt-1 text-xs text-slate-500">{activeMembershipCount} active memberships</p>
        </div>
      </section>

      <section className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-5">
        <h2 className="text-sm font-semibold text-cyan-100">Recommended next actions</h2>
        <p className="mt-1 text-xs text-slate-500">
          Start with workforce activation, then confirm acceptance and open the Business Portal.
        </p>
        <ul className="mt-4 space-y-3">
          {TENANT_COMMAND_CENTER_NEXT_ACTIONS.map((action) => (
            <li
              key={action.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-700/40 bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
              <Link
                href={actionHrefs[action.id] ?? workforceHref}
                className={action.primary ? "cc-btn-primary text-sm shrink-0" : "cc-btn-secondary text-sm shrink-0"}
              >
                {action.primary ? "Create invite" : "Go"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
