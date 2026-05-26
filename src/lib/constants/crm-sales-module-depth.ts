/**
 * G4 — CRM + Sales module depth: commercial operations readiness (not full CRM/SFA).
 * Rule-based, operator-guided, advisory posture only.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type CommercialWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type CommercialRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: CommercialWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export const CRM_WORKFLOW_MATCH_KEYWORDS = [
  "account",
  "customer",
  "crm",
  "contact",
  "escalation",
  "issue",
  "client",
  "handoff",
  "privacy",
  "access",
  "communication",
] as const;

export const SALES_WORKFLOW_MATCH_KEYWORDS = [
  "sales",
  "opportunity",
  "quote",
  "proposal",
  "commercial",
  "revenue",
  "pipeline",
  "discount",
  "onboarding",
  "won",
  "negotiation",
] as const;

export const CRM_RECOMMENDED_WORKFLOWS: readonly CommercialRecommendedWorkflow[] = [
  {
    id: "account-intake",
    label: "Account intake readiness",
    description: "Operator-managed account setup from implementation or commercial intake.",
    status: "recommended",
    linkedModuleKeys: ["crm", "sales", "tasks"],
  },
  {
    id: "customer-issue-escalation",
    label: "Customer issue escalation",
    description: "Escalation path for service issues — advisory, not a full case management product.",
    status: "recommended",
    linkedModuleKeys: ["crm", "tasks", "workflows"],
  },
  {
    id: "account-review",
    label: "Account review",
    description: "Periodic account master data review with evidence-ready notes.",
    status: "recommended",
    linkedModuleKeys: ["crm", "reports", "cybercrow"],
  },
  {
    id: "customer-data-review",
    label: "Customer data review",
    description: "Privacy and access review for customer records — operator checklist.",
    status: "recommended",
    linkedModuleKeys: ["crm", "cybercrow", "users"],
  },
  {
    id: "request-to-account",
    label: "Request-to-account handoff",
    description: "Link public implementation request context to tenant CRM accounts.",
    status: "recommended",
    linkedModuleKeys: ["crm", "sales", "reports"],
  },
  {
    id: "client-follow-up",
    label: "Client communication follow-up",
    description: "Operator follow-up tasks after commercial touchpoints — not email automation.",
    status: "recommended",
    linkedModuleKeys: ["crm", "tasks"],
  },
  {
    id: "customer-access-privacy",
    label: "Customer access / privacy review",
    description: "Role and data-access review for account-facing teams.",
    status: "recommended",
    linkedModuleKeys: ["crm", "roles", "cybercrow"],
  },
] as const;

export const SALES_RECOMMENDED_WORKFLOWS: readonly CommercialRecommendedWorkflow[] = [
  {
    id: "opportunity-review",
    label: "Opportunity review",
    description: "Review pipeline lines before commercial approval — operator-managed.",
    status: "recommended",
    linkedModuleKeys: ["sales", "crm", "tasks"],
  },
  {
    id: "proposal-readiness",
    label: "Proposal readiness",
    description: "Blueprint / implementation request handoff to commercial records — advisory.",
    status: "recommended",
    linkedModuleKeys: ["sales", "crm", "reports"],
  },
  {
    id: "commercial-approval",
    label: "Commercial approval",
    description: "Discount or exception approval with task trail — not automated CPQ.",
    status: "recommended",
    linkedModuleKeys: ["sales", "tasks", "workflows"],
  },
  {
    id: "quote-handoff",
    label: "Quote / proposal handoff readiness",
    description: "Coordinate quote records toward finance readiness — not invoicing.",
    status: "recommended",
    linkedModuleKeys: ["sales", "finance"],
  },
  {
    id: "sales-finance-handoff",
    label: "Sales-to-finance handoff",
    description: "Won opportunities aligned with finance coordination — not revenue recognition.",
    status: "recommended",
    linkedModuleKeys: ["sales", "finance", "crm"],
  },
  {
    id: "revenue-readiness-review",
    label: "Revenue readiness review",
    description: "Monthly commercial roll-up using reports — advisory pipeline review.",
    status: "recommended",
    linkedModuleKeys: ["sales", "finance", "reports"],
  },
  {
    id: "customer-onboarding-handoff",
    label: "Customer onboarding handoff",
    description: "Post-win handoff to account teams and tasks — operator checklist.",
    status: "recommended",
    linkedModuleKeys: ["sales", "crm", "tasks"],
  },
  {
    id: "monthly-pipeline-review",
    label: "Monthly sales pipeline review",
    description: "Operator-managed pipeline review — not predictive analytics.",
    status: "recommended",
    linkedModuleKeys: ["sales", "reports"],
  },
] as const;

export const CRM_CYBERCROW_RISKS = [
  "Customer data exposure",
  "Unauthorized account master data changes",
  "Stale customer access assignments",
  "Customer issue audit gaps",
  "Privacy / access review gaps",
  "Overprivileged account managers",
  "Request-to-account linkage gaps",
] as const;

export const SALES_CYBERCROW_RISKS = [
  "Unauthorized discount / commercial approval",
  "Proposal / version audit gaps",
  "Revenue handoff gaps to finance",
  "Stale or unlinked opportunity records",
  "Sales role misuse",
  "Missing commercial approval trail",
  "Customer onboarding handoff gaps",
] as const;

export const CRM_CYBERCROW_EVIDENCE = [
  "Account review record",
  "Customer issue escalation trail",
  "Request-to-account handoff note",
  "Customer data access review",
  "Role / access review for account teams",
  "Commercial communication follow-up",
] as const;

export const SALES_CYBERCROW_EVIDENCE = [
  "Proposal review trail",
  "Commercial approval record",
  "Sales-to-finance handoff evidence",
  "Opportunity review record",
  "Monthly commercial review",
  "Pipeline exception review",
] as const;

export type CommercialSareaPersona = {
  persona: string;
  audience: string;
  experience: string;
};

export const CRM_SAREA_PERSONAS: readonly CommercialSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Account posture, customer risk signals, commercial health summary.",
  },
  {
    persona: "Account Manager / CRM Owner",
    audience: "Customer relationships",
    experience: "Accounts, contacts, escalations, request linkage — primary CRM density.",
  },
  {
    persona: "Customer Service Agent",
    audience: "Service desk",
    experience: "Issue escalation tasks and account context — compact inbox.",
  },
  {
    persona: "Sales Manager",
    audience: "Commercial leadership",
    experience: "Pipeline join on accounts — links to Sales readiness.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance operations",
    experience: "Customer context for revenue readiness — read-only handoff.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Account lists and commercial KPI readiness — export-oriented.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Role mappings and commercial access — RBAC for access, SAREA for layout.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Customer-data evidence and access trails — advisory read-only.",
  },
] as const;

export const SALES_SAREA_PERSONAS: readonly CommercialSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Pipeline summary, revenue readiness, commercial risk — high-level only.",
  },
  {
    persona: "Sales Manager",
    audience: "Commercial operations",
    experience: "Opportunities, approvals, proposal readiness, finance handoff.",
  },
  {
    persona: "Account Manager",
    audience: "Customer-facing sales",
    experience: "CRM-linked opportunities and quote context — field-friendly cards.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance operations",
    experience: "Won/pipeline signals for finance coordination — not invoicing UI.",
  },
  {
    persona: "Customer Service Agent",
    audience: "Service desk",
    experience: "Limited sales density — escalations link back to CRM.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Pipeline KPI readiness and exception lists — no fake forecasting.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Commercial role mappings and module enablement advisory.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Commercial approval trails and customer-data risks — advisory.",
  },
] as const;

export type CommercialSectorNote = {
  sector: ModeledSectorKey;
  headline: string;
  focus: readonly string[];
};

export const CRM_SECTOR_NOTES: readonly CommercialSectorNote[] = [
  {
    sector: "logistics",
    headline: "Customer accounts, delivery issues, commercial handoffs",
    focus: ["Shipper accounts", "Service issue escalation", "Freight commercial context"],
  },
  {
    sector: "retail",
    headline: "Customer service, account readiness, returns escalations",
    focus: ["Store / chain accounts", "Returns coordination (advisory)", "B2B account context"],
  },
  {
    sector: "construction",
    headline: "Project clients, account management, commercial review",
    focus: ["Project client accounts", "Variation commercial context", "Site stakeholder contacts"],
  },
  {
    sector: "aviation",
    headline: "Passenger / customer service, service request intake",
    focus: ["Station customer issues", "Service billing readiness linkage", "Account coordination"],
  },
  {
    sector: "healthcare",
    headline: "Patient / customer coordination, privacy-safe service requests",
    focus: ["Privacy-safe contact density", "Clinic service escalation", "Billing coordination readiness"],
  },
] as const;

export const SALES_SECTOR_NOTES: readonly CommercialSectorNote[] = [
  {
    sector: "logistics",
    headline: "Freight quotes, B2B pipeline, delivery commercial readiness",
    focus: ["Quote-to-order coordination", "Customer billing readiness", "Account-linked pipeline"],
  },
  {
    sector: "retail",
    headline: "Sales summaries, returns readiness, commercial roll-ups",
    focus: ["Store / wholesale pipeline", "Promotion exception review", "Procurement cost linkage"],
  },
  {
    sector: "construction",
    headline: "Project intake, variation commercial review",
    focus: ["Project opportunity tracking", "Change-order commercial review", "Client proposal handoff"],
  },
  {
    sector: "aviation",
    headline: "Service billing readiness, supplier and commercial intake",
    focus: ["Service package quotes", "Station commercial review", "Supplier cost linkage"],
  },
  {
    sector: "healthcare",
    headline: "Billing coordination readiness, privacy-safe commercial review",
    focus: ["Service package proposals", "Access-controlled approvals", "Supplies commercial linkage"],
  },
] as const;

export const CRM_REPORT_KPI_SIGNALS = [
  "CRM module enabled",
  "Account count",
  "Contact count",
  "Accounts without contacts",
  "Implementation request linkage (blueprint)",
  "CRM-related open tasks",
  "Sales module enabled (commercial join)",
  "Finance module enabled (revenue handoff)",
  "Reports module roll-ups",
  "Customer-data evidence readiness",
] as const;

export const SALES_REPORT_KPI_SIGNALS = [
  "Sales module enabled",
  "Opportunity / pipeline line count",
  "Pipeline SAR (when amounts exist)",
  "Won SAR (when amounts exist)",
  "Opportunities without CRM account link",
  "Finance module enabled (handoff)",
  "CRM module enabled (account context)",
  "Commercial approval workflows",
  "Reports module roll-ups",
  "Request / blueprint handoff context",
] as const;

export const CRM_SALES_FORBIDDEN_CLAIM_PHRASES = [
  "ai lead scoring",
  "lead scoring",
  "marketing automation",
  "email campaign",
  "contract signing",
  "live invoicing",
  "live payment",
  "payment gateway activated",
  "stripe checkout enabled",
  "automated revenue",
  "revenue automation",
  "full crm replacement",
  "full sfa",
  "sales force automation",
  "fraud detection",
  "certified audit",
  "automated compliance",
  "external crm sync",
] as const;
