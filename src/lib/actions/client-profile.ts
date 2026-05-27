"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClientAccess } from "@/lib/auth/session";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Display name is required").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  job_title: z.string().trim().max(80).optional().or(z.literal("")),
  preferred_language: z.string().trim().max(40).optional().or(z.literal("")),
});

export type ClientProfileUpdateResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updateClientProfileMetadata(
  _prev: ClientProfileUpdateResult | null,
  formData: FormData
): Promise<ClientProfileUpdateResult> {
  const user = await requireClientAccess(routes.client.profile);
  const { role } = getCrowAuth(user);

  if (isAuthDisabled()) {
    return { ok: false, error: "Profile editing is disabled in local auth bypass mode." };
  }

  if (isPlatformStaff(role)) {
    return {
      ok: false,
      error: "Platform staff cannot update client profile fields from the Client Portal.",
    };
  }

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") ?? "",
    job_title: formData.get("job_title") ?? "",
    preferred_language: formData.get("preferred_language") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const { full_name, phone, job_title, preferred_language } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name,
      phone: phone || undefined,
      job_title: job_title || undefined,
      preferred_language: preferred_language || undefined,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(routes.client.profile);
  revalidatePath(routes.client.home);
  revalidatePath(routes.client.settings);

  return { ok: true };
}
