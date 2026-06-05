import Link from "next/link";
import type { CemTransactionWorkflowSummary } from "@/lib/cem/cem-transaction-workflow-contract";
import { purchaseToStockWorkflowRoute } from "@/lib/services/cem-transaction-workflow.service";
import { routes } from "@/lib/routes";

type Props = {
  tenantSlug: string;
  summary: CemTransactionWorkflowSummary;
};

const PERSISTENCE_LABEL: Record<CemTransactionWorkflowSummary["persistenceMode"], string> = {
  tenant_backed: "Tenant-backed (purchase requests)",
  advisory_only: "Advisory-only (no purchase requests)",
};

export function AdminCemTransactionWorkflowPanel({ tenantSlug, summary }: Props) {
  const workflowHref = purchaseToStockWorkflowRoute(tenantSlug);

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-cyan-100">
        CEM transaction workflow prototype (M3.3)
      </h3>
      <p className="text-xs text-slate-500">
        Purchase-to-stock staging workflow — not supplier payment, accounting posting, or legal PO
        issuance. ProCrow Go/No-Go still required.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div>
          <p className="text-slate-500">Persistence</p>
          <p className="text-slate-200">{PERSISTENCE_LABEL[summary.persistenceMode]}</p>
        </div>
        <div>
          <p className="text-slate-500">Requests</p>
          <p className="text-slate-200">{summary.requestCount}</p>
        </div>
        <div>
          <p className="text-slate-500">Current status</p>
          <p className="text-cyan-200 capitalize">{summary.status.replace(/_/g, " ")}</p>
        </div>
        <div>
          <p className="text-slate-500">Demo flow completed</p>
          <p className={summary.hasCompletedDemoFlow ? "text-teal-300" : "text-amber-300"}>
            {summary.hasCompletedDemoFlow ? "Yes (received stage)" : "No"}
          </p>
        </div>
      </div>
      {summary.activeRequestTitle && (
        <p className="text-xs text-slate-400">
          Active request: <span className="text-white">{summary.activeRequestTitle}</span>
        </p>
      )}
      {summary.warnings.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-amber-300/90 space-y-1">
          {summary.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <Link href={workflowHref} className="text-xs text-cyan-400 hover:text-cyan-300">
          Open purchase-to-stock workflow →
        </Link>
        <Link
          href={routes.tenant(tenantSlug).workflows}
          className="text-xs text-slate-400 hover:text-slate-300"
        >
          Tenant workflows →
        </Link>
      </div>
      <p className="text-[10px] text-slate-600">
        Run npm run cem-transaction:verify after M3.3 changes.
      </p>
    </section>
  );
}
