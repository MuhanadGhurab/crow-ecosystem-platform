/**
 * A1 / R1A — Tenant workforce activation (M4C invite operator UX).
 */

export const TENANT_WORKFORCE_ACTIVATION_TITLE = "Tenant Workforce Activation" as const;

export const BUSINESS_PORTAL_INVITE_TITLE = "Business Portal Invite" as const;

export const WORKFORCE_ACTIVATION_STATUS_CHIP = "Manual copy-link mode" as const;

export const WORKFORCE_ACTIVATION_STATUS_CHIP_EMAIL = "Email + copy-link fallback" as const;

export const WORKFORCE_ACTIVATION_PURPOSE =
  "Activate tenant employees for the Business Portal after runtime preparation. Invite links grant Business Portal access only after the invited email accepts." as const;

export const WORKFORCE_ACTIVATION_DESCRIPTION =
  "Create a secure invite link. When email delivery is configured, Crow sends a transactional invite; copy-link fallback is always available." as const;

export const WORKFORCE_ACTIVATION_COPY = {
  sectionTitle: "Business Portal Invite",
  sectionSubtitle: WORKFORCE_ACTIVATION_PURPOSE,
  createLink: "Create invite link",
  createAndEmail: "Create and email invite",
  activateUser: "Activate tenant user",
  inviteEmail: "Employee email",
  roleLabel: "Business Portal role",
  expiryLabel: "Link expires in",
  expiryDefaultDays: 7,
  operatorNote: "Internal note (optional)",
  manualDelivery:
    "Copy-link fallback is always available. When email delivery is not configured, copy the link and share it yourself.",
  emailConfiguredHint:
    "Email delivery is configured. Crow will attempt to deliver a transactional invite after creation.",
  emailUnconfiguredHint:
    "Email delivery is not configured. Copy and send the invite link manually after creation.",
  copyLinkLabel: "Copy invite link (fallback)",
  deliveryDelivered: "Invite email delivered",
  deliveryUnavailable: "Invite created, but email delivery is unavailable",
  deliveryFailed: "Invite created, but the email could not be delivered",
  retryEmail: "Retry email delivery",
  oneTimeUrl:
    "Raw link is shown once — it is not stored in Crow and cannot be retrieved later.",
  inviteListTitle: "Invite history",
  inviteListEmpty: "No invites yet. Create a link above to activate a tenant user.",
  statusPending: "Pending",
  statusAccepted: "Invite accepted",
  statusRevoked: "Invite revoked",
  statusExpired: "Invite expired",
  revokeAction: "Revoke",
  breakGlassTitle: "Advanced / Break-glass membership grant",
  breakGlassSubtitle:
    "Operator recovery and testing only — grants membership immediately when a Supabase account already exists. Normal onboarding uses Business Portal invite links above.",
  breakGlassSubmit: "Grant membership immediately",
  safetyNotesTitle: "Access boundaries",
} as const;

export const WORKFORCE_ACTIVATION_SAFETY_NOTES = [
  "Business Portal access only — not ProCrow operator access.",
  "No platform admin or platform staff role.",
  "No Client Portal proposal approval rights.",
  "No production billing or payment activation.",
] as const;
