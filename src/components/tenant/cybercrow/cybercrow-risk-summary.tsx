import Link from "next/link";
import { routes } from "@/lib/routes";
import { CYBERCROW_COPY } from "@/lib/constants/cybercrow-ux-depth";
import { CybercrowReadinessCard } from "./cybercrow-readiness-card";

type CybercrowRiskSummaryProps = {
  tenantSlug: string;
  postureScore: number;
  openIncidents: number;
  openEvents: number;
  highSeveritySignals: number;
};

export function CybercrowRiskSummary({
  tenantSlug,
  postureScore,
  openIncidents,
  openEvents,
  highSeveritySignals,
}: CybercrowRiskSummaryProps) {
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <section className="cc-glass-card cc-entity-block--cybercrow !p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
            Risk review
          </h2>
          <p className="mt-1 text-xs text-slate-500">{CYBERCROW_COPY.riskPurpose}</p>
        </div>
        <Link href={r.risk} className="cc-btn-secondary text-xs">
          Risk posture →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CybercrowReadinessCard
          label="Posture score"
          value={postureScore}
          status={postureScore >= 70 ? "ready" : postureScore >= 50 ? "needs_review" : "missing"}
          hint="Rule-based — not AI"
        />
        <CybercrowReadinessCard
          label="Open incidents"
          value={openIncidents}
          status={openIncidents > 0 ? "needs_review" : "ready"}
        />
        <CybercrowReadinessCard
          label="Events to review"
          value={openEvents}
          status={openEvents > 0 ? "needs_review" : "ready"}
        />
        <CybercrowReadinessCard
          label="High-severity signals"
          value={highSeveritySignals}
          status={highSeveritySignals > 0 ? "needs_review" : "advisory"}
        />
      </div>
    </section>
  );
}
