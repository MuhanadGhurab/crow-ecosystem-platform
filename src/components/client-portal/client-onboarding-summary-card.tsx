import Link from "next/link";

import type { ClientOnboardingTracker } from "@/lib/client-portal/client-onboarding-contract";
import { routes } from "@/lib/routes";

type Props = {
  tracker: ClientOnboardingTracker | null;
};

export function ClientOnboardingSummaryCard({ tracker }: Props) {
  if (!tracker) return null;

  return (
    <section className="cc-glass-card border-slate-700/50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Onboarding readiness
          </p>
          <p className="mt-1 font-semibold text-slate-200">{tracker.statusLabel}</p>
          {tracker.currentStep && (
            <p className="mt-1 text-sm text-slate-500">Next: {tracker.currentStep.label}</p>
          )}
        </div>
        <Link
          href={routes.client.onboarding}
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          Full tracker →
        </Link>
      </div>
      <p className="mt-3 text-xs text-slate-600">
        ProCrow owns provisioning and go-live. Approval does not start production or billing.
      </p>
    </section>
  );
}
