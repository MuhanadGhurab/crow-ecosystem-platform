"use client";

import { useActionState } from "react";
import {
  updateCrmAccountAction,
  updateCrmContactAction,
  type CrmActionState,
} from "@/lib/actions/crm";
import type { CrmAccountListItem, CrmContactListItem } from "@/lib/services/crm.service";

export function CrmAccountEditRow({
  tenantSlug,
  account,
}: {
  tenantSlug: string;
  account: CrmAccountListItem;
}) {
  const [state, action, pending] = useActionState<CrmActionState, FormData>(
    updateCrmAccountAction,
    undefined
  );

  return (
    <form action={action} className="mt-2 flex flex-wrap items-end gap-2 border-t border-cyan-500/5 pt-2">
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input type="hidden" name="accountId" value={account.id} />
      <input name="name" defaultValue={account.name} className="input-cc text-sm" />
      <select name="status" defaultValue={account.status} className="input-cc text-sm">
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      <button type="submit" disabled={pending} className="cc-btn-secondary px-2 py-1 text-xs">
        Save
      </button>
      {state?.success && <span className="text-xs text-teal-300">Saved</span>}
    </form>
  );
}

export function CrmContactEditRow({
  tenantSlug,
  contact,
}: {
  tenantSlug: string;
  contact: CrmContactListItem;
}) {
  const [state, action, pending] = useActionState<CrmActionState, FormData>(
    updateCrmContactAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input type="hidden" name="contactId" value={contact.id} />
      <input name="fullName" defaultValue={contact.fullName} className="input-cc text-sm" />
      <input name="email" defaultValue={contact.email ?? ""} className="input-cc text-sm" />
      <input name="title" defaultValue={contact.title ?? ""} className="input-cc text-sm" />
      <button type="submit" disabled={pending} className="cc-btn-secondary px-2 py-1 text-xs">
        Save
      </button>
    </form>
  );
}
