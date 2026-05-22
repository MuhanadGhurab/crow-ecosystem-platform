"use client";

import { useActionState } from "react";
import { promoteClientToTenantAction, type GrantAccessState } from "@/lib/actions/membership";

interface PromoteClientFormProps {
  tenantId: string;
  tenantSlug: string;
  contactEmail: string;
}

export function PromoteClientForm({ tenantId, tenantSlug, contactEmail }: PromoteClientFormProps) {
  const [state, action, pending] = useActionState<GrantAccessState, FormData>(
    promoteClientToTenantAction,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="email" value={contactEmail} />
      <p className="text-sm text-slate-400">
        Promote the client who signed in as <span className="font-mono text-cyan-400">{contactEmail}</span>{" "}
        to <span className="font-mono text-cyan-400">/{tenantSlug}</span>. Same Supabase account —
        role upgrades from <span className="text-teal-300">client</span> to tenant member.
      </p>
      <div>
        <label htmlFor="promote-role" className="mb-1 block text-sm text-slate-400">
          Tenant role
        </label>
        <select id="promote-role" name="role" className="input-cc max-w-md" defaultValue="tenant_user">
          <option value="tenant_user">Tenant User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
      <button type="submit" disabled={pending} className="cc-btn-secondary text-sm disabled:opacity-50">
        {pending ? "Promoting…" : "Invite as tenant user"}
      </button>
    </form>
  );
}
