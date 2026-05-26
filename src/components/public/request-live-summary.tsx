"use client";

import { calculateMonthlyEstimate, formatSar } from "@/lib/services/pricing.service";
import type { SecurityPackageKey } from "@/lib/constants/security-packages";
import type { CemModuleKey } from "@/lib/constants/modules";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

type RequestLiveSummaryProps = {
  planKey: SubscriptionTierKey;
  moduleKeys: CemModuleKey[];
  securityKeys: SecurityPackageKey[];
  progressPct: number;
  compact?: boolean;
  showSubmit?: boolean;
  loading?: boolean;
  onSubmit?: () => void;
};

export function RequestLiveSummary({
  planKey,
  moduleKeys,
  securityKeys,
  progressPct,
  compact = false,
  showSubmit = false,
  loading = false,
  onSubmit,
}: RequestLiveSummaryProps) {
  const estimate = calculateMonthlyEstimate({
    planKey,
    moduleKeys,
    securityPackageKeys: securityKeys,
  });

  const hasAddOns = moduleKeys.length > 0 || securityKeys.length > 0;
  const showStarterHint = !hasAddOns && progressPct < 60;

  return (
    <div
      className={`rounded-cc border border-cyan-500/15 bg-gradient-to-br from-violet-950/40 via-cc-elevated/90 to-teal-950/30 backdrop-blur-md ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      {!compact && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Live estimate</p>
            <span className="font-mono text-[10px] text-slate-500">{progressPct}% complete</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="cc-request-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </>
      )}

      {showStarterHint && (
        <p className={`rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-xs leading-relaxed text-slate-400 ${compact ? "mb-3" : "mt-4"}`}>
          Choose your subscription tier, modules, and security packages — the monthly total updates here
          as you go. This is indicative only; final commercial terms follow discovery and blueprint.
        </p>
      )}

      <div className={compact ? "flex items-end justify-between gap-4" : "mt-5 space-y-3"}>
        <div className={compact ? "min-w-0" : ""}>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {hasAddOns ? "Monthly (indicative)" : "Platform tier (indicative)"}
          </p>
          <p
            key={estimate.totalMonthlySar}
            className={`cc-live-estimate text-2xl font-bold text-cc-star ${compact ? "text-xl" : "sm:text-3xl"}`}
          >
            {formatSar(estimate.totalMonthlySar)}
            {!hasAddOns && (
              <span className="ml-1 text-sm font-normal text-slate-500">before add-ons</span>
            )}
          </p>
        </div>
        {!compact && (
          <dl className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-cc-sm border border-white/10 bg-white/[0.03] px-2 py-2">
              <dt className="text-slate-500">Tier</dt>
              <dd className="mt-0.5 font-medium text-slate-200">{formatSar(estimate.baseMonthlySar)}</dd>
            </div>
            <div className="rounded-cc-sm border border-white/10 bg-white/[0.03] px-2 py-2">
              <dt className="text-slate-500">Modules</dt>
              <dd className="mt-0.5 font-medium text-teal-300">
                {moduleKeys.length > 0 ? `+${formatSar(estimate.modulesMonthlySar)}` : "—"}
              </dd>
            </div>
            <div className="rounded-cc-sm border border-white/10 bg-white/[0.03] px-2 py-2">
              <dt className="text-slate-500">Security</dt>
              <dd className="mt-0.5 font-medium text-violet-300">
                {securityKeys.length > 0 ? `+${formatSar(estimate.securityMonthlySar)}` : "—"}
              </dd>
            </div>
          </dl>
        )}
        {compact && (
          <p className="shrink-0 text-xs text-slate-500">
            {moduleKeys.length} modules · {securityKeys.length} security
          </p>
        )}
      </div>

      {!compact && (
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Indicative pricing (excl. VAT) — 15% VAT applied at invoice. Totals recalculate as you change
          selections; binding commercial terms are confirmed after discovery and blueprint review.
        </p>
      )}

      {showSubmit && onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="cc-btn-primary mt-4 w-full"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-cc-spin-slow rounded-full border-2 border-white/30 border-t-white" />
              Submitting…
            </span>
          ) : (
            "Submit request →"
          )}
        </button>
      )}
    </div>
  );
}
