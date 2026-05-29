import Link from "next/link";
import { RequestStatusFilters } from "@/components/admin/request-status-filters";
import { ProCrowRequestListCard, type ProCrowRequestListRow } from "@/components/procrow/procrow-request-list-card";
import { ProCrowWorkbenchPageHeader } from "@/components/procrow/procrow-workbench-page-header";
import { ProCrowContextLinkGrid } from "@/components/procrow/procrow-context-link-grid";
import { formatSar } from "@/lib/services/commercial.service";
import { getRequestDeptContextFromRow } from "@/lib/pipeline/request-dept-context";
import { listImplementationRequests } from "@/lib/services/implementation-request.service";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import { routes } from "@/lib/routes";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

const FILTER_STATUSES = ["PENDING_REVIEW", "UNDER_DISCOVERY", "BLUEPRINT_BUILD"] as const;

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  let requests: ProCrowRequestListRow[] = [];
  let usingMock = isUseMockData();

  if (usingMock) {
    requests = MOCK_PIPELINE_REQUESTS.map((m) => ({
      id: m.id,
      organizationName: m.organizationName,
      referenceCode: m.referenceCode,
      status: m.status as ImplementationRequestStatus,
      planKey: m.planKey,
      industry: "industry" in m ? (m as { industry?: string | null }).industry : null,
      estimatedMonthlySar: m.estimatedMonthlySar,
      ...getRequestDeptContextFromRow({
        status: m.status,
        requestedSecurityPkgs: m.hasSecurity ? [1] : [],
        requestedModules: m.hasModules ? [1] : [],
        discoveryProfile:
          m.status === "BLUEPRINT_BUILD"
            ? { answers: [{ sectionKey: "experience", questionKey: "sareaPackageKey", valueJson: "professional" }] }
            : null,
      }),
    }));
  }

  try {
    if (usingMock) throw new Error("USE_MOCK_DATA");
    const rows = await listImplementationRequests();
    requests = rows.map((r) => {
      const dept = getRequestDeptContextFromRow(r);
      return {
        id: r.id,
        organizationName: r.organizationName,
        referenceCode: r.referenceCode,
        status: r.status,
        planKey: r.requestedPlans[0]?.planKey,
        industry: r.industry,
        estimatedMonthlySar: r.estimatedMonthlySar ? Number(r.estimatedMonthlySar) : null,
        ...dept,
      };
    });
  } catch {
    usingMock = true;
    requests = MOCK_PIPELINE_REQUESTS.map((m) => ({
      id: m.id,
      organizationName: m.organizationName,
      referenceCode: m.referenceCode,
      status: m.status as ImplementationRequestStatus,
      planKey: m.planKey,
      industry: "industry" in m ? (m as { industry?: string | null }).industry : null,
      estimatedMonthlySar: m.estimatedMonthlySar,
      ...getRequestDeptContextFromRow({
        status: m.status,
        requestedSecurityPkgs: m.hasSecurity ? [1] : [],
        requestedModules: m.hasModules ? [1] : [],
        discoveryProfile:
          m.status === "BLUEPRINT_BUILD"
            ? { answers: [{ sectionKey: "experience", questionKey: "sareaPackageKey", valueJson: "professional" }] }
            : null,
      }),
    }));
  }

  if (
    statusFilter &&
    FILTER_STATUSES.includes(statusFilter as (typeof FILTER_STATUSES)[number])
  ) {
    requests = requests.filter((r) => r.status === statusFilter);
  }

  const pipelineValue = requests.reduce((sum, r) => sum + (r.estimatedMonthlySar ?? 0), 0);

  return (
    <div className="space-y-6">
      <ProCrowWorkbenchPageHeader
        eyebrow="ProCrow · Request workspace"
        title="Implementation requests"
        purpose="One row per company — stage, client posture, and next ProCrow action. Open a workspace for full context."
        statusChip={`${requests.length} in list`}
        backHref={routes.admin.queue}
        backLabel="← Operator queue"
      />

      <ProCrowContextLinkGrid
        links={[
          { label: "Operator queue", href: routes.admin.queue, description: "Daily priorities" },
          { label: "Control tower", href: routes.admin.overview, description: "Platform snapshot" },
          { label: "Go / No-Go", href: routes.admin.goNoGo, description: "Release discipline" },
        ]}
      />

      {usingMock && (
        <p className="rounded-cc-sm border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          Demo list — connect DATABASE_URL for live requests.
        </p>
      )}

      {requests.length > 0 && pipelineValue > 0 && (
        <p className="text-xs text-slate-500">
          Combined monthly estimate (visible rows):{" "}
          <span className="font-mono text-teal-300">{formatSar(pipelineValue)}</span>
        </p>
      )}

      <RequestStatusFilters active={statusFilter} />

      {requests.length === 0 ? (
        <div className="cc-glass-card py-12 text-center">
          <p className="text-slate-400">No requests yet</p>
          <Link href={routes.public.request} className="cc-btn-secondary mt-4 inline-block text-sm">
            Public request entry →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <ProCrowRequestListCard row={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
