import type { User } from "@supabase/supabase-js";

import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import {
  resolveAuthoritativeCrowAuth,
  userWithAuthoritativeMetadata,
} from "@/lib/auth/authoritative-crow-auth";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { routes } from "@/lib/routes";

/**
 * C3-aware post-auth landing. Active platform accounts without authoritative Crow role
 * route to Account Home (least-privilege requester), not client portal via metadata alone.
 */
export async function resolveC3PostAuthLanding(
  user: User,
  explicitNext?: string | null
): Promise<string> {
  if (!isC3PlatformAccountGateEnabled()) {
    return resolvePostLoginDestination(user, explicitNext);
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (account && isPlatformAccountActive(account)) {
    const auth = await resolveAuthoritativeCrowAuth(user);
    if (!auth.role) {
      return routes.account.home;
    }
    return resolvePostLoginDestination(
      userWithAuthoritativeMetadata(user, auth),
      explicitNext
    );
  }

  const auth = await resolveAuthoritativeCrowAuth(user);
  if (!auth.role) {
    return routes.account.home;
  }

  return resolvePostLoginDestination(
    userWithAuthoritativeMetadata(user, auth),
    explicitNext
  );
}
