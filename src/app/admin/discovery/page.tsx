import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { AdminListPage } from "@/components/ui/admin-list-page";
import { ListCard } from "@/components/ui/list-card";
import {
  discoveryProgressPercent,
  getDiscoveryStepCompletion,
} from "@/lib/discovery-progress";
import { routes } from "@/lib/routes";
import {
  listActiveDiscoveryRequests,
  type ActiveDiscoveryRequestListItem,
} from "@/lib/services/implementation-request.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

function discoveryPercentForRequest(r: ActiveDiscoveryRequestListItem): number | null {
  const profile = r.discoveryProfile;
  if (!profile) return null;
  const completion = getDiscoveryStepCompletion({
    answers: profile.answers,
    departments: profile.departments,
    branches: profile.branches,
    roles: profile.roles,
    workflows: profile.workflows,
    securityRequirements: profile.securityRequirements,
  });
  return discoveryProgressPercent(completion);
}

export default async function AdminDiscoveryPage() {
  const requests = await listActiveDiscoveryRequests();

  return (
    <AdminListPage
      badge="Discovery"
      title="Active discovery"
      description="Requests in discovery or blueprint build — open the workspace to continue."
      isEmpty={requests.length === 0}
      emptyTitle="Nothing in discovery"
      emptyDescription="Start discovery from a pending request in the queue."
    >
      {requests.map((r: ActiveDiscoveryRequestListItem) => {
        const pct = discoveryPercentForRequest(r);
        return (
          <ListCard key={r.id}>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{r.organizationName}</p>
              <p className="font-mono text-xs text-slate-500">{r.referenceCode}</p>
              {r.discoveryProfile && (
                <p className="mt-1 text-xs text-slate-500">Profile: {r.discoveryProfile.status}</p>
              )}
              {pct !== null && (
                <div className="mt-3 max-w-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Discovery essentials</span>
                    <span>{pct}%</span>
                  </div>
                  <div
                    className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-cyan-500/70 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RequestStatusBadge status={r.status as ImplementationRequestStatus} />
              {r.status === "UNDER_DISCOVERY" && (
                <Link
                  href={routes.discovery(r.id).organization}
                  className="cc-btn-primary text-sm"
                >
                  Workspace →
                </Link>
              )}
              {r.status === "BLUEPRINT_BUILD" && r.enterpriseBlueprint && (
                <Link
                  href={routes.blueprint(r.enterpriseBlueprint.id).overview}
                  className="cc-btn-primary text-sm"
                >
                  Blueprint →
                </Link>
              )}
              <Link
                href={routes.admin.request(r.id)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Detail
              </Link>
            </div>
          </ListCard>
        );
      })}
    </AdminListPage>
  );
}
