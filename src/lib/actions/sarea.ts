"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import { filterValidNavKeys } from "@/lib/sarea/studio-helpers";
import { logSareaStudioMutation } from "@/lib/services/sarea-studio-audit.service";
import { prisma } from "@/lib/db";
import {
  updateAdaptiveUiRule,
  updateAdaptiveRuleDensity,
  updateDashboardLayout,
  updateDeviceExperienceRule,
  updateDeviceRuleJson,
  updateExperienceProfileConfig,
  updateExperienceProfileName,
  updateNavigationPrimaryKeys,
  updateRoleExperienceMap,
  updateRoleMapProfile,
  updateWidgetRuleVisibility,
} from "@/lib/services/sarea.service";

export type SareaActionState = { error?: string; success?: string } | undefined;

function revalidateSarea(path: string) {
  revalidatePath(routes.sarea.overview);
  revalidatePath(routes.sarea.profiles);
  revalidatePath(routes.sarea.roleMapping);
  revalidatePath(routes.sarea.preview);
  revalidatePath(routes.sarea.widgets);
  revalidatePath(routes.sarea.navigation);
  revalidatePath(routes.sarea.deviceRules);
  revalidatePath(path);
}

export async function updateLayoutNameAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Layout id and name required." };
  try {
    await updateDashboardLayout(id, name);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.layouts);
  return { success: "Layout updated." };
}

export async function updateWidgetVisibilityAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const visibility = String(formData.get("visibility") ?? "");
  if (!id || !visibility) return { error: "Widget id and visibility required." };
  try {
    const before = await prisma.widgetRule.findUnique({
      where: { id },
      include: { profile: { include: { tenant: { select: { slug: true } } } } },
    });
    await updateWidgetRuleVisibility(id, visibility);
    const slug = before?.profile.tenant?.slug;
    await logSareaStudioMutation({
      kind: "widget_visibility",
      tenantSlug: slug ?? undefined,
      summary: `Widget ${before?.widgetKey ?? id}: visibility ${before?.visibility ?? "?"} → ${visibility}.`,
      metadata: {
        widgetKey: before?.widgetKey ?? id,
        personaKey: before?.profile.personaKey ?? "",
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.widgets);
  return { success: "Widget visibility updated — RBAC and route access unchanged." };
}

export async function updateRoleMapAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const roleSlug = String(formData.get("roleSlug") ?? "").trim();
  if (!id || !roleSlug) return { error: "Map id and role slug required." };
  try {
    await updateRoleExperienceMap(id, roleSlug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.roleMapping);
  return { success: "Role map updated." };
}

export async function updateAdaptiveRuleAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const ruleKey = String(formData.get("ruleKey") ?? "").trim();
  if (!id || !ruleKey) return { error: "Rule id and key required." };
  try {
    await updateAdaptiveUiRule(id, ruleKey);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.rules);
  return { success: "Adaptive rule updated." };
}

export async function updateDeviceRuleAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const deviceType = String(formData.get("deviceType") ?? "").trim();
  if (!id || !deviceType) return { error: "Rule id and device type required." };
  try {
    await updateDeviceExperienceRule(id, deviceType);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.deviceRules);
  return { success: "Device rule updated." };
}

