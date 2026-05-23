import { routes } from "@/lib/routes";
import type { ErpNavItem } from "@/lib/constants/erp-module-registry";

/** Nav keys referenced in SAREA NavigationProfile.configJson.primary */
export const SAREA_NAV_KEYS = [
  "dashboard",
  "tasks",
  "workflows",
  "users",
  "hr",
  "crm",
  "modules",
  "reports",
  "cybercrow",
  "settings",
] as const;

export type SareaNavKey = (typeof SAREA_NAV_KEYS)[number];

function mergeErpNavItems(
  items: { href: string; label: string }[],
  erpNavItems: ErpNavItem[]
): { href: string; label: string }[] {
  const seen = new Set(items.map((i) => i.href));
  const erpToAdd = erpNavItems
    .map((e) => ({ href: e.href, label: e.label }))
    .filter((e) => !seen.has(e.href));
  if (erpToAdd.length === 0) return items;

  const workflowsIdx = items.findIndex((i) => i.href.endsWith("/workflows"));
  const tasksIdx = items.findIndex((i) => i.href.endsWith("/tasks"));
  const insertAt =
    workflowsIdx >= 0
      ? workflowsIdx + 1
      : tasksIdx >= 0
        ? tasksIdx + 1
        : Math.min(1, items.length);

  return [...items.slice(0, insertAt), ...erpToAdd, ...items.slice(insertAt)];
}

export function buildTenantNavItems(
  slug: string,
  navKeys: string[],
  erpNavItems: ErpNavItem[] = []
) {
  const r = routes.tenant(slug);
  const registry: Record<SareaNavKey, { href: string; label: string }> = {
    dashboard: { href: r.dashboard, label: "Dashboard" },
    tasks: { href: r.tasks, label: "Tasks" },
    workflows: { href: r.workflows, label: "Workflows" },
    users: { href: r.users, label: "Users" },
    hr: { href: r.hr, label: "HR" },
    crm: { href: r.crm, label: "CRM" },
    modules: { href: r.modules, label: "Modules" },
    reports: { href: r.reports, label: "Reports" },
    cybercrow: { href: r.cybercrow.dashboard, label: "CyberCrow" },
    settings: { href: r.settings, label: "Settings" },
  };

  const keys = navKeys.length > 0 ? navKeys : (["dashboard", "tasks", "users", "modules", "cybercrow"] as const);
  const seen = new Set<string>();
  const items: { href: string; label: string }[] = [];

  for (const key of keys) {
    const item = registry[key as SareaNavKey];
    if (item && !seen.has(item.href)) {
      seen.add(item.href);
      items.push(item);
    }
  }

  if (!seen.has(r.dashboard)) {
    items.unshift(registry.dashboard);
  }

  return mergeErpNavItems(items, erpNavItems);
}

/** Dashboard widget blocks controlled by WidgetRule.visibility */
export const SAREA_DASHBOARD_WIDGETS = [
  { key: "tasks", label: "Tasks", description: "Open work items" },
  { key: "alerts", label: "Security alerts", description: "CyberCrow activity" },
  { key: "reports", label: "Reports", description: "Analytics & exports" },
  { key: "modules", label: "Modules", description: "Enabled CEM modules" },
  { key: "structure", label: "Organization", description: "Departments & roles" },
  { key: "fleet_kpis", label: "Fleet KPIs", description: "SLA breaches & hub performance" },
  { key: "ops_board", label: "Ops board", description: "Dispatch & warehouse throughput" },
  { key: "pod_mobile", label: "POD mobile", description: "Shipment scan & proof of delivery" },
  { key: "operational_load", label: "Operational load", description: "Tasks, workflows, modules" },
  { key: "cybercrow_posture", label: "CyberCrow posture", description: "Risk, compliance, init status" },
] as const;

export type SareaDashboardWidgetKey = (typeof SAREA_DASHBOARD_WIDGETS)[number]["key"];
