import Link from "next/link";
import type { DiscoveryCompletenessResult } from "@/lib/discovery-intelligence/completeness";
import {
  confidenceBadgeClass,
  readinessLabelStyles,
} from "@/lib/discovery-intelligence/completeness";

type Props = {
  requestId: string;
  data: DiscoveryCompletenessResult;
};

export function DiscoveryCompletenessPanel({ requestId, data }: Props) {
  const styles = readinessLabelStyles(data.readinessLabel);

  return (
    <section
      className={`rounded-xl border p-4 ${styles.border}`}
      aria-labelledby="discovery-completeness-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Discovery completeness
          </p>
          <h2 id="discovery-completeness-heading" className={`mt-1 text-lg font-semibold ${styles.text}`}>
            {data.readinessTitle}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Advisory score — not automated AI. Essentials {data.essentialsPercent}% · optional{" "}
            {data.optionalAnswered}/{data.optionalTotal}
          </p>
        </div>
        <Link
          href={`/discovery/${requestId}/summary`}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-500/20"
        >
          Summary & blueprint
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(data.sectorConfidence.level)}`}>
          Sector {data.sectorConfidence.level}
        </span>
        <span className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(data.moduleConfidence.level)}`}>
          Modules {data.moduleConfidence.level}
        </span>
        <span className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(data.orgModelConfidence.level)}`}>
          Org model {data.orgModelConfidence.level}
        </span>
      </div>

      {data.missingInputs.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-slate-300">
          {data.missingInputs.slice(0, 5).map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-amber-400" aria-hidden>
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-xs text-slate-500">{data.blueprintReadinessHint}</p>
    </section>
  );
}
