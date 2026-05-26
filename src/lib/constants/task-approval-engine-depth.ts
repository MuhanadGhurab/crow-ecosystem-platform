/**
 * G8 — Tasks / Approvals engine depth: operator-guided coordination
 * (not BPMN, RPA, autonomous workflow, or AI task assignment).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type TaskApprovalWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type TaskApprovalRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: TaskApprovalWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export type ModuleApprovalItem = {
  id: string;
  label: string;
  description: string;
};

export type ModuleTaskApprovalMap = {
  moduleKey: string;
  label: string;
  approvals: readonly ModuleApprovalItem[];
};

/** Cross-module recommended approval paths — advisory, not live automation. */
export const MODULE_TASK_APPROVAL_MAP: readonly ModuleTaskApprovalMap[] = [
  {
    moduleKey: "hr",
    label: "HR",
    approvals: [
      { id: "hr-onboarding", label: "Onboarding approval", description: "Role and access provisioning review before go-live." },
      { id: "hr-offboarding", label: "Offboarding review", description: "Access revocation and handoff checklist." },
      { id: "hr-access-change", label: "Role / access change approval", description: "Privileged role changes with evidence trail." },
      { id: "hr-policy-ack", label: "Training / policy acknowledgment", description: "Operator-managed acknowledgment tasks." },
    ],
  },
  {
    moduleKey: "finance",
    label: "Finance",
    approvals: [
      { id: "fin-billing-review", label: "Billing review", description: "AR/AP coordination review — not automated payment approval." },
      { id: "fin-expense-review", label: "Expense review", description: "Spend signal review before finance close." },
      { id: "fin-plan-review", label: "Plan / subscription review", description: "Advisory plan change review on settings." },
      { id: "fin-monthly-report", label: "Monthly finance report", description: "Executive finance readiness review task." },
    ],
  },
  {
    moduleKey: "crm",
    label: "CRM",
    approvals: [
      { id: "crm-account-review", label: "Account review", description: "Customer account data quality and ownership." },
      { id: "crm-proposal", label: "Proposal / commercial approval", description: "Commercial terms coordination — not legal signing." },
      { id: "crm-sales-finance", label: "Sales-to-finance handoff", description: "Revenue recognition readiness handoff." },
    ],
  },
  {
    moduleKey: "sales",
    label: "Sales",
    approvals: [
      { id: "sales-quote-review", label: "Quote / commercial review", description: "Sales desk coordination with CRM and finance." },
      { id: "sales-handoff-finance", label: "Sales-to-finance handoff", description: "Closed-won handoff readiness." },
    ],
  },
  {
    moduleKey: "procurement",
    label: "Procurement",
    approvals: [
      { id: "proc-pr-approval", label: "Purchase request approval", description: "PR approval chain — operator-managed, not live supplier payment." },
      { id: "proc-supplier", label: "Supplier approval", description: "Supplier onboarding and reference review." },
      { id: "proc-finance-handoff", label: "Procurement-to-finance handoff", description: "Spend commitment to finance signals." },
    ],
  },
  {
    moduleKey: "inventory",
    label: "Inventory",
    approvals: [
      { id: "inv-adjustment", label: "Stock adjustment review", description: "Adjustment review with evidence — not live stock accuracy." },
      { id: "inv-receiving", label: "Receiving review", description: "Receiving coordination with warehouse." },
      { id: "inv-movement", label: "Movement review", description: "Inter-location movement readiness." },
    ],
  },
  {
    moduleKey: "warehouse",
    label: "Warehouse",
    approvals: [
      { id: "wh-receiving", label: "Receiving review", description: "Inbound lane and receipt coordination." },
      { id: "wh-movement", label: "Warehouse movement review", description: "Internal movement and pick prep." },
      { id: "wh-logistics-handoff", label: "Warehouse-to-logistics handoff", description: "Outbound release before dispatch coordination." },
    ],
  },
  {
    moduleKey: "logistics",
    label: "Logistics",
    approvals: [
      { id: "log-dispatch-review", label: "Dispatch assignment review", description: "Coordinator-managed dispatch queue — not autonomous dispatch." },
      { id: "log-exception", label: "Delivery exception review", description: "Exception and dispute review with evidence." },
      { id: "log-pod-review", label: "Proof-of-delivery review", description: "POD review readiness — not live capture." },
      { id: "log-finance-handoff", label: "Logistics-to-finance handoff", description: "Freight cost coordination signals." },
    ],
  },
  {
    moduleKey: "reports",
    label: "Reports",
    approvals: [
      { id: "rpt-monthly-ops", label: "Monthly operational review", description: "Cross-module KPI readiness review." },
      { id: "rpt-executive", label: "Executive readiness review", description: "Advisory executive snapshot review." },
    ],
  },
] as const;

export const TASK_APPROVAL_ENGINE_WORKFLOW_KEYWORDS = [
  "approval",
  "approve",
  "review",
  "handoff",
  "onboarding",
  "offboarding",
  "dispatch",
  "exception",
  "purchase",
  "procurement",
  "receiving",
  "movement",
  "billing",
  "expense",
  "access",
  "escalation",
  "pod",
  "proof",
] as const;

