"use server";

import { revalidatePath } from "next/cache";
import { linkRequestsForUser } from "@/lib/services/client-request-link.service";
import { createImplementationRequest } from "@/lib/services/implementation-request.service";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";
import type { ImplementationRequestInput } from "@/lib/types/platform";

export async function submitImplementationRequest(input: ImplementationRequestInput) {
  let submittedByUserId: string | undefined;
  if (!isAuthDisabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id) {
      submittedByUserId = user.id;
      try {
        await linkRequestsForUser(user);
      } catch {
        /* DB optional */
      }
    }
  }

  const created = await createImplementationRequest(input, { submittedByUserId });
  revalidatePath("/admin/requests");
  revalidatePath("/portal/requests");
  return {
    id: created.id,
    referenceCode: created.referenceCode,
    status: created.status,
  };
}
