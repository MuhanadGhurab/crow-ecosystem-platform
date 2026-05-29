/**
 * K2.4 — ProCrow tenant provisioning UI copy (staging/runtime prep, not production go-live).
 */

export const TENANT_PROVISION_PANEL_TITLE = "Prepare CEM tenant runtime" as const;

export const TENANT_PROVISION_PANEL_DESCRIPTION =
  "Creates a staging tenant workspace from the approved blueprint, including modules, CyberCrow baseline, and SAREA personas." as const;

export const TENANT_PROVISION_SAFETY_NOTE =
  "This does not activate production, payments, subscription billing, or final go-live. Production remains F23-gated and requires ProCrow Go/No-Go review." as const;

export const TENANT_PROVISION_STATUS_NOTE =
  "Blueprint approved for runtime preparation." as const;

export const TENANT_PROVISION_BUTTON_LABEL = "Create staging tenant" as const;

export const TENANT_PROVISION_PENDING_LABEL = "Preparing runtime…" as const;

export const TENANT_PROVISION_ALREADY_PREPARED =
  "Staging tenant runtime is already prepared for this blueprint." as const;

export const TENANT_PROVISION_SUCCESS_HINT =
  "Tenant runtime prepared. Next: review CyberCrow baseline, SAREA profiles, and Go/No-Go readiness." as const;

export const BLUEPRINT_RUNTIME_PREP_NAV_LABEL = "Runtime prep" as const;

export const BLUEPRINT_RUNTIME_PREP_PAGE_TITLE = "Tenant runtime preparation" as const;

export const BLUEPRINT_RUNTIME_PREP_PAGE_LEAD =
  "Prepare staging tenant workspace, seed CEM from discovery, and initialize CyberCrow and SAREA sibling engines. ProCrow-controlled — not production launch." as const;

export const BLUEPRINT_RUNTIME_PREP_TENANT_READY =
  "Staging tenant ready" as const;
