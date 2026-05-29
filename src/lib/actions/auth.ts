"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { getCrowAuth } from "@/lib/auth/roles";
import {
  assignDefaultClientRoleOnSignUp,
  countRequestsForEmail,
  linkRequestsForUser,
} from "@/lib/services/client-request-link.service";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import {
  sanitizeAuthNextPathOptional,
  sanitizeAuthNextPathWithDefault,
} from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";

export type SignInState = { error?: string } | undefined;

export type SignUpState = { error?: string; message?: string } | undefined;

async function authCallbackUrl(next?: string): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin =
    (host ? `${proto}://${host}` : null) ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const safeNext = sanitizeAuthNextPathOptional(next);
  const nextParam = safeNext ? `?next=${encodeURIComponent(safeNext)}` : "";
  return `${origin}${routes.auth.callback}${nextParam}`;
}

function mapSupabaseAuthError(msg: string, mode: "signin" | "signup"): string {
  if (/invalid api key/i.test(msg)) {
    return "Invalid Supabase API key. Check NEXT_PUBLIC_SUPABASE_URL and anon key in .env.";
  }
  if (/invalid path specified/i.test(msg)) {
    return "Supabase URL is misconfigured. Use https://<project-ref>.supabase.co only (no /rest/v1).";
  }
  if (/invalid login credentials/i.test(msg) && mode === "signin") {
    return "Invalid email or password. Create an account if you are new, or use Google sign-in.";
  }
  if (/user already registered|already been registered|already exists/i.test(msg)) {
    return "This email may already have an account. Try signing in or use Google.";
  }
  if (/signup.*disabled|signups.*disabled|email.*disabled/i.test(msg)) {
    return "Email sign-up is not enabled for this project. Use Google sign-in, or ask the operator to enable email sign-up in Supabase Auth.";
  }
  if (/rate limit|too many requests/i.test(msg)) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  if (/password/i.test(msg) && /weak|short|least/i.test(msg)) {
    return msg;
  }
  return msg;
}

async function completeAuthenticatedSession(
  supabase: Awaited<ReturnType<typeof createClient>>,
  next?: string
): Promise<SignInState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign-in could not be completed. Try again." };
  }

  return finalizeAuthUser(supabase, user, next);
}

async function finalizeAuthUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
  next?: string
): Promise<SignInState> {
  try {
    await linkRequestsForUser(user);
  } catch {
    /* DB optional */
  }

  const refreshed = (await supabase.auth.getUser()).data.user ?? user;
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
    return {
      error:
        "No Crow access assigned. Use the email on your implementation request, or create a new client account.",
    };
  }

  if (!role) {
    return { error: "No Crow access assigned. Contact your administrator." };
  }

  redirect(resolvePostLoginDestination(refreshed, next));
}

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Supabase Auth is not configured. Add keys to .env." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeAuthNextPathOptional(String(formData.get("next") ?? ""));

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
    return { error: mapSupabaseAuthError(error.message, "signin") };
  }

  return completeAuthenticatedSession(supabase, next);
}

export async function signUp(
  _prev: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Supabase Auth is not configured. Add keys to .env." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const next = sanitizeAuthNextPathWithDefault(
    String(formData.get("next") ?? ""),
    routes.public.request
  );

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== passwordConfirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  let signUpError: { message: string } | null = null;
  let sessionUser: User | null = null;
  let hasSession = false;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: await authCallbackUrl(next),
      },
    });
    signUpError = error;
    sessionUser = data.user;
    hasSession = Boolean(data.session);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Sign-up request failed." };
  }

  if (signUpError) {
    return { error: mapSupabaseAuthError(signUpError.message, "signup") };
  }

  if (!sessionUser) {
    return { error: "Account could not be created. Try again or use Google sign-in." };
  }

  let roleAssigned = false;
  try {
    roleAssigned = await assignDefaultClientRoleOnSignUp(sessionUser.id);
  } catch {
    roleAssigned = false;
  }

  if (hasSession && !roleAssigned) {
    return {
      error:
        "Account created but client access could not be assigned. Ensure SUPABASE_SERVICE_ROLE_KEY is set on the server (not public), then sign out and sign in again.",
    };
  }

  if (hasSession) {
    try {
      await linkRequestsForUser(sessionUser);
    } catch {
      /* DB optional */
    }
    const {
      data: { user: refreshed },
    } = await supabase.auth.getUser();
    if (refreshed) {
      redirect(resolvePostLoginDestination(refreshed, next));
    }
  }

  return {
    message:
      "Account created. Check your email to confirm your address, then sign in to submit and track your request.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
