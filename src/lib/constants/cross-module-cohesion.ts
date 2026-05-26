/**
 * G10 — Cross-module runtime cohesion model (rule-based, operator-guided).
 * Not autonomous AI, predictive analytics, or certified compliance.
 */

import type { ExecutiveRollupCategoryId } from "@/lib/constants/reports-bi-readiness-depth";

export type CohesionChainId =
  | "commercial"
  | "supply_chain"
  | "workforce"
  | "control"
  | "experience"
  | "trust";

/** Tenant / blueprint module keys used for coverage checks (CEM keys). */
export type CohesionChainDefinition = {
  key: CohesionChainId;
  label: string;
  purpose: string;
  /** Human-readable module / surface names for docs and UI. */
  modulesInvolved: readonly string[];
  /** CEM `moduleKey` values that should be enabled for full chain coverage. */
  cemKeysForCoverage: readonly string[];
  /** Executive roll-up categories that inform this chain (G9 signals). */
  relatedRollupIds: readonly ExecutiveRollupCategoryId[];
  /** Logical handoffs — advisory; evaluated against enablement + workspace signals. */
  requiredHandoffs: readonly { label: string; from: string; to: string }[];
  cybercrowEvidenceExamples: readonly string[];
  sareaImplications: readonly string[];
  reportKpiSignals: readonly string[];
  weakLinkIndicators: readonly string[];
  recommendedOperatorActions: readonly string[];
  /** When true, chain status is capped at `limited_data` if CyberCrow is not initialized. */
  requiresCybercrowInitialized?: boolean;
};

