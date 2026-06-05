import Link from "next/link";
import { purchaseToStockWorkflowRoute } from "@/lib/services/cem-transaction-workflow.service";

const MODULE_HINTS: Record<string, { title: string; description: string }> = {
  procurement: {
    title: "Purchase-to-stock · procurement review",
    description: "Department request and procurement review stages for the cross-module workflow.",
  },
  finance: {
    title: "Purchase-to-stock · finance approval",
    description: "Finance approval readiness — not payment execution or ledger posting.",
  },
  warehouse: {
    title: "Purchase-to-stock · warehouse receiving",
    description: "Warehouse receiving step — advisory visibility, not production stock mutation.",
  },
  inventory: {
    title: "Purchase-to-stock · inventory visibility",
    description: "Inventory visibility after receiving — staging workflow prototype.",
  },
  reports: {
    title: "Purchase-to-stock · report output",
    description: "Operational summary of stage, blockers, and evidence readiness.",
  },
  tasks: {
    title: "Purchase-to-stock · related tasks",
    description: "Tasks linked to the purchase-to-stock coordination workflow.",
  },
  workflows: {
    title: "Purchase-to-stock workflow",
    description: "First CEM cross-module transaction workflow prototype.",
  },
};

type Props = {
  slug: string;
  moduleKey: keyof typeof MODULE_HINTS;
};

export function TenantCemPurchaseToStockLink({ slug, moduleKey }: Props) {
  const hint = MODULE_HINTS[moduleKey] ?? MODULE_HINTS.workflows;
  const href = purchaseToStockWorkflowRoute(slug);

  return (
    <section className="cc-glass-card border-cyan-500/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-cyan-400/80">
            Transaction workflow prototype
          </p>
          <h3 className="mt-1 font-display text-sm font-semibold text-white">{hint.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{hint.description}</p>
        </div>
        <Link href={href} className="cc-btn-secondary shrink-0 text-sm">
          Open workflow →
        </Link>
      </div>
    </section>
  );
}
