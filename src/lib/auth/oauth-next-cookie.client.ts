import { OAUTH_NEXT_COOKIE } from "@/lib/auth/msal-config";

/** Browser-side mirror of server oauth next cookie (see oauthNextCookieOptions). */
export function setOAuthNextCookie(nextPath?: string) {
  if (!nextPath) return;
  const value =
    nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/admin/overview";
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${OAUTH_NEXT_COOKIE}=${value}; path=/; max-age=600; SameSite=Lax${secure ? "; Secure" : ""}`;
}
