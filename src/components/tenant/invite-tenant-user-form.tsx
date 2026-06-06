"use client";

import { useActionState } from "react";
import { inviteTenantUserAction, type GrantAccessState } from "@/lib/actions/membership";

export function InviteTenantUserForm({ tenantSlug }: { tenantSlug: string }) {
  const [state, action, pending] = useActionState<GrantAccessState, FormData>(
    inviteTenantUserAction,
    undefined
  );

  return (
    <form action={action} className="cc-glass-card space-y-3">
      <h3 className="text-sm font-medium text-cyan-400">Activate tenant user</h3>
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input
        name="email"
        type="email"
        required
        placeholder="colleague@company.com"
        className="input-cc w-full max-w-md"
      />
      <select name="role" className="input-cc max-w-md" defaultValue="tenant_user">
        <option value="tenant_admin">Tenant Admin</option>
        <option value="tenant_user">Tenant User</option>
      </select>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Adding…" : "Activate tenant user"}
      </button>
    </form>
  );
}
