"use client";

import { useActionState, useState } from "react";
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
  WORKFORCE_ACTIVATION_DESCRIPTION,
  WORKFORCE_ACTIVATION_PURPOSE,
  WORKFORCE_ACTIVATION_SAFETY_NOTES,
  WORKFORCE_ACTIVATION_STATUS_CHIP,
} from "@/lib/constants/crow-workforce-activation";
import type { TenantMembershipAccessSummary } from "@/lib/tenant/tenant-membership-contract";
import { TENANT_WORKFORCE_SECTION_ID } from "@/lib/constants/tenant-command-center";
import {
  DEFAULT_TENANT_INVITE_EXPIRY_DAYS,
  type TenantMembershipInviteListItem,
  type TenantMembershipInviteRecordStatus,
} from "@/lib/tenant/tenant-invite-acceptance-contract";

type Props = {
  tenantId: string;
  tenantSlug: string;
  accessSummary?: TenantMembershipAccessSummary | null;
  inviteHistory: TenantMembershipInviteListItem[];
};

function statusLabel(status: TenantMembershipInviteRecordStatus): string {
  switch (status) {
    case "pending":
      return WORKFORCE_ACTIVATION_COPY.statusPending;
    case "accepted":
      return WORKFORCE_ACTIVATION_COPY.statusAccepted;
    case "revoked":
      return WORKFORCE_ACTIVATION_COPY.statusRevoked;
    case "expired":
      return WORKFORCE_ACTIVATION_COPY.statusExpired;
    default:
      return status;
  }
}

function StatusBadge({ status }: { status: TenantMembershipInviteRecordStatus }) {
  const tone =
    status === "pending"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : status === "accepted"
        ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
        : status === "revoked"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-slate-600/50 bg-slate-800/50 text-slate-400";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {statusLabel(status)}
    </span>
  );
}

function CopyInviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: user can select the readonly field */
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
      <p className="text-xs font-medium text-teal-100">{WORKFORCE_ACTIVATION_COPY.copyLinkLabel}</p>
      <p className="text-xs text-teal-200/80">
        Copy this link now — {WORKFORCE_ACTIVATION_COPY.oneTimeUrl}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          className="input-cc min-w-0 flex-1 font-mono text-xs"
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Invite link"
        />
        <button type="button" onClick={handleCopy} className="cc-btn-secondary shrink-0 text-xs">
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export function AdminTenantMembershipInvitePanel({
  tenantId,
  tenantSlug,
  accessSummary,
  inviteHistory,
}: Props) {
  const [tokenState, tokenAction, tokenPending] = useActionState<TenantInviteTokenState, FormData>(
    createTenantInviteTokenAction,
    undefined
  );
  const [revokeState, revokeAction, revokePending] = useActionState<TenantInviteRevokeState, FormData>(
    revokeTenantInviteAction,
    undefined
  );

  return (
    <div id={TENANT_WORKFORCE_SECTION_ID} className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-slate-100">{TENANT_WORKFORCE_ACTIVATION_TITLE}</h2>
          <span className="inline-flex rounded-full border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-cyan-200">
            {WORKFORCE_ACTIVATION_STATUS_CHIP}
          </span>
        </div>
        <p className="max-w-2xl text-sm text-slate-400">{WORKFORCE_ACTIVATION_PURPOSE}</p>
        <p className="text-xs text-slate-500">{WORKFORCE_ACTIVATION_DESCRIPTION}</p>
      </header>

      <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-cyan-100">{BUSINESS_PORTAL_INVITE_TITLE}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Business Portal access only. {WORKFORCE_ACTIVATION_COPY.manualDelivery} Email delivery is not
            active in this phase.
          </p>
        </div>

        {accessSummary && (
          <div className="grid gap-3 sm:grid-cols-3 text-xs rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
            <div>
              <p className="text-slate-500">Access model</p>
              <p className="text-slate-200">{accessSummary.membershipModel.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-slate-500">Active memberships</p>
              <p className="text-slate-200">{accessSummary.activeMembershipCount}</p>
            </div>
            <div>
              <p className="text-slate-500">Tenant slug</p>
              <p className="font-mono text-slate-300">/{tenantSlug}</p>
            </div>
          </div>
        )}

        <form action={tokenAction} className="space-y-4 rounded-lg border border-slate-700/40 bg-slate-900/20 p-4">
          <input type="hidden" name="tenantId" value={tenantId} />
          <input type="hidden" name="tenantSlug" value={tenantSlug} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="m4c-invite-email" className="mb-1 block text-xs font-medium text-slate-400">
                {WORKFORCE_ACTIVATION_COPY.inviteEmail}
              </label>
              <input
                id="m4c-invite-email"
                name="email"
                type="email"
                required
                className="input-cc w-full"
                placeholder="user@organization.com"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="m4c-invite-role" className="mb-1 block text-xs font-medium text-slate-400">
                {WORKFORCE_ACTIVATION_COPY.roleLabel}
              </label>
              <select id="m4c-invite-role" name="role" className="input-cc w-full" defaultValue="tenant_user">
                <option value="tenant_user">tenant_user</option>
                <option value="tenant_admin">tenant_admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="m4c-invite-expiry" className="mb-1 block text-xs font-medium text-slate-400">
                {WORKFORCE_ACTIVATION_COPY.expiryLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="m4c-invite-expiry"
                  name="expiryDays"
                  type="number"
                  min={1}
                  max={90}
                  defaultValue={DEFAULT_TENANT_INVITE_EXPIRY_DAYS}
                  className="input-cc w-20"
                />
                <span className="text-xs text-slate-500">days (default {WORKFORCE_ACTIVATION_COPY.expiryDefaultDays})</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="m4c-invite-note" className="mb-1 block text-xs font-medium text-slate-400">
                {WORKFORCE_ACTIVATION_COPY.operatorNote}
              </label>
              <input
                id="m4c-invite-note"
                name="note"
                type="text"
                className="input-cc w-full"
                placeholder="Onboarding context for audit inbox"
              />
            </div>
          </div>

          {tokenState?.error && <p className="text-sm text-red-400">{tokenState.error}</p>}
          {tokenState?.success && <p className="text-sm text-teal-300">{tokenState.success}</p>}
          {tokenState?.result?.inviteUrl && (
            <div className="space-y-2">
              <CopyInviteLink url={tokenState.result.inviteUrl} />
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

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {WORKFORCE_ACTIVATION_COPY.inviteListTitle}
          </h4>
          {inviteHistory.length === 0 ? (
            <p className="text-xs text-slate-600">{WORKFORCE_ACTIVATION_COPY.inviteListEmpty}</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="border-b border-slate-700/50 bg-slate-900/40 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Created</th>
                    <th className="px-3 py-2 font-medium">Expires</th>
                    <th className="px-3 py-2 font-medium">Accepted</th>
                    <th className="px-3 py-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {inviteHistory.map((invite) => (
                    <tr key={invite.id} className="text-slate-300">
                      <td className="px-3 py-2 font-mono">{invite.email}</td>
                      <td className="px-3 py-2 text-slate-400">{invite.role}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={invite.status} />
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {new Date(invite.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {invite.acceptedAt
                          ? new Date(invite.acceptedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {invite.status === "pending" ? (
                          <form action={revokeAction} className="inline">
                            <input type="hidden" name="inviteId" value={invite.id} />
                            <input type="hidden" name="tenantId" value={tenantId} />
                            <input type="hidden" name="tenantSlug" value={tenantSlug} />
                            <button
                              type="submit"
                              disabled={revokePending}
                              className="text-red-300 hover:text-red-200 disabled:opacity-50"
                            >
                              {WORKFORCE_ACTIVATION_COPY.revokeAction}
                            </button>
                          </form>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {revokeState?.error && <p className="text-sm text-red-400">{revokeState.error}</p>}
          {revokeState?.success && <p className="text-sm text-teal-300">{revokeState.success}</p>}
        </div>

        <div className="rounded-lg border border-slate-700/40 bg-slate-900/20 p-3">
          <p className="text-xs font-medium text-slate-400">{WORKFORCE_ACTIVATION_COPY.safetyNotesTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
            {WORKFORCE_ACTIVATION_SAFETY_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
