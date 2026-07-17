import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthBackNavigation } from "@/components/auth/auth-back-navigation";
import { PublicAuthFrame } from "@/components/public-site/public-auth-frame";
import { SignInForm } from "@/components/portal/auth/sign-in-form";
import { redirectAuthenticatedSession } from "@/lib/auth/c3-authenticated-entry";
import { isGoogleSsoEnabled } from "@/lib/auth/google-sso";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";
import {
  LOGIN_CLIENT_PURPOSE,
  LOGIN_INTERNAL_NOTE,
} from "@/lib/constants/public-client-ux";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "You do not have permission to access that area.",
  config: "Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and anon key to .env.",
  auth_callback:
    "Sign-in could not be completed. Try again, or use email and password if the problem continues.",
  oauth_session:
    "Your sign-in session could not be established. Try Continue with Google again.",
  google_start_failed:
    "Could not start Google sign-in. Try again in a moment or use email and password.",
  google_not_configured:
    "Google sign-in is not available right now. Use email and password to sign in.",
  no_role:
    "Your account signed in successfully, but no Crow access is assigned yet. Use the same email as your implementation request to track it, or ask a platform administrator.",
  role_config:
    "Your account signed in, but the server cannot assign client access yet. Ask the operator to configure the Supabase service role on the server (never in a public env var), enable email sign-up in Supabase if needed, and add /auth/callback to redirect URLs.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    error?: string;
    verified?: string;
    email?: string;
    message?: string;
    "password-reset"?: string;
  }>;
}) {
  const {
    next,
    error,
    verified,
    email: emailParam,
    message: messageParam,
    "password-reset": passwordReset,
  } = await searchParams;
  const nextPath = sanitizeAuthNextPathOptional(next);
  const verifiedBanner = verified === "1";
  const passwordResetBanner = passwordReset === "1";
  const prefillEmail = typeof emailParam === "string" ? emailParam.trim() : "";

  const existingUser = await getSessionUser();
  if (existingUser) {
    await redirectAuthenticatedSession(existingUser, nextPath);
  }

  const errorMessage = error
    ? (ERROR_MESSAGES[error] ??
        (typeof messageParam === "string" ? messageParam : undefined) ??
        "Sign-in failed.")
    : null;
  const configured = isSupabaseAuthConfigured();
  const googleEnabled = isGoogleSsoEnabled();

  return (
    <PublicAuthFrame
      title="Sign in to Crow"
      subtitle={LOGIN_CLIENT_PURPOSE}
      note={LOGIN_INTERNAL_NOTE}
      footer={
        configured ? (
          <>
            <div className="space-y-1 text-center text-xs text-[var(--pv2-text-muted)]">
              <p>Platform access is role-based.</p>
              <p>RBAC controls access. SAREA controls experience.</p>
            </div>
            <p className="mt-4 text-center text-sm text-[var(--pv2-text-secondary)]">
              Don&apos;t have an account?{" "}
              <Link
                href={routes.auth.signupWithNext(nextPath ?? routes.public.request)}
                className="font-medium text-[var(--pv2-cyan)] hover:underline"
              >
                Create account
              </Link>
            </p>
            <p className="mt-3 text-center text-sm text-[var(--pv2-text-secondary)]">
              <Link
                href={`${routes.auth.login}?next=${encodeURIComponent(routes.portal.requests)}`}
                className="font-medium text-[var(--pv2-cyan)] hover:underline"
              >
                Track my request
              </Link>
              {" · "}
              <Link
                href={routes.auth.loginWithNext(routes.public.request)}
                className="text-[var(--pv2-cyan)] hover:underline"
              >
                Sign in to submit request
              </Link>
            </p>
          </>
        ) : undefined
      }
    >
      <AuthBackNavigation />

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {verifiedBanner ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Email verified. Sign in with your password to continue.
        </p>
      ) : null}

      {passwordResetBanner ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Your password was changed successfully. Sign in with your new password.
        </p>
      ) : null}

      {!configured ? (
        <p className="text-sm text-[var(--pv2-text-secondary)]">
          Set <span className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
          <span className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
          <span className="font-mono text-xs">.env</span>. See{" "}
          <span className="font-mono text-xs">docs/PHASE2_AUTH.md</span>.
        </p>
      ) : (
        <SignInForm
          nextPath={nextPath}
          googleEnabled={googleEnabled}
          defaultEmail={prefillEmail || undefined}
        />
      )}
    </PublicAuthFrame>
  );
}
