import { Permission } from "@/lib/auth/permissions";
import { routes } from "@/lib/routes";

export type ProcrowAdminNavItem = {
  href: string;
  label: string;
  permission: (typeof Permission)[keyof typeof Permission];
};

export type ProcrowAdminNavGroup = {
  heading: string;
  items: ProcrowAdminNavItem[];
};

/** L1 — grouped ProCrow sidebar (routes unchanged; permissions unchanged). */
export const PROCROW_ADMIN_NAV_GROUPS: ProcrowAdminNavGroup[] = [
  {
    heading: "Command",
    items: [
      { href: routes.admin.overview, label: "Overview", permission: Permission["platform.admin.view"] },
      { href: routes.admin.queue, label: "Queue", permission: Permission["platform.admin.view"] },
      { href: routes.admin.notifications, label: "Notifications", permission: Permission["platform.audit.view"] },
    ],
  },
  {
    heading: "Customer flow",
    items: [
      { href: routes.admin.requests, label: "Requests", permission: Permission["platform.requests.view"] },
      { href: routes.admin.discovery, label: "Discovery", permission: Permission["platform.discovery.view"] },
      { href: routes.admin.blueprints, label: "Blueprints", permission: Permission["platform.blueprint.view"] },
    ],
  },
  {
    heading: "Tenant operations",
    items: [
      { href: routes.admin.tenants, label: "Tenants", permission: Permission["platform.tenants.manage"] },
      { href: routes.admin.domains, label: "Domains", permission: Permission["platform.admin.view"] },
      { href: routes.admin.integrations, label: "Integrations", permission: Permission["platform.admin.view"] },
      { href: routes.admin.subscriptions, label: "Subscriptions", permission: Permission["platform.requests.view"] },
    ],
  },
  {
    heading: "Trust & experience",
    items: [
      { href: routes.admin.securityBaselines, label: "Security baselines", permission: Permission["platform.admin.view"] },
      { href: routes.admin.audit, label: "Audit", permission: Permission["platform.audit.view"] },
    ],
  },
  {
    heading: "Release center",
    items: [
      { href: routes.admin.goNoGo, label: "Go / No-Go", permission: Permission["platform.admin.view"] },
      { href: routes.admin.operatorConsole, label: "Operator console", permission: Permission["platform.admin.view"] },
    ],
  },
];

export const PROCROW_OPERATOR_WORKFLOW_STEPS = [
  { id: "intake", label: "Request intake", href: routes.admin.requests },
  { id: "discovery", label: "Discovery / blueprint", href: routes.admin.discovery },
  { id: "proposal", label: "Proposal", href: routes.admin.requests },
  { id: "approval", label: "Client approval", href: routes.admin.requests },
  { id: "onboarding", label: "Onboarding", href: routes.admin.requests },
  { id: "readiness", label: "Tenant readiness", href: routes.admin.tenants },
  { id: "cybercrow", label: "CyberCrow trust", href: routes.admin.securityBaselines },
  { id: "sarea", label: "SAREA experience", href: routes.sarea.overview },
  { id: "gono", label: "Go / No-Go", href: routes.admin.goNoGo },
  { id: "handoff", label: "Tenant runtime", href: routes.admin.tenants },
] as const;
