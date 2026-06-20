"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  requestPasswordResetAction,
  type PasswordRecoveryFormState,
} from "@/lib/actions/password-recovery";
import { routes } from "@/lib/routes";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password-validation";

const initial: PasswordRecoveryFormState = { status: "idle" };

function SendResetButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cc-btn-primary w-full disabled:opacity-50"
      aria-busy={pending}
    >
      {pending ? "Sending…" : "Send reset link"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial);
  const success = state?.status === "success";
  const error = state?.status === "error" ? state.message : null;
  const successMessage = state?.status === "success" ? state.message : null;

  if (success && successMessage) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {successMessage}
        </p>
        <p className="text-center text-sm text-slate-500">
          <Link
            href={routes.auth.login}
            className="font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {error ? (
        <p className="cc-alert-warning text-sm" role="alert">
          {error}
        </p>
      ) : null}
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
          disabled={pending}
          className="input-cc w-full"
          placeholder="you@organization.com"
        />
      </div>
      <SendResetButton />
      <p className="text-center text-xs text-slate-500">
        Password must be at least {PASSWORD_MIN_LENGTH} characters when you set a new one.
      </p>
    </form>
  );
}
