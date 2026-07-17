"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ensureClientRoleForAuthenticatedIntake,
  linkRequestsForUser,
} from "@/lib/services/client-request-link.service";
import { createImplementationRequest } from "@/lib/services/implementation-request.service";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";
import {
  runPublicIntakeGuards,
  unexpectedIntakeFailure,
} from "@/lib/security/public-intake-guard";
import { assertLegacyImplementationRequestIntakeDisabled } from "@/lib/client-service-request/legacy-intake-guard";
import type { ImplementationRequestInput } from "@/lib/types/platform";

export type PublicIntakeSubmissionMeta = {
  companyWebsite?: string;
  turnstileToken?: string | null;
};

export async function submitImplementationRequest(
  input: ImplementationRequestInput,
  meta?: PublicIntakeSubmissionMeta
) {
  assertLegacyImplementationRequestIntakeDisabled();
  const hdrs = await headers();
  const guard = await runPublicIntakeGuards({
    headers: hdrs,
    body: {
      ...input,
      companyWebsite: meta?.companyWebsite,
      turnstileToken: meta?.turnstileToken ?? undefined,
    },
  });

  if ("status" in guard) {
    const msg = guard.body.error;
    if (guard.status === 429) {
      throw new Error(msg);
    }
    throw new Error(msg);
  }

  let submittedByUserId: string | undefined;
  if (!isAuthDisabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error("Sign in required to submit an enterprise request.");
    }
    const access = await ensureClientRoleForAuthenticatedIntake(user);
    if (!access.ok) {
      throw new Error(access.error);
    }
    submittedByUserId = user.id;
    try {
      await linkRequestsForUser(user);
    } catch {
      /* DB optional */
    }
  }

  try {
    const created = await createImplementationRequest(guard.data, { submittedByUserId });
    revalidatePath("/admin/requests");
    revalidatePath("/portal/requests");
    return {
      id: created.id,
      referenceCode: created.referenceCode,
      status: created.status,
    };
  } catch {
    throw new Error(unexpectedIntakeFailure().body.error);
  }
}
