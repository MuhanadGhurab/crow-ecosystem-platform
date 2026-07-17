import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { routes } from "@/lib/routes";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseAuthConfigured();
  const expired = error === "expired";

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email for your Crow account. If an eligible account exists, we will send a secure reset link."
      footer={
        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            href={routes.auth.login}
            className="font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {!configured ? (
        <p className="text-sm text-slate-500">
          Password reset is not configured on this environment.
        </p>
      ) : (
        <>
          {expired ? (
            <p className="cc-alert-warning mb-4 text-sm" role="alert">
              This reset link is invalid or has expired. Request a new reset link below.
            </p>
          ) : null}
          <ForgotPasswordForm />
        </>
      )}
    </AuthShell>
  );
}
