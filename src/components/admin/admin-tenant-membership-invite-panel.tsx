"use client";

import { useActionState } from "react";
import {
  createTenantMembershipInviteAction,
  type TenantMembershipInviteState,
} from "@/lib/actions/tenant-membership-invite";
import {
  createTenantInviteTokenAction,
  revokeTenantInviteAction,
  type TenantInviteRevokeState,
  type TenantInviteTokenState,
} from "@/lib/actions/tenant-invite-acceptance";
import {
  BUSINESS_PORTAL_INVITE_TITLE,
  TENANT_WORKFORCE_ACTIVATION_TITLE,
  WORKFORCE_ACTIVATION_COPY,
} from "@/lib/constants/crow-workforce-activation";
import type { TenantMembershipAccessSummary } from "@/lib/tenant/tenant-membership-contract";
import {
  TENANT_MEMBERSHIP_INVITE_DISCLAIMERS,
} from "@/lib/tenant/tenant-membership-invite-contract";
import {
  DEFAULT_TENANT_INVITE_EXPIRY_DAYS,
  TENANT_INVITE_ACCEPTANCE_DISCLAIMERS,
  type TenantMembershipInviteListItem,
} from "@/lib/tenant/tenant-invite-acceptance-contract";

type MembershipRow = {
  id: string;
  supabaseUserId: string;
  role: string;
};

type Props = {
  tenantId: string;
  tenantSlug: string;
  accessSummary?: TenantMembershipAccessSummary | null;
  memberships: MembershipRow[];
  pendingInvites: TenantMembershipInviteListItem[];
};

function InviteStatusBadge({ status }: { status: string }) {
  const tone =
    status === "pending"
      ? "text-amber-200"
      : status === "accepted"
        ? "text-teal-300"
        : status === "revoked"
          ? "text-red-300"
          : "text-slate-400";
  return <span className={tone}>{status}</span>;
}

