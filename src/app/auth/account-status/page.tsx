import Link from "next/link";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { routes } from "@/lib/routes";

const REASON_COPY: Record<string, string> = {
  blocked: "This Crow account cannot sign in right now.",
  collision: "This sign-in could not be linked safely to a Crow account.",
  conflict: "This email is associated with conflicting account records.",
  configuration: "Crow could not complete account preparation.",
};

export default async function AuthAccountStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; ref?: string }>;
}) {
  const { reason, ref } = await searchParams;
  const reasonKey = typeof reason === "string" ? reason : "configuration";
  const message = REASON_COPY[reasonKey] ?? REASON_COPY.configuration;
  const supportRef = typeof ref === "string" ? ref.trim() : "";

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Account status</h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
        {supportRef ? (
          <p className="mt-3 text-xs text-slate-500">
            Reference: <span className="font-mono text-slate-400">{supportRef}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={routes.auth.login} className="cc-btn-primary px-4 py-2 text-sm">
            Return to sign in
          </Link>
          <SignOutButton className="text-sm text-slate-400 hover:text-cyan-300" />
        </div>
      </div>
    </div>
  );
}
