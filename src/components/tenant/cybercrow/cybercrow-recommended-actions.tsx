import Link from "next/link";
import type { CybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";

type CybercrowRoutes = {
  dashboard: string;
  incidents: string;
  securityEvents: string;
  compliance: string;
  grc: string;
  auditLogs: string;
};

type CybercrowRecommendedActionsProps = {
  cybercrowHref: CybercrowRoutes;
  initialized: boolean;
  metrics: CybercrowDashboardMetrics;
  auditLogCount: number;
  highSeverityEvents: number;
};

export function CybercrowRecommendedActions({
  cybercrowHref: r,
  initialized,
  metrics,
  auditLogCount,
  highSeverityEvents,
}: CybercrowRecommendedActionsProps) {
  const actions: { label: string; href: string; reason: string }[] = [];

  if (!initialized) {
    actions.push({
      label: "Complete CyberCrow baseline",
      href: r.dashboard,
      reason: "Baseline initialization records trust posture and NCA-aligned controls.",
    });
  }
  if (metrics.openIncidentCount > 0) {
    actions.push({
      label: `Review ${metrics.openIncidentCount} open incident(s)`,
      href: r.incidents,
      reason: "Open incidents reduce the derived posture score.",
    });
  }
  if (highSeverityEvents > 0) {
    actions.push({
      label: "Triage high-severity security events",
      href: r.securityEvents,
      reason: `${highSeverityEvents} medium-or-higher events in the last window.`,
    });
  }
  if (metrics.controls.some((c) => c.status === "at_risk" || c.status === "not_assessed")) {
    actions.push({
      label: "Review at-risk compliance controls",
      href: r.compliance,
      reason: "Advisory NCA-aligned controls need evidence or status updates.",
    });
  }
  if (metrics.controls.length === 0 && auditLogCount > 0) {
    actions.push({
      label: "Seed compliance controls",
      href: r.grc,
      reason: "Audit activity exists but no control baseline is mapped yet.",
    });
  }
  if (actions.length === 0) {
    actions.push({
      label: "Monitor audit trail",
      href: r.auditLogs,
      reason: "Posture is stable — continue periodic review of platform and logistics events.",
    });
  }

  return (
    <section className="cc-glass-card border border-violet-500/15">
      <h3 className="text-sm font-medium text-violet-300">Recommended actions</h3>
      <p className="mt-1 text-xs text-slate-500">
        Suggestions from live counts — not automated remediation or AI scoring.
      </p>
      <ul className="mt-4 space-y-3">
        {actions.slice(0, 5).map((a) => (
          <li key={a.href + a.label}>
            <Link
              href={a.href}
              className="block rounded-cc-sm border border-violet-500/10 bg-violet-500/[0.04] px-3 py-2 transition hover:border-violet-400/25"
            >
              <span className="font-medium text-white">{a.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{a.reason}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
