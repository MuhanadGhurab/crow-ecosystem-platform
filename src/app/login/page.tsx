import Link from "next/link";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { SignInForm } from "@/components/portal/auth/sign-in-form";
import { isEntraSsoEnabled } from "@/lib/auth/entra-sso";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { routes } from "@/lib/routes";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "You do not have permission to access that area.",
  config: "Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and anon key to .env.",
  auth_callback:
    "Sign-in could not be completed. For Microsoft: Azure redirect URI must be your Supabase callback (https://<ref>.supabase.co/auth/v1/callback), Supabase allow list must include http://localhost:3000/auth/callback exactly — see docs/ENTRA_SSO.md.",
  entra_start_failed:
    "Could not start Microsoft sign-in. Check NEXT_PUBLIC_SUPABASE_URL, enable the Azure provider in Supabase Dashboard, and AZURE_SSO_ENABLED / NEXT_PUBLIC_AZURE_TENANT_ID in .env.",
  entra_not_configured:
    "Microsoft SSO is not enabled. Set AZURE_SSO_ENABLED=true, NEXT_PUBLIC_AZURE_TENANT_ID, and configure Azure in Supabase (see docs/ENTRA_SSO.md).",
  no_role:
    "Your Microsoft account signed in, but no Crow access is assigned yet. Use the same email as your implementation request to track it, or ask an administrator.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const trackNext = routes.portal.requests;
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") ? next : trackNext;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Sign-in failed.") : null;
  const configured = isSupabaseAuthConfigured();
  const entraEnabled = isEntraSsoEnabled();

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          One Microsoft (Entra) identity for customers tracking requests, tenant employees, and Crow
          staff. Email and password remain available for issued credentials.
        </p>

        {errorMessage && <p className="cc-alert-warning mt-4">{errorMessage}</p>}

        {!configured ? (
          <p className="mt-6 text-sm text-slate-500">
            Set <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="cc-kbd">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
            <span className="cc-kbd">.env</span>. See{" "}
            <span className="cc-kbd">docs/PHASE2_AUTH.md</span>.
          </p>
        ) : (
          <div className="mt-6">
            <SignInForm nextPath={nextPath} entraEnabled={entraEnabled} />
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href={`${routes.auth.login}?next=${encodeURIComponent(trackNext)}`}
            className="font-medium text-teal-400 hover:text-teal-300"
          >
            Track my request
          </Link>
          {" · "}
          <Link href={routes.public.request} className="text-cyan-400 hover:text-cyan-300">
            Submit new request
          </Link>
        </p>
      </div>
    </div>
  );
}
