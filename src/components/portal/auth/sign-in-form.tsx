"use client";

import { useActionState } from "react";
import { SignInWithEntra } from "@/components/portal/auth/sign-in-with-entra";
import { SignInWithGoogle } from "@/components/portal/auth/sign-in-with-google";
import { signIn, type SignInState } from "@/lib/actions/auth";

interface SignInFormProps {
  nextPath?: string;
  entraEnabled?: boolean;
  googleEnabled?: boolean;
}

export function SignInForm({
  nextPath,
  entraEnabled = false,
  googleEnabled = false,
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
    </div>
  );
}
