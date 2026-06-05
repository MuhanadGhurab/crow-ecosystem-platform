import type { CemOperatingModelSnapshot } from "@/lib/cem/cem-operating-model-contract";

type Variant = "tasks" | "workflows" | "reports";

type Props = {
  variant: Variant;
  snapshot: CemOperatingModelSnapshot;
};

export function TenantOperatingModelCrossLink({ variant, snapshot }: Props) {
  const spine = `${snapshot.entities.department ?? 0} departments · ${snapshot.entities.role ?? 0} roles · ${snapshot.entities.module ?? 0} modules`;
  const taskWorkflow =
    snapshot.entities.task && snapshot.entities.workflow
      ? `${snapshot.entities.task} tasks linked across ${snapshot.entities.workflow} workflows`
      : "Task/workflow spine needs data";

  const reportFeeds = snapshot.reportOutputs.slice(0, 3).join(" · ");

  const copy: Record<Variant, { title: string; body: string }> = {
    tasks: {
      title: "Operating model · Tasks",
      body: `Workflow source when available · ${spine} · Reporting impact: ${reportFeeds || "advisory"}. CyberCrow observes approval context; SAREA shapes task inbox per role.`,
    },
    workflows: {
      title: "Operating model · Workflows",
      body: `${taskWorkflow} · Modules: ${snapshot.moduleRoles.filter((m) => m.enabled).map((m) => m.moduleLabel).slice(0, 5).join(", ") || "none enabled"}. Tasks generated or expected per template — advisory if unlinked.`,
    },
    reports: {
      title: "Operating model · Reports",
      body: `Feeds from modules/tasks/workflows: ${reportFeeds || "enable modules for roll-ups"}. CEM summarizes operations · CyberCrow trust posture · SAREA role dashboards. Not a data warehouse.`,
    },
  };

  const section = copy[variant];

  return (
    <section className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <p className="text-xs font-medium text-cyan-300">{section.title}</p>
      <p className="mt-1 text-xs text-slate-500">{section.body}</p>
      {snapshot.links.filter((l) => l.strength === "missing").length > 0 && (
        <p className="mt-2 text-[10px] text-amber-300/80">
          {snapshot.links.filter((l) => l.strength === "missing").length} operational link gap(s) —
          staging advisory, not fake readiness.
        </p>
      )}
    </section>
  );
}
