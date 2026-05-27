import Link from "next/link";
import { routes } from "@/lib/routes";
import { CYBERCROW_COPY } from "@/lib/constants/cybercrow-ux-depth";
import { CybercrowReadinessCard } from "./cybercrow-readiness-card";

type CybercrowEvidenceSummaryProps = {
  tenantSlug: string;
  total: number;
  readyCount: number;
  gapCount: number;
};

export function CybercrowEvidenceSummary({
  tenantSlug,
  total,
  readyCount,
  gapCount,
}: CybercrowEvidenceSummaryProps) {
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <section className="cc-glass-card cc-entity-block--cybercrow !p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
            Evidence readiness
          </h2>
          <p className="mt-1 text-xs text-slate-500">{CYBERCROW_COPY.evidencePurpose}</p>
        </div>
        <Link href={r.evidence} className="cc-btn-secondary text-xs">
          Evidence catalog →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CybercrowReadinessCard label="Catalog items" value={total} status="advisory" />
        <CybercrowReadinessCard
          label="Ready for review"
          value={readyCount}
          status="ready"
          hint="Metadata present"
        />
        <CybercrowReadinessCard
          label="Gaps"
          value={gapCount}
          status={gapCount > 0 ? "needs_review" : "ready"}
          hint="Recommended collection"
        />
      </div>
    </section>
  );
}
