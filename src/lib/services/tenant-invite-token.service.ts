import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/db";
import { grantTenantAccess } from "@/lib/services/membership.service";
import { getTenantById } from "@/lib/services/tenant.service";
import {
  DEFAULT_TENANT_INVITE_EXPIRY_DAYS,
  TENANT_INVITE_ACCEPTANCE_DISCLAIMERS,
  type AcceptTenantInviteResult,
  type CreateTenantInviteTokenResult,
  type TenantInviteAcceptanceAuditSource,
  type TenantInviteAcceptancePublicView,
  type TenantInviteAcceptanceViewStatus,
  type TenantMembershipInviteListItem,
  type TenantMembershipInviteRecordStatus,
} from "@/lib/tenant/tenant-invite-acceptance-contract";
import {
  isTenantInviteRole,
  type TenantInviteRole,
} from "@/lib/tenant/tenant-membership-invite-contract";
import type { TenantMembershipInviteStatus } from "@prisma/client";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function hashInviteToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function generateRawInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function buildTenantInviteAcceptanceUrl(rawToken: string): string {
  return `${siteOrigin()}/tenant-invite/${rawToken}`;
}

function toRecordStatus(status: TenantMembershipInviteStatus): TenantMembershipInviteRecordStatus {
  return status as TenantMembershipInviteRecordStatus;
}

function mapListItem(row: {
  id: string;
  email: string;
  role: string;
  status: TenantMembershipInviteStatus;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  operatorNote: string | null;
}): TenantMembershipInviteListItem {
  return {
    id: row.id,
    email: row.email,
    role: row.role as TenantInviteRole,
    status: toRecordStatus(row.status),
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    acceptedAt: row.acceptedAt?.toISOString() ?? null,
    revokedAt: row.revokedAt?.toISOString() ?? null,
    operatorNote: row.operatorNote,
  };
}

async function expireInviteIfNeeded(invite: {
  id: string;
  status: TenantMembershipInviteStatus;
  expiresAt: Date;
}): Promise<TenantMembershipInviteStatus> {
  if (invite.status !== "pending") return invite.status;
  if (invite.expiresAt.getTime() > Date.now()) return invite.status;

  await prisma.tenantMembershipInvite.update({
    where: { id: invite.id },
    data: { status: "expired" },
  });
  return "expired";
}

async function logInviteAcceptanceAudit(input: {
  tenantId: string;
  tenantSlug: string;
  email: string;
  role: TenantInviteRole;
  actorLabel: string;
  source: TenantInviteAcceptanceAuditSource;
  event: "created" | "accepted" | "revoked";
  note?: string;
}) {
  try {
    const subjectByEvent = {
      created: `Business Portal invite link created · /${input.tenantSlug}`,
      accepted: `Tenant invite accepted · /${input.tenantSlug}`,
      revoked: `Tenant invite revoked · /${input.tenantSlug}`,
    } as const;
    const bodyByEvent = {
      created: `${input.actorLabel} created invite link for ${input.email} as ${input.role}.`,
      accepted: `${input.email} accepted invite as ${input.role}.`,
      revoked: `${input.actorLabel} revoked pending invite for ${input.email}.`,
    } as const;

    await prisma.platformNotification.create({
      data: {
        eventType: "tenant_membership_invite",
        recipientEmail: PLATFORM_ADVISORY_EMAIL,
        subject: subjectByEvent[input.event],
        body: bodyByEvent[input.event],
        status: "logged",
        deliveryStatus: "logged",
        inboxStatus: "open",
        severity: "low",
        metadata: {
          tenantId: input.tenantId,
          tenantSlug: input.tenantSlug,
          inviteEmail: input.email,
          inviteRole: input.role,
          inviteEvent: input.event,
          inviteSource: input.source,
          invitedBy: input.actorLabel,
          ...(input.note ? { operatorNote: input.note } : {}),
        },
      },
    });
  } catch {
    /* never block invite flow */
  }
}

