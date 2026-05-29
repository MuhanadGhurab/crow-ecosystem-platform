import Link from "next/link";
import { redirect } from "next/navigation";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { SignUpForm } from "@/components/portal/auth/sign-up-form";
import { resolvePostAuthLanding } from "@/lib/auth/post-login-redirect";
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
    redirect(resolvePostAuthLanding(existingUser, nextPath));
  }

  const configured = isSupabaseAuthConfigured();
  const googleEnabled = isGoogleSsoEnabled();

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Create your Crow account</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{SIGNUP_CLIENT_PURPOSE}</p>
        <p className="mt-2 text-xs text-slate-600">{LOGIN_INTERNAL_NOTE}</p>

        {!configured ? (
          <p className="mt-6 text-sm text-slate-500">
            Set <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
            <span className="cc-kbd">.env</span> to enable registration.
          </p>
        ) : (
          <div className="mt-6">
            <SignUpForm nextPath={nextPath} googleEnabled={googleEnabled} />
          </div>
        )}

        {configured && (
          <div className="mt-6 space-y-1 border-t border-cyan-500/10 pt-5 text-center text-xs text-slate-500">
            <p>Platform access is role-based.</p>
            <p>RBAC controls access. SAREA controls experience.</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href={routes.auth.loginWithNext(nextPath)}
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
