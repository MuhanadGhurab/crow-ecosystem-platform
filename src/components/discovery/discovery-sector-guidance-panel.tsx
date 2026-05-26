import type { SectorGuidance } from "@/lib/discovery-intelligence/sector-guidance";
import { getModeledSectorCatalog } from "@/lib/constants/sector-catalog";
import {
  confidenceBadgeClass,
  type ConfidenceLevel,
} from "@/lib/discovery-intelligence/completeness";

const LIST_CAP = 4;

type Props = {
  guidance: SectorGuidance;
  sectorTemplateKey?: string;
  sectorConfidenceLevel?: ConfidenceLevel;
  missingInputs?: string[];
};

export function DiscoverySectorGuidancePanel({
  guidance,
  sectorTemplateKey,
  sectorConfidenceLevel,
  missingInputs = [],
}: Props) {
  const catalog = sectorTemplateKey ? getModeledSectorCatalog(sectorTemplateKey) : null;
  const sectorTitle = catalog?.title ?? guidance.sectorKey;

  return (
    <section className="rounded-xl border border-violet-500/20 bg-violet-950/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-300/80">
            Sector guidance
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">{guidance.headline}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selected model: <span className="text-violet-200">{sectorTitle}</span>
            {sectorTemplateKey ? (
              <span className="font-mono text-slate-600"> · {sectorTemplateKey}</span>
            ) : null}
          </p>
        </div>
        {sectorConfidenceLevel ? (
          <span
            className={`rounded-md border px-2 py-0.5 text-xs ${confidenceBadgeClass(sectorConfidenceLevel)}`}
          >
            Sector confidence {sectorConfidenceLevel}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-slate-400">{guidance.whyItMatters}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {guidance.focusAreas.slice(0, 6).map((area) => (
          <span
            key={area}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
          >
            {area}
          </span>
        ))}
        {guidance.focusAreas.length > 6 ? (
          <span className="text-xs text-slate-500">+{guidance.focusAreas.length - 6} more focus areas</span>
        ) : null}
      </div>

      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-cyan-300/90 hover:text-cyan-200">
          Show department, workflow, and engine hints
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GuidanceList title="Department hints" items={guidance.departmentHints} cap={LIST_CAP} />
          <GuidanceList title="Workflow examples" items={guidance.workflowExamples} cap={LIST_CAP} />
          <GuidanceList title="CyberCrow (advisory)" items={guidance.cybercrowHints} cap={LIST_CAP} />
          <GuidanceList title="SAREA hints" items={guidance.sareaHints} cap={LIST_CAP} />
        </div>
      </details>

      <details className="mt-3 group">
        <summary className="cursor-pointer text-sm font-medium text-slate-400 hover:text-slate-300">
          Blueprint notes (advisory)
        </summary>
        <ul className="mt-2 space-y-1 text-sm text-slate-400">
          {guidance.blueprintNotes.map((item) => (
            <li key={item} className="leading-snug">
              {item}
            </li>
          ))}
        </ul>
      </details>

      {missingInputs.length > 0 ? (
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-950/20 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-300/90">
            Missing information
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {missingInputs.length > 4 ? (
            <p className="mt-1 text-xs text-slate-500">+{missingInputs.length - 4} more on Summary</p>
          ) : null}
        </div>
      ) : null}

      {catalog ? (
        <p className="mt-3 text-xs text-slate-500">{catalog.advisoryNote}</p>
      ) : null}
    </section>
  );
}

function GuidanceList({
  title,
  items,
  cap,
}: {
  title: string;
  items: string[];
  cap: number;
}) {
  const shown = items.slice(0, cap);
  const rest = items.length - shown.length;
  return (
    <div>
      <h3 className="text-xs font-medium text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        {shown.map((item) => (
          <li key={item} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>
      {rest > 0 ? <p className="mt-1 text-xs text-slate-500">+{rest} more (see org model recommendations)</p> : null}
    </div>
  );
}
