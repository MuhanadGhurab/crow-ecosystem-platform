/**
 * G9 — Reports / BI readiness: executive visibility and cross-module roll-ups
 * (not data warehouse, external BI, AI forecasting, or certified compliance reporting).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type ReportsBiWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type ReportsBiRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: ReportsBiWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export type ExecutiveRollupCategoryId =
  | "people_hr"
  | "commercial"
  | "finance"
  | "procurement"
  | "supply_chain"
  | "logistics"
  | "tasks_approvals"
  | "cybercrow"
  | "sarea";

export type ExecutiveRollupStatus = "healthy" | "needs_review" | "limited_data" | "not_enabled";

/** Advisory executive rollup categories — rule-based, not scored analytics. */
export const EXECUTIVE_ROLLUP_CATEGORIES: readonly {
  id: ExecutiveRollupCategoryId;
  title: string;
  moduleKeys: readonly string[];
  routeKey: string;
}[] = [
  {
    id: "people_hr",
    title: "People / HR readiness",
    moduleKeys: ["hr"],
    routeKey: "hr",
  },
  {
    id: "commercial",
    title: "Commercial readiness",
    moduleKeys: ["crm", "sales"],
    routeKey: "crm",
  },
  {
    id: "finance",
    title: "Finance readiness",
    moduleKeys: ["finance"],
    routeKey: "finance",
  },
  {
    id: "procurement",
    title: "Procurement readiness",
    moduleKeys: ["procurement"],
    routeKey: "procurement",
  },
  {
    id: "supply_chain",
    title: "Supply chain readiness",
    moduleKeys: ["inventory", "warehouse"],
    routeKey: "inventory",
  },
  {
    id: "logistics",
    title: "Logistics readiness",
    moduleKeys: ["logistics"],
    routeKey: "logistics",
  },
  {
    id: "tasks_approvals",
    title: "Tasks / approvals readiness",
    moduleKeys: ["tasks", "workflows"],
    routeKey: "tasks",
  },
  {
    id: "cybercrow",
    title: "CyberCrow evidence posture",
    moduleKeys: ["cybercrow"],
    routeKey: "cybercrowRisk",
  },
  {
    id: "sarea",
    title: "SAREA experience posture",
    moduleKeys: ["sarea"],
    routeKey: "sareaProfiles",
  },
] as const;

/** Recommended report workflows — advisory cadence, not live automation. */
export const REPORTS_BI_RECOMMENDED_WORKFLOWS: readonly ReportsBiRecommendedWorkflow[] = [
  {
    id: "rpt-monthly-exec",
    label: "Monthly executive review",
    description: "Cross-module readiness rollup for leadership — advisory snapshot only.",
    status: "recommended",
    linkedModuleKeys: ["reports", "bi"],
  },
  {
    id: "rpt-module-health",
    label: "Module health review",
    description: "Per-module readiness signals from G2–G8 hubs.",
    status: "recommended",
    linkedModuleKeys: ["reports"],
  },
  {
    id: "rpt-finance-readiness",
    label: "Finance readiness review",
    description: "AR/AP signals and commercial handoff — not statutory financial statements.",
    status: "recommended",
    linkedModuleKeys: ["finance", "sales"],
  },
  {
    id: "rpt-procurement",
    label: "Procurement review",
    description: "Supplier and PR readiness with supply-chain context.",
    status: "recommended",
    linkedModuleKeys: ["procurement"],
  },
  {
    id: "rpt-inventory-wh",
    label: "Inventory & warehouse review",
    description: "Stock, location, and movement readiness signals.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "warehouse"],
  },
  {
    id: "rpt-logistics",
    label: "Logistics performance review",
    description: "Dispatch and exception readiness — not live carrier analytics.",
    status: "recommended",
    linkedModuleKeys: ["logistics"],
  },
  {
    id: "rpt-cybercrow-evidence",
    label: "CyberCrow evidence review",
    description: "Evidence packs, GRC posture, and operator-reviewed risk signals.",
    status: "recommended",
    linkedModuleKeys: ["cybercrow"],
  },
  {
    id: "rpt-sarea-experience",
    label: "SAREA role experience review",
    description: "Profile coverage, role mapping, and tenant-backed vs fallback posture.",
    status: "recommended",
    linkedModuleKeys: ["sarea"],
  },
  {
    id: "rpt-access-roles",
    label: "Access / role report review",
    description: "RBAC assignments vs SAREA experience mapping — RBAC controls access.",
    status: "recommended",
    linkedModuleKeys: ["hr", "sarea"],
  },
] as const;

