/**
 * M4C — Tenant invite acceptance token contract (durable invite row + public accept route).
 */

import type { TenantInviteRole, TenantInviteSource } from "@/lib/tenant/tenant-membership-invite-contract";
import { TENANT_MEMBERSHIP_INVITE_DISCLAIMERS } from "@/lib/tenant/tenant-membership-invite-contract";

export type TenantMembershipInviteRecordStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export type TenantInviteAcceptanceViewStatus =
  | "invalid"
  | "pending"
  | "accepted"
  | "revoked"
  | "expired"
  | "requires_sign_in"
  | "email_mismatch"
  | "ready_to_accept";

export const DEFAULT_TENANT_INVITE_EXPIRY_DAYS = 7;

export const TENANT_INVITE_ACCEPTANCE_DISCLAIMERS = [
  ...TENANT_MEMBERSHIP_INVITE_DISCLAIMERS,
  "Invite links are shared manually in this phase — Crow does not send invite email.",
  "Each invite link is single-use and expires; revoked invites cannot be accepted.",
] as const;

export type TenantMembershipInviteListItem = {
  id: string;
  email: string;
  role: TenantInviteRole;
  status: TenantMembershipInviteRecordStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  operatorNote: string | null;
};

export type TenantInviteAcceptancePublicView = {
  viewStatus: TenantInviteAcceptanceViewStatus;
  tenantName: string;
  tenantSlug: string;
  email: string;
  role: TenantInviteRole | null;
  expiresAt: string | null;
  signedInEmail: string | null;
  disclaimers: readonly string[];
};

export type CreateTenantInviteTokenResult = {
  inviteId: string;
  inviteUrl: string;
  email: string;
  role: TenantInviteRole;
  expiresAt: string;
  /** Shown once at create — not stored in DB. */
  message: string;
};

export type AcceptTenantInviteResult = {
  tenantSlug: string;
  tenantName: string;
  role: TenantInviteRole;
  redirectPath: string;
};

export type TenantInviteAcceptanceAuditSource = TenantInviteSource;
