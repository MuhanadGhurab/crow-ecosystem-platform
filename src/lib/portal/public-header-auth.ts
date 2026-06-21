import "server-only";

import type { User } from "@supabase/supabase-js";

import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import { prisma } from "@/lib/db";
import {
  resolveAuthoritativeCrowAuth,
  userWithAuthoritativeMetadata,
} from "@/lib/auth/authoritative-crow-auth";
import { routes } from "@/lib/routes";
import {
  getAuthenticatedPortalCta,
  type AuthenticatedPortalCta,
} from "@/lib/portal/portal-access-lite";

export type PublicHeaderAuth = {
  portalCta: AuthenticatedPortalCta;
  isAccountSession: true;
  showSignOut: true;
};

export type PublicHeaderPortalAuth = {
  portalCta: AuthenticatedPortalCta;
  isAccountSession: false;
  showSignOut: false;
};

export type PublicHeaderResolvedAuth = PublicHeaderAuth | PublicHeaderPortalAuth;

function accountHeaderLabel(input: {
  displayName?: string | null;
  accountEmail?: string | null;
  sessionEmail?: string | null;
}): string | null {
  const displayName = input.displayName?.trim();
  if (displayName) return displayName;

  const email = input.accountEmail?.trim() || input.sessionEmail?.trim();
  return email ?? null;
}

/**
 * Authentication display for the public header — separate from portal authorization.
 * Role-neutral PlatformAccount sessions resolve to /account without crow_role.
 */
export async function resolvePublicHeaderAuth(
  user: User
): Promise<PublicHeaderResolvedAuth | null> {
  const auth = await resolveAuthoritativeCrowAuth(user);
  const portalCta = getAuthenticatedPortalCta(userWithAuthoritativeMetadata(user, auth));
  if (portalCta) {
    return { portalCta, isAccountSession: false, showSignOut: false };
  }

  if (!isC3PlatformAccountGateEnabled()) return null;

  let displayName: string | undefined;
  let accountEmail: string | undefined;
  try {
    const account = await prisma.platformAccount.findUnique({
      where: { supabaseUserId: user.id },
      select: {
        email: true,
        profile: { select: { displayName: true } },
      },
    });
    if (account) {
      accountEmail = account.email?.trim();
      displayName = account.profile?.displayName?.trim();
    }
  } catch {
    /* Session fallback below — must not infer portal roles. */
  }

  const label = accountHeaderLabel({
    displayName,
    accountEmail,
    sessionEmail: user.email,
  });
  if (!label) return null;

  return {
    portalCta: {
      href: routes.account.home,
      label,
      tone: "account",
    },
    isAccountSession: true,
    showSignOut: true,
  };
}

/** @deprecated Use resolvePublicHeaderAuth */
export async function resolveAuthenticatedPublicHeaderCta(
  user: User
): Promise<AuthenticatedPortalCta | null> {
  const resolved = await resolvePublicHeaderAuth(user);
  return resolved?.portalCta ?? null;
}
