import Link from "next/link";
import { moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import type { SareaRuntimeContext } from "@/lib/services/sarea-runtime.service";
import { isWidgetVisible } from "@/lib/services/sarea-runtime.service";

type TenantDashboardWidgetsProps = {
  slug: string;
  runtime: SareaRuntimeContext;
  summary: {
    profileCount: number;
    departmentCount: number;
    roleCount: number;
    auditLogCount: number;
    moduleCount: number;
    openTaskCount?: number;
  };
  modules: { id: string; moduleKey: string }[];
};

export function SareaDashboardWidgets({
  slug,
  runtime,
  summary,
  modules,
}: TenantDashboardWidgetsProps) {
  const r = routes.tenant(slug);
  const gridClass = runtime.compact
    ? "grid gap-3 sm:grid-cols-2"
    : runtime.density === "spacious"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <section className={gridClass}>
        {isWidgetVisible(runtime, "tasks") && (
          <article className="cc-glass-card">
            <p className="text-2xl font-bold text-cyan-300">
              {summary.openTaskCount ?? "—"}
            </p>
            <p className="text-sm text-slate-500">Open tasks</p>
            <Link href={r.tasks} className="mt-2 inline-block text-xs text-cyan-400">
              Open tasks →
            </Link>
          </article>
        )}
        {isWidgetVisible(runtime, "alerts") && (
          <article className="cc-glass-card border-violet-500/15">
            <p className="text-2xl font-bold text-violet-300">{summary.auditLogCount}</p>
            <p className="text-sm text-slate-500">Security signals</p>
            <Link href={r.cybercrow.dashboard} className="mt-2 inline-block text-xs text-violet-400">
              CyberCrow →
            </Link>
          </article>
        )}
        {isWidgetVisible(runtime, "structure") && (
          <>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-cyan-300">{summary.profileCount}</p>
              <p className="text-sm text-slate-500">CEM users</p>
            </article>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-teal-300">{summary.departmentCount}</p>
              <p className="text-sm text-slate-500">Departments</p>
            </article>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-cyan-300">{summary.roleCount}</p>
              <p className="text-sm text-slate-500">Roles</p>
            </article>
          </>
        )}
        {isWidgetVisible(runtime, "modules") && (
          <article className="cc-glass-card">
            <p className="text-2xl font-bold text-teal-300">{summary.moduleCount}</p>
            <p className="text-sm text-slate-500">Enabled modules</p>
          </article>
        )}
        {isWidgetVisible(runtime, "reports") && (
          <article className="cc-glass-card border-rose-500/15">
            <p className="text-sm font-medium text-rose-300">Reports</p>
            <p className="mt-1 text-xs text-slate-500">Persona: {runtime.personaKey}</p>
            <Link href={r.reports} className="mt-2 inline-block text-xs text-rose-400">
              View reports →
            </Link>
          </article>
        )}
      </section>

      {isWidgetVisible(runtime, "modules") && modules.length > 0 && (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-cyan-400">Enabled CEM modules</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {modules.map((m) => (
              <li
                key={m.id}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
              >
                {moduleLabel(m.moduleKey)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
