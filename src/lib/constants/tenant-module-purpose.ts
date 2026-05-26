/** Short operational copy for tenant module cards — no schema dependency. */

export const TENANT_MODULE_PURPOSE: Record<string, string> = {
  iam: "Identity alignment with CyberCrow sessions and RBAC.",
  hr: "People records linked to departments and roles.",
  finance: "Ledger and AR visibility when finance data is seeded.",
  inventory: "SKU and stock signals for ops and reports.",
  warehouse: "Location-level throughput alongside inventory.",
  logistics: "Shipment and hub workflows — MEEM logistics tenants only.",
  sales: "Pipeline rows and KPI roll-ups in reports.",
  crm: "Customer-facing ops adjacent to sales workflows.",
  procurement: "Purchase requests and supplier touchpoints.",
  projects: "Project delivery tracking (lightweight in this phase).",
  bi: "Cross-module KPIs and executive snapshots.",
  documents: "Document control hooks (advisory in demo).",
  approvals: "Approval paths reflected in workflows and tasks.",
};

export function tenantModulePurpose(moduleKey: string): string {
  return (
    TENANT_MODULE_PURPOSE[moduleKey] ??
    "Operational surface enabled on this tenant blueprint — depth varies by module."
  );
}
