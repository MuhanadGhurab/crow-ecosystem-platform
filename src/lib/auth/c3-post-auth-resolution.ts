import type { User } from "@supabase/supabase-js";

import { BlueprintAuthorizationError } from "@/lib/crow-core/blueprint-runtime/blueprint-errors";
import { gateAuthSessionForC3 } from "@/lib/account/c3-auth-orchestration";
import {
  isC3GoogleOAuthCallbackEligible,
  resolveOAuthProviderForPlatformAccount,
  resolvePlatformAccountForOAuthUser,
} from "@/lib/account/provider-identity.service";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import {
  createRegistrationCorrelationId,
  formatSupportReference,
} from "@/lib/account/c3-registration-errors";
import { routes } from "@/lib/routes";

export type PostAuthResolutionStage =
  | "session_secured"
  | "account_checked"
  | "legal_reviewed"
  | "workspace_ready";

export type PostAuthAccountStatusReason =
  | "blocked"
  | "collision"
  | "conflict"
  | "configuration";

export type PostAuthResolutionSanitizedFailureClass =
  | "PRODUCTION_DATABASE_ENV_MISMATCH"
  | "PLATFORM_ACCOUNT_RECONCILIATION_FAILED"
  | "LEGAL_STATE_RESOLUTION_FAILED"
  | "POST_AUTH_LANDING_FAILED"
  | "RESOLUTION_TIMEOUT"
  | "CONFIGURATION";

export type PostAuthResolutionResult =
  | {
      outcome: "redirect";
      path: string;
      stages: PostAuthResolutionStage[];
    }
  | {
      outcome: "account_status";
      reason: PostAuthAccountStatusReason;
      message: string;
      supportRef: string;
      stages: PostAuthResolutionStage[];
      failureStage?: PostAuthResolutionStage;
      failureClass?: PostAuthResolutionSanitizedFailureClass;
    }
  | {
      outcome: "no_session";
      stages: PostAuthResolutionStage[];
    };

const RESOLUTION_TIMEOUT_MS = 12_000;

function mapLinkFailure(
  reason: "email_conflict" | "blocked" | "provider_collision",
  supportRef: string,
  stages: PostAuthResolutionStage[]
): PostAuthResolutionResult {
  if (reason === "blocked") {
    return {
      outcome: "account_status",
      reason: "blocked",
      message: "This account is not permitted to sign in.",
      supportRef,
      stages,
    };
  }
  return {
    outcome: "account_status",
    reason: reason === "provider_collision" ? "collision" : "conflict",
    message: "We could not safely link this sign-in to a Crow account.",
    supportRef,
    stages,
  };
}

function configurationFailure(
  stages: PostAuthResolutionStage[],
  supportRef: string,
  failureStage: PostAuthResolutionStage,
  failureClass: PostAuthResolutionSanitizedFailureClass,
  message = "We authenticated your Google account, but could not prepare your Crow account."
): PostAuthResolutionResult {
  return {
    outcome: "account_status",
    reason: "configuration",
    message,
    supportRef,
    stages,
    failureStage,
    failureClass,
  };
}

function classifyPersistenceError(err: unknown): PostAuthResolutionSanitizedFailureClass {
  if (!(err instanceof BlueprintAuthorizationError)) {
    return "PLATFORM_ACCOUNT_RECONCILIATION_FAILED";
  }
  const msg = err.message.toLowerCase();
  if (
    msg.includes("database_environment") ||
    msg.includes("expected_database_fingerprint") ||
    msg.includes("fingerprint mismatch")
  ) {
    return "PRODUCTION_DATABASE_ENV_MISMATCH";
  }
  return "CONFIGURATION";
}

async function resolveInternal(
  user: User,
  explicitNext?: string | null
): Promise<PostAuthResolutionResult> {
  const stages: PostAuthResolutionStage[] = ["session_secured"];
  const supportRef = formatSupportReference(createRegistrationCorrelationId());

  try {
    if (!user.email) {
      return {
        outcome: "account_status",
        reason: "configuration",
        message: "Account email is required to continue.",
        supportRef,
        stages,
        failureStage: "session_secured",
        failureClass: "CONFIGURATION",
      };
    }

    if (isC3GoogleOAuthCallbackEligible(user)) {
      const provider = resolveOAuthProviderForPlatformAccount(user);
      if (!provider) {
        return {
          outcome: "account_status",
          reason: "configuration",
          message: "Google sign-in is not available in this environment.",
          supportRef,
          stages,
          failureStage: "session_secured",
          failureClass: "CONFIGURATION",
        };
      }

      const link = await resolvePlatformAccountForOAuthUser(user, provider);
      if (!link.ok) {
        return mapLinkFailure(link.reason, supportRef, stages);
      }
    }

    stages.push("account_checked");

    const gate = await gateAuthSessionForC3(user, explicitNext ?? undefined);

    if (gate.action === "redirect") {
      return { outcome: "redirect", path: gate.path, stages };
    }

    if (gate.action === "error") {
      return {
        outcome: "account_status",
        reason: "blocked",
        message: gate.message,
        supportRef,
        stages,
        failureStage: "legal_reviewed",
        failureClass: "LEGAL_STATE_RESOLUTION_FAILED",
      };
    }

    stages.push("legal_reviewed");

    const landing = await resolveC3PostAuthLanding(user, explicitNext);
    stages.push("workspace_ready");

    return { outcome: "redirect", path: landing, stages };
  } catch (err) {
    const failureClass = classifyPersistenceError(err);
    const failureStage: PostAuthResolutionStage = stages.includes("account_checked")
      ? stages.includes("legal_reviewed")
        ? "workspace_ready"
        : "legal_reviewed"
      : "account_checked";
    return configurationFailure(stages, supportRef, failureStage, failureClass);
  }
}

/** Server-controlled post-OAuth resolution — reuses C3 gate and landing services. */
export async function resolveCrowPostAuthSession(
  user: User | null,
  explicitNext?: string | null
): Promise<PostAuthResolutionResult> {
  if (!user) {
    return { outcome: "no_session", stages: [] };
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      resolveInternal(user, explicitNext),
      new Promise<PostAuthResolutionResult>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("resolution_timeout")), RESOLUTION_TIMEOUT_MS);
      }),
    ]);
    return result;
  } catch (err) {
    const supportRef = formatSupportReference(createRegistrationCorrelationId());
    if (err instanceof Error && err.message === "resolution_timeout") {
      return {
        outcome: "account_status",
        reason: "configuration",
        message: "We authenticated your Google account, but could not prepare your Crow account.",
        supportRef,
        stages: ["session_secured"],
        failureStage: "account_checked",
        failureClass: "RESOLUTION_TIMEOUT",
      };
    }
    if (err instanceof BlueprintAuthorizationError) {
      return configurationFailure(
        ["session_secured"],
        supportRef,
        "account_checked",
        classifyPersistenceError(err)
      );
    }
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function accountStatusPath(input: {
  reason: PostAuthAccountStatusReason;
  supportRef: string;
}): string {
  const params = new URLSearchParams({
    reason: input.reason,
    ref: input.supportRef,
  });
  return `${routes.auth.accountStatus}?${params.toString()}`;
}

export function oauthSessionLoginPath(): string {
  return `${routes.auth.login}?error=oauth-session`;
}