export async function listTenantMembershipInvitesForTenant(
  tenantId: string
): Promise<TenantMembershipInviteListItem[]> {
  const rows = await prisma.tenantMembershipInvite.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const items: TenantMembershipInviteListItem[] = [];
  for (const row of rows) {
    const status = await expireInviteIfNeeded(row);
    items.push(mapListItem({ ...row, status }));
  }
  return items;
}

export type CreateTenantInviteTokenInput = {
  tenantId: string;
  email: string;
  role: TenantInviteRole;
  invitedByUserId: string;
  invitedByLabel: string;
  source: TenantInviteAcceptanceAuditSource;
  expiryDays?: number;
  operatorNote?: string;
};

export async function createTenantInviteToken(
  input: CreateTenantInviteTokenInput
): Promise<CreateTenantInviteTokenResult> {
  if (!isTenantInviteRole(input.role)) {
    throw new Error("Role must be tenant_user or tenant_admin.");
  }

  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    throw new Error("A valid email address is required.");
  }

  const tenant = await getTenantById(input.tenantId);
  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const pending = await prisma.tenantMembershipInvite.findFirst({
    where: { tenantId: tenant.id, email, status: "pending" },
  });
  if (pending) {
    const status = await expireInviteIfNeeded(pending);
    if (status === "pending") {
      throw new Error(
        "A pending invite already exists for this email. Revoke it or wait for expiry before creating a new link."
      );
    }
  }

  const expiryDays = input.expiryDays ?? DEFAULT_TENANT_INVITE_EXPIRY_DAYS;
  if (expiryDays < 1 || expiryDays > 90) {
    throw new Error("Expiry must be between 1 and 90 days.");
  }

  const rawToken = generateRawInviteToken();
  const tokenHash = hashInviteToken(rawToken);
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  const invite = await prisma.tenantMembershipInvite.create({
    data: {
      tenantId: tenant.id,
      email,
      role: input.role,
      tokenHash,
      expiresAt,
      invitedByUserId: input.invitedByUserId,
      operatorNote: input.operatorNote,
    },
  });

  const inviteUrl = buildTenantInviteAcceptanceUrl(rawToken);

  await logInviteAcceptanceAudit({
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    email,
    role: input.role,
    actorLabel: input.invitedByLabel,
    source: input.source,
    event: "created",
    note: input.operatorNote,
  });

  return {
    inviteId: invite.id,
    inviteUrl,
    email,
    role: input.role,
    expiresAt: expiresAt.toISOString(),
    message:
      "Copy the invite link and share it manually with the invited user. Crow does not send email in this phase.",
  };
}

async function findInviteByRawToken(rawToken: string) {
  if (!rawToken || rawToken.length < 16) return null;
  const tokenHash = hashInviteToken(rawToken);
  const invite = await prisma.tenantMembershipInvite.findUnique({
    where: { tokenHash },
    include: {
      tenant: {
        include: { organization: true },
      },
    },
  });
  if (!invite) return null;
  const status = await expireInviteIfNeeded(invite);
  return { ...invite, status };
}

function resolveViewStatus(input: {
  recordStatus: TenantMembershipInviteRecordStatus;
  signedInEmail: string | null;
  invitedEmail: string;
}): TenantInviteAcceptanceViewStatus {
  if (input.recordStatus === "accepted") return "accepted";
  if (input.recordStatus === "revoked") return "revoked";
  if (input.recordStatus === "expired") return "expired";
  if (!input.signedInEmail) return "requires_sign_in";
  if (normalizeEmail(input.signedInEmail) !== normalizeEmail(input.invitedEmail)) {
    return "email_mismatch";
  }
  return "ready_to_accept";
}

