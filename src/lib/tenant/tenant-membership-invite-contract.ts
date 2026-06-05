/**
 * M4B — ProCrow-controlled tenant membership invite / onboarding contract.
 * Business Portal access requires verified tenant membership; invite does not grant ProCrow or Client approval rights.
 */

export type TenantInviteStatus =
  | "draft"
  | "ready_to_send"
  | "pending_account"
  | "pending_acceptance"
  | "active"
  | "cancelled"
  | "expired"
  | "blocked";

export type TenantInviteRole = "tenant_user" | "tenant_admin";

export type TenantInviteSource =
  | "procrow_operator"
  | "tenant_admin"
  | "script_import"
  | "future_entra_mapping";

export const TENANT_INVITE_ROLE_ALLOWLIST: readonly TenantInviteRole[] = [
  "tenant_user",
  "tenant_admin",
] as const;

export type TenantMembershipInviteDraft = {
  tenantId: string;
  tenantSlug: string;
  email: string;
  role: TenantInviteRole;
  invitedBy: string;
  note?: string;
};

export type TenantMembershipInviteSnapshot = {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  email: string;
  role: TenantInviteRole | null;
  status: TenantInviteStatus;
  authUserExists: boolean;
  membershipExists: boolean;
  membershipActive: boolean;
  source: TenantInviteSource | null;
  nextAction: string;
  warnings: string[];
  disclaimers: readonly string[];
};

export const TENANT_MEMBERSHIP_INVITE_DISCLAIMERS = [
  "Invite grants Business Portal (tenant) access only — not ProCrow operator access.",
  "Invite does not assign platform_admin or any platform staff role.",
  "Invite does not grant Client Portal proposal approval rights.",
  "Invite does not auto-provision tenants or enable payments.",
  "Membership is not created from email domain match or public self-join.",
] as const;

export function isTenantInviteRole(value: string): value is TenantInviteRole {
  return (TENANT_INVITE_ROLE_ALLOWLIST as readonly string[]).includes(value);
}
