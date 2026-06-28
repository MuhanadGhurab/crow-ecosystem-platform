import Link from "next/link";
import { redirect } from "next/navigation";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { AuthBackNavigation } from "@/components/auth/auth-back-navigation";
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
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <AuthBackNavigation />
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Sign in to Crow</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{LOGIN_CLIENT_PURPOSE}</p>
        <p className="mt-2 text-xs text-slate-600">{LOGIN_INTERNAL_NOTE}</p>

        {errorMessage && <p className="cc-alert-warning mt-5">{errorMessage}</p>}

        {verifiedBanner && (
          <p className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Email verified. Sign in with your password to continue.
          </p>
        )}

        {passwordResetBanner && (
          <p className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Your password was changed successfully. Sign in with your new password.
          </p>
        )}

        {!configured ? (
          <p className="mt-6 text-sm text-slate-500">
            Set <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
            <span className="cc-kbd">.env</span>. See{" "}
            <span className="cc-kbd">docs/PHASE2_AUTH.md</span>.
          </p>
        ) : (
          <div className="mt-6">
            <SignInForm
              nextPath={nextPath}
              googleEnabled={googleEnabled}
              defaultEmail={prefillEmail || undefined}
            />
          </div>
        )}

        {configured && (
          <div className="mt-6 space-y-1 border-t border-cyan-500/10 pt-5 text-center text-xs text-slate-500">
            <p>Platform access is role-based.</p>
            <p>RBAC controls access. SAREA controls experience.</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href={routes.auth.signupWithNext(nextPath ?? routes.public.request)}
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Create account
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-500">
          <Link
            href={`${routes.auth.login}?next=${encodeURIComponent(routes.portal.requests)}`}
            className="font-medium text-teal-400 hover:text-teal-300"
          >
            Track my request
          </Link>
          {" · "}
          <Link
            href={routes.auth.loginWithNext(routes.public.request)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Sign in to submit request
          </Link>
        </p>
      </div>
    </div>
  );
}
