"use client";

import { useActionState } from "react";
import { grantTenantAccessAction, type GrantAccessState } from "@/lib/actions/membership";

interface GrantTenantAccessFormProps {
  tenantId: string;
  tenantSlug: string;
}

export function GrantTenantAccessForm({ tenantId, tenantSlug }: GrantTenantAccessFormProps) {
  const [state, action, pending] = useActionState<GrantAccessState, FormData>(
    grantTenantAccessAction,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <p className="text-sm text-slate-400">
        Link a user to <span className="font-mono text-cyan-400">/{tenantSlug}</span>. Enable invite
        to email a new user via Supabase if they do not exist yet.
      </p>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-slate-400">
          User email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input-cc w-full max-w-md"
          placeholder="user@organization.com"
        />
      </div>
      <div>
        <label htmlFor="role" className="mb-1 block text-sm text-slate-400">
          Tenant role
        </label>
        <select id="role" name="role" className="input-cc max-w-md" defaultValue="tenant_admin">
          <option value="tenant_admin">Tenant Admin</option>
          <option value="tenant_user">Tenant User</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" name="inviteIfMissing" className="rounded border-cyan-500/30" />
        Invite by email if user does not exist
      </label>
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-teal-300">{state.success}</p>
      )}
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Granting…" : "Grant tenant access"}
      </button>
    </form>
  );
}
