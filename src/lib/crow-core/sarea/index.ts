/**
 * C0 — SAREA: human experience orchestration (never authorization).
 * Bridges to M2 experience mapping contract where applicable.
 */

import type { SareaExperiencePersona } from "@/lib/sarea/sarea-experience-mapping-contract";

export type SareaExperienceDensity = "simple" | "standard" | "advanced" | "executive";

export type SareaPersonaVariant =
  | "requester"
  | "frontline"
  | "specialist"
  | "manager"
  | "approver"
  | "executive"
  | "security_operator"
  | "auditor"
  | "implementation_operator";

export type SareaContext = {
  tenantSlug: string;
  membershipVerified: boolean;
  roleKeys: readonly string[];
  permissionKeys: readonly string[];
  departmentKey: string | null;
  responsibilityKeys: readonly string[];
  workQueueKeys: readonly string[];
};

export type ExperienceComposition = {
  personaVariant: SareaPersonaVariant;
  landingRoute: string;
  navigationKeys: readonly string[];
  widgetsVisible: readonly string[];
  density: SareaExperienceDensity;
  cyberCrowBoundaryNotes: string;
};

export type SareaExperienceChain = {
  identity: string;
  membership: string;
  role: string;
  permissions: string;
  context: string;
  responsibility: string;
  work: string;
  experience: string;
};

export const SAREA_CONSTITUTIONAL_RULE =
  "SAREA shapes experience only. SAREA never grants access, permissions, or roles. RBAC remains authoritative." as const;

export const SAREA_EXPERIENCE_CHAIN: SareaExperienceChain = {
  identity: "Verified identity (may include government assurance)",
  membership: "Tenant membership linkage",
  role: "Assigned organizational role",
  permissions: "RBAC permission grants (not SAREA)",
  context: "Department, branch, responsibility scope",
  responsibility: "Owned work and approvals",
  work: "Queues, tasks, workflows",
  experience: "SAREA-composed landing, navigation, density",
};

/** Re-export M2 persona shape for lab and mapping alignment. */
export type { SareaExperiencePersona };
