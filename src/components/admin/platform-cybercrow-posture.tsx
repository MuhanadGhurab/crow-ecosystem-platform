import Link from "next/link";
import type { PlatformCybercrowPosture } from "@/lib/services/cybercrow-platform.service";
import { routes } from "@/lib/routes";

export function PlatformCybercrowPostureStrip({
  posture,
}: {
  posture: PlatformCybercrowPosture;
}) {
  const cards = [
    {
      label: "Live tenants",
      value: posture.liveTenantCount,
      hint: `${posture.tenantsWithBaseline} CyberCrow baseline`,
      accent: "text-white",
      border: "border-white/10 bg-white/[0.03]",
    },
    {
      label: "Security events",
      value: posture.securityEventCount,
      hint: "All tenants",
      accent: "text-violet-200",
      border: "border-violet-500/20 bg-violet-500/5",
    },
    {
      label: "Open incidents",
      value: posture.openIncidentCount,
      hint: "Cross-tenant",
      accent: "text-amber-200",
      border: "border-amber-500/20 bg-amber-500/5",
    },
    {
      label: "Compliance controls",
      value: posture.complianceControlCount,
      hint:
        posture.compliancePct != null
          ? `${posture.compliancePct}% compliant`
          : "No controls yet",
      accent: "text-teal-200",
      border: "border-teal-500/20 bg-teal-500/5",
    },
    {
      label: "Logistics audit",
      value: posture.logisticsAuditCount,
      hint: `${posture.totalAuditCount} total audit rows`,
      accent: "text-cyan-200",
      border: "border-cyan-500/20 bg-cyan-500/5",
    },
  ] as const;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
            CyberCrow posture
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Aggregate counts across all live tenants — open a tenant only for drill-down.
          </p>
        </div>
        <Link
          href={routes.admin.audit}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          Audit feed →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-cc-sm border px-4 py-3 ${card.border}`}
          >
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${card.accent}`}>
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
