/**
 * G1 — Self-describing ERP/CEM module catalog (architecture baseline).
 * Rule-based, operator-guided, integration-ready — no autonomous AI claims.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";
import type { ErpModuleKey } from "@/lib/constants/erp-module-registry";
import type { ErpModuleMaturityId } from "@/lib/constants/erp-module-maturity";

export type SectorRelevanceTier = "primary" | "secondary" | "optional" | "low";

export type ErpModuleCategory = "core_erp" | "platform_foundation" | "catalog_only";

export type ErpModuleCatalogEntry = {
  /** CEM / tenant module key (canonical catalog id) */
  cemModuleKey: string;
  erpKey?: ErpModuleKey;
  label: string;
  routePattern: string;
  hasTenantRoute: boolean;
  category: ErpModuleCategory;
  shortDescription: string;
  businessPurpose: string;
  primaryUsers: readonly string[];
  relatedDepartments: readonly string[];
  ownedDataExamples: readonly string[];
  commonWorkflows: readonly string[];
  approvalNeeds: readonly string[];
  reportSignals: readonly string[];
  cyberCrowRisks: readonly string[];
  evidenceExamples: readonly string[];
  auditEvents: readonly string[];
  sareaExperienceHints: readonly string[];
  sectorRelevance: Record<ModeledSectorKey, SectorRelevanceTier>;
  dependencies: readonly string[];
  implementationStatus: ErpModuleMaturityId;
  dataSource: string;
  uiMaturityNotes: string;
  futureDepth: readonly string[];
  futureOnlyCapabilities?: readonly string[];
};

const SECTORS: ModeledSectorKey[] = [
  "logistics",
  "retail",
  "construction",
  "aviation",
  "healthcare",
];

function rel(
  primary: ModeledSectorKey[],
  secondary: ModeledSectorKey[] = [],
  low: ModeledSectorKey[] = []
): Record<ModeledSectorKey, SectorRelevanceTier> {
  const out = {} as Record<ModeledSectorKey, SectorRelevanceTier>;
  for (const s of SECTORS) {
    if (primary.includes(s)) out[s] = "primary";
    else if (secondary.includes(s)) out[s] = "secondary";
    else if (low.includes(s)) out[s] = "low";
    else out[s] = "optional";
  }
  return out;
}

const SHARED_CYBER = {
  access: "Excessive role grants on module actions",
  audit: "Missing evidence for privileged changes",
} as const;

