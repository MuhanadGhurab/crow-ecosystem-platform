import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import {
  getCrowAuth,
  isClient,
  isPlatformStaff,
  type CrowRole,
} from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import { countRequestsForEmail } from "@/lib/services/client-request-link.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { getRequiredOnboardingGeneration } from "@/lib/account/onboarding-generation";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import { resolveTenantPlatformAccountAuthorization } from "@/lib/account/tenant-platform-account-authorization";
import {
  TENANT_MEMBERSHIP_DISCLAIMERS,
  type TenantBusinessPortalAccessDecision,
  type TenantBusinessPortalAccessLevel,
  type TenantMembershipAccessSummary,
  type TenantMembershipRole,
  type TenantMembershipSource,
  type TenantMembershipStatus,
} from "@/lib/tenant/tenant-membership-contract";

function mapCrowRoleToMembershipRole(
  role: CrowRole | null,
  dbMembershipRole: string | null,
  isOperator: boolean
): TenantMembershipRole | null {
  if (isOperator) return "operator_preview";
  if (dbMembershipRole === "tenant_admin") return "admin";
  if (dbMembershipRole === "tenant_user") return "employee";
  if (role === "tenant_admin") return "admin";
  if (role === "tenant_user") return "employee";
  if (role === "auditor_readonly") return "viewer";
  return null;
}

function mapToAccessLevel(
  membershipRole: TenantMembershipRole | null,
  status: TenantMembershipStatus
): TenantBusinessPortalAccessLevel {
  if (status !== "active" && status !== "preview_only") return "none";
  switch (membershipRole) {
    case "owner":
      return "owner";
    case "admin":
      return "admin";
    case "manager":
      return "manager";
    case "employee":
      return "employee";
    case "viewer":
      return "read_only";
    case "operator_preview":
      return "operator_preview";
    default:
      return "none";
  }
}

function blockedDecision(
  tenantSlug: string,
  user: User | null,
  blockedReason: string,
  warnings: string[] = []
): TenantBusinessPortalAccessDecision {
  return {
    tenantSlug,
    userId: user?.id ?? "",
    userEmail: user?.email ?? null,
    isAuthenticated: Boolean(user),
    isPlatformStaff: false,
    membershipStatus: "removed",
    membershipRole: null,
    accessLevel: "none",
    canViewBusinessPortal: false,
    canUseWorkflowActions: false,
    canManageTenantUsers: false,
    canPreviewAsOperator: false,
    source: "unavailable",
    blockedReason,
    warnings,
    disclaimers: TENANT_MEMBERSHIP_DISCLAIMERS,
  };
}

async function isEmailOnlyReviewer(email: string | undefined): Promise<boolean> {
  if (!email) return false;
  try {
    const count = await countRequestsForEmail(email);
    return count > 0;
  } catch {
    return false;
  }
}

