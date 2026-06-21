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
  "ProCrow is internal only.",
  "Client Portal is for request owners.",
  "Business Portal requires verified tenant membership.",
  "Client Portal access does not grant employee runtime access.",
  "Approval does not begin production, provisioning, or billing.",
] as const;

export const CLIENT_PORTAL_DESCRIPTION =
  "Request, discovery, proposal, onboarding." as const;

export const BUSINESS_PORTAL_DESCRIPTION =
  "Run daily company operations." as const;

export const PROCROW_PORTAL_DESCRIPTION =
  "Prepare, govern, and validate tenants." as const;

export const BUSINESS_PORTAL_UNAVAILABLE_REASON =
  "Business Portal access requires verified tenant membership." as const;
