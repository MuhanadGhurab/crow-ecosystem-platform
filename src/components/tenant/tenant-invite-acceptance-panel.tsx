"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  acceptTenantInviteAndRedirectAction,
  type TenantInviteAcceptState,
} from "@/lib/actions/tenant-invite-acceptance";
import { routes } from "@/lib/routes";
import type { TenantInviteAcceptancePublicView } from "@/lib/tenant/tenant-invite-acceptance-contract";

type Props = {
  token: string;
  view: TenantInviteAcceptancePublicView;
};

function statusLabel(viewStatus: TenantInviteAcceptancePublicView["viewStatus"]): string {
  switch (viewStatus) {
    case "invalid":
      return "Invalid link";
    case "accepted":
      return "Already accepted";
    case "revoked":
      return "Revoked";
    case "expired":
      return "Expired";
    case "requires_sign_in":
      return "Sign in required";
    case "email_mismatch":
      return "Wrong account";
    case "ready_to_accept":
      return "Ready to accept";
    default:
      return viewStatus;
  }
}

export function TenantInviteAcceptancePanel({ token, view }: Props) {
  const [state, action, pending] = useActionState<TenantInviteAcceptState, FormData>(
    acceptTenantInviteAndRedirectAction,
    undefined
  );

  useEffect(() => {
    if (state?.redirectPath && !state.error) {
      window.location.assign(state.redirectPath);
    }
  }, [state]);

  if (view.viewStatus === "invalid") {
    return (
      <section className="cc-glass-card space-y-3">
        <h2 className="text-lg font-semibold text-white">Invite not found</h2>
        <p className="text-sm text-slate-400">
          This invite link is invalid or has been removed. Ask your operator for a new link.
        </p>
        <Link href={routes.auth.login} className="cc-btn-secondary inline-flex text-sm">
          Sign in
        </Link>
      </section>
    );
  }

  const invitePath = routes.tenantInvite(token);
  const loginHref = routes.auth.loginWithNext(invitePath);
  const signupHref = routes.auth.signupWithNext(invitePath);

  return (
    <section className="cc-glass-card space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-violet-300/80">Business Portal invite</p>
        <h2 className="mt-1 text-lg font-semibold text-white">{view.tenantName}</h2>
        <p className="mt-1 font-mono text-sm text-slate-500">/{view.tenantSlug}</p>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Invited email</p>
          <p className="text-slate-200">{view.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Role</p>
          <p className="text-slate-200">{view.role ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Status</p>
          <p className="text-slate-200">{statusLabel(view.viewStatus)}</p>
        </div>
        {view.expiresAt && (
          <div>
            <p className="text-xs text-slate-500">Expires</p>
            <p className="text-slate-200">{new Date(view.expiresAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      {view.viewStatus === "requires_sign_in" && (
        <div className="space-y-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-sm text-cyan-100/90">
            Sign in or create an account with <span className="font-mono text-cyan-200">{view.email}</span>{" "}
            to accept this invite.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={loginHref} className="cc-btn-primary text-sm">
              Sign in
            </Link>
            <Link href={signupHref} className="cc-btn-secondary text-sm">
              Create account
            </Link>
          </div>
        </div>
      )}

      {view.viewStatus === "email_mismatch" && (
        <div className="space-y-2 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
          <p className="text-sm text-amber-100/90">
            You are signed in as <span className="font-mono">{view.signedInEmail}</span>, but this invite
            is for <span className="font-mono">{view.email}</span>. Sign out and use the invited email.
          </p>
          <SignOutButton className="cc-btn-secondary inline-flex text-sm" label="Sign out" />
        </div>
      )}

      {view.viewStatus === "ready_to_accept" && (
        <form action={action} className="space-y-3">
          <input type="hidden" name="token" value={token} />
          <p className="text-sm text-slate-300">
            Accepting grants Business Portal access for <span className="font-mono">/{view.tenantSlug}</span>{" "}
            only — not ProCrow operator or Client approval rights.
          </p>
          {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
          {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
          <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
            {pending ? "Accepting…" : "Accept invite"}
          </button>
        </form>
      )}

      {view.viewStatus === "accepted" && (
        <div className="space-y-2">
          <p className="text-sm text-teal-300">This invite was already accepted.</p>
          <Link href={routes.access} className="cc-btn-primary inline-flex text-sm">
            Open access gateway
          </Link>
        </div>
      )}

      {(view.viewStatus === "revoked" || view.viewStatus === "expired") && (
        <p className="text-sm text-slate-400">
          Ask a tenant administrator or ProCrow operator for a new invite link.
        </p>
      )}

      <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
        {view.disclaimers.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </section>
  );
}
