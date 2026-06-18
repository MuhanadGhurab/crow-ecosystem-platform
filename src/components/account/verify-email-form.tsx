"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  resendVerificationCode,
  type AccountActionState,
} from "@/lib/actions/account";

const initial: AccountActionState = undefined;

function VerifySubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-cc-primary w-full">
      {pending ? "Verifying…" : "Verify email"}
    </button>
  );
}

export function VerifyEmailForm({
  email,
  nextPath,
  initialError,
  initialMessage,
}: {
  email: string;
  nextPath?: string;
  initialError?: string;
  initialMessage?: string;
}) {
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationCode,
    initial
  );

  const error = initialError ?? resendState?.error;
  const message = initialMessage ?? resendState?.message;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-slate-200">{email}</span>. Enter it below
        to activate your platform account. After verification you will sign in with
        your password.
      </p>

      {error && (
        <p className="cc-alert-warning text-sm" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </p>
      )}

      <form action="/verify-email/submit" method="POST" className="space-y-4">
        <input type="hidden" name="email" value={email} />
        {nextPath && <input type="hidden" name="next" value={nextPath} />}
        <div>
          <label htmlFor="code" className="block text-xs font-medium text-slate-500">
            Verification code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
            placeholder="000000"
            className="input-cc mt-1 w-full tracking-[0.35em] text-center font-mono text-lg"
          />
        </div>
        <VerifySubmitButton />
      </form>

      <form action={resendAction}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={resendPending}
          className="text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
        >
          {resendPending ? "Sending…" : "Resend verification code"}
        </button>
      </form>
    </div>
  );
}
