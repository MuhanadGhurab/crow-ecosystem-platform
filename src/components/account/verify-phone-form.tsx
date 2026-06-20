"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPhoneCaptureAction,
  submitPhoneOtpAction,
  type AccountActionState,
} from "@/lib/actions/account";

const initial: AccountActionState = undefined;

function OtpSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-cc-primary w-full">
      {pending ? "Verifying…" : "Verify phone"}
    </button>
  );
}

function CaptureSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-cc-primary w-full">
      {pending ? "Sending…" : "Send verification code"}
    </button>
  );
}

export function VerifyPhoneForm({
  maskedPhone,
  nextPath,
  initialError,
  initialMessage,
}: {
  maskedPhone?: string | null;
  nextPath?: string;
  initialError?: string;
  initialMessage?: string;
}) {
  const [captureState, captureAction] = useActionState(submitPhoneCaptureAction, initial);
  const [otpState, otpAction] = useActionState(submitPhoneOtpAction, initial);

  const error = initialError ?? captureState?.error ?? otpState?.error;
  const message = initialMessage ?? captureState?.message ?? otpState?.message;
  const showOtp = Boolean(maskedPhone);

  return (
    <div className="space-y-6">
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

      {!showOtp ? (
        <form action={captureAction} className="space-y-4">
          {nextPath && <input type="hidden" name="next" value={nextPath} />}
          <div>
            <label htmlFor="countryCode" className="block text-xs font-medium text-slate-500">
              Country
            </label>
            <select
              id="countryCode"
              name="countryCode"
              required
              defaultValue="SA"
              className="input-cc mt-1 w-full"
            >
              <option value="SA">Saudi Arabia (+966)</option>
              <option value="AE">United Arab Emirates (+971)</option>
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-slate-500">
              Mobile number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel-national"
              className="input-cc mt-1 w-full"
              placeholder="5XXXXXXXX"
            />
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-400">
            <input type="checkbox" name="confirmPhone" className="mt-1" required />
            <span>I confirm this is my number and agree to receive a one-time SMS code.</span>
          </label>
          <CaptureSubmitButton />
        </form>
      ) : (
        <form action={otpAction} className="space-y-4">
          {nextPath && <input type="hidden" name="next" value={nextPath} />}
          <p className="text-sm text-slate-400">
            Enter the code sent to{" "}
            <span className="font-medium text-slate-200">{maskedPhone}</span>.
          </p>
          <div>
            <label htmlFor="code" className="block text-xs font-medium text-slate-500">
              SMS code
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
              className="input-cc mt-1 w-full tracking-[0.35em] text-center font-mono text-lg"
            />
          </div>
          <OtpSubmitButton />
        </form>
      )}
    </div>
  );
}
