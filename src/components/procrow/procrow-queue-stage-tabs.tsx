import type {
  ProCrowOperatorQueueSnapshot,
  ProCrowQueueStage,
} from "@/lib/procrow/procrow-operator-queue-contract";

const STAGES: (ProCrowQueueStage | "all")[] = [
  "all",
  "intake",
  "discovery",
  "blueprint",
  "proposal",
  "client_review",
  "approval",
  "onboarding",
  "tenant_readiness",
  "runtime_trust",
  "complete",
];

export function ProCrowQueueStageTabs({
  snapshot,
  selected,
  onSelect,
}: {
  snapshot: ProCrowOperatorQueueSnapshot;
  selected: ProCrowQueueStage | "all";
  onSelect: (stage: ProCrowQueueStage | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 pb-2">
      {STAGES.map((s) => {
        const label = s === "all" ? "All" : s.replace(/_/g, " ");
        const active = selected === s;
        const c = s === "all" ? snapshot.items.length : snapshot.stageBuckets[s].length;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
              active
                ? "bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-500/40"
                : "bg-slate-800/50 text-slate-500 hover:text-slate-300"
            }`}
          >
            {label}
            <span className="ml-1 font-mono text-[10px] text-slate-500">({c})</span>
          </button>
        );
      })}
    </div>
  );
}
