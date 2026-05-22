"use client";

import { useActionState } from "react";
import {
  assignProfileRoleAction,
  removeProfileRoleAction,
  type TenantRoleActionState,
} from "@/lib/actions/tenant-roles";

type ProfileRow = {
  id: string;
  fullName: string;
  email: string;
  departmentName: string | null;
  userRoles: { roleId: string; roleName: string }[];
};

type RoleOption = { id: string; name: string; slug: string };

export function ProfileRoleAssignForm({
  tenantSlug,
  profiles,
  roles,
}: {
  tenantSlug: string;
  profiles: ProfileRow[];
  roles: RoleOption[];
}) {
  const [state, action, pending] = useActionState<TenantRoleActionState, FormData>(
    assignProfileRoleAction,
    undefined
  );

  if (roles.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No CEM roles defined yet. Complete discovery or seed roles at provision.
      </p>
    );
  }

  return (
    <form action={action} className="cc-glass-card space-y-3">
      <h3 className="text-sm font-medium text-cyan-400">Assign CEM role</h3>
      <p className="text-xs text-slate-500">
        Requires tenant admin. Changes are logged to CyberCrow audit.
      </p>
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <div className="flex flex-wrap gap-3">
        <select name="profileId" required className="input-cc min-w-[12rem] flex-1">
          <option value="">Select user…</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName} ({p.email})
            </option>
          ))}
        </select>
        <select name="roleId" required className="input-cc min-w-[10rem]">
          <option value="">Select role…</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={pending || profiles.length === 0} className="cc-btn-primary text-sm">
          {pending ? "Assigning…" : "Assign role"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}
    </form>
  );
}

function RemoveRoleButton({
  tenantSlug,
  profileId,
  roleId,
  roleName,
}: {
  tenantSlug: string;
  profileId: string;
  roleId: string;
  roleName: string;
}) {
  const [state, action, pending] = useActionState<TenantRoleActionState, FormData>(
    removeProfileRoleAction,
    undefined
  );

  return (
    <form action={action} className="inline">
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      <input type="hidden" name="profileId" value={profileId} />
      <input type="hidden" name="roleId" value={roleId} />
      <button
        type="submit"
        disabled={pending}
        title={`Remove ${roleName}`}
        className="mr-1 inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
      >
        {roleName} ×
      </button>
      {state?.error && <span className="sr-only">{state.error}</span>}
    </form>
  );
}

export function ProfileRoleTable({
  tenantSlug,
  profiles,
  canManageRoles,
}: {
  tenantSlug: string;
  profiles: ProfileRow[];
  canManageRoles: boolean;
}) {
  if (profiles.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No profiles yet. New tenants receive a profile from the primary implementation contact.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-cc border border-cyan-500/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-cyan-500/10 bg-white/5 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">CEM roles</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/5">
          {profiles.map((p) => (
            <tr key={p.id} className="text-slate-300">
              <td className="px-4 py-3 font-medium text-white">{p.fullName}</td>
              <td className="px-4 py-3">{p.email}</td>
              <td className="px-4 py-3">{p.departmentName ?? "—"}</td>
              <td className="px-4 py-3">
                {p.userRoles.length === 0 && "—"}
                {canManageRoles
                  ? p.userRoles.map((ur) => (
                      <RemoveRoleButton
                        key={`${p.id}-${ur.roleId}`}
                        tenantSlug={tenantSlug}
                        profileId={p.id}
                        roleId={ur.roleId}
                        roleName={ur.roleName}
                      />
                    ))
                  : p.userRoles.map((ur) => (
                      <span
                        key={ur.roleId}
                        className="mr-1 inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300"
                      >
                        {ur.roleName}
                      </span>
                    ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
