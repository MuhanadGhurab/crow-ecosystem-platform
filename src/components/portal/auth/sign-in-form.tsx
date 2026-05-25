"use client";

import { useActionState } from "react";
import { SignInWithEntra } from "@/components/portal/auth/sign-in-with-entra";
import { signIn, type SignInState } from "@/lib/actions/auth";

interface SignInFormProps {
  nextPath?: string;
  entraEnabled?: boolean;
}

export function SignInForm({ nextPath, entraEnabled = false }: SignInFormProps) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, undefined);

  return (
    <div className="space-y-6">
      {entraEnabled && (
        <>
          <SignInWithEntra nextPath={nextPath} />
          <div className="relative text-center text-xs text-slate-500">
            <span className="bg-cc-elevated/80 relative z-10 px-2">or email & password</span>
            <span className="absolute inset-x-0 top-1/2 border-t border-cyan-500/10" />
          </div>
        </>
      )}
    <form action={action} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-slate-400">
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
        <label htmlFor="password" className="mb-1 block text-sm text-slate-400">
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
      {state?.error && (
        <p className="cc-alert-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="cc-btn-primary w-full disabled:opacity-50">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
    </div>
  );
}
