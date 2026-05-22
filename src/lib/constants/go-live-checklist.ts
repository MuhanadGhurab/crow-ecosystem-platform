/** Go-live readiness keys — aligned with founder architecture diagram (bottom checklist). */

export const GO_LIVE_CHECKLIST_ITEMS = [
  {
    key: "blueprint_approved",
    label: "Blueprint approved",
    required: true,
  },
  {
    key: "security_initialized",
    label: "Security initialized",
    required: true,
  },
  {
    key: "sarea_configured",
    label: "SAREA configured",
    required: true,
  },
  {
    key: "identities_synced",
    label: "Identities synced",
    required: false,
  },
  {
    key: "integrations_healthy",
    label: "Integrations recorded",
    required: false,
  },
  {
    key: "workflows_validated",
    label: "Workflows present",
    required: false,
  },
  {
    key: "infrastructure_ready",
    label: "Infrastructure ready",
    required: false,
  },
  {
    key: "performance_validated",
    label: "Performance validated",
    required: false,
  },
  {
    key: "support_ready",
    label: "Support ready",
    required: false,
  },
] as const;

export type GoLiveChecklistKey = (typeof GO_LIVE_CHECKLIST_ITEMS)[number]["key"];
