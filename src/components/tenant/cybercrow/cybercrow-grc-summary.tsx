import Link from "next/link";
import { routes } from "@/lib/routes";
import { CYBERCROW_COPY } from "@/lib/constants/cybercrow-ux-depth";
import { CybercrowReadinessCard } from "./cybercrow-readiness-card";

type CybercrowGrcSummaryProps = {
  tenantSlug: string;
  controlCount: number;
  mappedCount: number;
  gapCount: number;
};

export function CybercrowGrcSummary({
  tenantSlug,
  controlCount,
  mappedCount,
  gapCount,
}: CybercrowGrcSummaryProps) {
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <section className="cc-glass-card cc-entity-block--cybercrow !p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
            GRC mapping
          </h2>
          <p className="mt-1 text-xs text-slate-500">{CYBERCROW_COPY.grcPurpose}</p>
        </div>
        <Link href={r.grc} className="cc-btn-secondary text-xs">
          GRC readiness →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CybercrowReadinessCard label="Control domains" value={controlCount} status="advisory" />
        <CybercrowReadinessCard label="Mapped" value={mappedCount} status="ready" />
        <CybercrowReadinessCard
          label="Mapping gaps"
          value={gapCount}
          status={gapCount > 0 ? "missing" : "ready"}
        />
      </div>
    </section>
  );
}
