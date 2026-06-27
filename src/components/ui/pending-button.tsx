"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type PendingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel: string;
  children: ReactNode;
};

export function PendingButton({
  pending = false,
  pendingLabel,
  children,
  disabled,
  className = "cc-btn-primary",
  ...rest
}: PendingButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${className} min-w-[8rem] disabled:opacity-50`}
      {...rest}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
