import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { PASSWORD_RECOVERY_COOKIE } from "@/lib/auth/password-recovery-session";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { routes } from "@/lib/routes";

export default async function ResetPasswordPage() {
  if (!isSupabaseAuthConfigured()) {
    redirect(routes.auth.login);
  }

  const user = await getSessionUser();
  const cookieStore = await cookies();
  const recoveryFlag = cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value;

  if (!user || recoveryFlag !== "1") {
    redirect(`${routes.auth.forgotPassword}?error=expired`);
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Your recovery session is active. Set a new password to continue. You will sign in again afterward."
      footer={
        <p className="text-center text-sm text-slate-500">
          <Link
            href={routes.auth.login}
            className="font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
