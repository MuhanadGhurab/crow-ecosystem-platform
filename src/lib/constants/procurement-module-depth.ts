/**
 * G5 — Procurement module depth: supplier and purchase operations readiness
 * (not a full purchasing suite, vendor marketplace, or payment processor).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type ProcurementWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type ProcurementRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: ProcurementWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export const PROCUREMENT_WORKFLOW_MATCH_KEYWORDS = [
  "procurement",
  "purchase",
  "pr ",
  "supplier",
  "vendor",
  "buy",
  "receiving",
  "handoff",
  "approval",
  "exception",
  "inventory",
  "warehouse",
] as const;

export const PROCUREMENT_RECOMMENDED_WORKFLOWS: readonly ProcurementRecommendedWorkflow[] = [
  {
    id: "purchase-request-intake",
    label: "Purchase request intake",
    description: "Operator-managed PR intake before inventory or finance posting.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "tasks"],
  },
  {
    id: "supplier-approval",
    label: "Supplier approval readiness",
    description: "Supplier master review and approval trail — advisory, not a vendor marketplace.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "workflows", "cybercrow"],
  },
  {
    id: "purchase-approval",
    label: "Purchase approval",
    description: "PR approval with task trail — not automated PO issuance as legal document.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "tasks", "workflows"],
  },
  {
    id: "procurement-finance-handoff",
    label: "Procurement-to-finance handoff",
    description: "Link PR lines to finance references for AP coordination — not live supplier payments.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "finance"],
  },
  {
    id: "procurement-inventory-handoff",
    label: "Procurement-to-inventory handoff",
    description: "SKU / stock references on PRs for replenishment readiness.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "inventory", "warehouse"],
  },
  {
    id: "receiving-readiness",
    label: "Material / service receiving readiness",
    description: "Receiving coordination with warehouse — operator checklist.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "warehouse", "inventory"],
  },
  {
    id: "supplier-issue-escalation",
    label: "Supplier issue escalation",
    description: "Escalation path for supplier or delivery issues — advisory.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "tasks"],
  },
  {
    id: "procurement-exception",
    label: "Procurement exception review",
    description: "Exception and override review with evidence notes.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "cybercrow", "reports"],
  },
  {
    id: "monthly-procurement-review",
    label: "Monthly procurement review",
    description: "Operator-managed spend and supplier roll-up — advisory reporting.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "reports"],
  },
  {
    id: "procurement-access-review",
    label: "Procurement role / access review",
    description: "Periodic review of procurement privileges — RBAC + evidence.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "roles", "cybercrow"],
  },
] as const;

export const PROCUREMENT_CYBERCROW_RISKS = [
  "Unauthorized purchase request",
  "Supplier approval abuse",
  "Fake or stale supplier record",
  "Purchase approval bypass",
  "Procurement-to-finance handoff gaps",
  "Procurement-to-inventory receiving gaps",
  "Overprivileged procurement users",
  "Missing supplier approval trail",
  "Procurement exception audit gaps",
  "Privileged admin misuse",
] as const;

export const PROCUREMENT_CYBERCROW_EVIDENCE = [
  "Purchase request approval trail",
  "Supplier approval evidence",
  "Procurement exception review",
  "Procurement-to-finance handoff",
  "Procurement-to-inventory handoff",
  "Receiving readiness record",
  "Supplier issue escalation",
  "Monthly procurement report",
  "Procurement role / access review",
] as const;

export type ProcurementSareaPersona = {
  persona: string;
  audience: string;
  experience: string;
};

export const PROCUREMENT_SAREA_PERSONAS: readonly ProcurementSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Procurement health, supplier posture, cost readiness summary.",
  },
  {
    persona: "Procurement Manager",
    audience: "Procurement operations",
    experience: "Purchase requests, approvals, supplier coordination — primary density.",
  },
  {
    persona: "Buyer / Procurement Specialist",
    audience: "Buyers",
    experience: "Assigned PR reviews and supplier tasks — field-friendly lists.",
  },
  {
    persona: "Inventory Controller",
    audience: "Inventory",
    experience: "Receiving readiness and stock handoff signals — links to Inventory.",
  },
  {
    persona: "Warehouse Supervisor",
    audience: "Warehouse",
    experience: "Inbound receiving and warehouse handoff — compact operational view.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance operations",
    experience: "Procurement-to-finance review — not payment execution UI.",
  },
  {
    persona: "Department Manager",
    audience: "Line management",
    experience: "PR visibility and approval tasks — limited write scope.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Procurement reports, supplier gaps, approval readiness lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Role mappings and procurement access readiness.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Supplier evidence, approval trails, risk signals — advisory read-only.",
  },
] as const;

export type ProcurementSectorNote = {
  sector: ModeledSectorKey;
  headline: string;
  focus: readonly string[];
};

export const PROCUREMENT_SECTOR_NOTES: readonly ProcurementSectorNote[] = [
  {
    sector: "logistics",
    headline: "Supplier coordination, delivery ops procurement, warehouse handoff",
    focus: ["Carrier / parts suppliers", "Emergency buys", "Hub replenishment PRs"],
  },
  {
    sector: "retail",
    headline: "Supplier buying, replenishment, category supply readiness",
    focus: ["Category buyers", "Store replenishment", "Vendor coordination (advisory)"],
  },
  {
    sector: "construction",
    headline: "Material requests, subcontractor coordination, project cost handoff",
    focus: ["Site material PRs", "Subcontractor refs", "Project cost linkage to Finance"],
  },
  {
    sector: "aviation",
    headline: "Service suppliers, maintenance coordination, station procurement",
    focus: ["MRO suppliers", "Station consumables", "Service contract coordination (advisory)"],
  },
  {
    sector: "healthcare",
    headline: "Supplies / pharmacy procurement, privacy-safe supplier coordination",
    focus: ["Clinical supplies intake", "Privacy-safe vendor notes", "Billing coordination readiness"],
  },
] as const;

export const PROCUREMENT_REPORT_KPI_SIGNALS = [
  "Procurement module enabled",
  "Finance module enabled (handoff)",
  "Inventory module enabled (SKU linkage)",
  "Warehouse module enabled (receiving)",
  "Purchase request count",
  "Open / submitted PR count",
  "PRs without finance reference",
  "PRs without inventory reference",
  "Procurement-related open tasks",
  "Matched procurement workflows",
  "Reports module roll-ups",
  "Supplier evidence readiness (CyberCrow)",
] as const;

export const PROCUREMENT_FORBIDDEN_CLAIM_PHRASES = [
  "ai supplier scoring",
  "supplier risk scoring",
  "vendor marketplace",
  "contract signing",
  "live supplier payment",
  "live supplier payments",
  "procurement automation engine",
  "payment gateway activated",
  "bank integration",
  "fraud detection",
  "certified audit",
  "automated compliance",
  "full purchasing suite",
  "external supplier api",
  "automated purchase order",
] as const;
