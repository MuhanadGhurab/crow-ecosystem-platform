/**
 * G7 — Logistics module depth: dispatch and delivery operations readiness
 * (not a live TMS, carrier integration, GPS tracking, or automated dispatch engine).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type LogisticsWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type LogisticsRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: LogisticsWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export const LOGISTICS_WORKFLOW_MATCH_KEYWORDS = [
  "logistics",
  "dispatch",
  "delivery",
  "shipment",
  "freight",
  "handoff",
  "pod",
  "proof",
  "exception",
  "driver",
  "field",
  "warehouse",
  "outbound",
  "customer",
  "escalation",
] as const;

export const LOGISTICS_RECOMMENDED_WORKFLOWS: readonly LogisticsRecommendedWorkflow[] = [
  {
    id: "delivery-request-intake",
    label: "Delivery request intake",
    description: "Operator-managed intake before dispatch coordination — not automated booking.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "tasks", "crm"],
  },
  {
    id: "dispatch-assignment-readiness",
    label: "Dispatch assignment readiness",
    description: "Dispatch queue and assignment checklist — coordinator-managed, not autonomous dispatch.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "warehouse", "tasks"],
  },
  {
    id: "warehouse-logistics-handoff",
    label: "Warehouse-to-logistics handoff",
    description: "Outbound lane release and dispatch prep handoff from warehouse readiness.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "logistics", "inventory"],
  },
  {
    id: "field-task-update-readiness",
    label: "Driver / field task update readiness",
    description: "Assigned tasks and status updates — mobile-friendly lists, not a driver telematics app.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "tasks"],
  },
  {
    id: "shipment-status-readiness",
    label: "Shipment status update readiness",
    description: "Operator-managed status trail — not live GPS or carrier API sync.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "workflows"],
  },
  {
    id: "delivery-exception-review",
    label: "Delivery exception review",
    description: "Exception and dispute review with evidence notes — advisory.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "cybercrow", "reports"],
  },
  {
    id: "pod-review-readiness",
    label: "Proof-of-delivery review readiness",
    description: "POD review checklist and evidence posture — not live capture or OCR automation.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "cybercrow"],
  },
  {
    id: "customer-issue-escalation",
    label: "Customer issue escalation",
    description: "CRM-linked escalation for delivery issues — operator-managed.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "crm", "tasks"],
  },
  {
    id: "logistics-finance-handoff",
    label: "Logistics-to-finance handoff",
    description: "Freight cost and billing readiness linkage — not automated freight costing.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "finance"],
  },
  {
    id: "logistics-incident-report",
    label: "Logistics incident report",
    description: "Incident capture with CyberCrow evidence hooks — advisory.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "cybercrow"],
  },
  {
    id: "logistics-access-review",
    label: "Logistics role / access review",
    description: "Periodic review of logistics privileges — RBAC + evidence.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "roles", "cybercrow"],
  },
  {
    id: "monthly-logistics-review",
    label: "Monthly logistics performance review",
    description: "Operator-managed ops roll-up — advisory reporting, not OTIF guarantees.",
    status: "recommended",
    linkedModuleKeys: ["logistics", "reports"],
  },
] as const;

export const LOGISTICS_CYBERCROW_RISKS = [
  "Unauthorized dispatch changes",
  "Delivery exception fraud",
  "Proof-of-delivery dispute gaps",
  "Shipment / customer data exposure",
  "Warehouse-to-logistics handoff gaps",
  "Inventory movement abuse",
  "Driver / field role misuse",
  "Missing incident evidence",
  "Overprivileged logistics users",
  "Stale customer / account access",
  "Monthly review gaps",
] as const;

export const LOGISTICS_CYBERCROW_EVIDENCE = [
  "Dispatch assignment trail",
  "Warehouse-to-logistics handoff record",
  "Shipment / delivery status trail",
  "Delivery exception review",
  "Proof-of-delivery review",
  "Customer escalation record",
  "Logistics incident report",
  "Logistics-to-finance handoff",
  "Monthly logistics report",
  "Logistics role / access review",
] as const;

export type LogisticsSareaPersona = {
  persona: string;
  audience: string;
  experience: string;
};

export const LOGISTICS_SAREA_PERSONAS: readonly LogisticsSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Operations health, exception posture, and risk summary — not live fleet map.",
  },
  {
    persona: "Logistics Operations Manager",
    audience: "Logistics operations",
    experience: "Dispatch readiness, delivery lifecycle, and exception queues — primary density.",
  },
  {
    persona: "Dispatch Coordinator",
    audience: "Dispatch",
    experience: "Dispatch queue, handoffs, and tasks — coordinator-managed.",
  },
  {
    persona: "Warehouse Supervisor",
    audience: "Warehouse",
    experience: "Warehouse-to-logistics handoff — compact lane and outbound signals.",
  },
  {
    persona: "Driver / Field Operator",
    audience: "Field",
    experience: "Assigned tasks and status updates — mobile-friendly lists, not GPS tracking UI.",
  },
  {
    persona: "Customer Account Manager",
    audience: "Commercial",
    experience: "Customer issue and escalation context from CRM — read-mostly.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance operations",
    experience: "Logistics-to-finance handoff — not payment execution or freight automation.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Operations reports, exception trends, and readiness gap lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Role mappings and logistics access readiness.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Dispatch evidence, exception trails, access risks — advisory read-only.",
  },
] as const;

export type LogisticsSectorNote = {
  sector: ModeledSectorKey;
  headline: string;
  focus: readonly string[];
};

export const LOGISTICS_SECTOR_NOTES: readonly LogisticsSectorNote[] = [
  {
    sector: "logistics",
    headline: "Core dispatch, delivery, and hub operations readiness",
    focus: ["Dispatch coordination", "Delivery exceptions", "Warehouse handoff", "POD review readiness"],
  },
  {
    sector: "retail",
    headline: "Store replenishment and fulfillment / delivery readiness",
    focus: ["Last-mile coordination (advisory)", "Hub handoff", "Customer delivery issues"],
  },
  {
    sector: "construction",
    headline: "Materials movement and site delivery readiness",
    focus: ["Site delivery scheduling (advisory)", "Supplier handoff", "Exception review"],
  },
  {
    sector: "aviation",
    headline: "Station / service logistics readiness — not flight operations",
    focus: ["Ground support coordination", "Parts movement handoff", "Service delivery readiness"],
  },
  {
    sector: "healthcare",
    headline: "Supplies movement readiness — not clinical or patient logistics systems",
    focus: ["Supplies dispatch coordination", "Privacy-safe escalation", "Billing handoff readiness"],
  },
] as const;

export const LOGISTICS_REPORT_KPI_SIGNALS = [
  "Logistics module enabled",
  "Warehouse module enabled",
  "Inventory module enabled",
  "Procurement module enabled",
  "CRM module enabled",
  "Finance module enabled",
  "Outbound warehouse lanes",
  "SKU / stock context count",
  "Procurement PR count",
  "CRM account count",
  "Open AR SAR (finance handoff signal)",
  "Dispatch workflow readiness",
  "Delivery exception workflow readiness",
  "Warehouse handoff workflow readiness",
  "POD review readiness",
  "Logistics-related open tasks",
  "Matched logistics workflows",
  "Reports module roll-ups",
  "Evidence readiness (CyberCrow)",
] as const;

export const LOGISTICS_FORBIDDEN_CLAIM_PHRASES = [
  "live gps",
  "gps tracking",
  "telematics",
  "route optimization engine",
  "route optimizer",
  "carrier api",
  "carrier integration",
  "live carrier tracking",
  "live proof-of-delivery",
  "pod capture",
  "automated dispatch",
  "autonomous dispatch",
  "ai dispatch",
  "ai-assisted routing",
  "ai route optimization",
  "delivery sla guarantee",
  "otif guarantee",
  "automated freight costing",
  "live tracking",
  "real-time tracking",
  "fraud detection",
  "certified audit",
  "full tms",
  "transportation management system",
] as const;
