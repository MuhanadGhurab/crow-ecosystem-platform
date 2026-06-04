"use client";

import { useActionState, useState } from "react";
import {
  submitClientPackagePreferenceAction,
  type PricingPackagePreferenceActionResult,
} from "@/lib/actions/pricing-package-preference";
import {
  CLIENT_PACKAGE_CHANGE_LABELS,
  type ClientPackageChangeType,
  type PricingPackageEstimate,
} from "@/lib/pricing/pricing-package-contract";

const initial: PricingPackagePreferenceActionResult | null = null;

type Props = {
  requestId: string;
  estimate: PricingPackageEstimate;
};

export function ClientPricingPackagePanel({ requestId, estimate }: Props) {
  const [state, action, pending] = useActionState(submitClientPackagePreferenceAction, initial);
  const [notes, setNotes] = useState("");

  const rec = estimate.recommendation;

  return (
    <section className="cc-glass-card space-y-4 border-teal-500/15">
      <div>
        <h2 className="text-sm font-semibold text-teal-200">Recommended commercial package</h2>
        <p className="mt-2 text-sm text-slate-400">{estimate.discoverySourceNote}</p>
        <p className="mt-2 text-xs text-amber-200/80">{estimate.notFinalQuoteDisclaimer}</p>
      </div>

      <div className="rounded-lg border border-teal-500/25 bg-teal-500/5 p-3">
        <p className="text-xs uppercase tracking-wide text-teal-200/80">Recommended</p>
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
      </dl>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why recommended</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
          {estimate.signals.slice(0, 6).map((s) => (
            <li key={s.key}>
              <span className="text-slate-300">{s.label}:</span> {s.value}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-500">{estimate.finalQuoteRequiresProCrowReview}</p>

      {state?.ok === false && (
        <p className="cc-alert-warning text-sm" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
          role="status"
        >
          Package preference sent to ProCrow for review. This does not change final pricing or activate
          billing.
        </p>
      )}

      <form action={action} className="space-y-3 border-t border-white/5 pt-4">
        <input type="hidden" name="request_id" value={requestId} />
        <p className="text-xs text-slate-500">
          Tell ProCrow if the recommended package fits — or request a different direction. No payment or
          checkout.
        </p>
        <div className="flex flex-wrap gap-2">
          {estimate.packageChangeOptions.map((opt) => (
            <PackagePreferenceButton
              key={opt}
              changeType={opt}
              label={CLIENT_PACKAGE_CHANGE_LABELS[opt]}
              pending={pending}
            />
          ))}
        </div>
        <label className="block text-xs text-slate-500">
          Optional notes for ProCrow
          <textarea
            name="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-cc mt-1 w-full text-sm"
            placeholder="e.g. prefer fewer modules in year one…"
          />
        </label>
      </form>
    </section>
  );
}

function PackagePreferenceButton({
  changeType,
  label,
  pending,
}: {
  changeType: ClientPackageChangeType;
  label: string;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      name="change_type"
      value={changeType}
      disabled={pending}
      className="cc-btn-secondary text-xs disabled:opacity-50"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}
