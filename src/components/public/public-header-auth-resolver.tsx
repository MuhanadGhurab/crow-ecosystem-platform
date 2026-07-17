import { resolvePublicHeaderAuth } from "@/lib/portal/public-header-auth";
import { getSessionUser } from "@/lib/auth/session";
import { PublicHeaderNav } from "@/components/public/public-header-nav";

/** Isolated dynamic header slot — session/cookies stay out of the static public layout shell. */
export async function PublicHeaderAuthResolver() {
  const user = await getSessionUser();
  const auth = user ? await resolvePublicHeaderAuth(user) : null;

  return (
    <PublicHeaderNav
      portalCta={auth?.portalCta ?? null}
      isAccountSession={auth?.isAccountSession ?? false}
      showSignOut={auth?.showSignOut ?? false}
    />
  );
}
