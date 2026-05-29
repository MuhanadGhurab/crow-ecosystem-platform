import Link from "next/link";
import { redirect } from "next/navigation";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { SignInForm } from "@/components/portal/auth/sign-in-form";
import { EntraOpsPanel } from "@/components/tenant/entra-ops-panel";
import { resolvePostLoginDestination } from "@/lib/auth/post-login-redirect";
import { isEntraSsoEnabled } from "@/lib/auth/entra-sso";
import { isGoogleSsoEnabled } from "@/lib/auth/google-sso";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { routes } from "@/lib/routes";
import {
  LOGIN_CLIENT_PURPOSE,
  LOGIN_INTERNAL_NOTE,
} from "@/lib/constants/public-client-ux";
import type { TenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";

const LOGIN_ENTRA_DEFAULTS: TenantSecuritySettings = {
  mfaRequired: true,
  mfaLabel: "Required for admins (platform default)",
  idpPreference: "entra_id",
  idpLabel: "Microsoft Entra ID (SSO)",
  ssoNotes: null,
  source: "default",
};

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "You do not have permission to access that area.",
  config: "Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and anon key to .env.",
  auth_callback:
    "Sign-in could not be completed. Check Supabase redirect URLs (must include your app /auth/callback) and provider settings — see docs/internal/F18_GOOGLE_SIGNIN_SETUP.md and docs/internal/ENTRA_SSO.md.",
  entra_start_failed:
    "Could not start Microsoft sign-in. Check Azure provider in Supabase Dashboard and AZURE_SSO_ENABLED / NEXT_PUBLIC_AZURE_TENANT_ID in .env.",
  entra_not_configured:
    "Microsoft SSO is not enabled. Set AZURE_SSO_ENABLED=true, NEXT_PUBLIC_AZURE_TENANT_ID, and configure Azure in Supabase.",
  google_start_failed:
    "Could not start Google sign-in. Enable the Google provider in Supabase Dashboard and set GOOGLE_SSO_ENABLED=true in .env.",
  google_not_configured:
    "Google sign-in is not enabled. Set GOOGLE_SSO_ENABLED=true and configure Google in Supabase (see docs/internal/F18_GOOGLE_SIGNIN_SETUP.md).",
  no_role:
    "Your account signed in successfully, but no Crow access is assigned yet. Use the same email as your implementation request to track it, or ask a platform administrator.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  const existingUser = await getSessionUser();
  if (existingUser) {
    redirect(resolvePostLoginDestination(existingUser, nextPath));
  }

  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Sign-in failed.") : null;
  const configured = isSupabaseAuthConfigured();
  const entraEnabled = isEntraSsoEnabled();
  const googleEnabled = isGoogleSsoEnabled();

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Sign in to Crow</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{LOGIN_CLIENT_PURPOSE}</p>
        <p className="mt-2 text-xs text-slate-600">{LOGIN_INTERNAL_NOTE}</p>

        {errorMessage && <p className="cc-alert-warning mt-5">{errorMessage}</p>}

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
              entraEnabled={entraEnabled}
              googleEnabled={googleEnabled}
            />
          </div>
        )}

        {configured && (
          <div className="mt-6 space-y-1 border-t border-cyan-500/10 pt-5 text-center text-xs text-slate-500">
            <p>Platform access is role-based.</p>
            <p>RBAC controls access. SAREA controls experience.</p>
          </div>
        )}

        {configured && entraEnabled && (
          <EntraOpsPanel
            security={LOGIN_ENTRA_DEFAULTS}
            showEntraNarrative
            variant="login"
          />
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
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
