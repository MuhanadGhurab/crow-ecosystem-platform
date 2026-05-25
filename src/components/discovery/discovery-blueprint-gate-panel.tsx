import type { DiscoveryBlueprintGateResult } from "@/lib/services/discovery-completion-gate.service";

const STATUS_STYLES: Record<
  DiscoveryBlueprintGateResult["status"],
  { border: string; text: string }
> = {
  ready: { border: "border-teal-500/25 bg-teal-950/20", text: "text-teal-300" },
  needs_review: { border: "border-amber-500/25 bg-amber-950/15", text: "text-amber-200" },
  missing_data: { border: "border-red-500/30 bg-red-950/20", text: "text-red-300" },
  blueprint_exists: { border: "border-cyan-500/25 bg-cyan-950/15", text: "text-cyan-300" },
};

export function DiscoveryBlueprintGatePanel({ gate }: { gate: DiscoveryBlueprintGateResult }) {
  const style = STATUS_STYLES[gate.status];

  return (
    <section className={`rounded-lg border p-4 ${style.border}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-white">Blueprint readiness gate</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.text}`}>
          {gate.statusLabel}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Advisory check before creating the enterprise blueprint. You can still proceed when data is
        incomplete, but go-live may surface blockers later.
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        {gate.items.map((item) => (
          <li key={item.key} className="flex gap-2">
            <span className={item.passed ? "text-teal-400" : "text-amber-400"}>
              {item.passed ? "✓" : "○"}
            </span>
            <span className="text-slate-300">
              <span className="font-medium">{item.label}</span>
              <span className="text-slate-500"> — {item.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      {gate.warnings.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-amber-100/90">
          {gate.warnings.map((w) => (
            <li key={w}>• {w}</li>
          ))}
        </ul>
      )}

      {gate.blockers.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-red-200/90">
          {gate.blockers.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
