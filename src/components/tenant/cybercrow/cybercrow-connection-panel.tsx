import Link from "next/link";
import { routes } from "@/lib/routes";

type CybercrowConnectionPanelProps = {
  tenantSlug: string;
  variant?: "cybercrow" | "tenant" | "sarea";
};

/**
 * Twin-engine copy: CEM runs the org, CyberCrow protects, SAREA adapts experience.
 * RBAC controls access; SAREA controls presentation — not a substitute for authz.
 */
export function CybercrowConnectionPanel({
  tenantSlug,
  variant = "tenant",
}: CybercrowConnectionPanelProps) {
  const r = routes.tenant(tenantSlug);

  const borderClass =
    variant === "cybercrow"
      ? "border-violet-500/25 bg-violet-950/20"
      : variant === "sarea"
        ? "border-rose-500/25 bg-rose-950/20"
        : "border-cyan-500/20 bg-cyan-950/15";

  return (
    <section className={`rounded-lg border px-4 py-3 text-sm ${borderClass}`}>
      <p className="font-medium text-white">How the engines work together</p>
      <ul className="mt-2 space-y-1 text-xs text-slate-400">
        <li>
          <span className="text-cyan-300">CEM</span> runs day-to-day operations for this tenant.
        </li>
        <li>
          <span className="text-violet-300">CyberCrow</span> protects this tenant — audit, risk,
          incidents, and compliance telemetry.
        </li>
        <li>
          <span className="text-rose-300">SAREA</span> adapts the workspace experience based on role
          and persona — not permission grants.
        </li>
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        RBAC controls <span className="text-slate-300">who can access</span> data and actions. SAREA
        controls <span className="text-slate-300">how the console is presented</span> (navigation,
        widgets, density).         CyberCrow analysts work in this console (incidents, events, identity signals). Tenant
        admins govern users, roles, and plan in CEM while monitoring CyberCrow posture. Executives
        and managers see trust summaries via SAREA-adapted dashboards — not permission grants.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={r.cybercrow.dashboard} className="cc-btn-secondary text-xs">
          CyberCrow console
        </Link>
        <Link href={r.dashboard} className="cc-btn-secondary text-xs">
          Tenant dashboard
        </Link>
        <Link href={routes.sarea.overview} className="cc-btn-secondary text-xs">
          SAREA studio
        </Link>
      </div>
    </section>
  );
}
