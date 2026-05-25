import Link from "next/link";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";

type TwinEngineStripProps = {
  tenantSlug: string;
  variant: "sarea" | "cybercrow";
};

/** Cross-link SAREA ↔ CyberCrow on the same tenant slug (Muhanad / Omar twin admins). */
export function TwinEngineStrip({ tenantSlug, variant }: TwinEngineStripProps) {
  const r = routes.tenant(tenantSlug);
  const isMeem = tenantSlug === MEEM_TENANT_SLUG;

  if (variant === "cybercrow") {
    return (
      <section className="rounded-lg border border-rose-500/20 bg-rose-950/15 px-4 py-3 text-sm">
        <p className="font-medium text-rose-200">SAREA adapts this tenant&apos;s experience</p>
        <p className="mt-1 text-xs text-slate-400">
          RBAC controls access; SAREA controls navigation, widgets, and density per role. Security
          analysts use CyberCrow; executives and managers see trust-oriented summaries on the tenant
          dashboard.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={r.dashboard} className="cc-btn-secondary text-xs">
            Tenant dashboard (persona)
          </Link>
          {isMeem && (
            <Link href={routes.sarea.preview} className="cc-btn-secondary text-xs">
              SAREA preview hub
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-violet-500/20 bg-violet-950/15 px-4 py-3 text-sm">
      <p className="font-medium text-violet-200">CyberCrow protects this tenant</p>
      <p className="mt-1 text-xs text-slate-400">
        Trust posture, audit, incidents, and NCA-aligned compliance telemetry live here. SAREA does
        not replace security controls — it shapes how authorized users see operational data.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={r.cybercrow.dashboard}
          className="cc-btn-secondary text-xs !border-violet-500/30"
        >
          CyberCrow console
        </Link>
        {isMeem && (
          <Link
            href={`/admin/audit?category=logistics&tenant=${tenantSlug}`}
            className="text-xs text-violet-300 hover:text-violet-200"
          >
            Platform audit →
          </Link>
        )}
      </div>
    </section>
  );
}
