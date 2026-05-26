import type { DiscoveryAdvisoryRecommendations } from "@/lib/discovery-intelligence/recommendations";

type Props = {
  recommendations: DiscoveryAdvisoryRecommendations;
};

const CHIP_CAP = 6;

export function DiscoveryAdvisoryRecommendationsPanel({ recommendations }: Props) {
  return (
    <section className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-cyan-300/80">
        Suggested structure
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Based on sector template <span className="text-cyan-200">{recommendations.sectorKey}</span>.
        Edit on structure pages — advisory suggestions, not auto-applied.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChipList title="Departments" items={recommendations.departments} cap={CHIP_CAP} />
        <ChipList title="Roles" items={recommendations.roles} cap={CHIP_CAP} />
        <ChipList title="Workflows" items={recommendations.workflows} cap={CHIP_CAP} />
        <ChipList title="CyberCrow baselines" items={recommendations.cybercrow} cap={CHIP_CAP} />
        <ChipList title="SAREA profiles" items={recommendations.sarea} cap={CHIP_CAP} />
      </div>

      <ul className="mt-4 space-y-1 border-t border-white/10 pt-3 text-xs text-slate-500">
        {recommendations.blueprintNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

function ChipList({
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
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {shown.map((item) => (
          <li
            key={item}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
      {rest > 0 ? (
        <p className="mt-1 text-[10px] text-slate-500">+{rest} more in sector template</p>
      ) : null}
    </div>
  );
}
