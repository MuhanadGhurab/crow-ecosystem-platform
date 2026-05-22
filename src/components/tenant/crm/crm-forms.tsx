"use client";

import { useActionState } from "react";
import {
  createCrmAccountAction,
  createCrmContactAction,
  type CrmActionState,
} from "@/lib/actions/crm";

export function CrmAccountForm({ tenantSlug }: { tenantSlug: string }) {
  const [state, action, pending] = useActionState<CrmActionState, FormData>(
    createCrmAccountAction,
    undefined
  );

  return (
    <form action={action} className="cc-glass-card space-y-3">
      <h3 className="text-sm font-medium text-cyan-400">New account</h3>
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input name="name" required placeholder="Account name" className="input-cc w-full" />
      <input name="industry" placeholder="Industry" className="input-cc w-full" />
      <input name="website" placeholder="Website" className="input-cc w-full" />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

export function CrmContactForm({
  tenantSlug,
  accounts,
}: {
  tenantSlug: string;
  accounts: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<CrmActionState, FormData>(
    createCrmContactAction,
    undefined
  );

  return (
    <form action={action} className="cc-glass-card space-y-3">
      <h3 className="text-sm font-medium text-cyan-400">New contact</h3>
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input name="fullName" required placeholder="Full name" className="input-cc w-full" />
      <input name="email" type="email" placeholder="Email" className="input-cc w-full" />
      <input name="phone" placeholder="Phone" className="input-cc w-full" />
      <input name="title" placeholder="Title" className="input-cc w-full" />
      <select name="accountId" className="input-cc w-full">
        <option value="">No account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Creating…" : "Create contact"}
      </button>
    </form>
  );
}