export function AdminTenantMembershipInvitePanel({
  tenantId,
  tenantSlug,
  accessSummary,
  memberships,
  pendingInvites,
}: Props) {
  const [tokenState, tokenAction, tokenPending] = useActionState<TenantInviteTokenState, FormData>(
    createTenantInviteTokenAction,
    undefined
  );
  const [revokeState, revokeAction, revokePending] = useActionState<TenantInviteRevokeState, FormData>(
    revokeTenantInviteAction,
    undefined
  );
  const [breakGlassState, breakGlassAction, breakGlassPending] = useActionState<
    TenantMembershipInviteState,
    FormData
  >(createTenantMembershipInviteAction, undefined);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
            {TENANT_WORKFORCE_ACTIVATION_TITLE}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-cyan-100">{BUSINESS_PORTAL_INVITE_TITLE}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Business Portal access only. {WORKFORCE_ACTIVATION_COPY.manualDelivery} Email delivery is not
            active in this phase.
          </p>
        </div>

        {accessSummary && (
          <div className="grid gap-2 sm:grid-cols-3 text-xs">
            <div>
              <p className="text-slate-500">Access model</p>
              <p className="text-slate-200">{accessSummary.membershipModel.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-slate-500">DB memberships</p>
              <p className="text-slate-200">{accessSummary.activeMembershipCount}</p>
            </div>
            <div>
              <p className="text-slate-500">Tenant</p>
              <p className="font-mono text-slate-300">/{tenantSlug}</p>
            </div>
          </div>
        )}

        <form action={tokenAction} className="space-y-3">
          <input type="hidden" name="tenantId" value={tenantId} />
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <div>
            <label htmlFor="m4c-invite-email" className="mb-1 block text-xs text-slate-400">
              {WORKFORCE_ACTIVATION_COPY.inviteEmail}
            </label>
            <input
              id="m4c-invite-email"
              name="email"
              type="email"
              required
              className="input-cc w-full max-w-md"
              placeholder="user@organization.com"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="m4c-invite-role" className="mb-1 block text-xs text-slate-400">
                Tenant role
              </label>
              <select id="m4c-invite-role" name="role" className="input-cc" defaultValue="tenant_user">
                <option value="tenant_user">tenant_user</option>
                <option value="tenant_admin">tenant_admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="m4c-invite-expiry" className="mb-1 block text-xs text-slate-400">
                Expires (days)
              </label>
              <input
                id="m4c-invite-expiry"
                name="expiryDays"
                type="number"
                min={1}
                max={90}
                defaultValue={DEFAULT_TENANT_INVITE_EXPIRY_DAYS}
                className="input-cc w-24"
              />
            </div>
          </div>
          <div>
            <label htmlFor="m4c-invite-note" className="mb-1 block text-xs text-slate-400">
              Operator note (optional)
            </label>
            <input
              id="m4c-invite-note"
              name="note"
              type="text"
              className="input-cc w-full max-w-md"
              placeholder="Onboarding context for audit inbox"
            />
          </div>
          {tokenState?.error && <p className="text-sm text-red-400">{tokenState.error}</p>}
          {tokenState?.success && <p className="text-sm text-teal-300">{tokenState.success}</p>}
          {tokenState?.result?.inviteUrl && (
            <div className="space-y-2 rounded-lg border border-teal-500/25 bg-teal-500/5 p-3">
              <p className="text-xs text-teal-200/90">
                Copy this link now — it is not stored in Crow and cannot be retrieved later.
              </p>
              <input
                readOnly
                value={tokenState.result.inviteUrl}
                className="input-cc w-full font-mono text-xs"
                onFocus={(e) => e.currentTarget.select()}
              />
              <p className="text-xs text-slate-500">
                Expires {new Date(tokenState.result.expiresAt).toLocaleString()}
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={tokenPending}
            className="cc-btn-primary text-sm disabled:opacity-50"
          >
            {tokenPending ? "Creating…" : WORKFORCE_ACTIVATION_COPY.createLink}
          </button>
        </form>

        {pendingInvites.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400">Recent invites</p>
            <ul className="mt-2 space-y-2 text-xs">
              {pendingInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-700/50 px-2 py-2"
                >
                  <span className="font-mono text-slate-300">{invite.email}</span>
                  <span className="text-slate-500">{invite.role}</span>
                  <InviteStatusBadge status={invite.status} />
                  <span className="text-slate-600">
                    exp {new Date(invite.expiresAt).toLocaleDateString()}
                  </span>
                  {invite.status === "pending" && (
                    <form action={revokeAction}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <input type="hidden" name="tenantId" value={tenantId} />
                      <input type="hidden" name="tenantSlug" value={tenantSlug} />
                      <button
                        type="submit"
                        disabled={revokePending}
                        className="text-red-300 hover:text-red-200 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
            {revokeState?.error && <p className="mt-2 text-sm text-red-400">{revokeState.error}</p>}
            {revokeState?.success && <p className="mt-2 text-sm text-teal-300">{revokeState.success}</p>}
          </div>
        )}

        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
          {TENANT_INVITE_ACCEPTANCE_DISCLAIMERS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-violet-500/25 bg-violet-950/15 p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-violet-100">
            {WORKFORCE_ACTIVATION_COPY.breakGlassTitle}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{WORKFORCE_ACTIVATION_COPY.breakGlassSubtitle}</p>
        </div>

        <form action={breakGlassAction} className="space-y-3">
          <input type="hidden" name="tenantId" value={tenantId} />
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <div>
            <label htmlFor="invite-email" className="mb-1 block text-xs text-slate-400">
              Email
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              className="input-cc w-full max-w-md"
              placeholder="user@organization.com"
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="mb-1 block text-xs text-slate-400">
              Tenant role
            </label>
            <select id="invite-role" name="role" className="input-cc max-w-md" defaultValue="tenant_user">
              <option value="tenant_user">tenant_user</option>
              <option value="tenant_admin">tenant_admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="invite-note" className="mb-1 block text-xs text-slate-400">
              Operator note (optional)
            </label>
            <input
              id="invite-note"
              name="note"
              type="text"
              className="input-cc w-full max-w-md"
              placeholder="Onboarding context for audit inbox"
            />
          </div>
          <label className="flex items-start gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              name="useSupabaseInviteApi"
              className="mt-0.5 rounded border-violet-500/30"
            />
            <span>
              Use Supabase invite API when no account exists (creates Auth user + membership). Does not
              imply Crow-sent email.
            </span>
          </label>
          {breakGlassState?.error && <p className="text-sm text-red-400">{breakGlassState.error}</p>}
          {breakGlassState?.success && <p className="text-sm text-teal-300">{breakGlassState.success}</p>}
          {breakGlassState?.result?.snapshot && (
            <p className="text-xs text-slate-500">
              Status: <span className="text-slate-300">{breakGlassState.result.snapshot.status}</span>
              {" · "}
              {breakGlassState.result.snapshot.nextAction}
            </p>
          )}
          <button
            type="submit"
            disabled={breakGlassPending}
            className="cc-btn-secondary text-sm disabled:opacity-50"
          >
            {breakGlassPending ? "Adding…" : "Add member immediately"}
          </button>
        </form>

        {memberships.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400">Existing memberships (DB)</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {memberships.map((m) => (
                <li key={m.id} className="font-mono">
                  {m.supabaseUserId.slice(0, 8)}… · {m.role}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
          {TENANT_MEMBERSHIP_INVITE_DISCLAIMERS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
