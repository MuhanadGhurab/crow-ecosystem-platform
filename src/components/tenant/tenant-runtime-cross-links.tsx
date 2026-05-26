import Link from "next/link";
import { routes } from "@/lib/routes";

export type TenantRuntimeSection =
  | "dashboard"
  | "modules"
  | "workflows"
  | "tasks"
  | "users"
  | "roles"
  | "departments"
  | "crm"
  | "sales"
  | "hr"
  | "finance"
  | "procurement"
  | "reports"
  | "settings"
  | "settingsPlan";

type LinkItem = {
  id: TenantRuntimeSection | "cybercrow" | "sarea";
  href: string;
  label: string;
  tone?: "cem" | "violet" | "rose";
};

type TenantRuntimeCrossLinksProps = {
  slug: string;
  current?: TenantRuntimeSection;
  cybercrowLive?: boolean;
};

export function TenantRuntimeCrossLinks({
  slug,
  current,
  cybercrowLive = false,
}: TenantRuntimeCrossLinksProps) {
  const r = routes.tenant(slug);

  const ops: LinkItem[] = [
    { id: "dashboard", href: r.dashboard, label: "Dashboard", tone: "cem" },
    { id: "modules", href: r.modules, label: "Modules" },
    { id: "workflows", href: r.workflows, label: "Workflows" },
    { id: "tasks", href: r.tasks, label: "Tasks" },
    { id: "users", href: r.users, label: "Users" },
    { id: "roles", href: r.roles, label: "Roles" },
    { id: "departments", href: r.departments, label: "Structure" },
    { id: "crm", href: r.crm, label: "CRM" },
    { id: "sales", href: r.sales, label: "Sales" },
    { id: "hr", href: r.hr, label: "HR" },
    { id: "finance", href: r.finance, label: "Finance" },
    { id: "procurement", href: r.procurement, label: "Procurement" },
    { id: "reports", href: r.reports, label: "Reports" },
    { id: "settings", href: r.settings, label: "Settings" },
  ];

  const engines: LinkItem[] = [
    {
      id: "cybercrow",
      href: r.cybercrow.dashboard,
      label: cybercrowLive ? "CyberCrow posture" : "CyberCrow (setup)",
      tone: "violet",
    },
    { id: "sarea", href: routes.sarea.overview, label: "SAREA studio", tone: "rose" },
  ];

  const toneClass = (tone?: LinkItem["tone"], active?: boolean) => {
    if (active) return "border-cyan-400/40 bg-cyan-500/15 text-cyan-200";
    if (tone === "violet") return "border-violet-500/25 bg-violet-500/10 text-violet-200 hover:border-violet-400/40";
    if (tone === "rose") return "border-rose-500/25 bg-rose-500/10 text-rose-200 hover:border-rose-400/40";
    return "border-cyan-500/15 bg-white/[0.03] text-slate-300 hover:border-cyan-500/30 hover:text-cyan-200";
  };

  return (
    <section className="cc-glass-card space-y-4">
      <div>
        <h3 className="text-sm font-medium text-cyan-400">Tenant runtime</h3>
        <p className="mt-1 text-xs text-slate-500">
          CEM operations · CyberCrow security · SAREA experience (platform studio)
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ops.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={current === item.id ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${toneClass(item.tone, current === item.id)}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
        {engines.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${toneClass(item.tone)}`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={r.settingsPlan}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${toneClass(undefined, current === "settingsPlan")}`}
        >
          Plan (advisory)
        </Link>
      </div>
    </section>
  );
}
