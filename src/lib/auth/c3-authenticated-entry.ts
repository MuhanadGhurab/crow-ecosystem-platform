import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { gateAuthSessionForC3 } from "@/lib/account/c3-auth-orchestration";
import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import { isC3GoogleOAuthCallbackEligible } from "@/lib/account/provider-identity.service";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { routes } from "@/lib/routes";

/** Canonical redirect for an already-authenticated session hitting auth entry pages. */
export async function redirectAuthenticatedSession(
  user: User,
  nextPath?: string,
  oauthProviderHint?: string | null
): Promise<never> {
  if (
    isC3PlatformAccountGateEnabled() &&
    isC3GoogleOAuthCallbackEligible(user, oauthProviderHint)
  ) {
    redirect(
      nextPath ? routes.auth.resolvingWithNext(nextPath) : routes.auth.resolving
    );
  }

  if (isC3PlatformAccountGateEnabled()) {
    const gate = await gateAuthSessionForC3(user, nextPath);
    if (gate.action === "redirect") {
      redirect(gate.path);
    }
    if (gate.action === "error") {
      redirect("/login?error=forbidden");
    }
  }

  redirect(await resolveC3PostAuthLanding(user, nextPath));
}
