/**
 * L5 — Crow multi-portal access model (Client · Business · ProCrow).
 */

import type { CrowRole } from "@/lib/auth/roles";

export type CrowPortalKind = "client" | "business" | "procrow";

export type CrowPortalAccessState =
  | "available"
  | "unavailable"
  | "pending"
  | "requires_sign_in";

export type CrowPortalOption = {
  kind: CrowPortalKind;
  label: string;
  description: string;
  route: string;
  accessState: CrowPortalAccessState;
  reason: string | null;
  badge: string | null;
  priority: number;
  allowedRoles: readonly CrowRole[];
  tenantSlug?: string;
  tenantName?: string;
};

export type CrowAccessGatewaySnapshot = {
  isAuthenticated: boolean;
  primaryPortal: CrowPortalKind | null;
  availablePortals: CrowPortalOption[];
  unavailablePortals: CrowPortalOption[];
  recommendedNextAction: string;
  safetyNotes: readonly string[];
};

export const PORTAL_GATEWAY_SAFETY_NOTES = [
  "ProCrow is internal only — not shown to client accounts.",
  "Business Portal requires verified tenant membership — Client Portal access alone is not enough.",
  "Client Portal is for request owners — not the same as employee day-to-day runtime.",
  "Production launch and billing remain F23-gated; no payment activation from these portals.",
] as const;

export const CLIENT_PORTAL_DESCRIPTION =
  "Request Crow, complete guided discovery, review proposals and blueprints, approve scope, and track onboarding." as const;

export const BUSINESS_PORTAL_DESCRIPTION =
  "Run your company workspace through CEM — HR, finance, CRM, procurement, inventory, logistics, tasks, workflows, and reports." as const;

export const PROCROW_PORTAL_DESCRIPTION =
  "Internal control tower for discovery review, blueprint, proposal flow, CyberCrow/SAREA readiness, staging tenant preparation, and Go/No-Go." as const;
