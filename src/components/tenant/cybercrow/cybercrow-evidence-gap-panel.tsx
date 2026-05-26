import Link from "next/link";
import type { EvidenceGap } from "@/lib/services/cybercrow-evidence-grc.service";
import { gapSeverityClass } from "@/lib/services/cybercrow-evidence-grc.service";

type Props = {
  gaps: EvidenceGap[];
  maxItems?: number;
};

export function CybercrowEvidenceGapPanel({ gaps, maxItems = 12 }: Props) {
  const shown = gaps.slice(0, maxItems);
  if (shown.length === 0) {
    return (
      <section className="cc-glass-card border-teal-500/15">
        <h3 className="text-sm font-medium text-teal-300">Evidence gaps</h3>
        <p className="mt-2 text-xs text-slate-500">
          No advisory gaps detected from live controls, incidents, events, and findings.
          Continue periodic review.
        </p>
      </section>
    );
  }

  return (
    <section className="cc-glass-card border-amber-500/15">
      <h3 className="text-sm font-medium text-amber-300">Evidence gaps (advisory)</h3>
      <p className="mt-1 text-xs text-slate-500">
        Derived from database counts — not synthetic evidence. Operator-managed remediation.
      </p>
      <ul className="mt-4 space-y-3">
        {shown.map((g) => (
          <li
            key={g.id}
            className={`rounded-cc-sm border px-3 py-3 ${gapSeverityClass(g.severity)}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-white">{g.title}</p>
              <span className="text-[10px] uppercase tracking-wide opacity-80">{g.severity}</span>
            </div>
            <p className="mt-1 text-xs opacity-90">{g.whyItMatters}</p>
            <p className="mt-2 text-xs">
              <span className="font-medium">Collect:</span> {g.suggestedEvidence}
            </p>
            <Link href={g.relatedHref} className="mt-2 inline-block text-xs text-cyan-400 hover:text-cyan-300">
              {g.relatedRouteLabel} →
            </Link>
          </li>
        ))}
      </ul>
      {gaps.length > maxItems ? (
        <p className="mt-3 text-xs text-slate-600">+{gaps.length - maxItems} more gap(s)</p>
      ) : null}
    </section>
  );
}
