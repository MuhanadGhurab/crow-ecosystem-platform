import { createClient } from "@supabase/supabase-js";
import type { CrowAppMetadata, CrowRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import { getSupabaseUrl } from "@/lib/supabase/env";

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for membership operations");
  }
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function listTenantMemberships(tenantId: string) {
  return prisma.tenantMembership.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

/** Grant a Supabase user access to a tenant (DB row + app_metadata sync). */
export async function grantTenantAccess(
  supabaseUserId: string,
  tenantId: string,
  tenantSlug: string,
  role: Extract<CrowRole, "tenant_admin" | "tenant_user">
) {
  await prisma.tenantMembership.upsert({
    where: {
      supabaseUserId_tenantId: { supabaseUserId, tenantId },
    },
    create: { supabaseUserId, tenantId, role },
    update: { role },
  });

  const admin = getSupabaseAdmin();
  const { data: userData, error: fetchError } = await admin.auth.admin.getUserById(supabaseUserId);
  if (fetchError || !userData.user) {
    throw new Error(fetchError?.message ?? "User not found in Supabase Auth");
  }

  const meta = (userData.user.app_metadata ?? {}) as CrowAppMetadata;
  const tenantSlugs = new Set(meta.tenant_slugs ?? []);
  tenantSlugs.add(tenantSlug);

  const { error: updateError } = await admin.auth.admin.updateUserById(supabaseUserId, {
    app_metadata: {
      ...meta,
      crow_role: role,
      tenant_slugs: Array.from(tenantSlugs),
    },
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { supabaseUserId, tenantId, tenantSlug, role };
}

export async function grantTenantAccessByEmail(
  email: string,
  tenantId: string,
  tenantSlug: string,
  role: Extract<CrowRole, "tenant_admin" | "tenant_user">
) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error(`No Supabase user with email ${email}. Create the user in Auth first.`);
  }

  return grantTenantAccess(user.id, tenantId, tenantSlug, role);
}

/** Invite new user by email (or grant existing), then sync tenant membership. */
export async function inviteAndGrantTenantAccess(
  email: string,
  tenantId: string,
  tenantSlug: string,
  role: Extract<CrowRole, "tenant_admin" | "tenant_user">
) {
  const admin = getSupabaseAdmin();
  const normalized = email.trim().toLowerCase();

  const { data: listData, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw new Error(listError.message);

  const existing = listData.users.find((u) => u.email?.toLowerCase() === normalized);
  if (existing) {
    return grantTenantAccess(existing.id, tenantId, tenantSlug, role);
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    normalized,
    {
      redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback`,
    }
  );

  if (inviteError || !inviteData.user) {
    throw new Error(inviteError?.message ?? "Failed to invite user");
  }

  await admin.auth.admin.updateUserById(inviteData.user.id, {
    app_metadata: {
      crow_role: role,
      tenant_slugs: [tenantSlug],
    },
  });

  return grantTenantAccess(inviteData.user.id, tenantId, tenantSlug, role);
}

/** Promote a client (same Supabase user) to tenant member — no second account. */
export async function promoteClientToTenantUser(
  supabaseUserId: string,
  tenantId: string,
  tenantSlug: string,
  role: Extract<CrowRole, "tenant_admin" | "tenant_user">
) {
  const admin = getSupabaseAdmin();
  const { data: userData, error: fetchError } = await admin.auth.admin.getUserById(supabaseUserId);
  if (fetchError || !userData.user) {
    throw new Error(fetchError?.message ?? "User not found in Supabase Auth");
  }

  const meta = (userData.user.app_metadata ?? {}) as CrowAppMetadata;
  if (meta.crow_role && meta.crow_role !== "client") {
    return grantTenantAccess(supabaseUserId, tenantId, tenantSlug, role);
  }

  return grantTenantAccess(supabaseUserId, tenantId, tenantSlug, role);
}

export async function promoteClientToTenantUserByEmail(
  email: string,
  tenantId: string,
  tenantSlug: string,
  role: Extract<CrowRole, "tenant_admin" | "tenant_user">
) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error(
      `No Supabase user with email ${email}. Ask them to sign in with Microsoft first.`
    );
  }

  return promoteClientToTenantUser(user.id, tenantId, tenantSlug, role);
}
