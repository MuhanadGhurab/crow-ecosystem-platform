/**
 * A1 — Tenant workforce activation (M4C invite reframe).
 */

export const TENANT_WORKFORCE_ACTIVATION_TITLE = "Tenant workforce activation" as const;

export const BUSINESS_PORTAL_INVITE_TITLE = "Business Portal invite" as const;

export const WORKFORCE_ACTIVATION_DESCRIPTION =
  "Invite and activate tenant employees into the Business Portal after runtime preparation. Manual copy-link mode — Crow does not send email in this phase." as const;

export const WORKFORCE_ACTIVATION_COPY = {
  sectionTitle: "Business Portal invites",
  sectionSubtitle: "Tenant workforce activation — manual copy-link mode",
  createLink: "Create invite link",
  activateUser: "Activate tenant user",
  inviteEmail: "Employee email",
  manualDelivery: "Manual copy-link mode — copy the link and share it yourself. Email delivery is not active.",
  oneTimeUrl: "Copy this link now — it is shown once and is not stored in Crow.",
  breakGlassTitle: "Break-glass: immediate membership",
  breakGlassSubtitle: "Use only when a Supabase account already exists. Standard onboarding uses invite links above.",
} as const;
