import Link from "next/link";
import { MEEM_LOGISTICS_FEATURES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";

type MeemDashboardHintsProps = {
  slug: string;
  aiExtraKeys: string[];
  workflowCount: number;
  openTaskCount: number;
};

export function MeemDashboardHints({
  slug,
  aiExtraKeys,
  workflowCount,
  openTaskCount,
}: MeemDashboardHintsProps) {
  const r = routes.tenant(slug);
  const enabled = new Set(aiExtraKeys);
  const activeAi = MEEM_LOGISTICS_FEATURES.filter((f) => enabled.has(f.aiExtraKey));

  return (
    <section className="cc-glass-card border-teal-500/15">
      <h3 className="text-sm font-medium text-teal-300">Logistics · OCR & AI</h3>
      <p className="mt-1 text-xs text-slate-500">
        {workflowCount} workflow{workflowCount === 1 ? "" : "s"} · {openTaskCount} open task
        {openTaskCount === 1 ? "" : "s"} · {activeAi.length}/{MEEM_LOGISTICS_FEATURES.length} AI
        extras active
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {activeAi.length > 0 ? (
          activeAi.map((f) => (
            <li
              key={f.key}
              className="rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs text-teal-300"
            >
              {f.title}
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-500">Run db:seed:meem:ops for AI extras</li>
        )}
      </ul>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={r.logistics} className="cc-btn-secondary text-sm">
          Logistics hub
        </Link>
        <Link href={r.workflows} className="text-sm text-teal-400 hover:text-teal-300">
          Workflows →
        </Link>
      </div>
    </section>
  );
}
