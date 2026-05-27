import type { ClientOnboardingTracker } from "@/lib/client-portal/client-onboarding-contract";

type Props = {
  tracker: ClientOnboardingTracker | null;
};

export function AdminOnboardingReadinessPanel({ tracker }: Props) {
  if (!tracker) {
    return (
      <section className="cc-glass-card border-slate-700/60">
        <h2 className="text-sm font-semibold text-slate-300">Onboarding readiness</h2>
        <p className="mt-2 text-sm text-slate-500">
          Derived onboarding tracker unavailable for this request in the current environment.
        </p>
      </section>
    );
  }

  return (
    <section className="cc-glass-card border-slate-700/60">
      <h2 className="text-sm font-semibold text-slate-200">Onboarding readiness (derived)</h2>
      <p className="mt-1 text-lg font-medium text-teal-200/90">{tracker.statusLabel}</p>
      {tracker.currentStep && (
        <p className="mt-2 text-sm text-slate-400">
          Current step: <span className="text-slate-300">{tracker.currentStep.label}</span> (
          {tracker.currentStep.owner})
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">{tracker.tenantRuntimeLabel}</p>
      {tracker.missingInformation.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-200/80">
            Missing / blocked
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-500">
            {tracker.missingInformation.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          ProCrow next actions
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
          {tracker.procrowNextActions.slice(0, 4).map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-slate-600">
        Tenant provisioning is manual — this panel does not create tenants or enable production.
      </p>
    </section>
  );
}
