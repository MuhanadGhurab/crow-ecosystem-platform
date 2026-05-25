import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  oauthNextCookieOptions,
  resolveOAuthNextPath,
} from "@/lib/auth/entra-sso";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { getCrowAuth } from "@/lib/auth/roles";
import {
  countRequestsForEmail,
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

      if (user) {
        try {
          await linkRequestsForUser(user);
        } catch {
          /* DB optional in dev */
        }
      }

      const refreshed = user
        ? (await supabase.auth.getUser()).data.user ?? user
        : null;

      const { role } = getCrowAuth(refreshed);
      if (!role && refreshed?.email) {
        try {
          const count = await countRequestsForEmail(refreshed.email);
          if (count > 0) {
            const destination = resolvePostLoginDestination(
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
        await supabase.auth.signOut();
        return clearNextCookie(
          NextResponse.redirect(`${origin}/login?error=no_role`)
        );
      }

      if (!role) {
        await supabase.auth.signOut();
        return clearNextCookie(
          NextResponse.redirect(`${origin}/login?error=no_role`)
        );
      }

      const destination = resolvePostLoginDestination(refreshed!, explicitNext);
      return clearNextCookie(NextResponse.redirect(`${origin}${destination}`));
    }
  }

  return clearNextCookie(
    NextResponse.redirect(`${origin}/login?error=auth_callback`)
  );
}
