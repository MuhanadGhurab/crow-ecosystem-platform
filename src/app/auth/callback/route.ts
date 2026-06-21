import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  oauthNextCookieOptions,
  resolveOAuthNextPath,
} from "@/lib/auth/entra-sso";
import {
  isPasswordRecoveryNextPath,
  passwordRecoveryCookieOptions,
  PASSWORD_RECOVERY_NEXT_PATH,
} from "@/lib/auth/password-recovery-session";
import { isC3GoogleOAuthCallbackEligible } from "@/lib/account/provider-identity.service";
import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import { refreshSessionUser } from "@/lib/auth/refresh-session-user";
import {
  C3_OAUTH_PROVIDER_COOKIE,
  isGoogleOAuthProviderHint,
  isGoogleSsoEnabled,
  oauthProviderCookieOptions,
} from "@/lib/auth/google-sso";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

/** OAuth / magic-link callback — exchanges code for a session cookie. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");

  if (oauthError) {
    const detail = oauthErrorDescription
      ? encodeURIComponent(oauthErrorDescription.slice(0, 200))
      : "";
    const suffix = detail ? `&detail=${detail}` : "";
    return NextResponse.redirect(`${origin}/login?error=auth_callback${suffix}`);
  }

  const cookieStore = await cookies();
  const nextCookie = cookieStore.get(oauthNextCookieOptions().name)?.value;
  const explicitNext = resolveOAuthNextPath(
    searchParams.get("next"),
    nextCookie
  );
  const isPasswordRecovery = isPasswordRecoveryNextPath(explicitNext);

  const clearNextCookie = (response: NextResponse) => {
    response.cookies.set(oauthNextCookieOptions().name, "", {
      ...oauthNextCookieOptions(),
      maxAge: 0,
    });
    response.cookies.set(C3_OAUTH_PROVIDER_COOKIE, "", {
      ...oauthProviderCookieOptions(),
      maxAge: 0,
    });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  };

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (isPasswordRecovery) {
        const proto = request.headers.get("x-forwarded-proto") ?? "http";
        const secure = proto === "https";
        const response = NextResponse.redirect(`${origin}${PASSWORD_RECOVERY_NEXT_PATH}`);
        response.cookies.set(
          passwordRecoveryCookieOptions(secure).name,
          passwordRecoveryCookieOptions(secure).value,
          {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: passwordRecoveryCookieOptions(secure).maxAge,
          }
        );
        return clearNextCookie(response);
      }

      const oauthProviderHint = cookieStore.get(C3_OAUTH_PROVIDER_COOKIE)?.value;

      let {
        data: { user },
      } = await supabase.auth.getUser();

      const shouldUseCrowGoogleResolver = (candidate: typeof user) =>
        Boolean(candidate && isC3GoogleOAuthCallbackEligible(candidate, oauthProviderHint));

      if (user && !shouldUseCrowGoogleResolver(user) && isGoogleOAuthProviderHint(oauthProviderHint)) {
        user = (await refreshSessionUser(supabase)) ?? user;
      }

      if (user && shouldUseCrowGoogleResolver(user)) {
        const params = new URLSearchParams();
        if (explicitNext) params.set("next", explicitNext);
        const resolvingPath = params.size
          ? `${routes.auth.resolving}?${params.toString()}`
          : routes.auth.resolving;
        return clearNextCookie(NextResponse.redirect(`${origin}${resolvingPath}`));
      }

      if (user && isGoogleSsoEnabled() && isGoogleOAuthProviderHint(oauthProviderHint)) {
        const params = new URLSearchParams();
        if (explicitNext) params.set("next", explicitNext);
        const resolvingPath = params.size
          ? `${routes.auth.resolving}?${params.toString()}`
          : routes.auth.resolving;
        return clearNextCookie(NextResponse.redirect(`${origin}${resolvingPath}`));
      }

      if (user && isGoogleSsoEnabled() && user.identities?.some((i) => i.provider === "google")) {
        const params = new URLSearchParams();
        if (explicitNext) params.set("next", explicitNext);
        const resolvingPath = params.size
          ? `${routes.auth.resolving}?${params.toString()}`
          : routes.auth.resolving;
        return clearNextCookie(NextResponse.redirect(`${origin}${resolvingPath}`));
      }

      if (isGoogleSsoEnabled()) {
        const params = new URLSearchParams();
        if (explicitNext) params.set("next", explicitNext);
        const resolvingPath = params.size
          ? `${routes.auth.resolving}?${params.toString()}`
          : routes.auth.resolving;
        return clearNextCookie(NextResponse.redirect(`${origin}${resolvingPath}`));
      }

      if (user && isC3PlatformAccountGateEnabled()) {
        const { gateAuthSessionForC3 } = await import(
          "@/lib/account/c3-auth-orchestration"
        );
        const { resolveC3PostAuthLanding } = await import(
          "@/lib/auth/c3-post-auth-landing"
        );
        const gate = await gateAuthSessionForC3(user, explicitNext);
        if (gate.action === "redirect") {
          return clearNextCookie(NextResponse.redirect(`${origin}${gate.path}`));
        }
        if (gate.action === "error") {
          return clearNextCookie(
            NextResponse.redirect(`${origin}/login?error=account_blocked`)
          );
        }
        const landing = await resolveC3PostAuthLanding(user, explicitNext);
        return clearNextCookie(NextResponse.redirect(`${origin}${landing}`));
      }

      if (user) {
        try {
          const { linkRequestsForUser } = await import(
            "@/lib/services/client-request-link.service"
          );
          await linkRequestsForUser(user);
        } catch {
          /* DB optional in dev */
        }
      }

      const { getCrowAuth } = await import("@/lib/auth/roles");
      const {
        assignDefaultClientRoleOnSignUp,
        countRequestsForEmail,
        isSupabaseServiceRoleConfigured,
      } = await import("@/lib/services/client-request-link.service");
      const { resolvePostAuthLanding } = await import("@/lib/auth/post-login-redirect");

      let refreshed = user
        ? (await supabase.auth.getUser()).data.user ?? user
        : null;

      let { role } = getCrowAuth(refreshed);

      if (!role && refreshed) {
        try {
          const assigned = await assignDefaultClientRoleOnSignUp(refreshed.id);
          if (assigned) {
            refreshed = (await refreshSessionUser(supabase)) ?? refreshed;
            role = getCrowAuth(refreshed).role;
          }
        } catch {
          /* service role optional in dev */
        }
      }

      if (!role && refreshed?.email) {
        try {
          const count = await countRequestsForEmail(refreshed.email);
          if (count > 0) {
            const destination = resolvePostAuthLanding(
              {
                ...refreshed,
                app_metadata: { ...refreshed.app_metadata, crow_role: "client" },
              } as typeof refreshed,
              explicitNext
            );
            return clearNextCookie(
              NextResponse.redirect(`${origin}${destination}`)
            );
          }
        } catch {
          /* fall through */
        }
      }

      if (!role && refreshed) {
        const destination = resolvePostAuthLanding(refreshed, explicitNext);
        if (destination.startsWith("/login")) {
          if (!isSupabaseServiceRoleConfigured()) {
            return clearNextCookie(NextResponse.redirect(`${origin}${destination}`));
          }
          await supabase.auth.signOut();
        }
        return clearNextCookie(NextResponse.redirect(`${origin}${destination}`));
      }

      const destination = resolvePostAuthLanding(refreshed!, explicitNext);
      return clearNextCookie(NextResponse.redirect(`${origin}${destination}`));
    }
  }

  return clearNextCookie(
    NextResponse.redirect(`${origin}/login?error=auth_callback`)
  );
}
