/**
 * C0 — Shared primitives for Crow Core architecture contracts.
 * Persistence-neutral; no UI or Prisma coupling.
 */

/** Opaque tenant scope identifier (maps to runtime tenant slug or id elsewhere). */
export type TenantScopeId = string;

/** Semantic version string for blueprint, process, or configuration releases. */
export type VersionLabel = string;

export const ACTOR_TYPES = [
  "human_user",
  "service_account",
  "automation",
  "integration",
  "ai_assistant",
  "system_process",
] as const;

export type ActorType = (typeof ACTOR_TYPES)[number];

export type ActorRef = {
  actorType: ActorType;
  actorId: string;
  displayName: string;
  /** When actorType is ai_assistant or automation, must be true in audit records. */
  isNonHuman: boolean;
};

export type SensitivityLevel = "public" | "internal" | "confidential" | "restricted";

export type LifecycleState =
  | "draft"
  | "proposed"
  | "approved"
  | "active"
  | "suspended"
  | "archived"
  | "disposed";

export type ConfidenceLevel = "low" | "medium" | "high" | "verified";

export type ApprovalStatus = "draft" | "pending_review" | "approved" | "rejected" | "superseded";
