/** Rimal Construction — second-tenant staging identifiers (no hardcoded DB ids). */

export const RIMAL_TENANT_SLUG = "rimal-construction";
export const RIMAL_REFERENCE_CODE = "CROW-2026-RIMAL";

/** Construction-sector module set — no logistics stack (avoids MEEM logistics ops bleed). */
export const RIMAL_MODULE_KEYS = [
  "sales",
  "finance",
  "procurement",
  "hr",
  "tasks",
  "reports",
  "crm",
] as const;