export const TASK_APPROVAL_RECOMMENDED_WORKFLOWS: readonly TaskApprovalRecommendedWorkflow[] = [
  {
    id: "cross-module-approval-intake",
    label: "Cross-module approval intake",
    description: "Tasks created from module hubs route here for operator review — not autonomous routing.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "workflows"],
  },
  {
    id: "workflow-task-linkage",
    label: "Workflow-to-task linkage",
    description: "Each active workflow should surface at least one coordination task when operational.",
    status: "recommended",
    linkedModuleKeys: ["workflows", "tasks"],
  },
  {
    id: "approval-chain-readiness",
    label: "Approval chain readiness",
    description: "Recommended approver paths by department — advisory, not enforced automation.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "departments", "roles"],
  },
  {
    id: "unassigned-task-triage",
    label: "Unassigned task triage",
    description: "Critical tasks without assignee should be triaged on Users and Tasks boards.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "users"],
  },
  {
    id: "overdue-review-gap",
    label: "Overdue / stale review gap",
    description: "Open tasks without recent updates flagged for manager review — no SLA engine.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "reports"],
  },
  {
    id: "module-handoff-evidence",
    label: "Module handoff evidence",
    description: "Handoff tasks between finance, procurement, warehouse, and logistics with audit notes.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "cybercrow"],
  },
  {
    id: "monthly-ops-review",
    label: "Monthly operations review",
    description: "Recurring review workflow for task and workflow coverage.",
    status: "recommended",
    linkedModuleKeys: ["reports", "tasks", "workflows"],
  },
  {
    id: "access-role-review",
    label: "Access / role review",
    description: "Periodic access review tasks aligned with HR and CyberCrow posture.",
    status: "recommended",
    linkedModuleKeys: ["hr", "cybercrow", "tasks"],
  },
];

export const TASK_APPROVAL_CYBERCROW_RISKS = [
  "Unauthorized approval changes",
  "Stale or orphaned tasks",
  "Unassigned critical tasks",
  "Missing approval trail",
  "Overdue review gaps",
  "Role mismatch on approval actions",
  "Privileged user misuse on task completion",
  "Missing evidence for operational review",
  "Module handoff gaps without tasks",
  "Workflow status manipulation without audit",
] as const;

export const TASK_APPROVAL_CYBERCROW_EVIDENCE = [
  "Task assignment record",
  "Approval trail",
  "Review decision record",
  "Module handoff record",
  "Workflow status history",
  "Access / role review record",
  "Monthly operational review",
  "Exception review record",
] as const;

export const TASK_APPROVAL_SAREA_PERSONAS = [
  { id: "executive", label: "Executive / Owner", hint: "Exception review, approval posture, operational health summary." },
  { id: "ops-manager", label: "Operations Manager", hint: "Workload, workflow coverage, blockers across modules." },
  { id: "dept-manager", label: "Department Manager", hint: "Team tasks, approvals, and handoffs." },
  { id: "frontline", label: "Frontline Worker", hint: "Assigned tasks and simple status updates only." },
  { id: "finance-specialist", label: "Finance Specialist", hint: "Finance approval queue and billing review tasks." },
  { id: "procurement-specialist", label: "Procurement Specialist", hint: "PR and supplier approval tasks." },
  { id: "hr-specialist", label: "HR Specialist", hint: "Onboarding, offboarding, and access review tasks." },
  { id: "analyst", label: "Analyst", hint: "Trends, bottlenecks, and readiness gaps in Reports." },
  { id: "tenant-admin", label: "Tenant Admin", hint: "Task/role mapping and workflow readiness on SAREA." },
  { id: "cybercrow-reviewer", label: "CyberCrow Reviewer", hint: "Approval evidence and risk signals — advisory." },
] as const;

export const TASK_APPROVAL_SECTOR_NOTES: readonly {
  sector: ModeledSectorKey;
  title: string;
  note: string;
}[] = [
  {
    sector: "logistics",
    title: "Logistics sector",
    note: "Dispatch, exception, POD review, and warehouse handoff tasks — coordination only, not live tracking.",
  },
  {
    sector: "retail",
    title: "Retail sector",
    note: "Stock adjustment, promotion/discount review, returns escalations, and store task coordination.",
  },
  {
    sector: "construction",
    title: "Construction sector",
    note: "Material request, site task, HSE/quality, and variation approval readiness.",
  },
  {
    sector: "aviation",
    title: "Aviation sector",
    note: "Service request, safety incident, maintenance coordination, and shift/workforce review — not flight ops.",
  },
  {
    sector: "healthcare",
    title: "Healthcare sector",
    note: "Access review, patient service escalation, safety incident, and supplies request — not clinical systems.",
  },
];

export const TASK_APPROVAL_REPORT_KPI_SIGNALS = [
  "Total tasks",
  "Open / in-progress tasks",
  "Completed tasks",
  "Unassigned tasks",
  "Tasks without workflow link",
  "Workflow definitions",
  "Workflows with tasks",
  "Workflows without tasks",
  "Approval readiness (advisory)",
  "Module handoff readiness",
  "CyberCrow evidence readiness",
  "Enabled ERP modules with approval map",
] as const;

/** Phrases that must not appear as positive claims in tenant Tasks/Workflows UI. */
export const TASK_APPROVAL_FORBIDDEN_CLAIM_PHRASES = [
  "bpmn",
  "robotic process automation",
  "rpa engine",
  "autonomous approval",
  "autonomous workflow",
  "automatic payment approval",
  "ai task assignment",
  "ai assigns",
  "workflow automation engine",
  "certified audit",
  "compliance automation",
  "legal approval signing",
  "external workflow engine",
] as const;
