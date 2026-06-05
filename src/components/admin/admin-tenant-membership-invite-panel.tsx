"use client";

import { useActionState } from "react";
import {
  createTenantMembershipInviteAction,
  type TenantMembershipInviteState,
} from "@/lib/actions/tenant-membership-invite";
import type { TenantMembershipAccessSummary } from "@/lib/tenant/tenant-membership-contract";
import { TENANT_MEMBERSHIP_INVITE_DISCLAIMERS } from "@/lib/tenant/tenant-membership-invite-contract";

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
};

export function AdminTenantMembershipInvitePanel({
  tenantId,
  tenantSlug,
  accessSummary,
  memberships,
}: Props) {
  const [state, action, pending] = useActionState<TenantMembershipInviteState, FormData>(
    createTenantMembershipInviteAction,
    undefined
  );

  return (
    <section className="rounded-xl border border-violet-500/25 bg-violet-950/15 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-violet-100">
          Tenant membership invite (M4B)
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Adding a tenant member grants Business Portal access only. It does not grant ProCrow,
          platform admin, client approval rights, payments, or production access.
        </p>
        <p className="mt-2 text-xs text-amber-200/90">
          After adding the membership, the user can sign in with that email. Crow email delivery is
          not active in this phase unless you enable the Supabase invite API option below.
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

      <form action={action} className="space-y-3">
        <input type="hidden" name="tenantId" value={tenantId} />
        <input type="hidden" name="tenantSlug" value={tenantSlug} />
        <div>
          <label htmlFor="invite-email" className="mb-1 block text-xs text-slate-400">
            Invite email
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
        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
        {state?.result?.snapshot && (
          <p className="text-xs text-slate-500">
            Status: <span className="text-slate-300">{state.result.snapshot.status}</span>
            {" · "}
            {state.result.snapshot.nextAction}
          </p>
        )}
        <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
          {pending ? "Adding…" : "Add tenant member"}
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
  );
}
