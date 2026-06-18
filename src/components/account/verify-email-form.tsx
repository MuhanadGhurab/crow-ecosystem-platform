"use client";

import { useActionState } from "react";
import {
  resendVerificationCode,
  verifyEmailCode,
  type AccountActionState,
} from "@/lib/actions/account";

const initial: AccountActionState = undefined;

export function VerifyEmailForm({
  email,
  nextPath,
}: {
  email: string;
  nextPath?: string;
}) {
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyEmailCode,
    initial
  );
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationCode,
    initial
  );

  const error = verifyState?.error ?? resendState?.error;
  const message = verifyState?.message ?? resendState?.message;

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

      <form action={verifyAction} className="space-y-4">
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
        <button type="submit" disabled={verifyPending} className="btn-cc-primary w-full">
          {verifyPending ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <form action={resendAction}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={resendPending}
          className="w-full text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
        >
          {resendPending ? "Sending…" : "Resend code"}
        </button>
      </form>
    </div>
  );
}
