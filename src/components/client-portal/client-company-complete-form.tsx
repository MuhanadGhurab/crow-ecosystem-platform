"use client";

import { useActionState } from "react";
import {
  updateClientCompanySafeFields,
  type ClientCompanyUpdateResult,
} from "@/lib/actions/client-profile";
import { CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS } from "@/lib/client-portal/client-company-profile-fields";

const initial: ClientCompanyUpdateResult | null = null;

type Props = {
  requestId: string;
  employeeBand: string | null;
  canEdit: boolean;
  editBlockedReason: string | null;
};

export function ClientCompanyCompleteForm({
  requestId,
  employeeBand,
  canEdit,
  editBlockedReason,
}: Props) {
  const [state, action, pending] = useActionState(updateClientCompanySafeFields, initial);

  if (!canEdit) {
    return editBlockedReason ? (
      <p className="text-sm text-slate-400">{editBlockedReason}</p>
    ) : null;
  }

  return (
    <section className="cc-glass-card" aria-labelledby="complete-company-heading">
      <h2
        id="complete-company-heading"
        className="text-sm font-semibold uppercase tracking-wider text-slate-400"
      >
        Complete missing information
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Update safe company fields linked to your implementation request. Approval, tenant, and
        provisioning status are not changed here.
      </p>

      <form action={action} className="mt-4 space-y-4">
        <input type="hidden" name="request_id" value={requestId} />

        {state?.ok === false && state.error && (
          <p className="cc-alert-warning text-sm" role="alert">
            {state.error}
          </p>
        )}
        {state?.ok === true && (
          <p
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            role="status"
          >
            Company profile updated.
          </p>
        )}

        <div>
          <label htmlFor="employee_band" className="block text-xs font-medium text-slate-500">
            Employee band
          </label>
          <select
            id="employee_band"
            name="employee_band"
            required
            defaultValue={employeeBand ?? ""}
            className="input-cc mt-1 w-full max-w-md"
          >
            <option value="" disabled>
              Select employee band
            </option>
            {CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {state?.ok === false && state.fieldErrors?.employee_band && (
            <p className="mt-1 text-xs text-amber-300">{state.fieldErrors.employee_band}</p>
          )}
        </div>

        <button type="submit" className="cc-btn-primary text-sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </section>
  );
}
