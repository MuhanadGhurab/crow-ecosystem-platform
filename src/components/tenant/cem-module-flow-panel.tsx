import Link from "next/link";
import type {
  CemModuleDepthCrossLink,
  CemModuleDepthTaskRef,
  CemModuleDepthWorkflowRef,
} from "@/lib/cem/cem-module-depth-contract";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
  workflows: CemModuleDepthWorkflowRef[];
  tasks: CemModuleDepthTaskRef[];
  crossModuleLinks: CemModuleDepthCrossLink[];
};

export function CemModuleFlowPanel({ slug, workflows, tasks, crossModuleLinks }: Props) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/10 !py-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Workflows, tasks & cross-module flows
        </h3>
        <div className="flex gap-3 text-xs">
          <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
            Workflows
          </Link>
          <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
            Tasks
          </Link>
        </div>
      </div>

      {crossModuleLinks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Cross-module flows (M3.1)
          </p>
          <ul className="space-y-1.5">
            {crossModuleLinks.map((f) => (
              <li
                key={f.flowKey}
                className="flex flex-wrap justify-between gap-2 rounded border border-slate-700/30 px-2 py-1.5 text-xs"
              >
                <span className="text-slate-300">{f.flowLabel}</span>
                <span className="text-slate-500">
                  {f.roleInFlow} · {f.readiness.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflows.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Linked workflows
          </p>
          <ul className="space-y-1.5">
            {workflows.map((w) => (
              <li key={w.id} className="flex justify-between gap-2 text-xs text-slate-400">
                <span className="text-slate-300">{w.label}</span>
                <span>
                  {w.status} · {w.source.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Related tasks
          </p>
          <ul className="space-y-1.5">
            {tasks.map((t) => (
              <li key={t.id} className="flex justify-between gap-2 text-xs text-slate-400">
                <span className="text-slate-300">{t.label}</span>
                <span>{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflows.length === 0 && tasks.length === 0 && crossModuleLinks.length === 0 && (
        <p className="text-xs text-slate-500">
          No workflow or task linkage yet — configure workflows and tasks in tenant settings.
        </p>
      )}
    </section>
  );
}
