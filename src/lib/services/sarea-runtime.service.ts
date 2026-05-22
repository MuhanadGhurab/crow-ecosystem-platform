import type { User } from "@supabase/supabase-js";
import type { CrowRole } from "@/lib/auth/roles";
import { isPlatformStaff } from "@/lib/auth/roles";
import {
  SAREA_DASHBOARD_WIDGETS,
  type SareaDashboardWidgetKey,
} from "@/lib/constants/sarea-runtime";
import { prisma } from "@/lib/db";

export type SareaRuntimeContext = {
  personaKey: string;
  profileName: string;
  roleSlug: string;
  navKeys: string[];
  widgets: { key: string; visibility: "visible" | "hidden" | "optional" }[];
  density: "spacious" | "comfortable" | "compact";
  compact: boolean;
};

const DEFAULT_NAV = ["dashboard", "tasks", "users", "modules", "cybercrow"];

const CROW_ROLE_SLUG: Partial<Record<CrowRole, string>> = {
  tenant_admin: "tenant-admin",
  tenant_user: "employee",
};

export async function resolveRoleSlugForUser(
  tenantId: string,
  userEmail: string,
  crowRole: CrowRole | null
): Promise<string> {
  const profile = await prisma.profile.findFirst({
    where: { tenantId, email: { equals: userEmail, mode: "insensitive" } },
    include: { userRoles: { include: { role: true } } },
  });

  if (profile?.userRoles[0]?.role.slug) {
    return profile.userRoles[0].role.slug;
  }

  if (crowRole && isPlatformStaff(crowRole)) {
    return "tenant-admin";
  }

  return CROW_ROLE_SLUG[crowRole ?? "tenant_user"] ?? "employee";
}

export async function getSareaRuntimeContext(
  tenantId: string,
  userEmail: string,
  crowRole: CrowRole | null
): Promise<SareaRuntimeContext> {
  const roleSlug = await resolveRoleSlugForUser(tenantId, userEmail, crowRole);

  const roleMap = await prisma.roleExperienceMap.findFirst({
    where: {
      roleSlug,
      profile: { tenantId },
    },
    include: {
      profile: {
        include: {
          widgetRules: true,
          navigationProfiles: true,
          deviceRules: true,
          adaptiveRules: true,
        },
      },
    },
  });

  let profile = roleMap?.profile ?? undefined;

  if (!profile) {
    profile =
      (await prisma.sareaExperienceProfile.findFirst({
      where: { tenantId },
      include: {
        widgetRules: true,
        navigationProfiles: true,
        deviceRules: true,
        adaptiveRules: true,
      },
      orderBy: { personaKey: "asc" },
    })) ?? undefined;
  }

  if (!profile) {
    return {
      personaKey: "default",
      profileName: "Standard experience",
      roleSlug,
      navKeys: DEFAULT_NAV,
      widgets: SAREA_DASHBOARD_WIDGETS.map((w) => ({
        key: w.key,
        visibility: "visible" as const,
      })),
      density: "comfortable",
      compact: false,
    };
  }

  const navConfig = profile.navigationProfiles[0]?.configJson as
    | { primary?: string[] }
    | null
    | undefined;
  const navKeys = Array.isArray(navConfig?.primary) ? navConfig.primary : DEFAULT_NAV;

  const widgets = profile.widgetRules.map((w) => ({
    key: w.widgetKey,
    visibility: w.visibility as "visible" | "hidden" | "optional",
  }));

  const densityRule = profile.adaptiveRules.find((r) => r.ruleKey === "density");
  const densityJson = densityRule?.configJson as { level?: string } | null;
  const density =
    densityJson?.level === "spacious" || densityJson?.level === "compact"
      ? densityJson.level
      : "comfortable";

  const deviceRule = profile.deviceRules[0];
  const deviceJson = deviceRule?.rulesJson as { compact?: boolean } | null;
  const compact =
    Boolean(deviceJson?.compact) || deviceRule?.deviceType === "mobile";

  return {
    personaKey: profile.personaKey,
    profileName: profile.name,
    roleSlug,
    navKeys,
    widgets,
    density,
    compact,
  };
}

export function isWidgetVisible(
  runtime: SareaRuntimeContext,
  widgetKey: SareaDashboardWidgetKey
): boolean {
  const rule = runtime.widgets.find((w) => w.key === widgetKey);
  if (!rule) return true;
  return rule.visibility !== "hidden";
}

export async function getSareaRuntimeForTenantSlug(
  slug: string,
  user: User
): Promise<{ tenantId: string; runtime: SareaRuntimeContext } | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!tenant) return null;

  const crowRole =
    typeof user.app_metadata?.crow_role === "string"
      ? (user.app_metadata.crow_role as CrowRole)
      : null;

  const runtime = await getSareaRuntimeContext(
    tenant.id,
    user.email ?? "",
    crowRole
  );

  return { tenantId: tenant.id, runtime };
}
