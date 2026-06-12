/**
 * R1B — ProCrow single-tenant command center (operator IA + lifecycle).
 */

export const TENANT_COMMAND_CENTER_TITLE = "Tenant Command Center" as const;

export const TENANT_COMMAND_CENTER_SUBTITLE =
  "Prepare runtime, activate workforce, and monitor Business Portal readiness for this tenant." as const;

export const TENANT_WORKFORCE_SECTION_ID = "tenant-workforce-activation" as const;

export type TenantCommandCenterLifecycleStep = {
  id: string;
  order: number;
  label: string;
  /** When true, shown as the current operator focus (Workforce Activation). */
  current?: boolean;
};

export const TENANT_COMMAND_CENTER_LIFECYCLE_STEPS: readonly TenantCommandCenterLifecycleStep[] = [
  { id: "request", order: 1, label: "Request" },
  { id: "discovery", order: 2, label: "Discovery" },
  { id: "blueprint", order: 3, label: "Blueprint" },
  { id: "runtime", order: 4, label: "Runtime Preparation" },
  { id: "workforce", order: 5, label: "Workforce Activation", current: true },
  { id: "operations", order: 6, label: "Business Portal Operations" },
] as const;

export const TENANT_COMMAND_CENTER_NEXT_ACTIONS = [
  {
    id: "create-invite",
    label: "Create Business Portal invite",
    description: "Generate a copy-link invite for a tenant employee.",
    primary: true,
  },
  {
    id: "confirm-acceptance",
    label: "Confirm invite acceptance",
    description: "Check invite history after the invitee signs in with the matching email.",
    primary: false,
  },
  {
    id: "open-portal",
    label: "Open Business Portal dashboard",
    description: "Review CEM runtime after workforce is active.",
    primary: false,
  },
  {
    id: "go-no-go",
    label: "Review Go/No-Go evidence",
    description: "Advisory readiness before demo or deploy.",
    primary: false,
  },
] as const;
