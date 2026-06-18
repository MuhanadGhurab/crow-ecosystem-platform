"use client";

import Link from "next/link";
import { useActionState } from "react";
import { routes } from "@/lib/routes";
import { SignInWithEntra } from "@/components/portal/auth/sign-in-with-entra";
import { SignInWithGoogle } from "@/components/portal/auth/sign-in-with-google";
import { signIn, type SignInState } from "@/lib/actions/auth";

interface SignInFormProps {
  nextPath?: string;
  entraEnabled?: boolean;
  googleEnabled?: boolean;
  defaultEmail?: string;
}

export function SignInForm({
  nextPath,
  entraEnabled = false,
  googleEnabled = false,
  defaultEmail,
}: SignInFormProps) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, undefined);
  const showProviders = entraEnabled || googleEnabled;

  return (
    <div className="space-y-6">
      {showProviders && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Enterprise sign-in
          </p>
          {entraEnabled && <SignInWithEntra nextPath={nextPath} />}
          {googleEnabled && <SignInWithGoogle nextPath={nextPath} />}
        </div>
      )}

      {showProviders && (
        <div className="relative py-1 text-center text-xs text-slate-500">
          <span className="relative z-10 bg-cc-elevated/90 px-3">or email & password</span>
          <span className="absolute inset-x-0 top-1/2 border-t border-cyan-500/10" aria-hidden />
        </div>
      )}

      <form action={action} className="space-y-4">
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
        </div>
        {state?.error && <p className="cc-alert-error">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="cc-btn-primary w-full disabled:opacity-50"
          aria-busy={pending}
        >
          {pending ? "Signing in…" : "Sign in with email"}
        </button>
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
