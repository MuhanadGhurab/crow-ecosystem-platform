import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  oauthNextCookieOptions,
  resolveOAuthNextPath,
} from "@/lib/auth/entra-sso";
import {
  gateAuthSessionForC3,
  isC3AuthEnabled,
} from "@/lib/account/c3-auth-orchestration";
import { resolvePlatformAccountForOAuthUser } from "@/lib/account/provider-identity.service";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { resolvePostAuthLanding } from "@/lib/auth/post-login-redirect";
import { refreshSessionUser } from "@/lib/auth/refresh-session-user";
import { getCrowAuth } from "@/lib/auth/roles";
import {
  assignDefaultClientRoleOnSignUp,
  countRequestsForEmail,
  isSupabaseServiceRoleConfigured,
  linkRequestsForUser,
} from "@/lib/services/client-request-link.service";
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

  const clearNextCookie = (response: NextResponse) => {
    response.cookies.set(oauthNextCookieOptions().name, "", {
      ...oauthNextCookieOptions(),
      maxAge: 0,
    });
    return response;
  };

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && isC3AuthEnabled()) {
        const oauthLink = await resolvePlatformAccountForOAuthUser(user, "google");
        if (!oauthLink.ok) {
          await supabase.auth.signOut();
          return clearNextCookie(
            NextResponse.redirect(`${origin}/login?error=forbidden`)
          );
        }

        const gate = await gateAuthSessionForC3(user, explicitNext);
        if (gate.action === "redirect") {
          return clearNextCookie(
            NextResponse.redirect(`${origin}${gate.path}`)
          );
        }
        if (gate.action === "error") {
          await supabase.auth.signOut();
          const detail = encodeURIComponent(gate.message.slice(0, 200));
          return clearNextCookie(
            NextResponse.redirect(`${origin}/login?error=forbidden&detail=${detail}`)
          );
        }

        const refreshed =
          (await refreshSessionUser(supabase)) ?? user;
        const destination = await resolveC3PostAuthLanding(refreshed, explicitNext);
        return clearNextCookie(NextResponse.redirect(`${origin}${destination}`));
      }

      if (user) {
        try {
          await linkRequestsForUser(user);
        } catch {
          /* DB optional in dev */
        }
      }

      let refreshed = user
        ? (await supabase.auth.getUser()).data.user ?? user
        : null;

      let { role } = getCrowAuth(refreshed);

      if (!role && refreshed) {
        try {
          // Public OAuth: client role only when none assigned (never overwrites staff roles).
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
