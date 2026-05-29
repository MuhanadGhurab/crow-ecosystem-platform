import { getAuthenticatedPortalCta } from "@/lib/auth/post-login-redirect";
import { getSessionUser } from "@/lib/auth/session";
import { PublicHeaderNav } from "@/components/public/public-header-nav";

export async function PublicHeader() {
  const user = await getSessionUser();
  const portalCta = user ? getAuthenticatedPortalCta(user) : null;
  return <PublicHeaderNav portalCta={portalCta} />;
}
