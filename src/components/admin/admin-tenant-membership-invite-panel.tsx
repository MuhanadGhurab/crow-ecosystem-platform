"use client";

import { useActionState, useState } from "react";
import {
  createTenantInviteTokenAction,
  retryTenantInviteEmailAction,
  revokeTenantInviteAction,
  type TenantInviteEmailRetryState,
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
  WORKFORCE_ACTIVATION_STATUS_CHIP_EMAIL,
} from "@/lib/constants/crow-workforce-activation";
import type { TenantMembershipAccessSummary } from "@/lib/tenant/tenant-membership-contract";
import { TENANT_WORKFORCE_SECTION_ID } from "@/lib/constants/tenant-command-center";
import {
  DEFAULT_TENANT_INVITE_EXPIRY_DAYS,
  type InviteEmailDeliveryOutcome,
  type TenantMembershipInviteListItem,
  type TenantMembershipInviteRecordStatus,
} from "@/lib/tenant/tenant-invite-acceptance-contract";

type Props = {
  tenantId: string;
  tenantSlug: string;
  accessSummary?: TenantMembershipAccessSummary | null;
  inviteHistory: TenantMembershipInviteListItem[];
  inviteEmailConfigured: boolean;
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

function deliveryBannerTitle(outcome: InviteEmailDeliveryOutcome): string {
  switch (outcome) {
    case "delivered":
      return WORKFORCE_ACTIVATION_COPY.deliveryDelivered;
    case "provider_unconfigured":
      return WORKFORCE_ACTIVATION_COPY.deliveryUnavailable;
    default:
      return WORKFORCE_ACTIVATION_COPY.deliveryFailed;
  }
}

function deliveryBannerTone(outcome: InviteEmailDeliveryOutcome): string {
  if (outcome === "delivered") {
    return "border-teal-500/35 bg-teal-500/10 text-teal-100";
  }
  if (outcome === "provider_unconfigured") {
    return "border-amber-500/35 bg-amber-500/10 text-amber-100";
  }
  return "border-red-500/35 bg-red-500/10 text-red-100";
}

function canRetryEmailDelivery(outcome: InviteEmailDeliveryOutcome): boolean {
  return outcome === "delivery_error" || outcome === "provider_rejected";
}

export function AdminTenantMembershipInvitePanel({
  tenantId,
  tenantSlug,
  accessSummary,
  inviteHistory,
  inviteEmailConfigured,
}: Props) {
  const [tokenState, tokenAction, tokenPending] = useActionState<TenantInviteTokenState, FormData>(
    createTenantInviteTokenAction,
    undefined
  );
  const [retryState, retryAction, retryPending] = useActionState<
    TenantInviteEmailRetryState,
    FormData
  >(retryTenantInviteEmailAction, undefined);
  const [revokeState, revokeAction, revokePending] = useActionState<TenantInviteRevokeState, FormData>(
    revokeTenantInviteAction,
    undefined
  );

  const activeDelivery =
    retryState?.emailDelivery ?? tokenState?.result?.emailDelivery ?? null;
  const activeInviteUrl = tokenState?.result?.inviteUrl ?? null;
  const activeInviteId = tokenState?.result?.inviteId ?? null;
  const activeRecipientEmail = tokenState?.result?.email ?? null;
  const activeExpiresAt = tokenState?.result?.expiresAt ?? null;

  const createButtonLabel = inviteEmailConfigured
    ? WORKFORCE_ACTIVATION_COPY.createAndEmail
    : WORKFORCE_ACTIVATION_COPY.createLink;

  return (
    <div id={TENANT_WORKFORCE_SECTION_ID} className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-slate-100">{TENANT_WORKFORCE_ACTIVATION_TITLE}</h2>
          <span className="inline-flex rounded-full border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-cyan-200">
            {inviteEmailConfigured
              ? WORKFORCE_ACTIVATION_STATUS_CHIP_EMAIL
              : WORKFORCE_ACTIVATION_STATUS_CHIP}
          </span>
        </div>
        <p className="max-w-2xl text-sm text-slate-400">{WORKFORCE_ACTIVATION_PURPOSE}</p>
        <p className="text-xs text-slate-500">{WORKFORCE_ACTIVATION_DESCRIPTION}</p>
      </header>

      <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-cyan-100">{BUSINESS_PORTAL_INVITE_TITLE}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Business Portal access only.{" "}
            {inviteEmailConfigured
              ? WORKFORCE_ACTIVATION_COPY.emailConfiguredHint
              : WORKFORCE_ACTIVATION_COPY.emailUnconfiguredHint}
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
                <span className="text-xs text-slate-500">
                  days (default {WORKFORCE_ACTIVATION_COPY.expiryDefaultDays})
                </span>
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
          {tokenState?.success && !activeDelivery && (
            <p className="text-sm text-teal-300">{tokenState.success}</p>
          )}

          {activeDelivery && (
            <div className={`rounded-lg border p-3 text-sm ${deliveryBannerTone(activeDelivery.outcome)}`}>
              <p className="font-medium">{deliveryBannerTitle(activeDelivery.outcome)}</p>
              <p className="mt-1 text-xs opacity-90">{activeDelivery.operatorMessage}</p>
              {activeRecipientEmail && (
                <p className="mt-2 text-xs opacity-80">Recipient: {activeRecipientEmail}</p>
              )}
              {activeExpiresAt && (
                <p className="mt-1 text-xs opacity-80">
                  Expires {new Date(activeExpiresAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {retryState?.error && (
            <p className="text-sm text-red-400">{retryState.error}</p>
          )}
          {retryState?.success && (
            <p className="text-sm text-teal-300">{retryState.success}</p>
          )}

          {activeInviteUrl && (
            <div className="space-y-2">
              <CopyInviteLink url={activeInviteUrl} />
              {inviteEmailConfigured &&
                activeDelivery &&
                canRetryEmailDelivery(activeDelivery.outcome) &&
                activeInviteId && (
                  <form action={retryAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="inviteId" value={activeInviteId} />
                    <input type="hidden" name="tenantId" value={tenantId} />
                    <input type="hidden" name="tenantSlug" value={tenantSlug} />
                    <input type="hidden" name="inviteUrl" value={activeInviteUrl} />
                    <button
                      type="submit"
                      disabled={retryPending}
                      className="cc-btn-secondary text-xs disabled:opacity-50"
                    >
                      {retryPending ? "Retrying…" : WORKFORCE_ACTIVATION_COPY.retryEmail}
                    </button>
                    <span className="text-xs text-slate-500">
                      Reuses this invite link — no new token is generated.
                    </span>
                  </form>
                )}
            </div>
          )}

          <button
            type="submit"
            disabled={tokenPending}
            className="cc-btn-primary text-sm disabled:opacity-50"
          >
            {tokenPending ? "Creating…" : createButtonLabel}
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
          <p className="mt-2 text-xs text-slate-600">{WORKFORCE_ACTIVATION_COPY.manualDelivery}</p>
        </div>
      </section>
    </div>
  );
}