export const COHESION_CHAINS: readonly CohesionChainDefinition[] = [
  {
    key: "commercial",
    label: "Commercial chain",
    purpose:
      "Connect pipeline and customer context through revenue recognition and executive reporting — operator-guided handoffs only.",
    modulesInvolved: ["CRM", "Sales", "Finance", "Reports / BI"],
    cemKeysForCoverage: ["crm", "sales", "finance", "bi"],
    relatedRollupIds: ["commercial", "finance"],
    requiredHandoffs: [
      { label: "Account context for deals", from: "crm", to: "sales" },
      { label: "Commercial signals to ledger", from: "sales", to: "finance" },
      { label: "Executive roll-up and cadence", from: "finance", to: "bi" },
    ],
    cybercrowEvidenceExamples: [
      "Commercial approval or discount exception evidence (when workflows touch privileged actions).",
      "Identity and session posture for sales operators (advisory CyberCrow hub).",
    ],
    sareaImplications: [
      "Commercial personas see CRM/Sales density; Finance widgets stay scoped by RBAC.",
      "Executive persona leans on Reports / BI without duplicating full ERP depth.",
    ],
    reportKpiSignals: [
      "Commercial readiness roll-up (CRM/Sales).",
      "Finance readiness and AR/AP advisory KPIs.",
      "Monthly executive review workflow (advisory cadence).",
    ],
    weakLinkIndicators: [
      "CRM enabled without Sales (or vice versa) — fragmented commercial story.",
      "Finance disabled while Sales enabled — revenue signals lack ledger companion.",
      "Reports / BI disabled — no shared executive surface for the chain.",
    ],
    recommendedOperatorActions: [
      "Open CRM and Sales hubs to align pipeline fields before finance handoff.",
      "Run Finance readiness review then attach Reports / BI monthly cadence.",
    ],
  },
  {
    key: "supply_chain",
    label: "Supply chain",
    purpose:
      "Trace spend and inbound material through stock, warehouse moves, logistics, and cost visibility into reporting.",
    modulesInvolved: ["Procurement", "Inventory", "Warehouse", "Logistics", "Finance", "Reports / BI"],
    cemKeysForCoverage: ["procurement", "inventory", "warehouse", "logistics", "finance", "bi"],
    relatedRollupIds: ["procurement", "supply_chain", "logistics", "finance"],
    requiredHandoffs: [
      { label: "Inbound material", from: "procurement", to: "inventory" },
      { label: "Location balances", from: "warehouse", to: "inventory" },
      { label: "Dispatch throughput", from: "warehouse", to: "logistics" },
      { label: "Shipment billing hooks", from: "logistics", to: "finance" },
      { label: "Ops KPI roll-up", from: "finance", to: "bi" },
    ],
    cybercrowEvidenceExamples: [
      "Procurement approval evidence for high-value POs (advisory).",
      "Logistics exception or route-change evidence when workflows require sign-off.",
    ],
    sareaImplications: [
      "Warehouse and logistics operators see movement-oriented widgets; analysts see BI slices.",
      "SAREA navigation density follows enabled supply modules — not automatic orchestration.",
    ],
    reportKpiSignals: [
      "Supply chain readiness (inventory + warehouse).",
      "Logistics dispatch roll-up when module enabled.",
      "Procurement spend context in BI hub.",
    ],
    weakLinkIndicators: [
      "Procurement without Inventory — spend signals lack stock companion.",
      "Warehouse without Logistics — physical moves lack dispatch surface.",
      "No Finance — cost and accrual handoff to reporting is incomplete.",
    ],
    recommendedOperatorActions: [
      "Enable missing companion modules in blueprint order (Procurement → Inventory → Warehouse → Logistics).",
      "Review Logistics readiness then wire monthly supply review in Reports / BI.",
    ],
  },
  {
    key: "workforce",
    label: "Workforce chain",
    purpose:
      "Ground people data in directory structure, access roles, SAREA experience, and task coordination — RBAC-led.",
    modulesInvolved: ["HR", "Users", "Roles", "SAREA experience", "Tasks / Approvals"],
    cemKeysForCoverage: ["hr", "users", "roles", "approvals"],
    relatedRollupIds: ["people_hr", "tasks_approvals", "sarea"],
    requiredHandoffs: [
      { label: "Org structure to access", from: "hr", to: "users" },
      { label: "Access to experience mapping", from: "roles", to: "sarea" },
      { label: "Work coordination", from: "roles", to: "approvals" },
    ],
    cybercrowEvidenceExamples: [
      "HR access review or privileged HR change evidence (advisory CyberCrow).",
      "Task approval trails that reference role changes (when tasks module enabled).",
    ],
    sareaImplications: [
      "SAREA profiles and role mapping determine what each persona sees — separate from raw RBAC in CEM.",
      "Frontline personas see task slices; tenant admins see roles/profile mapping tools in studio.",
    ],
    reportKpiSignals: [
      "People / HR readiness roll-up.",
      "Tasks / approvals coordination signals in BI hub when enabled.",
    ],
    weakLinkIndicators: [
      "HR enabled without Roles — experience mapping starves.",
      "Roles without Tasks — coordination exists but no approval queue surface.",
      "SAREA personas not materialized — experience chain is advisory-only.",
    ],
    recommendedOperatorActions: [
      "Verify Users and Roles modules with HR stakeholders.",
      "Align SAREA role mapping after directory stabilizes.",
    ],
    requiresCybercrowInitialized: false,
  },
  {
    key: "control",
    label: "Control chain",
    purpose:
      "Link coordinated work (tasks, workflows) to evidence-friendly reporting — operators remain in the loop.",
    modulesInvolved: ["Tasks / Approvals", "Workflows", "CyberCrow evidence", "Reports / BI"],
    cemKeysForCoverage: ["approvals", "workflows", "bi"],
    relatedRollupIds: ["tasks_approvals", "cybercrow"],
    requiredHandoffs: [
      { label: "Structured multi-step work", from: "workflows", to: "approvals" },
      { label: "Evidence context for reporting", from: "approvals", to: "bi" },
    ],
    cybercrowEvidenceExamples: [
      "Task approval trails referenced in monthly reporting evidence packs (advisory).",
      "Privileged workflow completion notes in evidence hub when CyberCrow initialized.",
    ],
    sareaImplications: [
      "Operations managers see workflow chains in navigation when modules enabled.",
      "CyberCrow reviewers cross-check task-driven evidence from security hub.",
    ],
    reportKpiSignals: [
      "Tasks / approvals readiness in executive roll-up.",
      "Recommended report workflows spanning modules (advisory cadence).",
    ],
    weakLinkIndicators: [
      "Workflows defined but Tasks disabled — coordination signal gap.",
      "CyberCrow not initialized — evidence column in reporting stays placeholder.",
    ],
    recommendedOperatorActions: [
      "Clear or assign open tasks before executive review.",
      "Initialize CyberCrow when task-heavy modules need evidence context.",
    ],
    requiresCybercrowInitialized: true,
  },
  {
    key: "experience",
    label: "Experience chain",
    purpose:
      "Ensure role-to-profile mapping flows into navigation, widgets, and preview surfaces — experience layer only.",
    modulesInvolved: ["Roles", "SAREA profiles", "Navigation", "Widgets", "Preview"],
    cemKeysForCoverage: ["roles", "users"],
    relatedRollupIds: ["sarea", "tasks_approvals", "people_hr"],
    requiredHandoffs: [
      { label: "Directory to roles", from: "users", to: "roles" },
      { label: "Roles to SAREA profiles", from: "roles", to: "sarea" },
    ],
    cybercrowEvidenceExamples: [
      "SAREA mapping review notes stored as operational evidence (advisory, not certification).",
    ],
    sareaImplications: [
      "Studio paths: profiles, role mapping, navigation, widgets, preview.",
      "Executive sees cross-module health widgets only when RBAC + mappings allow.",
    ],
    reportKpiSignals: [
      "SAREA experience posture in executive roll-up.",
    ],
    weakLinkIndicators: [
      "Roles enabled but SAREA advisory shows missing_mapping or fallback_only.",
      "Users disabled — profile mapping lacks directory depth.",
    ],
    recommendedOperatorActions: [
      "Open SAREA role mapping and profile materialization after roles stabilize.",
      "Use preview hub to validate layouts — RBAC unchanged.",
    ],
  },
  {
    key: "trust",
    label: "Trust chain",
    purpose:
      "Surface audit-friendly trails from operations through CyberCrow evidence and risk posture into reporting — advisory trust signals.",
    modulesInvolved: ["Audit posture (CyberCrow)", "Evidence", "GRC", "Risk", "Reports / BI"],
    cemKeysForCoverage: ["bi"],
    relatedRollupIds: ["cybercrow", "tasks_approvals"],
    requiredHandoffs: [
      { label: "Security events to evidence narrative", from: "cybercrow", to: "bi" },
      { label: "Risk register context to reporting", from: "cybercrow", to: "bi" },
    ],
    cybercrowEvidenceExamples: [
      "Monthly reporting evidence pack references (advisory).",
      "GRC checklist progress snapshots for operators (not certification).",
      "Logistics or procurement approval evidence when cross-linked to tasks.",
    ],
    sareaImplications: [
      "CyberCrow reviewers persona sees trust widgets when mapped.",
      "Tenant admins see identity/session hints without replacing IAM modules.",
    ],
    reportKpiSignals: [
      "CyberCrow posture row in executive roll-up.",
      "Module health and security-adjacent report workflows.",
    ],
    weakLinkIndicators: [
      "CyberCrow not initialized — trust chain stays limited_data.",
      "Reports disabled — no BI surface for trust narrative.",
    ],
    recommendedOperatorActions: [
      "Initialize CyberCrow from security hub when trust reporting is in scope.",
      "Schedule advisory monthly executive review in Reports / BI.",
    ],
    requiresCybercrowInitialized: true,
  },
] as const;

/** Phrases that must not appear in cohesion-facing copy (verification scans repo slices). */
export const RUNTIME_COHESION_FORBIDDEN_CLAIM_PHRASES: readonly string[] = [
  "autonomous ai",
  "self-healing",
  "automated decision",
  "guaranteed optimization",
  "certified compliance",
  "zero trust certified",
  "fully autonomous",
  "ai-driven enforcement",
];
