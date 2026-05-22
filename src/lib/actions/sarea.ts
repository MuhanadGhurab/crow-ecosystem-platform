"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import {
  updateAdaptiveUiRule,
  updateDashboardLayout,
  updateDeviceExperienceRule,
  updateRoleExperienceMap,
  updateWidgetRuleVisibility,
} from "@/lib/services/sarea.service";

export type SareaActionState = { error?: string; success?: string } | undefined;

function revalidateSarea(path: string) {
  revalidatePath(routes.sarea.overview);
  revalidatePath(routes.sarea.profiles);
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
    await updateWidgetRuleVisibility(id, visibility);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidateSarea(routes.sarea.widgets);
  return { success: "Widget rule updated." };
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
