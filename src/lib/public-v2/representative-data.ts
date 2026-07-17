import type {
  PublicBlueprintTabId,
  PublicFoundationLayerId,
  PublicRuntimeAreaId,
  PublicSareaRoleId,
} from "./types";

export type PublicBlueprintTabData = {
  id: PublicBlueprintTabId;
  label: string;
  summary: string;
  items: readonly { label: string; value: string }[];
};

export const PUBLIC_BLUEPRINT_TABS: readonly PublicBlueprintTabData[] = [
  {
    id: "intent",
    label: "Intent",
    summary: "Why the organization exists and what outcomes matter.",
    items: [
      { label: "Purpose", value: "Regional logistics coordination for GCC distributors" },
      { label: "Scope", value: "Operations, procurement, warehouse, finance oversight" },
      { label: "Growth trigger", value: "Second hub opening in Dammam within 18 months" },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    summary: "Structure, branches, and authoritative roles.",
    items: [
      { label: "Entity", value: "Al-Najd Supply Collective — holding + 2 operating branches" },
      { label: "Departments", value: "Operations, Procurement, Warehouse, Finance, HR" },
      { label: "Roles", value: "COO, Branch Manager, Procurement Lead, Warehouse Supervisor" },
    ],
  },
  {
    id: "work",
    label: "Work",
    summary: "Responsibilities, Work Personas, and core workflows.",
    items: [
      { label: "Work Personas", value: "Hub Coordinator, Receiving Clerk, Procurement Analyst" },
      { label: "Workflows", value: "Purchase-to-stock, inbound inspection, vendor onboarding" },
      { label: "States", value: "Draft → Approved → In transit → Received → Closed" },
    ],
  },
  {
    id: "trust",
    label: "Trust",
    summary: "Identity, evidence, and information boundaries.",
    items: [
      { label: "Identity", value: "Entra SSO + verified phone for privileged actions" },
      { label: "Evidence", value: "Decision logs, approval trails, document retention" },
      { label: "Boundaries", value: "Branch-scoped data, finance segregation of duties" },
    ],
  },
  {
    id: "build",
    label: "Build",
    summary: "Modules, readiness, and tenant provisioning plan.",
    items: [
      { label: "Modules", value: "Procurement, Inventory, Warehouse, Finance (readiness)" },
      { label: "Readiness", value: "Blueprint approved — tenant build staged" },
      { label: "Isolation", value: "Dedicated tenant boundary with audit baseline" },
    ],
  },
];

export type PublicSareaRoleData = {
  id: PublicSareaRoleId;
  label: string;
  emphasis: string;
  workspaceFocus: readonly string[];
  navHighlights: readonly string[];
};

export const PUBLIC_SAREA_ROLES: readonly PublicSareaRoleData[] = [
  {
    id: "executive",
    label: "Executive",
    emphasis: "Outcomes, risk posture, and strategic attention",
    workspaceFocus: ["Portfolio outcomes", "Approval exceptions", "Trust summary"],
    navHighlights: ["Executive dashboard", "Risk & compliance", "Approvals"],
  },
  {
    id: "manager",
    label: "Manager",
    emphasis: "Team workload, decisions, and operational rhythm",
    workspaceFocus: ["Team work queue", "Decision backlog", "Branch performance"],
    navHighlights: ["My team", "Decisions", "Reports"],
  },
  {
    id: "specialist",
    label: "Specialist",
    emphasis: "Domain workflows and accountable handoffs",
    workspaceFocus: ["Procurement pipeline", "Vendor evidence", "Workflow states"],
    navHighlights: ["Procurement", "Vendors", "Tasks"],
  },
  {
    id: "frontline",
    label: "Frontline",
    emphasis: "Immediate tasks and clear next actions",
    workspaceFocus: ["Receiving queue", "Inspection checklist", "Handoff confirmations"],
    navHighlights: ["My work", "Receiving", "Checklists"],
  },
  {
    id: "analyst",
    label: "Analyst",
    emphasis: "Evidence, trends, and audit-ready views",
    workspaceFocus: ["Evidence trails", "Operational metrics", "Export packages"],
    navHighlights: ["Evidence", "Analytics", "Audit views"],
  },
];

export type PublicRuntimeAreaData = {
  id: PublicRuntimeAreaId;
  label: string;
  description: string;
  sampleItems: readonly { title: string; meta: string; status?: "active" | "complete" | "critical" }[];
};

export const PUBLIC_RUNTIME_AREAS: readonly PublicRuntimeAreaData[] = [
  {
    id: "attention",
    label: "My Attention",
    description: "What needs your focus now — prioritized by role and operating context.",
    sampleItems: [
      { title: "Approve vendor tier change", meta: "Procurement · Due today", status: "active" },
      { title: "Review hub capacity alert", meta: "Operations · 2h ago", status: "active" },
    ],
  },
  {
    id: "work",
    label: "My Work",
    description: "Assigned responsibilities and workflow tasks in clear states.",
    sampleItems: [
      { title: "PO-2847 — inbound shipment", meta: "Receiving · In progress", status: "active" },
      { title: "Vendor onboarding — Gulf Parts", meta: "Procurement · Waiting evidence", status: "active" },
    ],
  },
  {
    id: "decisions",
    label: "My Decisions",
    description: "Decisions awaiting judgment with context and accountability.",
    sampleItems: [
      { title: "Exception: partial receipt approval", meta: "Warehouse · Needs decision", status: "active" },
      { title: "Budget reallocation — Q3 hub", meta: "Finance · Reviewed", status: "complete" },
    ],
  },
  {
    id: "evidence",
    label: "My Evidence",
    description: "Supporting records, approvals, and audit-linked artifacts.",
    sampleItems: [
      { title: "Inspection photos — Bay 3", meta: "Attached · Verified", status: "complete" },
      { title: "Delegation record — acting manager", meta: "CyberCrow · On file", status: "complete" },
    ],
  },
  {
    id: "outcomes",
    label: "My Outcomes",
    description: "Results tied to responsibilities — not vanity metrics.",
    sampleItems: [
      { title: "Hub receiving SLA — 94%", meta: "This month · On track", status: "complete" },
      { title: "Open risk: dual approval gap", meta: "Trust · Review scheduled", status: "critical" },
    ],
  },
];

export type PublicFoundationLayerData = {
  id: PublicFoundationLayerId;
  label: string;
  role: string;
  description: string;
};

export const PUBLIC_FOUNDATION_LAYERS: readonly PublicFoundationLayerData[] = [
  {
    id: "cem",
    label: "CEM",
    role: "Operations",
    description:
      "Runs operational work, responsibilities, workflows, states, capabilities, and outcomes.",
  },
  {
    id: "cybercrow",
    label: "CyberCrow",
    role: "Trust",
    description:
      "Protects identity, decisions, evidence, information boundaries, auditability, and operational trust.",
  },
  {
    id: "sarea",
    label: "SAREA",
    role: "Experience",
    description:
      "Adapts the permitted presentation for each role, Work Persona, and operating context.",
  },
  {
    id: "procrow",
    label: "ProCrow",
    role: "Governance",
    description:
      "Makes Crow's intelligence accountable through review, provenance, Blueprint approval, tenant readiness, and lifecycle governance.",
  },
];

export const PUBLIC_TRUST_EVIDENCE = [
  "Authoritative server-side roles",
  "Tenant isolation",
  "Identity verification",
  "Audit evidence",
  "Approval controls",
  "Risk visibility",
  "Blueprint approval before tenant build",
] as const;

export const REPRESENTATIVE_ORG_NAME = "Al-Najd Supply Collective" as const;
