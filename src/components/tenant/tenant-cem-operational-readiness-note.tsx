import Link from "next/link";
import { routes } from "@/lib/routes";

type Variant = "modules" | "tasks" | "workflows" | "reports";

type Props = {
  slug: string;
  variant: Variant;
};

const COPY: Record<
  Variant,
  { title: string; purpose: string; dataNote: string; nextAction: string }
> = {
  modules: {
    title: "Operational modules",
    purpose: "Enabled modules define what tenant users can run in this staging Business Portal.",
    dataNote: "Module list is tenant-backed from blueprint provisioning — not the Client Portal.",
    nextAction: "Review cohesion links and seed ops data if areas look empty.",
  },
  tasks: {
    title: "Tasks coordination",
    purpose: "Tasks connect people, workflows, and modules across daily operations.",
    dataNote: "Task rows are tenant-backed when seeded; empty state means ops seeding is pending.",
    nextAction: "Assign owners on Users and link tasks to workflows when available.",
  },
  workflows: {
    title: "Workflow definitions",
    purpose: "Workflows stage approvals and handoffs between departments and modules.",
    dataNote: "Definitions come from discovery/blueprint provisioning — not a drag-and-drop builder.",
    nextAction: "Open Tasks to see workflow-linked work items.",
  },
  reports: {
    title: "Reports visibility",
    purpose: "Roll-up visibility from module signals — advisory BI, not certified reporting.",
    dataNote: "KPI tiles use tenant module data when present; otherwise show demo-limited hints.",
    nextAction: "Enable finance/inventory/sales modules for richer roll-ups on staging demo.",
  },
};

export function TenantCemOperationalReadinessNote({ slug, variant }: Props) {
  const c = COPY[variant];
  const dashboard = routes.tenant(slug).dashboard;

  return (
    <section className="rounded-lg border border-cyan-500/10 bg-slate-950/30 px-4 py-3 text-sm">
      <p className="font-medium text-cyan-200/90">{c.title}</p>
      <p className="mt-1 text-xs text-slate-400">{c.purpose}</p>
      <p className="mt-1 text-[11px] text-slate-500">{c.dataNote}</p>
      <p className="mt-2 text-[11px] text-slate-500">
        Next operational action: {c.nextAction}{" "}
        <Link href={dashboard} className="text-cyan-400 hover:text-cyan-300">
          Business Portal dashboard →
        </Link>
      </p>
    </section>
  );
}
