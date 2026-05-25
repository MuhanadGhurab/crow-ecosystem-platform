import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { MEEM_TASK_SAMPLES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";
import { listTenantTasks } from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const STATUS_CLASS: Record<string, string> = {
  open: "bg-cyan-500/15 text-cyan-300",
  in_progress: "bg-amber-500/15 text-amber-300",
  done: "bg-teal-500/15 text-teal-300",
  closed: "bg-slate-600/30 text-slate-400",
};

export default async function TasksPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tasks =
    isUseMockData() && slug === MEEM_TENANT_SLUG
      ? MEEM_TASK_SAMPLES.map((s, i) => ({
          id: `mock-task-${i}`,
          tenantId: tenant.id,
          workflowId: null,
          title: s.title,
          status: s.status,
          assigneeId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          workflow: { id: `mock-wf-${i}`, name: s.workflowName },
        }))
      : await listTenantTasks(tenant.id);
  const r = routes.tenant(slug);
  const openCount = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="CEM"
        entity="cem"
        title="Tasks"
        description="Work items linked to tenant workflows — seeded from discovery and ops enrichment."
      />

      <section className="cc-glass-card flex flex-wrap gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open</p>
          <p className="font-display text-3xl font-bold tabular-nums text-cyan-300">{openCount}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</p>
          <p className="font-display text-3xl font-bold tabular-nums text-slate-300">{tasks.length}</p>
        </div>
      </section>

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tasks yet. Run <code className="text-cyan-400">npm run db:seed:meem:ops</code> for MEEM
          sample tasks.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
            >
              <div>
                <p className="font-medium text-white">{task.title}</p>
                {task.workflow && (
                  <p className="mt-1 text-xs text-slate-500">
                    Workflow:{" "}
                    <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
                      {task.workflow.name}
                    </Link>
                  </p>
                )}
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  STATUS_CLASS[task.status] ?? "bg-slate-700/50 text-slate-400"
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={r.workflows} className="cc-btn-secondary text-sm">
          Workflows
        </Link>
        <Link href={r.dashboard} className="text-sm text-slate-400 hover:text-white">
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
