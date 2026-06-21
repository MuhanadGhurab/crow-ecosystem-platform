"use server";

import { redirect } from "next/navigation";
import { isNextRedirectError } from "@/lib/auth/next-redirect";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import {
  accountStatusPath,
  oauthSessionLoginPath,
  resolveCrowPostAuthSession,
  type PostAuthResolutionResult,
  type PostAuthResolutionSanitizedFailureClass,
  type PostAuthResolutionStage,
} from "@/lib/auth/c3-post-auth-resolution";

export type PostAuthResolutionActionState =
  | {
      status: "complete";
      redirectPath: string;
      stages: PostAuthResolutionStage[];
    }
  | {
      status: "account_status";
      redirectPath: string;
      stages: PostAuthResolutionStage[];
    }
  | {
      status: "resolver_error";
      message: string;
      supportRef: string;
      stages: PostAuthResolutionStage[];
      failureStage: PostAuthResolutionStage;
      failureClass?: PostAuthResolutionSanitizedFailureClass;
    }
  | {
      status: "no_session";
    }
  | undefined;

function mapResult(result: PostAuthResolutionResult): PostAuthResolutionActionState {
  if (result.outcome === "no_session") {
    return { status: "no_session" };
  }

  if (result.outcome === "redirect") {
    return {
      status: "complete",
      redirectPath: result.path,
      stages: result.stages,
    };
  }

  const failureStage = result.failureStage ?? "account_checked";

  if (
    result.reason === "configuration" ||
    result.failureClass === "RESOLUTION_TIMEOUT"
  ) {
    return {
      status: "resolver_error",
      message: result.message,
      supportRef: result.supportRef,
      stages: result.stages,
      failureStage,
      failureClass: result.failureClass,
    };
  }

  return {
    status: "account_status",
    redirectPath: accountStatusPath({
      reason: result.reason,
      supportRef: result.supportRef,
    }),
    stages: result.stages,
  };
}

export async function runPostAuthResolutionAction(
  _prev: PostAuthResolutionActionState,
  formData: FormData
): Promise<PostAuthResolutionActionState> {
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));
  const user = await getSessionUser();
  const result = await resolveCrowPostAuthSession(user, next);
  return mapResult(result);
}

/** Immediate server resolution for OAuth callback handoff (no UI). */
export async function resolvePostAuthSessionOrRedirect(next?: string | null): Promise<never> {
  const user = await getSessionUser();
  const result = await resolveCrowPostAuthSession(user, next);

  if (result.outcome === "no_session") {
    redirect(oauthSessionLoginPath());
  }

  if (result.outcome === "redirect") {
    redirect(result.path);
  }

  redirect(
    accountStatusPath({
      reason: result.reason,
      supportRef: result.supportRef,
    })
  );
}

export async function retryPostAuthResolution(next?: string | null): Promise<void> {
  try {
    await resolvePostAuthSessionOrRedirect(next);
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    throw err;
  }
}
