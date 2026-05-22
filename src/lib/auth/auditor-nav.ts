import type { CrowRole } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

/** Minimal tenant nav for platform auditors — CyberCrow audit surfaces only. */
export function buildAuditorTenantNav(slug: string) {
  const r = routes.tenant(slug).cybercrow;
  return [
    { href: r.dashboard, label: "CyberCrow dashboard" },
    { href: r.auditLogs, label: "Audit logs" },
    { href: r.securityEvents, label: "Security events" },
    { href: r.compliance, label: "Compliance" },
    { href: r.grc, label: "GRC" },
    { href: r.incidents, label: "Incidents" },
    { href: r.risk, label: "Risk" },
  ];
}

export function isAuditorReadOnly(role: CrowRole | null): boolean {
  return role === "auditor_readonly";
}
