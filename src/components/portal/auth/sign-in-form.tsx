"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { submitSignInFormAction } from "@/lib/actions/auth";
import { routes } from "@/lib/routes";
import { SignInWithGoogle } from "@/components/portal/auth/sign-in-with-google";

interface SignInFormProps {
  nextPath?: string;
  googleEnabled?: boolean;
  defaultEmail?: string;
}

function SignInSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cc-btn-primary w-full disabled:opacity-50"
      aria-busy={pending}
    >
      {pending ? "Signing in…" : "Sign in with email"}
    </button>
  );
}

export function SignInForm({
  nextPath,
  googleEnabled = false,
  defaultEmail,
}: SignInFormProps) {
  return (
    <div className="space-y-6">
      {googleEnabled && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Quick sign-in
          </p>
          <SignInWithGoogle nextPath={nextPath} />
          <div className="relative py-1 text-center text-xs text-slate-500">
            <span className="relative z-10 bg-cc-elevated/90 px-3">or email & password</span>
            <span className="absolute inset-x-0 top-1/2 border-t border-cyan-500/10" aria-hidden />
          </div>
        </div>
      )}

      <form action={submitSignInFormAction} className="space-y-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={defaultEmail}
            className="input-cc w-full"
            placeholder="you@organization.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-cc w-full"
          />
          <div className="mt-2 flex justify-end">
            <Link
              href={routes.auth.forgotPassword}
              className="text-sm text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 rounded-sm"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <SignInSubmitButton />
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href={routes.auth.signupWithNext(nextPath ?? routes.public.request)}
          className="font-medium text-cyan-400 hover:text-cyan-300"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
