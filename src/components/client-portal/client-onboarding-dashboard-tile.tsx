import Link from "next/link";

import type { ClientOnboardingDashboardTile } from "@/lib/client-portal/client-onboarding-contract";

type Props = {
  tile: ClientOnboardingDashboardTile;
};

export function ClientOnboardingDashboardTile({ tile }: Props) {
  return (
    <section className="cc-glass-card flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Onboarding
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-100">{tile.statusLabel}</p>
        {tile.organizationName && (
          <p className="mt-1 text-sm text-slate-500">{tile.organizationName}</p>
        )}
        <p className="mt-2 text-sm text-slate-400">
          <span className="text-slate-500">Current:</span> {tile.currentStepLabel}
        </p>
        <p className="mt-1 text-xs text-slate-600">{tile.tenantRuntimeLabel}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm text-slate-400">{tile.clientNextAction}</p>
        <Link
          href={tile.link}
          className="mt-3 inline-flex text-sm font-medium text-teal-300 hover:text-teal-200"
        >
          Open onboarding tracker →
        </Link>
      </div>
    </section>
  );
}
