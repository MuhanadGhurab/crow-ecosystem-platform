"use server";

import { revalidatePath } from "next/cache";
import { requireActionPermission } from "@/lib/auth/action-guard";
import { Permission } from "@/lib/auth/permissions";
import { routes } from "@/lib/routes";
import { updatePlatformNotificationStatus } from "@/lib/services/platform-notification.service";

export async function markPlatformNotificationReviewed(notificationId: string) {
  await requireActionPermission(Permission["platform.audit.view"]);
  await updatePlatformNotificationStatus(notificationId, "reviewed");
  revalidatePath(routes.admin.notifications);
  revalidatePath(routes.admin.overview);
  revalidatePath(routes.admin.tenants);
}

export async function dismissPlatformNotification(notificationId: string) {
  await requireActionPermission(Permission["platform.audit.view"]);
  await updatePlatformNotificationStatus(notificationId, "dismissed");
  revalidatePath(routes.admin.notifications);
  revalidatePath(routes.admin.overview);
  revalidatePath(routes.admin.tenants);
}