export const REPORTS_BI_CYBERCROW_RISKS = [
  "Export of sensitive KPIs without classification",
  "Executive snapshot shared outside tenant boundary",
  "Evidence pack gaps misread as certified compliance",
  "Incident review backlog hidden in roll-up tiles",
] as const;

export const REPORTS_BI_CYBERCROW_EVIDENCE = [
  "Report run advisory log (future export)",
  "Executive readiness snapshot review note",
  "Cross-module KPI category acknowledgment",
  "CyberCrow evidence pack linkage from reports hub",
] as const;

export const REPORTS_BI_SAREA_PERSONAS = [
  { personaKey: "executive", label: "Executive", hint: "Low-density roll-up tiles; drill to module hubs." },
  { personaKey: "cfo", label: "CFO / Finance lead", hint: "Finance and commercial readiness sections first." },
  { personaKey: "coo", label: "COO / Operations", hint: "Supply chain, logistics, and workflow summaries." },
  { personaKey: "analyst", label: "Business analyst", hint: "Table-forward signals; links to source modules." },
  { personaKey: "tenant_admin", label: "Tenant admin", hint: "Module enablement and SAREA mapping context." },
] as const;

export const REPORTS_BI_REPORT_KPI_SIGNALS = [
  "Cross-module KPI category readiness (operations, sales, inventory, finance, security)",
  "Open tasks and active workflows counts",
  "Pipeline SAR and open AR advisory totals",
  "Low-stock SKU count when inventory enabled",
  "Executive rollup status per domain (healthy / needs review / limited data)",
  "CyberCrow initialized vs not initialized",
  "SAREA backed personas vs fallback-only posture",
] as const;

export type ReportsBiSectorNote = {
  sector: ModeledSectorKey;
  emphasis: string;
};

export const REPORTS_BI_SECTOR_NOTES: readonly ReportsBiSectorNote[] = [
  {
    sector: "logistics",
    emphasis:
      "Dispatch, warehouse handoff, exception, and inventory movement readiness dominate executive roll-ups — not live fleet analytics.",
  },
  {
    sector: "retail",
    emphasis:
      "Sales pipeline, customer service handoffs, stock/replenishment, and returns readiness signals — not omnichannel forecasting.",
  },
  {
    sector: "construction",
    emphasis:
      "Project/site procurement, materials, and HSE/quality evidence readiness in roll-ups — not project accounting certification.",
  },
  {
    sector: "aviation",
    emphasis:
      "Service operations, safety/quality coordination, and workforce readiness in summaries — not regulatory certification dashboards.",
  },
  {
    sector: "healthcare",
    emphasis:
      "Clinic operations, privacy/safety evidence readiness, and supply/billing coordination — not clinical analytics warehouse.",
  },
] as const;

export const REPORTS_BI_FORBIDDEN_CLAIM_PHRASES = [
  "data warehouse",
  "analytics warehouse",
  "live analytics",
  "predictive forecasting",
  "predictive analytics",
  "ai forecasting",
  "ai insights engine",
  "autonomous insights",
  "certified compliance",
  "compliance certification",
  "certified audit",
  "statutory financial",
  "legal financial statement",
  "external bi platform",
  "power bi integration",
  "tableau integration",
  "looker integration",
  "siem analytics",
  "guaranteed risk score",
  "autonomous detection",
] as const;
