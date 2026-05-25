"use server";

import { redirect } from "next/navigation";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { getCrowAuth } from "@/lib/auth/roles";
import {
  countRequestsForEmail,
  linkRequestsForUser,
} from "@/lib/services/client-request-link.service";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

export type SignInState = { error?: string } | undefined;

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Supabase Auth is not configured. Add keys to .env." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim() || undefined;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  let error: { message: string } | null = null;
  try {
    ({ error } = await supabase.auth.signInWithPassword({ email, password }));
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined;
    const code =
      cause && typeof cause === "object" && "code" in cause
        ? String((cause as { code: string }).code)
        : "";
    if (code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
      return {
        error:
          "SSL certificate error reaching Supabase. Restart with: npm run dev (uses --use-system-ca).",
      };
    }
    return { error: err instanceof Error ? err.message : "Sign-in request failed." };
  }

  if (error) {
    const msg = error.message;
    if (/invalid api key/i.test(msg)) {
      return {
        error:
          "Invalid Supabase API key. In .env set NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) from Dashboard → Project Settings → API, and NEXT_PUBLIC_SUPABASE_URL to https://<project-ref>.supabase.co (no /rest/v1). Restart npm run dev after editing .env.",
      };
    }
    if (/invalid path specified/i.test(msg)) {
      return {
        error:
          "Supabase URL is misconfigured. Set NEXT_PUBLIC_SUPABASE_URL to https://<project-ref>.supabase.co only (remove /rest/v1). Restart npm run dev.",
      };
    }
    if (/invalid login credentials/i.test(msg)) {
      return {
        error:
          "Invalid email or password. For local dev: set AUTH_DISABLED=true in .env (UI bypass), or create a Supabase user with npm run auth:bootstrap (see docs/LOCAL_POSTGRES_SETUP.md#login-troubleshooting).",
      };
    }
    return { error: msg };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await linkRequestsForUser(user);
    } catch {
      /* DB optional */
    }
  }

  const refreshed = user ? (await supabase.auth.getUser()).data.user ?? user : null;
  const { role } = getCrowAuth(refreshed);

  if (!role && refreshed?.email) {
    try {
      const count = await countRequestsForEmail(refreshed.email);
      if (count > 0) {
        redirect(
          resolvePostLoginDestination(
            {
              ...refreshed,
              app_metadata: { ...refreshed.app_metadata, crow_role: "client" },
            } as typeof refreshed,
            next
          )
        );
      }
    } catch {
      /* fall through */
    }
    return { error: "No Crow role assigned. Sign in with the email on your request or contact support." };
  }

  if (!role) {
    return { error: "No Crow role assigned. Contact your administrator." };
  }

  redirect(resolvePostLoginDestination(refreshed!, next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
