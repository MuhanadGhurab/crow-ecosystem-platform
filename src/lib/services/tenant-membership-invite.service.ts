import { prisma } from "@/lib/db";
import {
  grantTenantAccess,
  grantTenantAccessByEmail,
  inviteAndGrantTenantAccess,
  lookupSupabaseUserByEmail,
} from "@/lib/services/membership.service";
import { getTenantById, getTenantBySlug } from "@/lib/services/tenant.service";
import {
  isTenantInviteRole,
  TENANT_MEMBERSHIP_INVITE_DISCLAIMERS,
  type TenantInviteRole,
  type TenantInviteSource,
  type TenantInviteStatus,
  type TenantMembershipInviteSnapshot,
} from "@/lib/tenant/tenant-membership-invite-contract";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function inferInviteStatus(input: {
  authUserExists: boolean;
  membershipExists: boolean;
  membershipActive: boolean;
}): TenantInviteStatus {
  if (input.membershipActive) return "active";
  if (input.membershipExists) return "pending_acceptance";
  if (!input.authUserExists) return "pending_account";
  return "ready_to_send";
}

export async function buildTenantMembershipInviteSnapshot(
  tenantId: string,
  tenantSlug: string,
  tenantName: string,
  email: string,
  role: TenantInviteRole | null = null,
  source: TenantInviteSource | null = null
): Promise<TenantMembershipInviteSnapshot> {
  const normalized = normalizeEmail(email);
  const warnings: string[] = [];

  let authUserExists = false;
  let authUserId: string | null = null;
  try {
    const authUser = await lookupSupabaseUserByEmail(normalized);
    if (authUser) {
      authUserExists = true;
      authUserId = authUser.id;
    }
  } catch (err) {
    warnings.push(
      err instanceof Error
        ? `Auth lookup unavailable: ${err.message}`
        : "Auth lookup unavailable."
    );
  }

  let membershipExists = false;
  let membershipActive = false;
  if (authUserId) {
    const row = await prisma.tenantMembership.findUnique({
      where: {
        supabaseUserId_tenantId: { supabaseUserId: authUserId, tenantId },
      },
    });
    membershipExists = Boolean(row);
    membershipActive = Boolean(row);
  }

  const status = inferInviteStatus({ authUserExists, membershipExists, membershipActive });

  let nextAction = "Add member with tenant_user or tenant_admin role.";
  if (status === "active") {
    nextAction = "Membership is active — user can sign in and open Business Portal via /access.";
  } else if (status === "pending_account") {
    nextAction =
      "No Supabase account for this email yet. User must sign up with this exact address, then re-run Add member (or enable Supabase invite API below).";
  } else if (status === "ready_to_send") {
    nextAction = "Auth account exists — Add member will grant DB membership and sync tenant_slugs metadata.";
  }

  return {
    tenantId,
    tenantSlug,
    tenantName,
    email: normalized,
    role,
    status,
    authUserExists,
    membershipExists,
    membershipActive,
    source,
    nextAction,
    warnings,
    disclaimers: TENANT_MEMBERSHIP_INVITE_DISCLAIMERS,
  };
}

async function logTenantMembershipInviteAudit(input: {
  tenantId: string;
  tenantSlug: string;
  email: string;
  role: TenantInviteRole;
  invitedBy: string;
  source: TenantInviteSource;
  status: TenantInviteStatus;
  note?: string;
}) {
  try {
    await prisma.platformNotification.create({
      data: {
        eventType: "tenant_membership_invite",
        recipientEmail: PLATFORM_ADVISORY_EMAIL,
        subject: `Tenant membership invite · /${input.tenantSlug}`,
        body: `${input.invitedBy} added ${input.email} as ${input.role} (${input.status}).`,
        status: "logged",
        deliveryStatus: "logged",
        inboxStatus: "open",
        severity: "low",
        metadata: {
          tenantId: input.tenantId,
          tenantSlug: input.tenantSlug,
          inviteEmail: input.email,
          inviteRole: input.role,
          inviteStatus: input.status,
          inviteSource: input.source,
          invitedBy: input.invitedBy,
          ...(input.note ? { operatorNote: input.note } : {}),
        },
      },
    });
  } catch {
    /* never block invite */
  }
}

export type CreateTenantMembershipInviteInput = {
  tenantId?: string;
  tenantSlug?: string;
  email: string;
  role: TenantInviteRole;
  invitedBy: string;
  invitedByEmail: string | null;
  source: TenantInviteSource;
  note?: string;
  /** When true, uses Supabase inviteUserByEmail — does not imply Crow email delivery. */
  useSupabaseInviteApi?: boolean;
};

export type CreateTenantMembershipInviteResult = {
  snapshot: TenantMembershipInviteSnapshot;
  message: string;
};

export async function createTenantMembershipInvite(
  input: CreateTenantMembershipInviteInput
): Promise<CreateTenantMembershipInviteResult> {
  if (!isTenantInviteRole(input.role)) {
    throw new Error("Role must be tenant_user or tenant_admin.");
  }

  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    throw new Error("A valid email address is required.");
  }

  const tenant = input.tenantId
    ? await getTenantById(input.tenantId)
    : input.tenantSlug
      ? await getTenantBySlug(input.tenantSlug)
      : null;

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const authUser = await lookupSupabaseUserByEmail(email);

  if (!authUser && !input.useSupabaseInviteApi) {
    const snapshot = await buildTenantMembershipInviteSnapshot(
      tenant.id,
      tenant.slug,
      tenant.organization.displayName,
      email,
      input.role,
      input.source
    );
    await logTenantMembershipInviteAudit({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      email,
      role: input.role,
      invitedBy: input.invitedByEmail ?? input.invitedBy,
      source: input.source,
      status: "pending_account",
      note: input.note,
    });
    return {
      snapshot,
      message:
        "No account exists for this email yet. The user must sign up with this exact address, then run Add member again. Email delivery is not active in this phase unless Supabase invite API is enabled below.",
    };
  }

  if (input.useSupabaseInviteApi) {
    await inviteAndGrantTenantAccess(email, tenant.id, tenant.slug, input.role);
    const snapshot = await buildTenantMembershipInviteSnapshot(
      tenant.id,
      tenant.slug,
      tenant.organization.displayName,
      email,
      input.role,
      input.source
    );
    await logTenantMembershipInviteAudit({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      email,
      role: input.role,
      invitedBy: input.invitedByEmail ?? input.invitedBy,
      source: input.source,
      status: snapshot.status,
      note: input.note,
    });
    return {
      snapshot: { ...snapshot, status: "active", membershipActive: true, membershipExists: true },
      message:
        "Membership record created via Supabase invite API. Crow does not send transactional email in this phase — confirm delivery in Supabase Auth if needed.",
    };
  }

  if (authUser) {
    await grantTenantAccess(authUser.id, tenant.id, tenant.slug, input.role);
  } else {
    await grantTenantAccessByEmail(email, tenant.id, tenant.slug, input.role);
  }

  const snapshot = await buildTenantMembershipInviteSnapshot(
    tenant.id,
    tenant.slug,
    tenant.organization.displayName,
    email,
    input.role,
    input.source
  );

  await logTenantMembershipInviteAudit({
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    email,
    role: input.role,
    invitedBy: input.invitedByEmail ?? input.invitedBy,
    source: input.source,
    status: "active",
    note: input.note,
  });

  return {
    snapshot: { ...snapshot, status: "active", membershipActive: true, membershipExists: true },
    message: `${email} can sign in with this email and access /${tenant.slug} Business Portal via /access.`,
  };
}
