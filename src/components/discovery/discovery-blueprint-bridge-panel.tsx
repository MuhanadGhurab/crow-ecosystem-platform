import Link from "next/link";
import type { DiscoveryBlueprintGateResult } from "@/lib/services/discovery-completion-gate.service";

type Props = {
  requestId: string;
  gate: DiscoveryBlueprintGateResult;
  blueprintId: string | null;
  essentialsPercent: number;
};

export function DiscoveryBlueprintBridgePanel({
  requestId,
  gate,
  blueprintId,
  essentialsPercent,
}: Props) {
  const statusStyles =
    gate.status === "ready"
      ? "border-teal-500/25 text-teal-200"
      : gate.status === "blueprint_exists"
        ? "border-cyan-500/25 text-cyan-200"
        : "border-amber-500/25 text-amber-200";

  return (
    <section className={`rounded-xl border bg-slate-950/40 p-4 ${statusStyles}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        Blueprint readiness
      </p>
      <h2 className="mt-1 text-lg font-semibold">{gate.statusLabel}</h2>
      <p className="mt-2 text-sm text-slate-400">
        {gate.warnings[0] ??
          gate.blockers[0] ??
          "Advisory gate for discovery → blueprint handoff. Review blockers before proceeding."}
      </p>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Carries into blueprint</dt>
          <dd className="text-slate-200">
            Org intelligence (when accepted), modules, security packages, structure counts
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Advisory only</dt>
          <dd className="text-slate-200">Sector hints, SAREA/CyberCrow suggestions, completeness %</dd>
        </div>
        <div>
          <dt className="text-slate-500">Discovery essentials</dt>
          <dd className="text-slate-200">{essentialsPercent}%</dd>
        </div>
        <div>
          <dt className="text-slate-500">Operator review</dt>
          <dd className="text-slate-200">
            {gate.blockers.length > 0
              ? `${gate.blockers.length} blocker(s) on Summary`
              : "No gate blockers — confirm org model"}
          </dd>
        </div>
      </dl>

      {gate.blockers.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-amber-200/90">
          {gate.blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/discovery/${requestId}/summary`}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
        >
          Open summary
        </Link>
        {blueprintId ? (
          <Link
            href={`/blueprints/${blueprintId}/overview`}
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200"
          >
            View blueprint
          </Link>
        ) : null}
        <Link
          href={`/discovery/${requestId}/organization-model`}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:text-white"
        >
          Review org model
        </Link>
      </div>
    </section>
  );
}
