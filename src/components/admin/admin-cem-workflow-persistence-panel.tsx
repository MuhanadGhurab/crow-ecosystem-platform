import Link from "next/link";
import type { CemWorkflowPersistenceSnapshot } from "@/lib/cem/cem-workflow-persistence-contract";
import { purchaseToStockWorkflowRoute } from "@/lib/services/cem-transaction-workflow.service";

type Props = {
  snapshot: CemWorkflowPersistenceSnapshot;
};

const MODE_LABEL: Record<CemWorkflowPersistenceSnapshot["persistenceMode"], string> = {
  existing_schema: "Existing schema (PATH A)",
  migration_required: "Migration required (M3.4B)",
  advisory_only: "Advisory only",
};

const STATUS_STYLE: Record<string, string> = {
  linked: "text-teal-300",
  inferred: "text-amber-300",
  missing: "text-rose-300",
  proposed: "text-slate-400",
};

export function AdminCemWorkflowPersistencePanel({ snapshot }: Props) {
  const workflowHref = purchaseToStockWorkflowRoute(snapshot.tenantSlug);
  const linked = snapshot.links.filter((l) => l.status === "linked").length;
  const inferred = snapshot.links.filter((l) => l.status === "inferred").length;
  const missing = snapshot.links.filter((l) => l.status === "missing").length;

  return (
    <section className="rounded-xl border border-violet-500/25 bg-violet-950/15 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-violet-100">
        CEM workflow persistence readiness (M3.4)
      </h3>
      <p className="text-xs text-slate-500">
        Transaction lineage for purchase-to-stock using existing tenant tables and report metadata.
        Staging workflow persistence prototype — not production ERP, payments, or accounting posting.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div>
          <p className="text-slate-500">Persistence mode</p>
          <p className="text-slate-200">{MODE_LABEL[snapshot.persistenceMode]}</p>
        </div>
        <div>
          <p className="text-slate-500">Stable links</p>
          <p className="text-teal-300">{linked}</p>
        </div>
        <div>
          <p className="text-slate-500">Inferred links</p>
          <p className="text-amber-300">{inferred}</p>
        </div>
        <div>
          <p className="text-slate-500">Missing links</p>
          <p className="text-rose-300">{missing}</p>
        </div>
      </div>
      {snapshot.audit.migrationProposalRequired ? (
        <p className="text-xs text-amber-200/90 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          Workflow prototype is functional, but stable transaction lineage requires schema approval
          (M3.4B). Does not approve production launch.
        </p>
      ) : (
        <p className="text-xs text-slate-400">{snapshot.audit.recommendedNextAction}</p>
      )}
      <ul className="space-y-1 text-xs">
        {snapshot.links.map((l) => (
          <li key={l.linkType} className="flex flex-wrap gap-2">
            <span className="text-slate-500">{l.linkType.replace(/_/g, " ")}</span>
            <span className={STATUS_STYLE[l.status] ?? "text-slate-400"}>{l.status}</span>
          </li>
        ))}
      </ul>
      {snapshot.warnings.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-amber-300/90 space-y-1">
          {snapshot.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <Link href={workflowHref} className="text-xs text-violet-400 hover:text-violet-300">
          Open purchase-to-stock workflow →
        </Link>
      </div>
      <p className="text-[10px] text-slate-600">
        Run npm run cem-workflow-persistence:verify after M3.4 changes.
      </p>
    </section>
  );
}
