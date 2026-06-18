import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { PUBLIC_SIGNUP_ALLOWED_ROLE } from "@/lib/auth/sanitize-auth-next";
import { getCrowAuth, type CrowAppMetadata } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { isUseMockData } from "@/lib/mock/env";

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return null;
  }
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Requests where primary contact email matches (case-insensitive). */
export async function findRequestIdsByContactEmail(email: string): Promise<string[]> {
  const normalized = normalizeEmail(email);
  const rows = await prisma.requestContact.findMany({
    where: {
      isPrimary: true,
      email: { equals: normalized, mode: "insensitive" },
    },
    select: { requestId: true },
  });
  return rows.map((r) => r.requestId);
}

export async function countRequestsForEmail(email: string): Promise<number> {
  const ids = await findRequestIdsByContactEmail(email);
  return ids.length;
}

type LinkRequestsOptions = {
  /** When false, only associate request ids — do not grant crow_role (C3 activation path). */
  grantClientRole?: boolean;
};

/** Link matching requests to the Supabase user and optionally grant client role. */
export async function linkRequestsForUser(
  user: User,
  options?: LinkRequestsOptions
): Promise<string[]> {
  const email = user.email;
  if (!email) return [];

  const requestIds = await findRequestIdsByContactEmail(email);
  if (requestIds.length === 0) return [];

  // I9 hardening: contact-email matches must remain review-only in non-mock mode.
  // Only mock/demo mode may use contact-email to fill `submittedByUserId`.
  if (isUseMockData()) {
    await prisma.implementationRequest.updateMany({
      where: { id: { in: requestIds }, submittedByUserId: null },
      data: { submittedByUserId: user.id },
    });
  }

  const meta = (user.app_metadata ?? {}) as CrowAppMetadata;
  const grantClientRole = options?.grantClientRole !== false;
  if (grantClientRole && !meta.crow_role) {
    await ensureClientRole(user.id, requestIds);
  } else if (meta.crow_role === "client") {
    await syncLinkedRequestIds(user.id, requestIds);
  }

  return requestIds;
}

/**
 * Public sign-up: grant client role only when none is set (never overwrites staff/tenant roles).
 */
export async function assignDefaultClientRoleOnSignUp(userId: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return false;

  const meta = (data.user.app_metadata ?? {}) as CrowAppMetadata;
  if (meta.crow_role) return true;

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...meta,
      crow_role: PUBLIC_SIGNUP_ALLOWED_ROLE,
      tenant_slugs: [],
      linked_request_ids: Array.isArray(meta.linked_request_ids) ? meta.linked_request_ids : [],
    },
  });
  return !updateError;
}

export type AuthenticatedIntakeAccessResult =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 503; error: string };

/**
 * ERP request intake: authenticated users without a role receive client only (never overwrites staff).
 */
export async function ensureClientRoleForAuthenticatedIntake(
  user: User
): Promise<AuthenticatedIntakeAccessResult> {
  const { role } = getCrowAuth(user);
  if (role) {
    return { ok: true };
  }

  if (!isSupabaseServiceRoleConfigured()) {
    return {
      ok: false,
      status: 503,
      error:
        "Your account is signed in but Crow client access is not configured on the server. The operator must set SUPABASE_SERVICE_ROLE_KEY in Vercel (server-only, not NEXT_PUBLIC). Then sign out and sign in again.",
    };
  }

  const assigned = await assignDefaultClientRoleOnSignUp(user.id);
  if (!assigned) {
    return {
      ok: false,
      status: 403,
      error:
        "Your account could not be granted client access. Sign out, sign in again, or contact support if this continues.",
    };
  }

  return { ok: true };
}

async function ensureClientRole(userId: string, requestIds: string[]): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return;

  const meta = (data.user.app_metadata ?? {}) as CrowAppMetadata;
  if (meta.crow_role) return;

  await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...meta,
      crow_role: PUBLIC_SIGNUP_ALLOWED_ROLE,
      tenant_slugs: [],
      linked_request_ids: requestIds,
    },
  });
}

async function syncLinkedRequestIds(userId: string, requestIds: string[]): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return;

  const meta = (data.user.app_metadata ?? {}) as CrowAppMetadata;
  const existing = Array.isArray(meta.linked_request_ids) ? meta.linked_request_ids : [];
  const merged = Array.from(new Set([...existing, ...requestIds]));

  await admin.auth.admin.updateUserById(userId, {
    app_metadata: { ...meta, linked_request_ids: merged },
  });
}

export async function listClientRequests(userId: string, email: string) {
  const byEmail = await findRequestIdsByContactEmail(email);
  const byUser = await prisma.implementationRequest.findMany({
    where: { submittedByUserId: userId },
    select: { id: true },
  });
  const ids = Array.from(new Set([...byEmail, ...byUser.map((r) => r.id)]));
  if (ids.length === 0) return [];

  return prisma.implementationRequest.findMany({
    where: { id: { in: ids } },
    orderBy: { updatedAt: "desc" },
    include: {
      contacts: true,
      requestedPlans: true,
      requestedModules: true,
      requestedSecurityPkgs: true,
      discoveryProfile: { include: { answers: true } },
      enterpriseBlueprint: {
        select: {
          id: true,
          proposalToken: true,
          proposalStatus: true,
          status: true,
          proposalSentAt: true,
          clientApprovedAt: true,
          tenant: { select: { id: true, slug: true, isActive: true } },
        },
      },
    },
  });
}

export async function clientCanAccessRequest(
  userId: string,
  email: string,
  requestId: string
): Promise<boolean> {
  const ids = await findRequestIdsByContactEmail(email);
  if (ids.includes(requestId)) return true;

  const row = await prisma.implementationRequest.findFirst({
    where: { id: requestId, submittedByUserId: userId },
    select: { id: true },
  });
  return Boolean(row);
}