export async function updateNavigationKeysAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const primaryRaw = String(formData.get("primaryKeys") ?? "").trim();
  if (!id || !primaryRaw) return { error: "Navigation id and keys required." };
  const parsed = primaryRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const { valid, rejected } = filterValidNavKeys(parsed);
  if (valid.length === 0) {
    return {
      error:
        rejected.length > 0
          ? `No valid nav keys. Rejected: ${rejected.join(", ")}. Use SAREA shell keys only.`
          : "At least one valid navigation key required.",
    };
  }
  try {
    const before = await prisma.navigationProfile.findUnique({
      where: { id },
      include: { profile: { include: { tenant: { select: { slug: true } } } } },
    });
    await updateNavigationPrimaryKeys(id, valid);
    const slug = before?.profile.tenant?.slug;
    const prev =
      ((before?.configJson as { primary?: string[] } | null)?.primary ?? []).join(", ") || "—";
    await logSareaStudioMutation({
      kind: "navigation_keys",
      tenantSlug: slug ?? undefined,
      summary: `Navigation ${before?.profile.personaKey ?? ""}: ${prev} → ${valid.join(", ")}.`,
      metadata: {
        personaKey: before?.profile.personaKey ?? "",
        ...(rejected.length > 0 ? { rejectedKeys: rejected.join(",") } : {}),
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.navigation);
  const warn =
    rejected.length > 0
      ? ` Saved ${valid.length} keys; ignored unknown: ${rejected.join(", ")}.`
      : "";
  return {
    success: `Navigation updated — shell links only; RBAC still gates routes.${warn}`,
  };
}

export async function updateDensityLevelAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const level = String(formData.get("level") ?? "").trim();
  if (!id || !level) return { error: "Rule id and density level required." };
  try {
    await updateAdaptiveRuleDensity(id, level);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.rules);
  return { success: "Density updated." };
}

export async function updateDeviceCompactAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const compact = String(formData.get("compact") ?? "") === "true";
  if (!id) return { error: "Device rule id required." };
  try {
    await updateDeviceRuleJson(id, { compact, touchTargets: compact ? "large" : "default" });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.deviceRules);
  return { success: "Compact mode updated." };
}

export async function updateProfileNameAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Profile id and name required." };
  try {
    const before = await prisma.sareaExperienceProfile.findUnique({
      where: { id },
      include: { tenant: { select: { slug: true } } },
    });
    await updateExperienceProfileName(id, name);
    await logSareaStudioMutation({
      kind: "profile_update",
      tenantSlug: before?.tenant?.slug ?? undefined,
      summary: `Profile ${before?.personaKey ?? id} renamed: ${before?.name ?? "?"} → ${name}.`,
      metadata: { personaKey: before?.personaKey ?? "" },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.profiles);
  return { success: "Profile renamed." };
}

export async function updateProfileConfigAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const complexity = String(formData.get("complexity") ?? "").trim();
  if (!id) return { error: "Profile id required." };
  try {
    const before = await prisma.sareaExperienceProfile.findUnique({
      where: { id },
      include: { tenant: { select: { slug: true } } },
    });
    await updateExperienceProfileConfig(id, { complexity: complexity || undefined });
    await logSareaStudioMutation({
      kind: "profile_update",
      tenantSlug: before?.tenant?.slug ?? undefined,
      summary: `Profile ${before?.personaKey ?? id} config updated (complexity: ${complexity || "unchanged"}).`,
      metadata: { personaKey: before?.personaKey ?? "" },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.profiles);
  return { success: "Profile settings updated." };
}

export async function updateRoleMapProfileAction(
  _prev: SareaActionState,
  formData: FormData
): Promise<SareaActionState> {
  await requireActionPlatformStaff();
  const id = String(formData.get("id") ?? "");
  const profileId = String(formData.get("profileId") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!id || !profileId) return { error: "Map id and profile required." };
  if (confirm !== "yes") return { error: "Type confirmation to apply mapping change." };
  try {
    const map = await prisma.roleExperienceMap.findUnique({
      where: { id },
      include: {
        profile: { include: { tenant: { select: { slug: true } } } },
      },
    });
    if (!map) return { error: "Role map not found." };
    const target = await prisma.sareaExperienceProfile.findUnique({ where: { id: profileId } });
    if (!target) return { error: "Target profile not found." };
    await updateRoleMapProfile(id, profileId);
    const slug = map.profile.tenant?.slug;
    await logSareaStudioMutation({
      kind: "role_map_reassign",
      tenantSlug: slug ?? undefined,
      summary: `Role ${map.roleSlug}: profile ${map.profile.name} (${map.profile.personaKey}) → ${target.name} (${target.personaKey}).`,
      metadata: {
        roleSlug: map.roleSlug,
        fromPersona: map.profile.personaKey,
        toPersona: target.personaKey,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.roleMapping);
  return {
    success: `Role now maps to the selected profile. Preview and dashboard presentation will follow the new persona — RBAC permissions unchanged.`,
  };
}
