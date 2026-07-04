import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthBackNavigation } from "@/components/auth/auth-back-navigation";
import { PublicAuthFrame } from "@/components/public-site/public-auth-frame";
import { SignUpForm } from "@/components/portal/auth/sign-up-form";
import { redirectAuthenticatedSession } from "@/lib/auth/c3-authenticated-entry";
import { isGoogleSsoEnabled } from "@/lib/auth/google-sso";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { sanitizeAuthNextPathWithDefault } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";
import {
  LOGIN_INTERNAL_NOTE,
  SIGNUP_CLIENT_PURPOSE,
} from "@/lib/constants/public-client-ux";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = sanitizeAuthNextPathWithDefault(next, routes.public.request);

  const existingUser = await getSessionUser();
  if (existingUser) {
    await redirectAuthenticatedSession(existingUser, nextPath);
  }

  const configured = isSupabaseAuthConfigured();
  const googleEnabled = isGoogleSsoEnabled();

  return (
    <PublicAuthFrame
      title="Create your Crow account"
      subtitle={SIGNUP_CLIENT_PURPOSE}
      note={LOGIN_INTERNAL_NOTE}
      footer={
        configured ? (
          <>
            <div className="space-y-1 text-center text-xs text-[var(--pv2-text-muted)]">
              <p>Platform access is role-based.</p>
              <p>RBAC controls access. SAREA controls experience.</p>
            </div>
            <p className="mt-4 text-center text-sm text-[var(--pv2-text-secondary)]">
              Already have an account?{" "}
              <Link
                href={routes.auth.loginWithNext(nextPath)}
                className="font-medium text-[var(--pv2-cyan)] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : undefined
      }
    >
      <AuthBackNavigation />

      {!configured ? (
        <p className="text-sm text-[var(--pv2-text-secondary)]">
          Set <span className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
          <span className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
          <span className="font-mono text-xs">.env</span> to enable registration.
        </p>
      ) : (
        <SignUpForm nextPath={nextPath} googleEnabled={googleEnabled} />
      )}
    </PublicAuthFrame>
  );
}
