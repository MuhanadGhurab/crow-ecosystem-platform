import Link from "next/link";
import { planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";

type TenantRuntimeNextActionsProps = {
  slug: string;
  planKey: string;
  summary: {
    openTaskCount: number;
    workflowCount: number;
    profileCount: number;
    departmentCount: number;
    moduleCount: number;
    cybercrowInitialized: boolean;
  };
  sareaProfileName: string;
};

export function TenantRuntimeNextActions({
  slug,
  planKey,
  summary,
  sareaProfileName,
}: TenantRuntimeNextActionsProps) {
  const r = routes.tenant(slug);

  const actions: { label: string; href: string; hint: string; tone?: "violet" | "rose" }[] = [];

  if (summary.openTaskCount > 0) {
    actions.push({
      label: "Review open tasks",
      href: r.tasks,
      hint: `${summary.openTaskCount} open`,
    });
  } else {
    actions.push({
      label: "Open tasks board",
      href: r.tasks,
      hint: "No open tasks — verify workflows",
    });
  }

  if (summary.workflowCount > 0) {
    actions.push({
      label: "Inspect workflows",
      href: r.workflows,
      hint: `${summary.workflowCount} definition${summary.workflowCount === 1 ? "" : "s"}`,
    });
  }

  if (summary.profileCount === 0) {
    actions.push({
      label: "Add workspace users",
      href: r.users,
      hint: "Profiles not seeded",
    });
  } else {
    actions.push({
      label: "Users & role assignments",
      href: r.users,
      hint: `${summary.profileCount} profiles`,
    });
  }

  actions.push({
    label: summary.cybercrowInitialized ? "CyberCrow posture" : "Initialize CyberCrow",
    href: r.cybercrow.dashboard,
    hint: summary.cybercrowInitialized ? "Live metrics" : "Awaiting init",
    tone: "violet",
  });

  actions.push({
    label: "SAREA experience context",
    href: routes.sarea.profiles,
    hint: sareaProfileName,
    tone: "rose",
  });

  actions.push({
    label: "Plan & advisory scope",
    href: r.settingsPlan,
    hint: planLabel(planKey),
  });

  return (
    <section className="cc-glass-card">
      <h3 className="text-sm font-medium text-cyan-400">Recommended next actions</h3>
      <p className="mt-1 text-xs text-slate-500">
        Operational shortcuts from live tenant data — not automated workflow engine actions.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className={`flex flex-col rounded-cc border p-4 transition hover:bg-white/[0.04] ${
                a.tone === "violet"
                  ? "border-violet-500/20"
                  : a.tone === "rose"
                    ? "border-rose-500/20"
                    : "border-cyan-500/15"
              }`}
            >
              <span className="font-medium text-white">{a.label}</span>
              <span className="mt-1 text-xs text-slate-500">{a.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-600">
        {summary.moduleCount} modules · {summary.departmentCount} departments · advisory plan only
        (no live checkout).
      </p>
    </section>
  );
}
