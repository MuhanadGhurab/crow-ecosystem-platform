import type { User } from "@supabase/supabase-js";

import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { getCrowAuth } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

/**
 * C3-aware post-auth landing. Active platform accounts without a crow_role
 * route to Account Home (least-privilege requester), not login?error=role_config.
 */
export async function resolveC3PostAuthLanding(
  user: User,
  explicitNext?: string | null
): Promise<string> {
  if (!isAccountRegistrationEnabled()) {
    return resolvePostLoginDestination(user, explicitNext);
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (account && isPlatformAccountActive(account)) {
    const { role } = getCrowAuth(user);
    if (!role) {
      return routes.account.home;
    }
  }

  return resolvePostLoginDestination(user, explicitNext);
}
