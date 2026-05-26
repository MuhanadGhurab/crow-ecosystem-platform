/**
 * G2 — HR module depth: operational readiness (not payroll / full HRMS).
 * Rule-based, operator-guided, advisory posture only.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type HrWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type HrRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: HrWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

/** Keywords used to match tenant workflows/tasks to HR readiness (read-only). */
export const HR_WORKFLOW_MATCH_KEYWORDS = [
  "onboard",
  "offboard",
  "role change",
  "transfer",
  "access review",
  "workforce",
  "training",
  "policy",
  "acknowledgement",
  "acknowledgment",
] as const;

export const HR_RECOMMENDED_WORKFLOWS: readonly HrRecommendedWorkflow[] = [
  {
    id: "onboarding-readiness",
    label: "Employee onboarding readiness",
    description:
      "Profile invite, role assignment, department mapping, and optional HR employee record.",
    status: "recommended",
    linkedModuleKeys: ["users", "roles", "hr"],
  },
  {
    id: "offboarding-readiness",
    label: "Employee offboarding readiness",
    description:
      "Deactivate access, complete tasks, and retain advisory evidence — operator-managed checklist.",
    status: "recommended",
    linkedModuleKeys: ["users", "tasks", "cybercrow"],
  },
  {
    id: "role-change",
    label: "Role change request",
    description: "RBAC role assignment change with approval trail readiness.",
    status: "recommended",
    linkedModuleKeys: ["users", "roles", "tasks"],
  },
  {
    id: "department-transfer",
    label: "Department transfer request",
    description: "Move profile or employee between departments with structure visibility.",
    status: "recommended",
    linkedModuleKeys: ["departments", "hr", "users"],
  },
  {
    id: "access-review",
    label: "Access review",
    description: "Periodic review of role assignments and privileged access — advisory, not automated IAM.",
    status: "recommended",
    linkedModuleKeys: ["roles", "users", "cybercrow"],
  },
  {
    id: "workforce-request",
    label: "Workforce request",
    description: "Headcount or staffing coordination task linked to HR and department managers.",
    status: "recommended",
    linkedModuleKeys: ["hr", "tasks", "departments"],
  },
  {
    id: "training-awareness",
    label: "Training / awareness task",
    description: "Operator-managed training or policy awareness — evidence-ready, not LMS replacement.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "cybercrow"],
  },
  {
    id: "policy-ack",
    label: "Policy acknowledgement readiness",
    description: "Task or approval pattern for policy sign-off — advisory evidence only.",
    status: "recommended",
    linkedModuleKeys: ["tasks", "cybercrow", "reports"],
  },
] as const;

export const HR_CYBERCROW_RISKS = [
  "Unauthorized role changes",
  "Stale user access after offboarding",
  "Offboarding gaps (profile active, employee inactive)",
  "Overprivileged accounts",
  "Missing access reviews",
  "Department / role mismatch on profiles",
  "HR employee record without workspace profile",
  "Privileged admin misuse",
] as const;

export const HR_CYBERCROW_EVIDENCE = [
  "Onboarding approval trail",
  "Offboarding checklist record",
  "Role change approval",
  "Access review record",
  "Policy acknowledgement",
  "Training completion record",
  "Privileged role review",
] as const;

export type HrSareaPersona = {
  persona: string;
  audience: string;
  hrExperience: string;
};

export const HR_SAREA_PERSONAS: readonly HrSareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    hrExperience: "Workforce overview, readiness gaps, and risk posture — summary density.",
  },
  {
    persona: "HR Manager",
    audience: "People operations",
    hrExperience: "Users, roles, onboarding/offboarding readiness, employee records.",
  },
  {
    persona: "Department Manager",
    audience: "Line management",
    hrExperience: "Team roles, department tasks, workflow status — not full admin.",
  },
  {
    persona: "Frontline Employee",
    audience: "Operators",
    hrExperience: "Assigned tasks, policy/training reminders — minimal HR admin.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    hrExperience: "Workforce KPI readiness, mapping gaps, export-oriented lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    hrExperience: "User/role configuration and access readiness — RBAC surfaces.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    hrExperience: "Identity/access evidence and risk signals — read-only advisory.",
  },
] as const;

export type HrSectorWorkforceNote = {
  sector: ModeledSectorKey;
  headline: string;
  focus: readonly string[];
};

export const HR_SECTOR_WORKFORCE_NOTES: readonly HrSectorWorkforceNote[] = [
  {
    sector: "logistics",
    headline: "Drivers, dispatch, and field workforce readiness",
    focus: ["Shift-friendly tasks", "Branch-scoped roles", "Field vs HQ density"],
  },
  {
    sector: "retail",
    headline: "Store staff, cashier, and supervisor readiness",
    focus: ["Store manager assignments", "High-turnover onboarding", "POS boundary (no payroll)"],
  },
  {
    sector: "construction",
    headline: "Site workforce, HSE, and quality coordination",
    focus: ["Site access patterns", "Subcontractor onboarding advisory", "Project transfers"],
  },
  {
    sector: "aviation",
    headline: "Shift workforce and customer service coordination",
    focus: ["Station roles", "Safety escalation paths", "Privileged handler reviews"],
  },
  {
    sector: "healthcare",
    headline: "Clinic staff and privacy-sensitive access readiness",
    focus: ["Access reviews", "Privacy-aware density", "No clinical/EMR replacement"],
  },
] as const;

export const HR_REPORT_KPI_SIGNALS = [
  "Total users (profiles)",
  "Active HR employees",
  "Roles defined",
  "Departments defined",
  "Profiles without role assignment",
  "Employees without department",
  "Unassigned roles",
  "HR-related open tasks",
  "SAREA profile mapping coverage",
  "Access review readiness (advisory)",
] as const;

/** Phrases that must not appear in HR-facing copy (verified by hr:verify). */
export const HR_FORBIDDEN_CLAIM_PHRASES = [
  "payroll engine",
  "salary processing",
  "hipaa certified",
  "hipaa-certified",
  "autonomous hr",
  "automated compliance",
  "certified compliance",
  "live payments",
  "full hrms",
] as const;
