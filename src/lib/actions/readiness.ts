"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import type { GoLiveChecklistKey } from "@/lib/constants/go-live-checklist";
import { routes } from "@/lib/routes";
import { setManualReadinessItem } from "@/lib/services/readiness.service";

export async function toggleManualReadinessAction(
  blueprintId: string,
  itemKey: GoLiveChecklistKey,
  completed: boolean
) {
  await requireActionPlatformStaff();
  await setManualReadinessItem(blueprintId, itemKey, completed);
  const b = routes.blueprint(blueprintId);
  revalidatePath(b.goLive);
  revalidatePath(b.readiness);
}
