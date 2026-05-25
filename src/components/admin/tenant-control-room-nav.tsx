import Link from "next/link";
import { routes } from "@/lib/routes";

export const TENANT_CONTROL_ROOM_TABS = [
  { id: "overview", label: "Overview" },
  { id: "plan", label: "Plan" },
  { id: "organization", label: "Organization" },
  { id: "cem", label: "CEM" },
  { id: "cybercrow", label: "CyberCrow" },
  { id: "sarea", label: "SAREA" },
  { id: "readiness", label: "Readiness" },
  { id: "audit", label: "Audit" },
] as const;

export type TenantControlRoomTab = (typeof TENANT_CONTROL_ROOM_TABS)[number]["id"];

export function TenantControlRoomNav({
  tenantId,
  activeTab,
}: {
  tenantId: string;
  activeTab: TenantControlRoomTab;
}) {
  const base = routes.admin.tenant(tenantId);

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-cyan-500/10 pb-4"
      aria-label="Tenant control room"
    >
      {TENANT_CONTROL_ROOM_TABS.map((tab) => {
        const href = tab.id === "overview" ? base : `${base}?tab=${tab.id}`;
        const active = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={href}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              active
                ? "border border-cyan-500/40 bg-cyan-500/10 font-medium text-cyan-100"
                : "border border-transparent text-slate-400 hover:border-white/10 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function parseTenantControlRoomTab(
  tab: string | undefined
): TenantControlRoomTab {
  if (tab && TENANT_CONTROL_ROOM_TABS.some((t) => t.id === tab)) {
    return tab as TenantControlRoomTab;
  }
  return "overview";
}
