import Link from "next/link";
import { routes } from "@/lib/routes";

const STATUS_CLASS: Record<string, string> = {
  open: "bg-cyan-500/15 text-cyan-300",
  in_progress: "bg-amber-500/15 text-amber-300",
  pending: "bg-amber-500/15 text-amber-300",
  done: "bg-teal-500/15 text-teal-300",
  closed: "bg-slate-600/30 text-slate-400",
};

type TaskRow = {
  id: string;
  title: string;
  status: string;
  assigneeId: string | null;
  workflow: { id: string; name: string } | null;
};

type TenantTaskStatusGroupsProps = {
  slug: string;
  tasks: TaskRow[];
  cybercrowInitialized: boolean;
};

function assignTaskGroup(task: TaskRow): string {
  if (task.status === "done" || task.status === "closed") return "done";
  if (!task.assigneeId || !task.workflow) return "needs_review";
  if (task.status === "in_progress" || task.status === "pending") return "in_progress";
  if (task.status === "open") return "open";
  return "other";
}

const GROUP_LABELS: Record<string, string> = {
  needs_review: "Needs review",
  open: "Open",
  in_progress: "In progress",
  done: "Done / closed",
  other: "Other",
};

const GROUP_ORDER = ["needs_review", "open", "in_progress", "done", "other"] as const;

export function TenantTaskStatusGroups({
  slug,
  tasks,
  cybercrowInitialized,
}: TenantTaskStatusGroupsProps) {
  const r = routes.tenant(slug);

  const buckets = new Map<string, TaskRow[]>();
  for (const task of tasks) {
    const key = assignTaskGroup(task);
    const list = buckets.get(key) ?? [];
    list.push(task);
    buckets.set(key, list);
  }

  const grouped = GROUP_ORDER.filter((key) => (buckets.get(key)?.length ?? 0) > 0).map(
    (key) => ({
      key,
      label: GROUP_LABELS[key] ?? key,
      items: buckets.get(key) ?? [],
    })
  );

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section key={group.key}>
          <h3 className="text-sm font-medium text-cyan-400">
            {group.label}{" "}
            <span className="font-normal text-slate-500">({group.items.length})</span>
          </h3>
          <ul className="mt-3 space-y-3">
            {group.items.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{task.title}</p>
                  {task.workflow ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Workflow:{" "}
                      <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
                        {task.workflow.name}
                      </Link>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-amber-400/90">No workflow linked</p>
                  )}
                  {!task.assigneeId && (
                    <p className="mt-1 text-xs text-slate-500">Unassigned — assign on users page</p>
                  )}
                  <p className="mt-2 text-xs text-slate-600">
                    Next: update status when work is reviewed; sensitive changes may appear in
                    CyberCrow audit.
                  </p>
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
        </section>
      ))}

      {cybercrowInitialized && (
        <p className="text-xs text-slate-500">
          Security-sensitive task coordination may appear in{" "}
          <Link href={r.cybercrow.auditLogs} className="text-violet-400 hover:text-violet-300">
            CyberCrow audit logs
          </Link>
          .
        </p>
      )}
    </div>
  );
}
