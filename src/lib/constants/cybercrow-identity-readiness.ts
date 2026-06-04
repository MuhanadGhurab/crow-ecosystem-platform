/**
 * M1 — Identity & Entra ID readiness mapping (advisory — not live integration).
 */

export const CYBERCROW_IDENTITY_SOURCE_MODES = [
  {
    key: "local_accounts",
    label: "Local CEM accounts",
    description: "Profiles and roles managed in tenant runtime — no external IdP sync yet.",
  },
  {
    key: "entra_planned",
    label: "Entra ID planned",
    description: "Discovery or plan indicates Microsoft Entra ID — readiness mapping only until integration is configured.",
  },
  {
    key: "hybrid_future",
    label: "Hybrid (future)",
    description: "Mixed local and cloud identity — requires explicit integration design.",
  },
  {
    key: "unknown",
    label: "Not configured",
    description: "Identity source not configured yet — ProCrow should confirm before Go/No-Go.",
  },
] as const;

export const CYBERCROW_DOMAIN_READINESS = [
  "Tenant domain known from organization record",
  "Custom domain pending — document in discovery",
  "Domain mapping future — Entra readiness advisory",
] as const;

export const CYBERCROW_USER_PROVISIONING_READINESS = [
  "Local users only — manual or invite pattern",
  "Entra user mapping planned — not synced",
  "Invite/manual onboarding — verify role assignment",
  "User provisioning not configured",
] as const;

export const CYBERCROW_ROLE_MAPPING_READINESS = [
  "CEM roles present — validate privileged assignments",
  "SAREA profiles should align to CEM roles",
  "CyberCrow access review pending before Go/No-Go",
  "No tenant roles defined yet",
] as const;

export const CYBERCROW_MFA_ACCESS_POLICY_READINESS = [
  "MFA posture advisory — configure in IdP when Entra is enabled",
  "Policy enforcement not automated by CyberCrow in this build",
  "Review privileged access in access review checklist",
] as const;

export const CYBERCROW_ACCESS_REVIEW_AREAS = [
  "Confirm tenant_admin and privileged roles",
  "Validate employee vs contractor access boundaries",
  "Review module visibility against role assignments",
  "Confirm offboarding / access removal process (manual)",
  "Document exceptions before Go/No-Go",
] as const;

export const ENTRA_READINESS_MAPPING_LABEL =
  "Entra ID readiness mapping" as const;

export const ENTRA_NOT_LIVE_COPY =
  "Entra ID integration is not active in this build — readiness mapping and operator checklist only." as const;
