/**
 * G1 — Cross-module integration map (advisory, integration-ready handoffs).
 */

import type { ErpModuleKey } from "@/lib/constants/erp-module-registry";

export type ErpIntegrationKind =
  | "data_flow"
  | "approval"
  | "reporting"
  | "identity"
  | "experience";

export type ErpIntegrationEdge = {
  from: ErpModuleKey | "platform";
  to: ErpModuleKey | "platform" | "cybercrow" | "sarea";
  kind: ErpIntegrationKind;
  label: string;
  advisoryNote?: string;
};

/** Canonical supply-chain and revenue chain (matches erp-module-registry chain). */
export const ERP_SUPPLY_CHAIN_CHAIN: ErpModuleKey[] = [
  "sales",
  "inventory",
  "warehouse",
  "logistics",
  "finance",
  "procurement",
];

export const ERP_MODULE_INTEGRATION_EDGES: ErpIntegrationEdge[] = [
  { from: "sales", to: "crm", kind: "data_flow", label: "Account and opportunity context" },
  { from: "sales", to: "finance", kind: "data_flow", label: "Quotes and orders → AR signals" },
  { from: "sales", to: "inventory", kind: "data_flow", label: "Fulfillment demand" },
  { from: "procurement", to: "inventory", kind: "data_flow", label: "Inbound stock" },
  { from: "procurement", to: "finance", kind: "data_flow", label: "PO accruals and payables" },
  { from: "warehouse", to: "inventory", kind: "data_flow", label: "Location-level balances" },
  { from: "warehouse", to: "logistics", kind: "data_flow", label: "Dispatch and hub throughput" },
  { from: "logistics", to: "finance", kind: "data_flow", label: "Shipment billing hooks" },
  { from: "hr", to: "platform", kind: "identity", label: "Departments and roles foundation" },
  { from: "platform", to: "sarea", kind: "experience", label: "Role → profile experience mapping" },
  { from: "tasks", to: "platform", kind: "approval", label: "Workflow steps → open tasks" },
  { from: "tasks", to: "cybercrow", kind: "approval", label: "Privileged action evidence (advisory)" },
  { from: "reports", to: "sales", kind: "reporting", label: "Pipeline KPIs" },
  { from: "reports", to: "finance", kind: "reporting", label: "Ledger snapshots" },
  { from: "reports", to: "inventory", kind: "reporting", label: "Stock and movement KPIs" },
  { from: "reports", to: "logistics", kind: "reporting", label: "Hub and lane metrics (when enabled)" },
  { from: "crm", to: "sales", kind: "data_flow", label: "Customer master for deals" },
  { from: "finance", to: "procurement", kind: "data_flow", label: "Budget and commitment checks (advisory)" },
  {
    from: "platform",
    to: "cybercrow",
    kind: "identity",
    label: "Sessions, audit logs, risk register",
    advisoryNote: "CyberCrow suite is parallel to CEM — not a replacement for ERP modules.",
  },
];

const EDGES_FROM = new Map<string, ErpIntegrationEdge[]>();

for (const edge of ERP_MODULE_INTEGRATION_EDGES) {
  const key = String(edge.from);
  const list = EDGES_FROM.get(key) ?? [];
  list.push(edge);
  EDGES_FROM.set(key, list);
}

export function getIntegrationEdgesFrom(
  module: ErpModuleKey | "platform"
): ErpIntegrationEdge[] {
  return EDGES_FROM.get(module) ?? [];
}

/** Hub modules that fan out to many consumers */
export const ERP_INTEGRATION_HUBS = {
  tasks: "Approvals and operator tasks across all enabled modules",
  reports: "BI and KPI roll-ups across enabled modules",
  workflows: "Named workflows spanning departments",
  cybercrow: "Audit, evidence, risk, and identity advisory layer",
} as const;