export const ERP_MODULE_CATALOG: ErpModuleCatalogEntry[] = [
  {
    cemModuleKey: "sales",
    erpKey: "sales",
    label: "Sales",
    routePattern: "/[tenant]/sales",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Commercial and sales readiness — pipeline coordination, proposal handoffs, and finance linkage when data exists.",
    businessPurpose:
      "Turn implementation requests and opportunities into operator-managed commercial readiness — not live invoicing or AI lead scoring.",
    primaryUsers: [
      "Sales manager",
      "Account executive",
      "Commercial ops",
      "Finance manager (handoff)",
      "Executive / owner",
      "Analyst",
    ],
    relatedDepartments: ["Sales", "Commercial", "Revenue", "Finance"],
    ownedDataExamples: [
      "Opportunity / pipeline lines",
      "Quote and order references",
      "Pipeline SAR roll-ups (advisory)",
      "Blueprint request linkage",
    ],
    commonWorkflows: [
      "Opportunity review",
      "Proposal readiness",
      "Commercial approval",
      "Quote / proposal handoff",
      "Sales-to-finance handoff",
      "Revenue readiness review",
      "Monthly pipeline review (advisory)",
    ],
    approvalNeeds: [
      "Discount exceptions",
      "Large deal sign-off",
      "Commercial approval before finance handoff",
    ],
    reportSignals: [
      "Pipeline SAR",
      "Won SAR",
      "Opportunity count",
      "Commercial workflow coverage",
      "Finance module join",
    ],
    cyberCrowRisks: [
      "Unauthorized discount / commercial approval",
      "Proposal version audit gaps",
      "Revenue handoff gaps",
      "Stale opportunity records",
      "Sales role misuse",
      SHARED_CYBER.audit,
    ],
    evidenceExamples: [
      "Proposal review trail",
      "Commercial approval record",
      "Sales-to-finance handoff",
      "Monthly commercial review",
    ],
    auditEvents: ["sales.opportunity.created", "sales.status.changed"],
    sareaExperienceHints: [
      "Sales manager: pipeline + approval readiness",
      "Executive: commercial health and revenue readiness tiles",
      "Finance manager: handoff section to Finance module",
      "CyberCrow reviewer: commercial approval and customer-data risks",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"],
      [],
      []
    ),
    dependencies: ["crm", "finance", "inventory", "tasks", "reports", "workflows", "cybercrow"],
    implementationStatus: "workflow_linked",
    dataSource: "sales.service + sales-readiness.service + MEEM logistics samples when mock",
    uiMaturityNotes:
      "G4 depth: commercial readiness panel, linkage banners, always-on pipeline when module enabled — not payment capture",
    futureDepth: [
      "Configurable stages",
      "CPQ templates",
      "Sector quote packs",
      "Deeper request-to-opportunity automation (operator-guided only)",
    ],
    futureOnlyCapabilities: [
      "AI lead scoring",
      "Marketing automation",
      "Email campaigns",
      "Contract signing",
      "Live invoicing",
      "Live payments",
      "External CRM integrations",
      "Automated revenue recognition",
    ],
  },
  {
    cemModuleKey: "inventory",
    erpKey: "inventory",
    label: "Inventory",
    routePattern: "/[tenant]/inventory",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Stock and material operations readiness — SKU visibility, adjustments, and procurement/warehouse handoffs.",
    businessPurpose:
      "Coordinate item catalog, stock signals, receiving handoffs, and replenishment readiness across procurement, warehouse, logistics, finance, tasks, and reports — without live stock accuracy guarantees or automated sync.",
    primaryUsers: [
      "Inventory controller",
      "Operations manager",
      "Procurement specialist",
      "Finance manager",
      "Executive / owner",
      "Analyst",
    ],
    relatedDepartments: ["Operations", "Supply chain", "Procurement", "Warehouse", "Finance"],
    ownedDataExamples: [
      "SKUs and categories",
      "On-hand quantities (coordination signal)",
      "Reorder levels",
      "Stock locations",
      "Procurement inventory refs",
    ],
    commonWorkflows: [
      "Item / catalog readiness",
      "Stock receiving",
      "Stock adjustment review",
      "Cycle count readiness",
      "Replenishment request",
      "Inventory-to-finance review (advisory)",
    ],
    approvalNeeds: [
      "Stock adjustment approval",
      "Negative stock override",
      "Inventory exception review",
      "Inventory access review",
    ],
    reportSignals: [
      "SKU count",
      "Low-stock flags",
      "PRs with inventory ref",
      "Inventory-related open tasks",
    ],
    cyberCrowRisks: [
      "Unauthorized stock adjustment",
      "Missing receiving trail",
      "Inventory count gaps",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Stock receiving record",
      "Stock adjustment approval",
      "Cycle count record",
      "Item / catalog review",
    ],
    auditEvents: ["inventory.adjustment", "inventory.sku.updated"],
    sareaExperienceHints: [
      "Inventory controller: SKU grid density",
      "Operations manager: exception tiles",
      "Executive: summary readiness",
      "CyberCrow reviewer: adjustment trails",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction"],
      ["aviation", "healthcare"]
    ),
    dependencies: [
      "procurement",
      "warehouse",
      "logistics",
      "finance",
      "tasks",
      "workflows",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource: "inventory.service + inventory-warehouse-readiness.service",
    uiMaturityNotes:
      "G6 readiness hub always on; MEEM logistics hub optional; SKU list from service or industry pack",
    futureDepth: [
      "Lot/serial tracking (advisory)",
      "Multi-UOM",
      "Deeper ATP handoff to sales (advisory)",
    ],
    futureOnlyCapabilities: [
      "Barcode scanner integration",
      "RFID",
      "IoT sensors",
      "Real-time stock accuracy guarantees",
      "Automated stock synchronization",
      "Automated replenishment engine",
      "AI demand forecasting",
      "Full WMS",
    ],
  },
  {
    cemModuleKey: "warehouse",
    erpKey: "warehouse",
    label: "Warehouse",
    routePattern: "/[tenant]/warehouse",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Warehouse operations readiness — receiving, putaway, picking, and logistics handoffs.",
    businessPurpose:
      "Coordinate hub locations, inbound/outbound lanes, and movement readiness with procurement receiving and logistics dispatch — not a full WMS or warehouse automation platform.",
    primaryUsers: [
      "Warehouse supervisor",
      "Field / warehouse operator",
      "Logistics coordinator",
      "Inventory controller",
      "Executive / owner",
      "Analyst",
    ],
    relatedDepartments: ["Warehouse", "Distribution", "Logistics", "Procurement"],
    ownedDataExamples: [
      "Hub sites and zones",
      "Inbound / outbound lanes",
      "Movement kinds",
      "Receiving readiness checklists",
    ],
    commonWorkflows: [
      "Receiving readiness",
      "Putaway readiness",
      "Picking / dispatch readiness",
      "Warehouse-to-logistics handoff",
      "Monthly warehouse report (advisory)",
    ],
    approvalNeeds: [
      "Warehouse movement review",
      "High-value dispatch readiness",
      "Warehouse access review",
    ],
    reportSignals: [
      "Location count",
      "Inbound / outbound lane counts",
      "Warehouse-related open tasks",
    ],
    cyberCrowRisks: [
      "Unauthorized warehouse movement",
      "Receiving / putaway gaps",
      "Picking / dispatch mismatch",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Warehouse receiving record",
      "Putaway / picking readiness trail",
      "Warehouse-to-logistics handoff",
    ],
    auditEvents: ["warehouse.movement.posted"],
    sareaExperienceHints: [
      "Warehouse supervisor: lane and movement density",
      "Floor operator: task checklists",
      "Logistics coordinator: dispatch handoff links",
      "CyberCrow reviewer: movement evidence",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction"],
      ["aviation", "healthcare"]
    ),
    dependencies: [
      "inventory",
      "procurement",
      "logistics",
      "tasks",
      "workflows",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource: "warehouse.service + inventory-warehouse-readiness.service",
    uiMaturityNotes:
      "G6 readiness hub always on; MEEM logistics hub optional; location list from service or industry pack",
    futureDepth: [
      "Wave picking (advisory)",
      "Deeper 3PL handoff notes (future-only)",
    ],
    futureOnlyCapabilities: [
      "Barcode scan UI",
      "RFID",
      "IoT sensors",
      "Warehouse automation platform",
      "Real-time stock guarantees",
      "External warehouse APIs",
      "Full WMS",
    ],
  },
  {
    cemModuleKey: "logistics",
    erpKey: "logistics",
    label: "Logistics",
    routePattern: "/[tenant]/logistics",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Dispatch and delivery operations readiness — warehouse handoffs, exceptions, and cross-module coordination.",
    businessPurpose:
      "Coordinate dispatch readiness, delivery lifecycle checklists, warehouse-to-logistics handoffs, and exception review across inventory, procurement, CRM, finance, tasks, and reports — not a live TMS, GPS tracker, or carrier integration.",
    primaryUsers: [
      "Logistics operations manager",
      "Dispatch coordinator",
      "Warehouse supervisor",
      "Driver / field operator",
      "Customer account manager",
      "Finance manager",
      "Executive / owner",
      "Analyst",
    ],
    relatedDepartments: ["Logistics", "Transport", "Warehouse", "Commercial", "Finance"],
    ownedDataExamples: [
      "Dispatch readiness checklists",
      "Delivery exception review notes",
      "Warehouse outbound lane signals",
      "CRM escalation context",
      "Procurement handoff refs",
    ],
    commonWorkflows: [
      "Delivery request intake",
      "Dispatch assignment readiness",
      "Warehouse-to-logistics handoff",
      "Delivery exception review",
      "Proof-of-delivery review readiness",
      "Logistics-to-finance handoff (advisory)",
    ],
    approvalNeeds: [
      "Dispatch release review",
      "Delivery exception approval",
      "POD review readiness",
      "Logistics access review",
    ],
    reportSignals: [
      "Outbound lane count",
      "Logistics-related open tasks",
      "Matched logistics workflows",
      "CRM account linkage",
      "Procurement PR handoff count",
    ],
    cyberCrowRisks: [
      "Unauthorized dispatch changes",
      "Delivery exception fraud",
      "Proof-of-delivery dispute gaps",
      "Warehouse-to-logistics handoff gaps",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Dispatch assignment trail",
      "Warehouse-to-logistics handoff record",
      "Delivery exception review",
      "Proof-of-delivery review",
      "Logistics incident report",
    ],
    auditEvents: ["logistics.dispatch.reviewed", "logistics.exception.reviewed"],
    sareaExperienceHints: [
      "Dispatch coordinator: dispatch queue and handoff density",
      "Logistics manager: exception and lifecycle readiness",
      "Field operator: task lists — not GPS map UI",
      "CyberCrow reviewer: dispatch and exception evidence",
    ],
    sectorRelevance: rel(
      ["logistics"],
      ["retail", "construction"],
      ["aviation", "healthcare"]
    ),
    dependencies: [
      "warehouse",
      "inventory",
      "procurement",
      "crm",
      "finance",
      "tasks",
      "workflows",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource: "logistics-readiness.service + warehouse/inventory/procurement/crm/finance services",
    uiMaturityNotes:
      "G7 readiness hub always on when module enabled; MEEM logistics hub optional below; no live tracking UI",
    futureDepth: [
      "Carrier status webhooks (future-only)",
      "Deeper route planning notes (advisory)",
    ],
    futureOnlyCapabilities: [
      "Live GPS / telematics",
      "Carrier API integration",
      "Live proof-of-delivery capture",
      "Route optimization engine",
      "Automated dispatch",
      "AI dispatch / routing",
      "Delivery SLA guarantees",
      "Automated freight costing",
      "Full TMS",
    ],
  },
  {
    cemModuleKey: "finance",
    erpKey: "finance",
    label: "Finance",
    routePattern: "/[tenant]/finance",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Financial operations readiness — AR/AP coordination, billing handoffs, and approval trails when data exists.",
    businessPurpose:
      "Coordinate revenue and spend signals across sales, procurement, tasks, and reports without live payments or tax automation.",
    primaryUsers: [
      "Finance manager",
      "Procurement specialist",
      "Sales / CRM manager",
      "Executive / owner",
      "Analyst",
    ],
    relatedDepartments: ["Finance", "Procurement", "Sales", "Executive"],
    ownedDataExamples: [
      "Ledger lines (AR/AP)",
      "Open AR / AP SAR roll-ups",
      "Linked sales references",
      "Procurement finance refs",
    ],
    commonWorkflows: [
      "Billing review readiness",
      "Purchase approval",
      "Monthly finance report (advisory)",
      "Procurement-to-finance handoff",
    ],
    approvalNeeds: [
      "Purchase approval",
      "Billing review",
      "Financial exception review",
      "Plan / subscription review (advisory)",
    ],
    reportSignals: [
      "Open AR SAR",
      "Open AP SAR",
      "Finance entry count",
      "Sales pipeline SAR",
      "Procurement PR value",
    ],
    cyberCrowRisks: [
      "Unauthorized purchase approval",
      "Billing review gaps",
      "Procurement-to-finance handoff gaps",
      "Finance role misuse",
      SHARED_CYBER.audit,
    ],
    evidenceExamples: [
      "Purchase approval trail",
      "Billing review record",
      "Monthly finance report",
      "Subscription plan review",
    ],
    auditEvents: ["finance.entry.posted"],
    sareaExperienceHints: [
      "Finance manager: billing + procurement handoffs",
      "Executive: summary tiles and plan posture",
      "CyberCrow reviewer: evidence and approval trails",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [
      "sales",
      "procurement",
      "crm",
      "tasks",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource: "finance.service + finance-readiness.service",
    uiMaturityNotes:
      "G3 readiness hub + optional ledger list; plan/subscription advisory via settings; no live checkout",
    futureDepth: [
      "Advisory budget vs actual (no budget engine)",
      "Deeper sales-to-cash handoff (no payment processor)",
    ],
    futureOnlyCapabilities: [
      "Live payments",
      "Tax / VAT engine",
      "Bank integration",
      "Full general ledger",
      "Payment reconciliation automation",
    ],
  },
  {
    cemModuleKey: "procurement",
    erpKey: "procurement",
    label: "Procurement",
    routePattern: "/[tenant]/procurement",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Supplier and purchase operations readiness — PR intake, approvals, and finance/inventory handoffs.",
    businessPurpose:
      "Coordinate purchase requests and supplier touchpoints across finance, inventory, warehouse, tasks, and reports without live supplier payments or vendor marketplace automation.",
    primaryUsers: [
      "Procurement manager",
      "Buyer / procurement specialist",
      "Site manager",
      "Inventory controller",
      "Finance manager",
      "Executive / owner",
    ],
    relatedDepartments: ["Procurement", "Finance", "Warehouse", "Projects", "Maintenance"],
    ownedDataExamples: [
      "Purchase requests",
      "Vendor names on PRs",
      "Approval status",
      "Finance / inventory refs",
    ],
    commonWorkflows: [
      "Purchase request intake",
      "Purchase approval",
      "Procurement-to-finance handoff",
      "Procurement-to-inventory handoff",
      "Monthly procurement review (advisory)",
    ],
    approvalNeeds: [
      "PR approval",
      "Supplier approval readiness",
      "Procurement exception review",
      "Procurement access review",
    ],
    reportSignals: [
      "Open PR count",
      "PR value SAR",
      "PRs without finance link",
      "Procurement-related open tasks",
    ],
    cyberCrowRisks: [
      "Unauthorized purchase request",
      "Supplier approval abuse",
      "Purchase approval bypass",
      "Procurement-to-finance handoff gaps",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Purchase request approval trail",
      "Supplier approval evidence",
      "Procurement-to-finance handoff",
      "Procurement exception review",
    ],
    auditEvents: ["procurement.request.submitted"],
    sareaExperienceHints: [
      "Procurement manager: PR and supplier density",
      "Buyer: assigned PR tasks",
      "Executive: summary readiness tiles",
      "CyberCrow reviewer: approval trails",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [
      "finance",
      "inventory",
      "warehouse",
      "tasks",
      "workflows",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource: "procurement.service + procurement-readiness.service",
    uiMaturityNotes:
      "G5 readiness hub always on; MEEM logistics hub optional; PR list from service or industry pack",
    futureDepth: [
      "Deeper supplier master (no marketplace)",
      "Receiving automation hooks (advisory)",
    ],
    futureOnlyCapabilities: [
      "Live supplier payments",
      "Vendor marketplace",
      "AI supplier scoring",
      "Contract signing",
      "Procurement automation engine",
      "Bank integration",
      "Automated PO as legal document",
    ],
  },
  {
    cemModuleKey: "hr",
    erpKey: "hr",
    label: "HR",
    routePattern: "/[tenant]/hr",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Workforce operational readiness — people records, org linkage, and advisory onboarding/offboarding.",
    businessPurpose:
      "Coordinate workforce structure visibility across profiles, roles, departments, tasks, SAREA personas, and CyberCrow identity posture — not payroll or full HRMS.",
    primaryUsers: [
      "HR admin",
      "People ops",
      "Department manager",
      "Tenant admin",
      "CyberCrow reviewer (read-only)",
    ],
    relatedDepartments: ["HR", "People operations", "Line management"],
    ownedDataExamples: [
      "HR employee records",
      "Department assignment",
      "Profile–role linkage (via users)",
      "Workforce readiness signals",
    ],
    commonWorkflows: [
      "Onboarding readiness",
      "Offboarding readiness",
      "Role change",
      "Department transfer",
      "Access review (advisory)",
      "Policy acknowledgement readiness",
    ],
    approvalNeeds: ["Role change", "Sensitive profile edit", "Offboarding checklist"],
    reportSignals: [
      "Headcount (HR + profiles)",
      "Role coverage gaps",
      "Department mapping",
      "HR-related open tasks",
    ],
    cyberCrowRisks: [
      "Stale access after offboarding",
      "Overprivileged accounts",
      "HR/profile email mismatch",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Onboarding approval trail",
      "Offboarding checklist",
      "Role change approval",
      "Access review record",
    ],
    auditEvents: ["hr.employee.updated", "hr.role.assigned"],
    sareaExperienceHints: [
      "RBAC on users/roles",
      "Persona density via SAREA profiles",
      "HR hub: readiness summary",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["departments", "roles", "users", "tasks", "reports", "cybercrow"],
    implementationStatus: "workflow_linked",
    dataSource: "hr.service + hr-readiness.service + tenant identity",
    uiMaturityNotes:
      "G2 depth: workforce readiness panel, org linkage banners, workflow recommendations — operator-managed",
    futureDepth: [
      "Leave management (future-only)",
      "Payroll export (future-only — not in scope)",
    ],
  },
  {
    cemModuleKey: "crm",
    erpKey: "crm",
    label: "CRM",
    routePattern: "/[tenant]/crm",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "CRM readiness — client/account context, request-to-account linkage, and escalation coordination when records exist.",
    businessPurpose:
      "Support commercial operations readiness with operator-managed accounts and contacts — not a full CRM/SFA product.",
    primaryUsers: [
      "Account manager",
      "Customer success",
      "Sales ops",
      "Customer service agent",
      "Tenant admin",
      "CyberCrow reviewer",
    ],
    relatedDepartments: ["Sales", "Customer success", "Finance", "Operations"],
    ownedDataExamples: [
      "Accounts",
      "Contacts",
      "Implementation request reference (blueprint)",
      "Account-to-contact linkage",
    ],
    commonWorkflows: [
      "Account intake readiness",
      "Customer issue escalation",
      "Account review",
      "Customer data review",
      "Request-to-account handoff",
      "Client communication follow-up",
    ],
    approvalNeeds: [
      "Credit limit override (advisory)",
      "Master data merge",
      "Customer access / privacy review",
    ],
    reportSignals: [
      "Account count",
      "Contact count",
      "Accounts without contacts",
      "CRM-related open tasks",
      "Request linkage present",
    ],
    cyberCrowRisks: [
      "Customer data exposure",
      "Unauthorized account changes",
      "Stale customer access",
      "Customer issue audit gaps",
      "Privacy / access review gaps",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Account review record",
      "Customer issue escalation trail",
      "Request-to-account handoff",
      "Role / access review for account managers",
    ],
    auditEvents: ["crm.account.updated", "crm.contact.updated"],
    sareaExperienceHints: [
      "Account manager: account + escalation context",
      "Customer service: issue / escalation workflows",
      "Executive: account posture summary",
      "Sales manager: join to Sales pipeline",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["sales", "finance", "tasks", "reports", "workflows", "cybercrow"],
    implementationStatus: "operational_list",
    dataSource: "crm.service + crm-sales-readiness.service",
    uiMaturityNotes:
      "G4 depth: commercial readiness panel, request linkage, forms/lists — honest empty states",
    futureDepth: [
      "Case management (future-only)",
      "Marketing lists (future-only)",
      "External CRM sync (future-only)",
    ],
    futureOnlyCapabilities: [
      "Marketing automation",
      "Email campaigns",
      "AI lead scoring",
      "Full CRM replacement",
      "External CRM integrations",
      "Automated compliance",
    ],
  },
  {
    cemModuleKey: "approvals",
    erpKey: "tasks",
    label: "Tasks / Approvals",
    routePattern: "/[tenant]/tasks",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Cross-module task coordination and approval readiness — workflow-linked review queues across ERP hubs.",
    businessPurpose:
      "Coordinate operator-guided tasks and advisory approval paths across HR, Finance, CRM, Sales, Procurement, Inventory, Warehouse, Logistics, and Reports — not BPMN, RPA, autonomous approvals, or AI task assignment.",
    primaryUsers: [
      "Approver",
      "Process owner",
      "Department manager",
      "Operations manager",
      "Executive / owner",
      "Frontline operator",
      "CyberCrow reviewer",
    ],
    relatedDepartments: ["All departments", "Operations", "Finance", "Compliance"],
    ownedDataExamples: [
      "Task rows and status",
      "Workflow linkage",
      "Assignee references",
      "Module handoff tasks (advisory)",
    ],
    commonWorkflows: [
      "Cross-module approval intake",
      "Workflow-to-task linkage",
      "Module handoff review",
      "Monthly operations review",
      "Access / role review",
    ],
    approvalNeeds: [
      "Onboarding / offboarding review",
      "Purchase and supplier approval",
      "Stock adjustment and movement review",
      "Dispatch and exception review",
      "Finance billing / expense review",
    ],
    reportSignals: [
      "Total and open task counts",
      "Unassigned tasks",
      "Tasks without workflow link",
      "Workflows with / without tasks",
      "Module approval map coverage",
    ],
    cyberCrowRisks: [
      "Unauthorized approval changes",
      "Stale or unassigned critical tasks",
      "Missing approval trail",
      "Module handoff gaps",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Task assignment record",
      "Approval trail",
      "Review decision record",
      "Module handoff record",
      "Workflow status history",
    ],
    auditEvents: ["task.completed", "task.assigned", "workflow.updated"],
    sareaExperienceHints: [
      "Approver: task inbox density",
      "Department manager: team tasks and handoffs",
      "Executive: exception and readiness summary",
      "CyberCrow reviewer: approval evidence — advisory",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [
      "workflows",
      "hr",
      "finance",
      "crm",
      "sales",
      "procurement",
      "inventory",
      "warehouse",
      "logistics",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource:
      "tenant-identity.service + cem-operations-intelligence + task-approval-readiness.service",
    uiMaturityNotes:
      "G8 readiness hub on Tasks and Workflows; module hubs link here; no external workflow engine",
    futureDepth: [
      "SLA timers (advisory)",
      "Bulk approve with evidence (future-only)",
      "Delegation rules (future-only)",
    ],
    futureOnlyCapabilities: [
      "BPMN engine",
      "Robotic process automation",
      "Autonomous approvals",
      "AI task assignment",
      "External workflow automation",
      "Legal e-sign",
      "Compliance automation",
    ],
  },
  {
    cemModuleKey: "bi",
    erpKey: "reports",
    label: "Reports / BI",
    routePattern: "/[tenant]/reports",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Cross-module KPIs and executive snapshots (lightweight BI).",
    businessPurpose: "Roll up module signals for advisory intelligence — not autonomous analytics.",
    primaryUsers: ["COO", "CFO", "Department head"],
    relatedDepartments: ["Executive", "Finance", "Operations"],
    ownedDataExamples: ["KPI definitions", "Snapshot tiles", "Module roll-ups"],
    commonWorkflows: ["Weekly ops review", "Board pack (advisory)"],
    approvalNeeds: ["Publish dashboard (future)"],
    reportSignals: ["All module reportSignals aggregate here"],
    cyberCrowRisks: ["Export of sensitive KPIs", SHARED_CYBER.access],
    evidenceExamples: ["Report run log", "Snapshot export"],
    auditEvents: ["reports.snapshot.generated"],
    sareaExperienceHints: ["Executive: low density charts", "Analyst: table forward"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["sales", "finance", "inventory", "logistics", "hr"],
    implementationStatus: "evidence_report_linked",
    dataSource: "reports.service + workspace summary",
    uiMaturityNotes: "BI hub; links from modules page when bi enabled",
    futureDepth: ["Custom dashboards", "Scheduled email (future-only)"],
    futureOnlyCapabilities: ["Autonomous insights", "Predictive forecasting"],
  },
  {
    cemModuleKey: "workflows",
    label: "Workflows",
    routePattern: "/[tenant]/workflows",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription:
      "Workflow definitions and advisory approval-chain readiness — linked to tasks and module hubs.",
    businessPurpose:
      "Surface named workflow templates and step sequences that coordinate tasks and evidence hooks across departments — operator-guided definitions, not a live BPM or automation platform.",
    primaryUsers: [
      "Process owner",
      "Ops excellence",
      "Tenant admin",
      "Department manager",
      "CyberCrow reviewer",
    ],
    relatedDepartments: ["Operations", "IT", "Compliance", "All departments"],
    ownedDataExamples: [
      "Workflow definitions",
      "Step sequences",
      "Active / inactive status",
      "Task linkage counts",
    ],
    commonWorkflows: [
      "Workflow-to-task linkage",
      "Approval chain readiness (advisory)",
      "Cross-module handoff",
      "Monthly operations review",
      "MEEM OCR review (demo layer only)",
    ],
    approvalNeeds: [
      "Recommended approver paths",
      "Workflow publish review (future)",
      "Step reorder review (future)",
    ],
    reportSignals: [
      "Active workflow count",
      "Workflows with tasks",
      "Workflows without tasks",
      "Keyword-matched approval workflows",
    ],
    cyberCrowRisks: [
      "Workflow tampering",
      "Workflow status manipulation without audit",
      SHARED_CYBER.audit,
    ],
    evidenceExamples: [
      "Workflow definition record",
      "Workflow status history",
      "Linked task trail",
    ],
    auditEvents: ["workflow.updated"],
    sareaExperienceHints: [
      "Admin: workflow readiness and role mapping",
      "Process owner: read-only catalog with advisory next actions",
      "User: deep-link to Tasks board",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [
      "tasks",
      "departments",
      "roles",
      "users",
      "reports",
      "cybercrow",
    ],
    implementationStatus: "workflow_linked",
    dataSource:
      "tenant-identity.service + cem-operations-intelligence + task-approval-readiness.service",
    uiMaturityNotes:
      "G8 readiness panel on Workflows; MEEM OCR links are demo-only; no visual designer in this phase",
    futureDepth: [
      "Visual designer (future-only)",
      "Versioned publish",
      "Enforced approval chains (future-only)",
    ],
    futureOnlyCapabilities: [
      "BPMN designer",
      "External workflow engine",
      "Autonomous workflow execution",
      "RPA connectors",
    ],
  },
  {
    cemModuleKey: "departments",
    label: "Departments",
    routePattern: "/[tenant]/departments",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Department tree for org structure and RBAC context.",
    businessPurpose: "Organize people and approvals by department.",
    primaryUsers: ["HR admin", "Tenant admin"],
    relatedDepartments: ["HR", "IT"],
    ownedDataExamples: ["Department nodes", "Parent/child"],
    commonWorkflows: ["Org restructure", "Cost center mapping (advisory)"],
    approvalNeeds: ["Department delete", "Merge"],
    reportSignals: ["Headcount by department"],
    cyberCrowRisks: [SHARED_CYBER.access],
    evidenceExamples: ["Org change ticket"],
    auditEvents: ["department.updated"],
    sareaExperienceHints: ["Rarely frontline-facing"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["hr", "roles"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "List page; discovery seeds structure",
    futureDepth: ["Hierarchy drag-drop", "Delegated admin"],
  },
  {
    cemModuleKey: "roles",
    label: "Roles",
    routePattern: "/[tenant]/roles",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant roles for RBAC — separate from SAREA experience profiles.",
    businessPurpose: "Control which modules and actions operators may access.",
    primaryUsers: ["Security admin", "Tenant admin"],
    relatedDepartments: ["IT", "Security"],
    ownedDataExamples: ["Role definitions", "Permission bundles (advisory)"],
    commonWorkflows: ["Role assignment", "Access review"],
    approvalNeeds: ["Privileged role grant"],
    reportSignals: ["Role count", "Users per role"],
    cyberCrowRisks: ["Excessive admin roles", SHARED_CYBER.audit],
    evidenceExamples: ["Access review export"],
    auditEvents: ["role.permission.changed"],
    sareaExperienceHints: ["Maps to SAREA role-mapping — experience not access"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["users", "sarea"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "List + linkage to CyberCrow identity advisory",
    futureDepth: ["Fine-grained permissions", "SoD rules (advisory)"],
  },
  {
    cemModuleKey: "users",
    label: "Users",
    routePattern: "/[tenant]/users",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant user directory and membership.",
    businessPurpose: "Bind auth identities to roles and departments.",
    primaryUsers: ["Tenant admin", "IT support"],
    relatedDepartments: ["IT", "HR"],
    ownedDataExamples: ["User records", "Role membership"],
    commonWorkflows: ["Invite user", "Deactivate", "Reset access (advisory)"],
    approvalNeeds: ["Admin invite", "Role elevation"],
    reportSignals: ["Active users"],
    cyberCrowRisks: ["Dormant admin accounts", SHARED_CYBER.audit],
    evidenceExamples: ["Joiner/mover/leaver log"],
    auditEvents: ["user.role.changed"],
    sareaExperienceHints: ["Admin console density"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["roles", "hr"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "Operational list",
    futureDepth: ["SCIM (future-only)", "Entra group sync (future-only)"],
    futureOnlyCapabilities: ["Autonomous access provisioning"],
  },
  {
    cemModuleKey: "branches",
    label: "Branches",
    routePattern: "/[tenant]/branches",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Physical locations seeded from discovery.",
    businessPurpose: "Anchor multi-site ops for retail, logistics, and construction tenants.",
    primaryUsers: ["Ops admin", "Regional manager"],
    relatedDepartments: ["Operations", "Facilities"],
    ownedDataExamples: ["Branch name", "City", "Region"],
    commonWorkflows: ["Site opening", "Regional rollup"],
    approvalNeeds: ["Branch closure"],
    reportSignals: ["Sites by region"],
    cyberCrowRisks: ["Wrong-site data access"],
    evidenceExamples: ["Site charter document"],
    auditEvents: ["branch.created"],
    sareaExperienceHints: ["Regional manager: branch switcher (future)"],
    sectorRelevance: rel(["retail", "logistics", "construction"], ["aviation"], ["healthcare"]),
    dependencies: ["inventory", "hr"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "Simple list — thin but functional",
    futureDepth: ["Geo map", "Hours of operation"],
  },
  {
    cemModuleKey: "modules",
    label: "Modules",
    routePattern: "/[tenant]/modules",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Enabled CEM modules and operational depth advisory grid.",
    businessPurpose: "Self-describing map of what is enabled vs catalog-only on this tenant.",
    primaryUsers: ["Tenant admin", "Solution lead"],
    relatedDepartments: ["IT", "Transformation"],
    ownedDataExamples: ["TenantModule rows", "Enable flags"],
    commonWorkflows: ["Blueprint alignment", "Enable module"],
    approvalNeeds: ["Module entitlement change (advisory)"],
    reportSignals: ["Enabled module count"],
    cyberCrowRisks: ["Shadow modules enabled"],
    evidenceExamples: ["Blueprint module manifest"],
    auditEvents: ["tenant.module.enabled"],
    sareaExperienceHints: ["Admin overview — not frontline"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [],
    implementationStatus: "readiness_page",
    dataSource: "tenant.modules + erp-module-catalog",
    uiMaturityNotes: "TenantModulesOperationalGrid — uses catalog purpose copy",
    futureDepth: ["Dependency warnings", "Sector fit score from matrix"],
  },
  {
    cemModuleKey: "dashboard",
    label: "Tenant dashboard",
    routePattern: "/[tenant]/dashboard",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Command center entry with cross-module snapshot.",
    businessPurpose: "Orient operators to open tasks, workflows, and module shortcuts.",
    primaryUsers: ["All tenant users"],
    relatedDepartments: ["Executive", "Operations"],
    ownedDataExamples: ["Summary counts", "Quick links"],
    commonWorkflows: ["Daily stand-up", "Ops pulse"],
    approvalNeeds: [],
    reportSignals: ["Aggregated KPI teasers"],
    cyberCrowRisks: ["Overprivileged dashboard widgets"],
    evidenceExamples: [],
    auditEvents: [],
    sareaExperienceHints: ["Role-based widget sets (future)"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["tasks", "reports", "workflows"],
    implementationStatus: "operational_list",
    dataSource: "workspace-summary + ops snapshot",
    uiMaturityNotes: "CEM command center — cross-links",
    futureDepth: ["Personalized layouts", "Sector dashboard packs"],
  },
  {
    cemModuleKey: "settings",
    label: "Settings / Plan",
    routePattern: "/[tenant]/settings",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant settings and plan readiness (no live billing).",
    businessPurpose: "Show entitlement and configuration posture — advisory only.",
    primaryUsers: ["Tenant admin"],
    relatedDepartments: ["IT", "Finance"],
    ownedDataExamples: ["Plan tier (advisory)", "Feature flags"],
    commonWorkflows: ["Plan review"],
    approvalNeeds: [],
    reportSignals: [],
    cyberCrowRisks: ["Misconfigured auth settings"],
    evidenceExamples: ["Plan change request"],
    auditEvents: ["tenant.settings.updated"],
    sareaExperienceHints: ["Admin-only"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [],
    implementationStatus: "readiness_page",
    dataSource: "tenant record + billing advisory routes",
    uiMaturityNotes: "Plan page — billing deferred per F23 gate (advisory)",
    futureDepth: ["Usage meters", "Checkout (explicitly deferred)"],
    futureOnlyCapabilities: ["Live Stripe billing", "Usage enforcement"],
  },
  {
    cemModuleKey: "iam",
    label: "IAM (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Identity alignment with CyberCrow sessions and RBAC.",
    businessPurpose: "CEM catalog key for identity — surfaces via CyberCrow and modules grid.",
    primaryUsers: ["Security admin"],
    relatedDepartments: ["IT", "Security"],
    ownedDataExamples: ["Session policy (advisory)", "Identity provider refs"],
    commonWorkflows: ["Access review"],
    approvalNeeds: ["IdP config change"],
    reportSignals: [],
    cyberCrowRisks: ["Session fixation", "Weak MFA policy (advisory)"],
    evidenceExamples: ["Identity review export"],
    auditEvents: ["identity.provider.updated"],
    sareaExperienceHints: ["Link from modules grid to CyberCrow identity"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["cybercrow"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "No /[tenant]/iam route — CyberCrow identity instead",
    futureDepth: ["Unified IAM route", "Entra tile"],
  },
  {
    cemModuleKey: "projects",
    label: "Projects (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Project delivery tracking (lightweight in this phase).",
    businessPurpose: "Future project entity for construction and professional services.",
    primaryUsers: ["Project manager"],
    relatedDepartments: ["Projects", "Engineering"],
    ownedDataExamples: ["WBS (future)", "Milestones (future)"],
    commonWorkflows: ["Stage gate (future)"],
    approvalNeeds: ["Budget transfer"],
    reportSignals: ["Earned value (future)"],
    cyberCrowRisks: ["Shared project folder exposure"],
    evidenceExamples: ["Stage approval"],
    auditEvents: [],
    sareaExperienceHints: ["PM desktop density"],
    sectorRelevance: rel(["construction"], ["aviation", "logistics"], ["retail", "healthcare"]),
    dependencies: ["tasks", "procurement", "finance"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "Not a live tenant route — use tasks/workflows today",
    futureDepth: ["Project hub route", "Cost codes"],
    futureOnlyCapabilities: ["Full PSA suite"],
  },
  {
    cemModuleKey: "documents",
    label: "Documents (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Document control hooks (advisory in demo).",
    businessPurpose: "Future document vault linked to evidence and workflows.",
    primaryUsers: ["Compliance", "Quality"],
    relatedDepartments: ["Legal", "Quality"],
    ownedDataExamples: ["Document refs (future)", "Version (future)"],
    commonWorkflows: ["Controlled publish (future)"],
    approvalNeeds: ["Document release"],
    reportSignals: [],
    cyberCrowRisks: ["Uncontrolled document share"],
    evidenceExamples: ["Signed PDF", "Policy attestation"],
    auditEvents: [],
    sareaExperienceHints: ["Read-only viewer for frontline"],
    sectorRelevance: rel(["healthcare", "aviation", "construction"], ["logistics", "retail"]),
    dependencies: ["cybercrow", "tasks"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "Advisory only — evidence via CyberCrow",
    futureDepth: ["Document route", "Retention labels"],
    futureOnlyCapabilities: ["Autonomous classification"],
  },
];

const BY_CEM = new Map(ERP_MODULE_CATALOG.map((e) => [e.cemModuleKey, e]));
const BY_ERP = new Map(
  ERP_MODULE_CATALOG.filter((e) => e.erpKey).map((e) => [e.erpKey!, e])
);

export const LIVE_ERP_CATALOG_ENTRIES = ERP_MODULE_CATALOG.filter(
  (e) => e.category === "core_erp" && e.hasTenantRoute
);

export const ERP_MODULE_CATALOG_CEM_KEYS = ERP_MODULE_CATALOG.map((e) => e.cemModuleKey);

export function getErpModuleCatalogEntry(
  cemOrErpKey: string
): ErpModuleCatalogEntry | undefined {
  return BY_CEM.get(cemOrErpKey) ?? BY_ERP.get(cemOrErpKey as ErpModuleKey);
}

export function getCatalogShortPurpose(moduleKey: string): string | undefined {
  return getErpModuleCatalogEntry(moduleKey)?.shortDescription;
}
