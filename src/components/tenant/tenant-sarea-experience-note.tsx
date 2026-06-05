import { SAREA_CYBERCROW_DEPENDENCY_COPY } from "@/lib/sarea/sarea-experience-mapping-contract";
import { SAREA_COPY } from "@/lib/constants/sarea-ux-depth";

type Props = {
  variant?: "dashboard" | "modules";
};

export function TenantSareaExperienceNote({ variant = "dashboard" }: Props) {
  const body =
    variant === "modules"
      ? "SAREA adapts navigation and widget emphasis by role — it does not grant module access. RBAC still controls what you can open."
      : "This Business Portal is shaped by SAREA based on role, department, and module context. RBAC controls access; SAREA controls experience density and presentation.";

  return (
    <section className="rounded-lg border border-rose-500/15 bg-rose-950/15 px-4 py-3 text-sm">
      <p className="font-medium text-rose-200">Role-based experience (SAREA)</p>
      <p className="mt-1 text-xs text-slate-400">{body}</p>
      <p className="mt-2 text-[11px] text-slate-500">{SAREA_COPY.rbacBoundary}</p>
      <p className="mt-1 text-[11px] text-slate-600">{SAREA_CYBERCROW_DEPENDENCY_COPY}</p>
    </section>
  );
}
