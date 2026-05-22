import type { CrowRole } from "@/lib/auth/roles";
import { roleLabel } from "@/lib/auth/roles";

const ROLE_STYLES: Partial<Record<CrowRole, string>> = {
  platform_admin: "bg-cyan-500/20 text-cyan-200",
  implementer: "bg-violet-500/20 text-violet-200",
  sales: "bg-amber-500/20 text-amber-200",
  auditor_readonly: "bg-slate-500/20 text-slate-300",
  tenant_admin: "bg-teal-500/20 text-teal-200",
  tenant_user: "bg-slate-600/20 text-slate-300",
  client: "bg-rose-500/20 text-rose-200",
};

export function RoleBadge({ role }: { role: CrowRole | null }) {
  if (!role) return null;
  const style = ROLE_STYLES[role] ?? "bg-white/10 text-slate-300";
  return (
    <span
      className={`shrink-0 rounded-cc-sm px-2 py-0.5 text-[10px] font-medium sm:text-xs ${style}`}
      title={`crow_role: ${role}`}
    >
      {roleLabel(role)}
    </span>
  );
}
