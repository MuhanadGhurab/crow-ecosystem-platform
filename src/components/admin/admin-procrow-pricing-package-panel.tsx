import Link from "next/link";
import type { PricingPackageEstimate } from "@/lib/pricing/pricing-package-contract";
import { routes } from "@/lib/routes";

type Props = {
  requestId: string;
  estimate: PricingPackageEstimate | null;
  blueprintId: string | null;
};

export function AdminProcrowPricingPackagePanel({ requestId, estimate, blueprintId }: Props) {
  if (!estimate) {
    return (
      <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-white">Advisory pricing package</h3>
        <p className="mt-3 text-sm text-slate-400">Request data unavailable for package recommendation.</p>
      </section>
    );
  }

  const rec = estimate.recommendation;
  const weakDiscovery =
    estimate.discoverySource === "request_only" || estimate.discoverySource === "draft";

  return (
    <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Advisory pricing package</h3>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
          L7 advisory
        </span>
      </div>

      <p className="text-xs text-amber-200/80">{estimate.notFinalQuoteDisclaimer}</p>

      {weakDiscovery && (
        <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-sm text-amber-100">
          Pricing recommendation will become stronger after ProCrow accepts client discovery into the
          blueprint.
        </p>
      )}

      {estimate.discoverySource === "accepted_into_blueprint" && (
        <p className="text-sm text-emerald-300/90">{estimate.discoverySourceNote}</p>
      )}

      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
        <p className="text-xs uppercase tracking-wide text-cyan-200/80">Recommended package</p>
        <p className="mt-1 text-lg font-semibold text-white">{rec.label}</p>
        <p className="mt-2 text-sm text-slate-300">{rec.description}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Setup / onboarding (estimate)</dt>
          <dd className="text-white">{estimate.setupEstimateRange}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Monthly direction (estimate)</dt>
          <dd className="text-white">{estimate.monthlyEstimateRange}</dd>
        </div>
        <div>
          <dt className="text-slate-500">CEM module depth</dt>
          <dd className="text-slate-300 text-xs">{rec.moduleDepth}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Workflow depth</dt>
          <dd className="text-slate-300 text-xs">{rec.workflowDepth}</dd>
        </div>
        <div>
          <dt className="text-slate-500">CyberCrow</dt>
          <dd className="text-slate-300 text-xs">{rec.cyberCrowDepth}</dd>
        </div>
        <div>
          <dt className="text-slate-500">SAREA</dt>
          <dd className="text-slate-300 text-xs">{rec.sareaDepth}</dd>
        </div>
      </dl>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why this package</p>
        <ul className="mt-2 space-y-2">
          {estimate.signals.map((s) => (
            <li key={s.key} className="text-sm text-slate-400">
              <span className="text-slate-300">{s.label}:</span> {s.value}
              <span className="block text-xs text-slate-500">{s.reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-500">{estimate.finalQuoteRequiresProCrowReview}</p>

      <div className="flex flex-wrap gap-3 border-t border-slate-700/60 pt-3">
        <span className="text-sm text-slate-400">
          Next: prepare proposal and commercial terms in ProCrow — no checkout on this screen.
        </span>
        {blueprintId ? (
          <Link
            href={routes.blueprint(blueprintId).pricing}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Blueprint pricing →
          </Link>
        ) : (
          <Link
            href={routes.discovery(requestId).organization}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Discovery workspace →
          </Link>
        )}
      </div>
    </section>
  );
}
