"use client";

import { useActionState } from "react";
import {
  createTenantMembershipInviteAction,
  type TenantMembershipInviteState,
} from "@/lib/actions/tenant-membership-invite";
import { WORKFORCE_ACTIVATION_COPY } from "@/lib/constants/crow-workforce-activation";
import { TENANT_MEMBERSHIP_INVITE_DISCLAIMERS } from "@/lib/tenant/tenant-membership-invite-contract";

type MembershipRow = {
  id: string;
  supabaseUserId: string;
  role: string;
};

type Props = {
  tenantId: string;
  tenantSlug: string;
  memberships: MembershipRow[];
};

export function AdminTenantMembershipBreakGlassPanel({
  tenantId,
  tenantSlug,
  memberships,
}: Props) {
  const [breakGlassState, breakGlassAction, breakGlassPending] = useActionState<
    TenantMembershipInviteState,
    FormData
  >(createTenantMembershipInviteAction, undefined);

  return (
    <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-950/10 p-5">
      <div>
        <h3 className="text-sm font-semibold text-amber-100">
          Advanced / Break-glass membership grant
        </h3>
        <p className="mt-1 text-xs text-slate-500">{WORKFORCE_ACTIVATION_COPY.breakGlassSubtitle}</p>
      </div>

      <form action={breakGlassAction} className="space-y-3">
        <input type="hidden" name="tenantId" value={tenantId} />
        <input type="hidden" name="tenantSlug" value={tenantSlug} />
        <div>
          <label htmlFor="break-glass-email" className="mb-1 block text-xs text-slate-400">
            Email
          </label>
          <input
            id="break-glass-email"
            name="email"
            type="email"
            required
            className="input-cc w-full max-w-md"
            placeholder="user@organization.com"
          />
        </div>
        <div>
          <label htmlFor="break-glass-role" className="mb-1 block text-xs text-slate-400">
            Tenant role
          </label>
          <select id="break-glass-role" name="role" className="input-cc max-w-md" defaultValue="tenant_user">
            <option value="tenant_user">tenant_user</option>
            <option value="tenant_admin">tenant_admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="break-glass-note" className="mb-1 block text-xs text-slate-400">
            Operator note (optional)
          </label>
          <input
            id="break-glass-note"
            name="note"
            type="text"
            className="input-cc w-full max-w-md"
            placeholder="Recovery or test context"
          />
        </div>
        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input type="checkbox" name="useSupabaseInviteApi" className="mt-0.5 rounded border-slate-600" />
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
        <button type="submit" disabled={breakGlassPending} className="cc-btn-secondary text-sm disabled:opacity-50">
          {breakGlassPending ? "Granting…" : WORKFORCE_ACTIVATION_COPY.breakGlassSubmit}
        </button>
      </form>

      {memberships.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500">Existing memberships (DB)</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
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
    </div>
  );
}
