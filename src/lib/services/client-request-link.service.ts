import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { CrowAppMetadata } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import { getSupabaseUrl } from "@/lib/supabase/env";

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

/** Link matching requests to the Supabase user and optionally grant client role. */
export async function linkRequestsForUser(user: User): Promise<string[]> {
  const email = user.email;
  if (!email) return [];

  const requestIds = await findRequestIdsByContactEmail(email);
  if (requestIds.length === 0) return [];

  await prisma.implementationRequest.updateMany({
    where: { id: { in: requestIds }, submittedByUserId: null },
    data: { submittedByUserId: user.id },
  });

  const meta = (user.app_metadata ?? {}) as CrowAppMetadata;
  if (!meta.crow_role) {
    await ensureClientRole(user.id, requestIds);
  } else if (meta.crow_role === "client") {
    await syncLinkedRequestIds(user.id, requestIds);
  }

  return requestIds;
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
      crow_role: "client",
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
        select: { id: true, proposalToken: true, proposalStatus: true, status: true, proposalSentAt: true },
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
