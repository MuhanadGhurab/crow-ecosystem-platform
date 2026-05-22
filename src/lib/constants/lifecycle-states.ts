/**
 * Canonical platform lifecycle pipeline states (product / UI vocabulary).
 * These extend beyond the current `ImplementationRequestStatus` Prisma enum,
 * which remains the persisted source of truth until a migration aligns them.
 *
 * Map at a high level (non-exhaustive):
 * - PENDING_REVIEW → often PENDING_DISCOVERY or CLIENT_APPROVAL_PENDING
 * - UNDER_DISCOVERY → DISCOVERY_IN_PROGRESS
 * - BLUEPRINT_BUILD → BLUEPRINT_PENDING / BLUEPRINT_APPROVED
 * - TENANT_PROVISIONING → PROVISIONING / READY_FOR_PROVISIONING
 * - SECURITY_INIT → SECURITY_INITIALIZING
 * - SAREA_INIT → SAREA_INITIALIZING
 * - GO_LIVE → READY_FOR_GO_LIVE / LIVE
 */
export const PLATFORM_LIFECYCLE_PIPELINE_STATES = [
  "PENDING_DISCOVERY",
  "DISCOVERY_IN_PROGRESS",
  "BLUEPRINT_PENDING",
  "BLUEPRINT_APPROVED",
  "PRICING_PENDING",
  "CLIENT_APPROVAL_PENDING",
  "READY_FOR_PROVISIONING",
  "PROVISIONING",
  "SECURITY_INITIALIZING",
  "SAREA_INITIALIZING",
  "IDENTITY_INITIALIZING",
  "READY_FOR_GO_LIVE",
  "LIVE",
] as const;

export type PlatformLifecyclePipelineState =
  (typeof PLATFORM_LIFECYCLE_PIPELINE_STATES)[number];
