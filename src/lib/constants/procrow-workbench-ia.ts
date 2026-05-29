/**
 * L2 — ProCrow workbench information architecture (copy only).
 */

export const PROCROW_WORKBENCH_AREAS = [
  {
    id: "queue",
    label: "Operator queue",
    purpose: "What needs attention now?",
    route: "/admin/queue",
  },
  {
    id: "request",
    label: "Request workspace",
    purpose: "Work one company from intake through onboarding.",
    route: "/admin/requests",
  },
  {
    id: "tenant",
    label: "Tenant readiness",
    purpose: "Prepare CEM runtime without auto-provisioning.",
    route: "/admin/tenants",
  },
  {
    id: "trust",
    label: "Trust & experience",
    purpose: "CyberCrow and SAREA readiness before handoff.",
    route: "/admin/security-baselines",
  },
  {
    id: "release",
    label: "Release / Go-No-Go",
    purpose: "Validate before deployment or demo.",
    route: "/admin/go-no-go",
  },
] as const;

export const PROCROW_CEM_RUNTIME_MODULES = [
  "HR",
  "Finance",
  "CRM / Sales",
  "Procurement",
  "Inventory / Warehouse",
  "Logistics",
  "Tasks / Approvals",
  "Reports / BI",
] as const;

export const PROCROW_PREPARATION_CONTROLS = [
  "Blueprint & modules",
  "Departments & roles",
  "Workflows",
  "CyberCrow posture",
  "SAREA profiles",
  "Go / No-Go",
] as const;
