import Link from "next/link";
import { getDiscoveryIntelligenceSnapshot } from "@/lib/services/discovery-intelligence.service";
import {
  confidenceBadgeClass,
  readinessLabelStyles,
} from "@/lib/discovery-intelligence/completeness";
import { routes } from "@/lib/routes";

type Props = {
  requestId: string;
};

export async function AdminDiscoveryIntelligencePanel({ requestId }: Props) {
  const snapshot = await getDiscoveryIntelligenceSnapshot(requestId);
  if (!snapshot) return null;

  const { completeness } = snapshot;
  const styles = readinessLabelStyles(completeness.readinessLabel);
  const d = routes.discovery(requestId);

  return (
    <section className={`cc-glass-card space-y-4 !p-5 ${styles.border}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Discovery intelligence
          </p>
          <h2 className={`mt-1 text-lg font-semibold ${styles.text}`}>{completeness.readinessTitle}</h2>
          <p className="mt-1 text-sm text-slate-400">
            Essentials {completeness.essentialsPercent}% · sector template{" "}
            <span className="font-mono text-slate-300">{snapshot.sectorTemplateKey}</span>
            {snapshot.orgIntelligenceStatus
              ? ` · org model ${snapshot.orgIntelligenceStatus}`
              : ""}
          </p>
        </div>
        <Link href={d.organizationModel} className="text-sm text-cyan-400 hover:text-cyan-300">
          Org model →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(completeness.sectorConfidence.level)}`}
        >
          Sector {completeness.sectorConfidence.level}
        </span>
        <span
          className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(completeness.orgModelConfidence.level)}`}
        >
          Blueprint gate: {snapshot.gate.status}
        </span>
      </div>

      {completeness.missingInputs.length > 0 ? (
        <ul className="text-sm text-slate-400">
          {completeness.missingInputs.slice(0, 4).map((m) => (
            <li key={m}>· {m}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          {snapshot.gate.warnings[0] ?? snapshot.gate.statusLabel}
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <Link href={d.summary} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
          Discovery summary
        </Link>
        {snapshot.blueprintId ? (
          <Link
            href={routes.blueprint(snapshot.blueprintId).overview}
            className="cc-btn-secondary !px-3 !py-1.5 text-xs"
          >
            Blueprint
          </Link>
        ) : null}
      </div>
    </section>
  );
}
