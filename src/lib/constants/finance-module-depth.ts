/**
 * G3 — Finance module depth: operational readiness (not accounting / payments / tax).
 * Rule-based, operator-guided, advisory posture only.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type FinanceWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type FinanceRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: FinanceWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export const FINANCE_WORKFLOW_MATCH_KEYWORDS = [
  "billing",
  "expense",
  "purchase",
  "payment",
  "budget",
  "subscription",
  "finance",
  "revenue",
  "procurement",
  "invoice",
  "monthly",
  "exception",
  "supplier",
  "cost",
] as const;

export const FINANCE_RECOMMENDED_WORKFLOWS: readonly FinanceRecommendedWorkflow[] = [
  {
    id: "billing-review",
    label: "Billing review readiness",
    description: "Operator review of billing lines before handoff to finance records — advisory.",
    status: "recommended",
    linkedModuleKeys: ["finance", "sales", "tasks"],
  },
  {
    id: "expense-review",
    label: "Expense review readiness",
    description: "Review spend intake from procurement before accrual-style coordination.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "finance", "tasks"],
  },
  {
    id: "purchase-approval",
    label: "Purchase approval",
    description: "Govern purchase requests with approval trail readiness.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "tasks", "workflows"],
  },
  {
    id: "supplier-payment-review",
    label: "Supplier payment review readiness",
    description: "Advisory checkpoint before payment release — not live payment processing.",
    status: "recommended",
    linkedModuleKeys: ["finance", "procurement", "cybercrow"],
  },
  {
    id: "budget-cost-review",
    label: "Budget / cost review readiness",
    description: "Periodic cost review using reports and module roll-ups — not a budget engine.",
    status: "recommended",
    linkedModuleKeys: ["reports", "finance", "procurement"],
  },
  {
    id: "subscription-plan-review",
    label: "Subscription plan review",
    description: "Advisory review of tenant plan entitlements — no live checkout in this phase.",
    status: "recommended",
    linkedModuleKeys: ["settings", "reports"],
  },
  {
    id: "financial-exception",
    label: "Financial exception review",
    description: "Escalation path for mismatched sales/procurement/finance signals.",
    status: "recommended",
    linkedModuleKeys: ["finance", "tasks", "cybercrow"],
  },
  {
    id: "monthly-finance-report",
    label: "Monthly finance report",
    description: "Operator-managed monthly roll-up — evidence-ready, not automated close.",
    status: "recommended",
    linkedModuleKeys: ["reports", "finance"],
  },
  {
    id: "revenue-readiness",
    label: "Revenue readiness review",
    description: "Sales pipeline vs finance entry alignment — coordination, not revenue recognition engine.",
    status: "recommended",
    linkedModuleKeys: ["sales", "finance", "crm"],
  },
  {
    id: "procurement-finance-handoff",
    label: "Procurement-to-finance handoff",
    description: "Link approved PRs to finance/AP visibility when references exist.",
    status: "recommended",
    linkedModuleKeys: ["procurement", "finance"],
  },
] as const;

export const FINANCE_CYBERCROW_RISKS = [
  "Unauthorized purchase approval",
  "Supplier / payment fraud readiness gaps (process, not detection product)",
  "Billing review gaps",
  "Plan / subscription mismatch with usage",
  "Finance role misuse or segregation-of-duties gaps",
  "Missing approval trail on spend",
  "Procurement-to-finance handoff gaps",
  "Suspicious financial workflow changes",
  "Overprivileged finance users",
  "Incomplete monthly review evidence",
] as const;

export const FINANCE_CYBERCROW_EVIDENCE = [
  "Purchase approval trail",
  "Billing review record",
  "Supplier approval evidence",
  "Financial exception review",
  "Subscription plan review",
  "Monthly finance report",
  "Role / access review",
  "Approval chain evidence",
] as const;

export type FinanceSareaPersona = {
  persona: string;
  audience: string;
  financeExperience: string;
};

export const FINANCE_SAREA_PERSONAS: readonly FinanceSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    financeExperience: "Financial health summary, plan posture, risk signals — high-level tiles.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance operations",
    financeExperience: "Billing coordination, procurement handoffs, approvals, reporting readiness.",
  },
  {
    persona: "Procurement Specialist",
    audience: "Spend intake",
    financeExperience: "Purchase requests and supplier handoff — not payment execution.",
  },
  {
    persona: "Sales / CRM Manager",
    audience: "Commercial",
    financeExperience: "Revenue readiness and customer linkage — not invoicing automation.",
  },
  {
    persona: "Department Manager",
    audience: "Line management",
    financeExperience: "Cost and task approval context — limited finance admin.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    financeExperience: "KPI readiness, exceptions, mapping gaps — export-oriented lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    financeExperience: "Plan advisory and role mappings — RBAC for access, SAREA for density.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    financeExperience: "Evidence, approval trails, and risk signals — read-only advisory.",
  },
] as const;

export type FinanceSectorNote = {
  sector: ModeledSectorKey;
  headline: string;
  focus: readonly string[];
};

export const FINANCE_SECTOR_NOTES: readonly FinanceSectorNote[] = [
  {
    sector: "logistics",
    headline: "Delivery billing, supplier costs, operations finance",
    focus: ["Freight AR/AP coordination", "Fuel and fleet spend visibility", "Customer billing readiness"],
  },
  {
    sector: "retail",
    headline: "Sales summaries, returns readiness, procurement cost visibility",
    focus: ["Store revenue roll-ups", "Refund coordination (advisory)", "Inventory-linked spend"],
  },
  {
    sector: "construction",
    headline: "Project cost control and purchase finance review",
    focus: ["Project PR approvals", "Variation review readiness", "Site spend handoff"],
  },
  {
    sector: "aviation",
    headline: "Service billing and supplier cost coordination",
    focus: ["Station operations costs", "Service billing readiness", "Supplier contract review"],
  },
  {
    sector: "healthcare",
    headline: "Billing coordination and supplies cost review",
    focus: ["Privacy-safe finance review density", "Clinic supplies procurement", "Access-controlled approvals"],
  },
] as const;

export const FINANCE_REPORT_KPI_SIGNALS = [
  "Finance module enabled",
  "Sales module enabled (revenue readiness)",
  "Procurement module enabled (expense readiness)",
  "Finance ledger entry count",
  "Open AR (when entries exist)",
  "Open AP (when entries exist)",
  "Sales pipeline SAR (when sales enabled)",
  "Procurement PR value (when procurement enabled)",
  "Finance-related open tasks",
  "Active approval workflows",
  "Reports module roll-ups",
  "Plan / subscription advisory state",
  "Monthly review readiness (advisory)",
] as const;

export const FINANCE_FORBIDDEN_CLAIM_PHRASES = [
  "live payment",
  "payment gateway activated",
  "stripe checkout enabled",
  "vat calculation",
  "tax engine",
  "general ledger engine",
  "accounting ledger automation",
  "bank integration",
  "payment reconciliation automation",
  "certified audit",
  "fraud detection",
  "payment monitoring",
  "autonomous financial",
  "automated compliance",
  "full accounting system",
] as const;
