"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SignInWithGoogle } from "@/components/portal/auth/sign-in-with-google";
import { signUp, type SignUpState } from "@/lib/actions/auth";
import { routes } from "@/lib/routes";

interface SignUpFormProps {
  nextPath?: string;
  googleEnabled?: boolean;
}

export function SignUpForm({ nextPath, googleEnabled = false }: SignUpFormProps) {
  const [state, action, pending] = useActionState<SignUpState, FormData>(signUp, undefined);
  const next = nextPath ?? routes.public.request;

  return (
    <div className="space-y-6">
      {googleEnabled && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Quick start
          </p>
          <SignInWithGoogle nextPath={nextPath} />
          <div className="relative py-1 text-center text-xs text-slate-500">
            <span className="relative z-10 bg-cc-elevated/90 px-3">or create with email</span>
            <span className="absolute inset-x-0 top-1/2 border-t border-cyan-500/10" aria-hidden />
          </div>
        </div>
      )}

      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Work email
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
            autoComplete="new-password"
            required
            minLength={8}
            className="input-cc w-full"
          />
          <p className="mt-1 text-[11px] text-slate-600">At least 8 characters.</p>
        </div>
        <div>
          <label
            htmlFor="passwordConfirm"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Confirm password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="input-cc w-full"
          />
        </div>
        {state?.error && <p className="cc-alert-error">{state.error}</p>}
        {state?.message && (
          <p className="rounded-lg border border-teal-500/25 bg-teal-500/10 px-3 py-2 text-sm text-teal-200">
            {state.message}{" "}
            <Link
              href={routes.auth.loginWithNext(next)}
              className="font-medium text-teal-300 underline hover:text-teal-200"
            >
              Sign in →
            </Link>
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="cc-btn-primary w-full disabled:opacity-50"
          aria-busy={pending}
        >
          {pending ? "Continuing…" : "Continue"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Client accounts only — for ERP requests and Client Portal tracking.{" "}
        <span className="text-slate-600">ProCrow staff are invited separately.</span>
      </p>
    </div>
  );
}
