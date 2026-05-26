import type { SectorGuidance } from "@/lib/discovery-intelligence/sector-guidance";

type Props = {
  guidance: SectorGuidance;
};

export function DiscoverySectorGuidancePanel({ guidance }: Props) {
  return (
    <section className="rounded-xl border border-violet-500/20 bg-violet-950/10 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-violet-300/80">
        Sector guidance
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">{guidance.headline}</h2>
      <p className="mt-2 text-sm text-slate-400">{guidance.whyItMatters}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {guidance.focusAreas.map((area) => (
          <span
            key={area}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
          >
            {area}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <GuidanceList title="Department hints" items={guidance.departmentHints} />
        <GuidanceList title="Workflow examples" items={guidance.workflowExamples} />
        <GuidanceList title="Security (advisory)" items={guidance.securityHints} />
        <GuidanceList title="SAREA hints" items={guidance.sareaHints} />
        <GuidanceList title="CyberCrow hints" items={guidance.cybercrowHints} />
        <GuidanceList title="Blueprint notes" items={guidance.blueprintNotes} />
      </div>
    </section>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
