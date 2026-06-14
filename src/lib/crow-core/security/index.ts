/**
 * C0 — Identity, trust, and security constitution (beyond CIA).
 */

import type { ActorRef, TenantScopeId } from "../common";

export const SECURITY_DIMENSIONS = [
  "identification",
  "authentication",
  "authorization",
  "accounting",
  "authenticity",
  "accountability",
  "non_repudiation",
  "privacy",
  "cryptography",
  "least_privilege",
  "separation_of_duties",
  "session_trust",
  "evidence",
  "assurance",
  "resilience",
] as const;

export type SecurityDimension = (typeof SECURITY_DIMENSIONS)[number];

export type SecurityConstitution = {
  tenantId: TenantScopeId;
  dimensions: readonly SecurityDimension[];
  /** Government identity (e.g. Nafath) provides assurance only — not Crow authorization. */
  governmentIdentityIsNotAuthorization: true;
  rbacIsAuthoritativeForAccess: true;
};

export type SecuritySignalSeverity = "info" | "low" | "medium" | "high" | "critical";

export type SecuritySignal = {
  signalId: string;
  tenantId: TenantScopeId;
  dimension: SecurityDimension;
  context: string;
  severity: SecuritySignalSeverity;
  recommendedAction: string;
  ownerRole: string;
  evidenceRefs: readonly string[];
  detectedAtIso: string;
};

export type SecurityControl = {
  controlKey: string;
  dimension: SecurityDimension;
  label: string;
  implementationStatus: "planned" | "partial" | "implemented" | "verified";
};

export const CYBERCROW_NON_CLAIMS = [
  "CyberCrow is not a SIEM replacement.",
  "CyberCrow is not an EDR product.",
  "CyberCrow does not operate an autonomous SOC.",
  "CyberCrow provides trust signals, evidence, and actionable recommendations within Crow.",
] as const;

export const GOVERNMENT_IDENTITY_RULE =
  "Government identity verification (e.g. Nafath) is identity assurance only. It does not grant membership, roles, or permissions in Crow." as const;
