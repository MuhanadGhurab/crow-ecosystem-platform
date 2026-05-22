"use client";

import { useActionState } from "react";
import { createHrEmployeeAction, type HrActionState } from "@/lib/actions/hr";

export function HrEmployeeForm({
  tenantSlug,
  departments,
}: {
  tenantSlug: string;
  departments: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<HrActionState, FormData>(
    createHrEmployeeAction,
    undefined
  );

  return (
    <form action={action} className="cc-glass-card space-y-4">
      <h3 className="text-sm font-medium text-cyan-400">Add employee</h3>
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Full name</label>
          <input name="fullName" required className="input-cc w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Email</label>
          <input name="email" type="email" required className="input-cc w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Job title</label>
          <input name="jobTitle" className="input-cc w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Employee #</label>
          <input name="employeeNumber" className="input-cc w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Department</label>
          <select name="departmentId" className="input-cc w-full">
            <option value="">—</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Status</label>
          <select name="employmentStatus" className="input-cc w-full" defaultValue="active">
            <option value="active">Active</option>
            <option value="on_leave">On leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
      <button type="submit" disabled={pending} className="cc-btn-primary text-sm disabled:opacity-50">
        {pending ? "Adding…" : "Add employee"}
      </button>
    </form>
  );
}
