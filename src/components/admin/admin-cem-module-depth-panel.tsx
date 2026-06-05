import type { CemModuleDepthSummaryItem } from "@/lib/cem/cem-module-depth-contract";
import { CEM_MODULE_DEPTH_RELATIONSHIP_COPY } from "@/lib/cem/cem-module-depth-contract";

const STATUS_CLASS: Record<CemModuleDepthSummaryItem["status"], string> = {
  not_available: "text-slate-500",
  thin: "text-slate-400",
  demo_ready: "text-amber-300",
  operational_model_ready: "text-teal-300",
  needs_data: "text-amber-300",
  needs_review: "text-rose-300",
};

type Props = {
  items: CemModuleDepthSummaryItem[];
};

export function AdminCemModuleDepthPanel({ items }: Props) {
  const thinCount = items.filter((i) => i.status === "thin" || i.status === "needs_data").length;

  return (
    <section className="rounded-xl border border-violet-500/25 bg-violet-950/15 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-violet-100">CEM module depth (M3.2)</h3>
      <p className="text-xs text-slate-500">{CEM_MODULE_DEPTH_RELATIONSHIP_COPY}</p>
      {thinCount > 0 && (
        <p className="text-xs text-amber-300/90">
          {thinCount} module(s) need more tenant data or review — advisory only; ProCrow Go/No-Go
          still required.
        </p>
      )}
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        {items.map((item) => (
          <li
            key={item.moduleKey}
            className="flex justify-between gap-2 rounded border border-slate-700/40 px-2 py-1.5"
          >
            <span className="text-slate-300">{item.moduleLabel}</span>
            <span className={STATUS_CLASS[item.status]}>
              {item.status.replace(/_/g, " ")} · {item.recordCount} rec · {item.flowCount} flows
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-slate-600">
        Staging module depth — not production ERP. Run npm run cem-module-depth:verify after M3.2
        changes.
      </p>
    </section>
  );
}
