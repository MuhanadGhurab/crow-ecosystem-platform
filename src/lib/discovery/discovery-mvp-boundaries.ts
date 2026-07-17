/**
 * CROW.DISCOVERY.2 — D0–D2 local-first Discovery MVP boundaries.
 * Blueprint complete remains available for later milestones only via explicit override.
 */

/** Product stages for adaptive Discovery (design truth; UI overview only in D2). */
export const DISCOVERY_MVP_STAGES = [
  {
    id: 1 as const,
    key: "context",
    title: "Context",
    summary: "Confirm journey, organization context, purpose, and success definition.",
  },
  {
    id: 2 as const,
    key: "organization_shape",
    title: "Organization shape",
    summary: "Legal entity, topology, departments, and operating shape.",
  },
  {
    id: 3 as const,
    key: "operating_reality",
    title: "Operating reality",
    summary: "Roles, workflows, approvals, systems, and capabilities.",
  },
  {
    id: 4 as const,
    key: "trust_and_risk",
    title: "Trust and risk",
    summary: "Identity, sensitivity, compliance, and segregation of duties.",
  },
  {
    id: 5 as const,
    key: "build_transform_intent",
    title: "Build / Transform intent",
    summary: "Journey-adaptive target state, pain points, and transition preference.",
  },
  {
    id: 6 as const,
    key: "evidence_references",
    title: "Evidence references",
    summary: "Names and URLs only — no file uploads in Discovery MVP.",
  },
  {
    id: 7 as const,
    key: "procrow_review_summary",
    title: "ProCrow review summary",
    summary: "Completeness, contradictions, and ready-for-modeling — not Blueprint.",
  },
] as const;

export type DiscoveryMvpStageId = (typeof DISCOVERY_MVP_STAGES)[number]["id"];

/**
 * D0–D2 default: block operator Complete Discovery → Blueprint create.
 * Override only with explicit env for later milestones / compatibility drills.
 */
export function isDiscoveryBlueprintCompleteBlocked(): boolean {
  return process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE !== "1";
}

export const DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE =
  "CROW.DISCOVERY.2 (D0–D2): Completing Discovery to create a Blueprint is out of scope. Discovery is structured learning — not Blueprint, tenant build, payment, or authority. ProCrow marks ready-for-modeling in a later phase; Blueprint handoff is a future milestone.";

export function assertDiscoveryBlueprintCompleteAllowed(): void {
  if (isDiscoveryBlueprintCompleteBlocked()) {
    throw new Error(DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE);
  }
}

export const DISCOVERY_MVP_NON_CLAIMS = [
  "Discovery is structured learning about the organization.",
  "Discovery is not Blueprint generation.",
  "Discovery is not tenant provisioning.",
  "Discovery is not payment or subscription.",
  "Discovery is not authority (membership or platform roles).",
  "Discovery does not invoke CroAI in this MVP slice.",
  "Evidence references are planned as text/URL refs only — no uploads.",
  "ProCrow reviews before modeling or Blueprint.",
] as const;

export const DISCOVERY_MVP_EVIDENCE_MODE = "refs_only_planned" as const;
