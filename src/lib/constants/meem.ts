/** MEEM lighthouse identifiers — no DB imports (safe for client, CLI, and mock modules). */

export const MEEM_TENANT_SLUG = "meem-global";
export const MEEM_REFERENCE_CODE = "CROW-2026-MEEM";

/** MOCK ONLY — offline/demo pipeline cards when DB is unavailable. */
export const MEEM_REQUEST_ID = "mock-req-meem";
/** MOCK ONLY */
export const MEEM_DISCOVERY_REQUEST_ID = "mock-req-meem-discovery";
/** MOCK ONLY */
export const MEEM_BLUEPRINT_ID = "mock-bp-meem";
/** MOCK ONLY */
export const MEEM_PROPOSAL_TOKEN = "mock-proposal-meem";

/** MOCK ONLY — offline demo cards; never returned from live resolver on DB miss. */
export const MEEM_MOCK_ONLY_FALLBACK_REQUEST_ID = MEEM_REQUEST_ID;
/** MOCK ONLY */
export const MEEM_MOCK_ONLY_FALLBACK_BLUEPRINT_ID = MEEM_BLUEPRINT_ID;

/** Blueprint + tenant modules for MEEM lighthouse (ERP chain + people). */
export const MEEM_MODULE_KEYS = [
  "sales",
  "logistics",
  "warehouse",
  "inventory",
  "finance",
  "crm",
  "hr",
] as const;