/** Resolve Business Portal access for one tenant slug (read-only — no grants). */
export async function resolveTenantBusinessPortalAccess(
  user: User | null,
  tenantSlug: string
): Promise<TenantBusinessPortalAccessDecision> {
  const slug = tenantSlug.trim().toLowerCase();
  if (!user) {
    return blockedDecision(slug, null, "Sign in to access the Business Portal.");
  }

  const tenant = await getTenantBySlug(slug);
  const { role, tenantSlugs } = getCrowAuth(user);
  const warnings: string[] = [];

  if (!tenant) {
    return blockedDecision(slug, user, "Tenant workspace not found.");
  }

  const base = {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    userId: user.id,
    userEmail: user.email ?? null,
    isAuthenticated: true,
    isPlatformStaff: isPlatformStaff(role),
    disclaimers: TENANT_MEMBERSHIP_DISCLAIMERS,
    warnings,
  };

  if (isClient(role)) {
    return {
      ...base,
      membershipStatus: "removed",
      membershipRole: null,
      accessLevel: "none",
      canViewBusinessPortal: false,
      canUseWorkflowActions: false,
      canManageTenantUsers: false,
      canPreviewAsOperator: false,
      source: "unavailable",
      blockedReason:
        "Client Portal accounts cannot open the Business Portal without verified tenant membership.",
    };
  }

  if (!role && user.email && (await isEmailOnlyReviewer(user.email))) {
    return {
      ...base,
      membershipStatus: "removed",
      membershipRole: null,
      accessLevel: "none",
      canViewBusinessPortal: false,
      canUseWorkflowActions: false,
      canManageTenantUsers: false,
      canPreviewAsOperator: false,
      source: "unavailable",
      blockedReason:
        "Email-linked request reviewers may use the Client Portal only — not the Business Portal.",
    };
  }

  if (isPlatformStaff(role)) {
    const membershipRole: TenantMembershipRole = "operator_preview";
    const accessLevel = mapToAccessLevel(membershipRole, "preview_only");
    return {
      ...base,
      membershipStatus: "preview_only",
      membershipRole,
      accessLevel,
      canViewBusinessPortal: true,
      canUseWorkflowActions: true,
      canManageTenantUsers: false,
      canPreviewAsOperator: true,
      source: "operator_preview",
      blockedReason: null,
      warnings: [
        "Operator preview mode — this does not grant tenant employee status.",
      ],
    };
  }

  if (role === "auditor_readonly" && tenantSlugs.includes(slug)) {
    const membershipRole: TenantMembershipRole = "viewer";
    const accessLevel = mapToAccessLevel(membershipRole, "active");
    return {
      ...base,
      membershipStatus: "active",
      membershipRole,
      accessLevel,
      canViewBusinessPortal: true,
      canUseWorkflowActions: false,
      canManageTenantUsers: false,
      canPreviewAsOperator: false,
      source: "auth_metadata",
      blockedReason: null,
      warnings: ["Auditor access is read-only within tenant runtime."],
    };
  }

  const dbMembership = await prisma.tenantMembership.findUnique({
    where: {
      supabaseUserId_tenantId: {
        supabaseUserId: user.id,
        tenantId: tenant.id,
      },
    },
  });

  const metadataSlugMatch =
    (role === "tenant_admin" || role === "tenant_user") && tenantSlugs.includes(slug);

  let source: TenantMembershipSource = "unavailable";
  let membershipStatus: TenantMembershipStatus = "removed";

  if (dbMembership) {
    source = "database_membership";
    membershipStatus = "active";
    if (!metadataSlugMatch) {
      warnings.push(
        "Database membership exists but JWT tenant_slugs is out of sync — access granted via DB row.",
      );
    }
  } else if (metadataSlugMatch) {
    source = "auth_metadata";
    membershipStatus = "active";
    warnings.push(
      "Access is metadata-based (tenant_slugs) without a matching tenant_memberships row — treat as temporary until ProCrow syncs membership.",
    );
  } else {
    return {
      ...base,
      membershipStatus: "removed",
      membershipRole: null,
      accessLevel: "none",
      canViewBusinessPortal: false,
      canUseWorkflowActions: false,
      canManageTenantUsers: false,
      canPreviewAsOperator: false,
      source: "unavailable",
      blockedReason: "Verified tenant membership is required for this workspace.",
    };
  }

  const platformGate = await resolveTenantPlatformAccountAuthorization(user.id, {
    requiredGeneration: getRequiredOnboardingGeneration(),
    registrationFeatureEnabled: isAccountRegistrationEnabled(),
    hasTenantMembership: Boolean(dbMembership) || metadataSlugMatch,
  });
  if (!platformGate.authorized) {
    return blockedDecision(slug, user, platformGate.message, warnings);
  }

  const membershipRole = mapCrowRoleToMembershipRole(
    role,
    dbMembership?.role ?? null,
    false
  );
  const accessLevel = mapToAccessLevel(membershipRole, membershipStatus);
  const canView = accessLevel !== "none";
  const canWorkflow =
    canView &&
    (accessLevel === "employee" ||
      accessLevel === "manager" ||
      accessLevel === "admin" ||
      accessLevel === "owner" ||
      accessLevel === "operator_preview");
  const canManage =
    accessLevel === "admin" || accessLevel === "owner" || role === "tenant_admin";

  return {
    ...base,
    membershipStatus,
    membershipRole,
    accessLevel,
    canViewBusinessPortal: canView,
    canUseWorkflowActions: canWorkflow,
    canManageTenantUsers: canManage,
    canPreviewAsOperator: false,
    source,
    blockedReason: canView ? null : "Verified tenant membership is required.",
    warnings,
  };
}

/** List tenant slugs the user may open in Business Portal. */
export async function listTenantBusinessPortalSlugsForUser(
  user: User | null
): Promise<string[]> {
  if (!user) return [];
  const { role, tenantSlugs } = getCrowAuth(user);

  if (isClient(role)) return [];

  if (isPlatformStaff(role)) {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { slug: "asc" },
    });
    return tenants.map((t) => t.slug);
  }

  const dbRows = await prisma.tenantMembership.findMany({
    where: { supabaseUserId: user.id },
    include: { tenant: { select: { slug: true, isActive: true } } },
  });

  const fromDb = dbRows
    .filter((r) => r.tenant.isActive)
    .map((r) => r.tenant.slug);

  const merged = new Set<string>([...fromDb, ...tenantSlugs]);
  const slugs = [...merged];

  const allowed: string[] = [];
  for (const slug of slugs) {
    const decision = await resolveTenantBusinessPortalAccess(user, slug);
    if (decision.canViewBusinessPortal) allowed.push(slug);
  }
  return allowed;
}

/** ProCrow tenant detail — membership model summary (read-only). */
export async function buildTenantMembershipAccessSummaryForTenantId(
  tenantId: string
): Promise<TenantMembershipAccessSummary | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { organization: true, memberships: true },
  });
  if (!tenant) return null;

  const activeCount = tenant.memberships.length;
  const notes: string[] = [];

  if (activeCount === 0) {
    notes.push("No tenant_memberships rows — Business Portal may rely on JWT tenant_slugs only.");
  } else {
    notes.push(
      `${activeCount} tenant_memberships row(s) — DB is the preferred source of truth when synced with Supabase app_metadata.`,
    );
  }

  const model: TenantMembershipAccessSummary["membershipModel"] =
    activeCount > 0 ? "hybrid" : "metadata_only";

  return {
    tenantSlug: tenant.slug,
    tenantName: tenant.organization.displayName,
    membershipModel: model,
    activeMembershipCount: activeCount,
    metadataOnlyWarning: activeCount === 0,
    accessSourceNotes: notes,
    recommendedNextAction:
      activeCount === 0
        ? "Grant tenant access via ProCrow (GrantTenantAccessForm) to create DB membership and sync JWT."
        : "Review memberships for role accuracy; invite flow (M4B) optional.",
    disclaimers: TENANT_MEMBERSHIP_DISCLAIMERS,
  };
}
