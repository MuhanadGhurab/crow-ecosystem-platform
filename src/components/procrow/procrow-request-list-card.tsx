import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { industryLabel, planLabel } from "@/lib/catalog-labels";
import { formatSar } from "@/lib/services/commercial.service";
import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";
import { routes } from "@/lib/routes";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type ProCrowRequestListRow = {
  id: string;
  organizationName: string;
  referenceCode: string;
  status: ImplementationRequestStatus;
  planKey?: string;
  industry?: string | null;
  estimatedMonthlySar?: number | null;
  hasSecurity: boolean;
  hasModules: boolean;
  showSarea: boolean;
};

export function ProCrowRequestListCard({ row }: { row: ProCrowRequestListRow }) {
  const stage = requestStatusToOperatorQueueHint(row.status);

  return (
    <article className="cc-glass-card flex flex-col gap-4 !p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-white">{row.organizationName}</p>
          <span className="font-mono text-[10px] text-slate-600">{row.referenceCode}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {row.industry != null && (
            <span>
              Industry: <span className="text-violet-300">{industryLabel(row.industry)}</span>
            </span>
          )}
          {row.planKey && (
            <span>
              Plan: <span className="text-cyan-300">{planLabel(row.planKey)}</span>
            </span>
          )}
        </div>
        <DeptChips hasSecurity={row.hasSecurity} hasModules={row.hasModules} showSarea={row.showSarea} />
        <p className="text-xs text-slate-500">
          Stage: <span className="text-cyan-300/90">{stage}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <RequestStatusBadge status={row.status} />
        {row.estimatedMonthlySar != null && (
          <p className="text-right font-display text-sm font-semibold tabular-nums text-teal-300">
            {formatSar(row.estimatedMonthlySar)}
            <span className="text-xs font-normal text-slate-500"> /mo est.</span>
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href={routes.admin.queue} className="text-xs text-slate-500 hover:text-cyan-300">
            Queue
          </Link>
          <Link href={routes.admin.request(row.id)} className="cc-btn-primary !px-3 !py-1.5 text-sm">
            Workspace →
          </Link>
        </div>
      </div>
    </article>
  );
}
