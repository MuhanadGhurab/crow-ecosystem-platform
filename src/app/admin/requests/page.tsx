import Link from "next/link";
import { RequestStatusFilters } from "@/components/admin/request-status-filters";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { AdminListPage } from "@/components/ui/admin-list-page";
import { ListCard } from "@/components/ui/list-card";
import { planLabel } from "@/lib/catalog-labels";
import { formatSar } from "@/lib/services/commercial.service";
import { listImplementationRequests } from "@/lib/services/implementation-request.service";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

type RequestRow = {
  id: string;
  organizationName: string;
  referenceCode: string;
  status: string;
  planKey?: string;
  estimatedMonthlySar?: number | null;
  hasSecurity?: boolean;
  hasModules?: boolean;
};

const FILTER_STATUSES = ["PENDING_REVIEW", "UNDER_DISCOVERY", "BLUEPRINT_BUILD"] as const;

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  let requests: RequestRow[] = [];
  let usingMock = isUseMockData();

  if (usingMock) {
    requests = MOCK_PIPELINE_REQUESTS.map((m) => ({ ...m }));
  }

  try {
    if (usingMock) throw new Error("USE_MOCK_DATA");
    const rows = await listImplementationRequests();
    requests = rows.map((r) => ({
      id: r.id,
      organizationName: r.organizationName,
      referenceCode: r.referenceCode,
      status: r.status,
      planKey: r.requestedPlans[0]?.planKey,
      estimatedMonthlySar: r.estimatedMonthlySar ? Number(r.estimatedMonthlySar) : null,
      hasSecurity: r.requestedSecurityPkgs.length > 0,
      hasModules: r.requestedModules.length > 0,
    }));
  } catch {
    usingMock = true;
    requests = MOCK_PIPELINE_REQUESTS.map((m) => ({ ...m }));
  }

  if (
    statusFilter &&
    FILTER_STATUSES.includes(statusFilter as (typeof FILTER_STATUSES)[number])
  ) {
    requests = requests.filter((r) => r.status === statusFilter);
  }

  return (
    <AdminListPage
      title="Implementation requests"
      description="Commercial pipeline queue — review, assign dept ownership, and advance to discovery."
      isEmpty={requests.length === 0}
      emptyTitle="No requests yet"
      emptyAction={
        <Link href="/request" className="cc-btn-secondary text-sm">
          Open public request form →
        </Link>
      }
    >
      {usingMock && (
        <p className="mb-4 rounded-cc-sm border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          Demo queue — database unavailable. Connect DATABASE_URL to load live requests.
        </p>
      )}

      <RequestStatusFilters active={statusFilter} />

      {requests.map((r) => (
        <ListCard key={r.id} className="cc-pipeline-card">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-medium text-white">{r.organizationName}</p>
            <p className="font-mono text-xs text-slate-500">{r.referenceCode}</p>
            <DeptChips
              hasSecurity={r.hasSecurity ?? true}
              hasModules={r.hasModules ?? true}
              showSarea={r.status === "UNDER_DISCOVERY" || r.status === "BLUEPRINT_BUILD"}
            />
            {r.planKey && (
              <p className="text-xs text-slate-500">
                Plan: <span className="text-cyan-300">{planLabel(r.planKey)}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
            <RequestStatusBadge status={r.status as ImplementationRequestStatus} />
            {r.estimatedMonthlySar != null && (
              <p className="font-display text-sm font-semibold tabular-nums text-teal-300">
                {formatSar(r.estimatedMonthlySar)}
                <span className="text-xs font-normal text-slate-500"> /mo</span>
              </p>
            )}
            <Link
              href={`/admin/requests/${r.id}`}
              className="cc-btn-secondary !px-3 !py-1.5 text-sm"
            >
              Review →
            </Link>
          </div>
        </ListCard>
      ))}
    </AdminListPage>
  );
}
