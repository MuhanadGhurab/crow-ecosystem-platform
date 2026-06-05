import Link from "next/link";
import type {
  CemWorkflowLinkType,
  CemWorkflowPersistenceLink,
  CemWorkflowPersistenceSnapshot,
} from "@/lib/cem/cem-workflow-persistence-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: CemWorkflowPersistenceSnapshot;
  requestId?: string;
};

const LINK_LABEL: Record<CemWorkflowLinkType, string> = {
  purchase_request_to_workflow: "Purchase request → workflow",
  workflow_to_stage: "Workflow → stages",
  stage_to_task: "Stage → task",
  stage_to_approval: "Stage → finance approval",
  stage_to_receiving: "Warehouse receiving marker",
  receiving_to_inventory_visibility: "Inventory visibility marker",
  workflow_to_report: "Workflow → report output",
  workflow_to_cybercrow_evidence: "CyberCrow evidence hook",
  workflow_to_sarea_experience: "SAREA role experience",
};

const STATUS_STYLE: Record<CemWorkflowPersistenceLink["status"], string> = {
  linked: "border-teal-500/30 bg-teal-500/5 text-teal-200",
  inferred: "border-amber-500/30 bg-amber-500/5 text-amber-200",
  missing: "border-rose-500/30 bg-rose-500/5 text-rose-200",
  proposed: "border-slate-500/30 bg-slate-500/5 text-slate-300",
};

function linkHref(
  tenantSlug: string,
  link: CemWorkflowPersistenceLink,
  requestId?: string
): string | null {
  const r = routes.tenant(tenantSlug);
  switch (link.linkType) {
    case "purchase_request_to_workflow":
      return requestId
        ? `${r.purchaseToStockWorkflow}?requestId=${encodeURIComponent(requestId)}`
        : r.purchaseToStockWorkflow;
    case "stage_to_task":
      return link.targetId ? `${r.tasks}` : null;
    case "stage_to_approval":
      return r.finance;
    case "workflow_to_report":
      return r.reports;
    case "workflow_to_cybercrow_evidence":
      return r.cybercrow.dashboard;
    default:
      return null;
  }
}

export function CemWorkflowPersistencePanel({ snapshot, requestId }: Props) {
  return (
    <section className="cc-glass-card border-violet-500/15 p-4 sm:p-6 space-y-4">
      <div>
        <h2 className="font-display text-base font-semibold text-white">Persistence status</h2>
        <p className="mt-1 text-xs text-slate-500">
          Tenant-backed links use existing schema and report lineage metadata. Inferred or missing
          relationships are advisory until persistence hardening completes.
        </p>
      </div>
      <ul className="space-y-2">
        {snapshot.links.map((link) => {
          const href = linkHref(snapshot.tenantSlug, link, requestId);
          const advisory =
            link.status === "inferred" || link.status === "missing" || link.status === "proposed";
          return (
            <li
              key={link.linkType}
              className={`rounded-lg border p-3 text-sm ${STATUS_STYLE[link.status]}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{LINK_LABEL[link.linkType]}</p>
                <span className="text-xs capitalize">{link.status}</span>
              </div>
              <p className="mt-1 text-xs opacity-80">{link.notes}</p>
              {advisory && link.status !== "linked" && (
                <p className="mt-2 text-xs text-slate-400">
                  This relationship is currently advisory and will require persistence hardening
                  {link.status === "missing" ? " before it is tenant-backed." : "."}
                </p>
              )}
              {href && link.status === "linked" && (
                <Link href={href} className="mt-2 inline-block text-xs underline opacity-90">
                  Open related surface →
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
