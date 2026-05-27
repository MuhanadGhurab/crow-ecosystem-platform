import Link from "next/link";

import type { ClientOnboardingTracker } from "@/lib/client-portal/client-onboarding-contract";
import { routes } from "@/lib/routes";

function statusBadgeClass(status: string): string {
  switch (status) {
    case "complete":
      return "border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "current":
      return "border-amber-500/35 bg-amber-500/10 text-amber-100";
    case "blocked":
      return "border-rose-500/30 bg-rose-500/10 text-rose-200";
    case "skipped":
      return "border-slate-600/40 bg-slate-800/40 text-slate-500";
    default:
      return "border-slate-600/40 bg-slate-900/40 text-slate-400";
  }
}

function overallStatusClass(status: ClientOnboardingTracker["overallStatus"]): string {
  switch (status) {
    case "tenant_ready":
      return "text-teal-200";
    case "waiting_for_scope_approval":
    case "missing_information":
      return "text-amber-200";
    case "paused":
      return "text-rose-200";
    default:
      return "text-slate-200";
  }
}

type Props = {
  tracker: ClientOnboardingTracker;
  showRequestPicker?: boolean;
};

export function ClientOnboardingTrackerPanel({ tracker, showRequestPicker }: Props) {
  return (
    <div className="space-y-8">
      <section className="cc-glass-card">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Onboarding status
        </p>
        <h2 className={`mt-2 text-2xl font-semibold ${overallStatusClass(tracker.overallStatus)}`}>
          {tracker.statusLabel}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {tracker.organizationName} · {tracker.referenceCode}
        </p>
        {tracker.approvalSummary.scopeApproved && tracker.approvalSummary.clientApprovedAt && (
          <p className="mt-2 text-xs text-teal-300/90">
            Scope approved{" "}
            {new Date(tracker.approvalSummary.clientApprovedAt).toLocaleString()} — ProCrow review
            continues; not production launch.
          </p>
        )}
        <p className="mt-4 text-sm text-slate-500">{tracker.tenantRuntimeLabel}</p>
      </section>

      {tracker.currentStep && (
        <section className="cc-glass-card border-amber-500/20">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-200/80">
            Current step
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">{tracker.currentStep.label}</h3>
          <p className="mt-2 text-sm text-slate-400">{tracker.currentStep.description}</p>
          {tracker.currentStep.blockedReason && (
            <p className="mt-2 text-sm text-amber-200/90">{tracker.currentStep.blockedReason}</p>
          )}
          {tracker.currentStep.relatedRoute && (
            <Link
              href={tracker.currentStep.relatedRoute}
              className="mt-4 inline-flex text-sm font-medium text-teal-300 hover:text-teal-200"
            >
              Open related page →
            </Link>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card">
          <h3 className="text-sm font-semibold text-slate-200">Your next actions</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
            {tracker.clientNextActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
        <section className="cc-glass-card">
          <h3 className="text-sm font-semibold text-slate-200">ProCrow is handling</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-500">
            {tracker.procrowNextActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      </div>

      {tracker.missingInformation.length > 0 && (
        <section className="cc-glass-card border-amber-500/20">
          <h3 className="text-sm font-semibold text-amber-100">Missing information</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
            {tracker.missingInformation.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="cc-glass-card">
        <h3 className="text-sm font-semibold text-slate-200">Onboarding timeline</h3>
        <ol className="mt-6 space-y-4">
          {tracker.steps.map((step) => (
            <li
              key={step.key}
              className="flex gap-4 rounded-lg border border-slate-800/80 bg-slate-950/40 p-4"
            >
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(step.status)}`}
              >
                {step.status.replace("_", " ")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-200">{step.label}</p>
                  <span className="text-xs text-slate-500">· {step.owner}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                {step.blockedReason && (
                  <p className="mt-1 text-xs text-amber-200/80">{step.blockedReason}</p>
                )}
                {step.relatedRoute && (
                  <Link
                    href={step.relatedRoute}
                    className="mt-2 inline-block text-xs text-teal-400 hover:text-teal-300"
                  >
                    Open →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cc-glass-card border-slate-700/60">
        <h3 className="text-sm font-semibold text-slate-300">Trust & safety</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-500">
          {tracker.trustNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        <Link href={routes.client.requests} className="text-teal-400 hover:text-teal-300">
          Requests
        </Link>
        <Link href={routes.client.proposals} className="text-teal-400 hover:text-teal-300">
          Proposals
        </Link>
        {tracker.blueprintId ? (
          <Link
            href={routes.client.blueprint(tracker.blueprintId)}
            className="text-teal-400 hover:text-teal-300"
          >
            Blueprint
          </Link>
        ) : null}
        <Link href={routes.client.company} className="text-teal-400 hover:text-teal-300">
          Company
        </Link>
        <Link href={routes.client.profile} className="text-teal-400 hover:text-teal-300">
          Profile
        </Link>
      </section>

      {showRequestPicker && (
        <p className="text-xs text-slate-600">
          Showing onboarding for your most recently updated linked request. Additional requests
          appear on each request detail page.
        </p>
      )}
    </div>
  );
}
