"use client";

import { useActionState } from "react";
import { updateHrEmployeeAction, type HrActionState } from "@/lib/actions/hr";
import type { HrEmployeeListItem } from "@/lib/services/hr.service";

export function HrEmployeeEditRow({
  tenantSlug,
  employee,
}: {
  tenantSlug: string;
  employee: HrEmployeeListItem;
}) {
  const [state, action, pending] = useActionState<HrActionState, FormData>(
    updateHrEmployeeAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-2 border-t border-cyan-500/5 pt-3">
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input type="hidden" name="employeeId" value={employee.id} />
      <input
        name="fullName"
        defaultValue={employee.fullName}
        className="input-cc min-w-[10rem] text-sm"
        aria-label="Full name"
      />
      <input
        name="email"
        defaultValue={employee.email}
        className="input-cc min-w-[10rem] text-sm"
        aria-label="Email"
      />
      <input
        name="jobTitle"
        defaultValue={employee.jobTitle ?? ""}
        placeholder="Job title"
        className="input-cc min-w-[8rem] text-sm"
      />
      <select
        name="employmentStatus"
        defaultValue={employee.employmentStatus}
        className="input-cc text-sm"
      >
        <option value="active">Active</option>
        <option value="on_leave">On leave</option>
        <option value="terminated">Terminated</option>
      </select>
      <button type="submit" disabled={pending} className="cc-btn-secondary px-3 py-1 text-xs">
        {pending ? "…" : "Save"}
      </button>
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
      {state?.success && <span className="text-xs text-teal-300">Saved</span>}
    </form>
  );
}
