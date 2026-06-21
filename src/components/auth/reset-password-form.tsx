"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPasswordResetAction,
  type PasswordRecoveryFormState,
} from "@/lib/actions/password-recovery";
import { routes } from "@/lib/routes";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/password-validation";

const initial: PasswordRecoveryFormState = { status: "idle" };

function SavePasswordButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cc-btn-primary w-full disabled:opacity-50"
      aria-busy={pending}
    >
      {pending ? "Saving…" : "Save new password"}
    </button>
  );
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-cc w-full pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(submitPasswordResetAction, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const error = state?.status === "error" ? state.message : null;

  return (
    <form action={action} className="space-y-4">
      {error ? (
        <p className="cc-alert-warning text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <PasswordField
        id="password"
        name="password"
        label="New password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="passwordConfirm"
        name="passwordConfirm"
        label="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
      />
      <ul className="text-xs text-slate-500 space-y-1">
        <li>At least {PASSWORD_MIN_LENGTH} characters</li>
        <li>Maximum {PASSWORD_MAX_LENGTH} characters</li>
        <li>Both fields must match exactly</li>
      </ul>
      <SavePasswordButton />
      <p className="text-center text-sm text-slate-500">
        <Link
          href={routes.auth.forgotPassword}
          className="text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Request another reset link
        </Link>
      </p>
    </form>
  );
}
