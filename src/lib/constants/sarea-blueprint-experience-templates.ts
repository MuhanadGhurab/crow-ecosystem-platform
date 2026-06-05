/**
 * M2 — Advisory blueprint persona / experience templates (not permission grants).
 */

import type { SareaExperienceDensity } from "@/lib/sarea/sarea-experience-mapping-contract";

export type SareaBlueprintPersonaTemplate = {
  key: string;
  label: string;
  department: string;
  roleType: string;
  responsibilities: string;
  landingRouteKey: "dashboard" | "reports" | "workflows" | "tasks" | "hr" | "finance" | "crm" | "logistics";
  suggestedModules: string[];
  navigationKeys: string[];
  widgetsVisible: string[];
  reportViews: string[];
  workflowViews: string[];
  experienceDensity: SareaExperienceDensity;
  rbacNote: string;
  cyberCrowNote: string;
};

export const SAREA_BLUEPRINT_EXPERIENCE_TEMPLATES: readonly SareaBlueprintPersonaTemplate[] = [
  {
    key: "executive",
    label: "Executive",
    department: "Leadership",
    roleType: "executive",
    responsibilities: "Fleet trust, KPIs, risk summary — low operational depth",
    landingRouteKey: "dashboard",
    suggestedModules: ["reports", "finance", "cybercrow"],
    navigationKeys: ["dashboard", "reports", "cybercrow"],
    widgetsVisible: ["executive_summary", "cybercrow_posture", "fleet_kpis"],
    reportViews: ["executive_roll_up", "bi_readiness"],
    workflowViews: [],
    experienceDensity: "executive",
    rbacNote: "RBAC must allow reports/CyberCrow read — SAREA only shapes density",
    cyberCrowNote: "Trust/risk summary widgets advisory — not certified compliance",
  },
  {
    key: "operations_manager",
    label: "Operations Manager",
    department: "Operations",
    roleType: "manager",
    responsibilities: "Workflows, tasks, logistics/procurement/inventory exceptions",
    landingRouteKey: "workflows",
    suggestedModules: ["workflows", "tasks", "logistics", "procurement", "inventory", "warehouse"],
    navigationKeys: ["dashboard", "workflows", "tasks", "logistics", "reports"],
    widgetsVisible: ["ops_board", "operational_load", "tasks"],
    reportViews: ["ops_exceptions"],
    workflowViews: ["dispatch", "approvals"],
    experienceDensity: "standard",
    rbacNote: "Module shortcuts visible only when RBAC grants module access",
    cyberCrowNote: "Respect CyberCrow access review for privileged ops roles",
  },
  {
    key: "hr_specialist",
    label: "HR Specialist",
    department: "Human Resources",
    roleType: "hr",
    responsibilities: "HR module, users/roles visibility, onboarding tasks",
    landingRouteKey: "hr",
    suggestedModules: ["hr", "users", "roles", "tasks"],
    navigationKeys: ["dashboard", "hr", "users", "roles", "tasks"],
    widgetsVisible: ["structure", "onboarding_tasks"],
    reportViews: ["workforce_readiness"],
    workflowViews: ["onboarding"],
    experienceDensity: "standard",
    rbacNote: "User/role admin remains RBAC-gated — SAREA does not grant admin",
    cyberCrowNote: "Identity readiness informs HR onboarding copy only",
  },
  {
    key: "finance_user",
    label: "Finance User",
    department: "Finance",
    roleType: "finance",
    responsibilities: "Finance module, invoices, approvals, reports",
    landingRouteKey: "finance",
    suggestedModules: ["finance", "reports", "tasks"],
    navigationKeys: ["dashboard", "finance", "reports", "tasks"],
    widgetsVisible: ["finance_readiness", "approvals"],
    reportViews: ["ar_ap_readiness"],
    workflowViews: ["invoice_approval"],
    experienceDensity: "standard",
    rbacNote: "Financial write paths follow existing approval RBAC",
    cyberCrowNote: "Evidence trails advisory — not legal audit packs",
  },
  {
    key: "sales_crm",
    label: "Sales / CRM User",
    department: "Commercial",
    roleType: "sales",
    responsibilities: "CRM/sales pipeline and customer records",
    landingRouteKey: "crm",
    suggestedModules: ["crm", "sales", "tasks"],
    navigationKeys: ["dashboard", "crm", "sales", "tasks"],
    widgetsVisible: ["pipeline", "customer_records"],
    reportViews: ["commercial_roll_up"],
    workflowViews: ["opportunity_review"],
    experienceDensity: "standard",
    rbacNote: "CRM density does not expose modules without entitlement",
    cyberCrowNote: "Customer-data boundaries from CyberCrow trust posture",
  },
  {
    key: "warehouse_inventory",
    label: "Warehouse / Inventory User",
    department: "Supply Chain",
    roleType: "warehouse",
    responsibilities: "Inventory, warehouse, stock tasks, procurement handoffs",
    landingRouteKey: "logistics",
    suggestedModules: ["inventory", "warehouse", "procurement", "logistics", "tasks"],
    navigationKeys: ["dashboard", "inventory", "warehouse", "logistics", "tasks"],
    widgetsVisible: ["stock_tasks", "receiving"],
    reportViews: ["stock_exceptions"],
    workflowViews: ["receiving", "pick_pack"],
    experienceDensity: "standard",
    rbacNote: "Handoff links visible when both modules enabled in RBAC",
    cyberCrowNote: "Logistics audit visibility where CyberCrow module enabled",
  },
  {
    key: "frontline",
    label: "Frontline / Field User",
    department: "Operations",
    roleType: "frontline",
    responsibilities: "Assigned tasks and workflows — mobile/simple density",
    landingRouteKey: "tasks",
    suggestedModules: ["tasks", "workflows", "logistics"],
    navigationKeys: ["dashboard", "tasks", "workflows"],
    widgetsVisible: ["tasks", "pod_mobile"],
    reportViews: [],
    workflowViews: ["assigned_work"],
    experienceDensity: "simple",
    rbacNote: "Frontline RBAC stays scoped — preview cookie does not widen access",
    cyberCrowNote: "No security enforcement from SAREA",
  },
  {
    key: "analyst",
    label: "Analyst / Reviewer",
    department: "Governance",
    roleType: "analyst",
    responsibilities: "Reports, audit visibility, evidence/trust posture where allowed",
    landingRouteKey: "reports",
    suggestedModules: ["reports", "cybercrow"],
    navigationKeys: ["dashboard", "reports", "cybercrow"],
    widgetsVisible: ["reports", "cybercrow_posture", "evidence_hints"],
    reportViews: ["audit_visibility", "bi_readiness"],
    workflowViews: [],
    experienceDensity: "advanced",
    rbacNote: "CyberCrow routes require CyberCrow RBAC — SAREA hides nav only",
    cyberCrowNote: "Map analyst persona after CyberCrow trust boundaries reviewed",
  },
] as const;
