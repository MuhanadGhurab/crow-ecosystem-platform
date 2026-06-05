import type { CemModuleDepthSnapshot } from "@/lib/cem/cem-module-depth-contract";

type Props = {
  snapshot: Pick<
    CemModuleDepthSnapshot,
    "nextActions" | "warnings" | "demoLimitations" | "disclaimers"
  >;
};

export function CemModuleNextActions({ snapshot }: Props) {
  const { nextActions, warnings, demoLimitations, disclaimers } = snapshot;

  return (
    <section className="cc-glass-card border-slate-600/30 !py-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
        Next operational actions & staging limits
      </h3>

      {nextActions.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Recommended next steps
          </p>
          <ul className="list-decimal pl-4 text-xs text-slate-300 space-y-1">
            {nextActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-amber-300/90 space-y-0.5">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {demoLimitations.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Demo / staging limitations
          </p>
          <ul className="list-disc pl-4 text-xs text-slate-500 space-y-0.5">
            {demoLimitations.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-slate-600 leading-relaxed">{disclaimers[0]}</p>
    </section>
  );
}