export async function buildTenantInviteAcceptancePublicView(
  rawToken: string,
  signedInEmail: string | null
): Promise<TenantInviteAcceptancePublicView> {
  const invite = await findInviteByRawToken(rawToken);
  if (!invite) {
    return {
      viewStatus: "invalid",
      tenantName: "",
      tenantSlug: "",
      email: "",
      role: null,
      expiresAt: null,
      signedInEmail,
      disclaimers: TENANT_INVITE_ACCEPTANCE_DISCLAIMERS,
    };
  }

  const recordStatus = toRecordStatus(invite.status);
  const role = isTenantInviteRole(invite.role) ? invite.role : null;

  return {
    viewStatus: resolveViewStatus({
      recordStatus,
      signedInEmail,
      invitedEmail: invite.email,
    }),
    tenantName: invite.tenant.organization.displayName,
    tenantSlug: invite.tenant.slug,
    email: invite.email,
    role,
    expiresAt: invite.expiresAt.toISOString(),
    signedInEmail,
    disclaimers: TENANT_INVITE_ACCEPTANCE_DISCLAIMERS,
  };
}

export async function acceptTenantInviteByToken(
  rawToken: string,
  supabaseUserId: string,
  userEmail: string
): Promise<AcceptTenantInviteResult> {
  const invite = await findInviteByRawToken(rawToken);
  if (!invite) {
    throw new Error("Invite link is invalid or no longer available.");
  }

  const recordStatus = toRecordStatus(invite.status);
  if (recordStatus === "accepted") {
    throw new Error("This invite has already been accepted.");
  }
  if (recordStatus === "revoked") {
    throw new Error("This invite was revoked by an operator.");
  }
  if (recordStatus === "expired") {
    throw new Error("This invite has expired. Ask an operator for a new link.");
  }
  if (!isTenantInviteRole(invite.role)) {
    throw new Error("Invite role is not allowed.");
  }

  const normalizedUserEmail = normalizeEmail(userEmail);
  if (normalizedUserEmail !== invite.email) {
    throw new Error("Sign in with the email address this invite was sent to.");
  }

  await grantTenantAccess(
    supabaseUserId,
    invite.tenantId,
    invite.tenant.slug,
    invite.role
  );

  await prisma.tenantMembershipInvite.update({
    where: { id: invite.id },
    data: {
      status: "accepted",
      acceptedByUserId: supabaseUserId,
      acceptedAt: new Date(),
    },
  });

  await logInviteAcceptanceAudit({
    tenantId: invite.tenantId,
    tenantSlug: invite.tenant.slug,
    email: invite.email,
    role: invite.role,
    actorLabel: normalizedUserEmail,
    source: "tenant_admin",
    event: "accepted",
  });

  return {
    tenantSlug: invite.tenant.slug,
    tenantName: invite.tenant.organization.displayName,
    role: invite.role,
    redirectPath: `/access`,
  };
}

export async function revokeTenantInvite(
  inviteId: string,
  tenantId: string,
  revokedByUserId: string,
  revokedByLabel: string,
  source: TenantInviteAcceptanceAuditSource
): Promise<void> {
  const invite = await prisma.tenantMembershipInvite.findFirst({
    where: { id: inviteId, tenantId },
    include: { tenant: true },
  });
  if (!invite) {
    throw new Error("Invite not found.");
  }

  const status = await expireInviteIfNeeded(invite);
  if (status !== "pending") {
    throw new Error("Only pending invites can be revoked.");
  }

  if (!isTenantInviteRole(invite.role)) {
    throw new Error("Invite role is not allowed.");
  }

  await prisma.tenantMembershipInvite.update({
    where: { id: invite.id },
    data: {
      status: "revoked",
      revokedAt: new Date(),
      revokedByUserId,
    },
  });

  await logInviteAcceptanceAudit({
    tenantId: invite.tenantId,
    tenantSlug: invite.tenant.slug,
    email: invite.email,
    role: invite.role,
    actorLabel: revokedByLabel,
    source,
    event: "revoked",
    note: invite.operatorNote ?? undefined,
  });
}
