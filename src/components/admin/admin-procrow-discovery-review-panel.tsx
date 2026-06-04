"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  acceptClientDiscoveryIntoBlueprintAction,
  requestClientDiscoveryChangesAction,
  startProCrowDiscoveryReviewAction,
  type ProcrowDiscoveryReviewActionResult,
} from "@/lib/actions/procrow-discovery-review";
import {
  discoveryStatusLabel,
  type ClientDiscoveryStep,
} from "@/lib/client-portal/client-discovery-contract";
import {
  canAcceptDiscoveryIntoBlueprint,
  canRequestProCrowDiscoveryChanges,
  canStartProCrowDiscoveryReview,
  PROCROW_DISCOVERY_ACCEPT_DISCLAIMER,
  PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST,
  type ProCrowDiscoveryReviewSnapshot,
} from "@/lib/procrow/procrow-discovery-review-contract";
import { moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";

const initial: ProcrowDiscoveryReviewActionResult | null = null;

const SECTION_LABELS: Record<ClientDiscoveryStep, string> = {
  company_size: "Company size",
  industry_template: "Industry",
  company_stage: "Company stage",
  departments: "Departments",
  roles: "Roles",
  modules: "Modules",
  workflows: "Workflows",
  security: "Security",
  sarea: "SAREA",
  review_submit: "Review & submit",
};

type Props = {
  snapshot: ProCrowDiscoveryReviewSnapshot | null;
};

export function AdminProcrowDiscoveryReviewPanel({ snapshot }: Props) {
  const [startState, startAction, startPending] = useActionState(
    startProCrowDiscoveryReviewAction,
    initial
  );
  const [changesState, changesAction, changesPending] = useActionState(
    requestClientDiscoveryChangesAction,
    initial
  );
  const [acceptState, acceptAction, acceptPending] = useActionState(
    acceptClientDiscoveryIntoBlueprintAction,
    initial
  );

  if (!snapshot) {
    return (
      <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-white">Client-led discovery review</h3>
        <p className="mt-3 text-sm text-slate-400">Request not found or discovery data unavailable.</p>
      </section>
    );
  }

  const canStart = canStartProCrowDiscoveryReview(snapshot);
  const canChanges = canRequestProCrowDiscoveryChanges(snapshot);
  const canAccept = canAcceptDiscoveryIntoBlueprint(snapshot);
  const accepted = snapshot.status === "accepted_into_blueprint";

  return (
    <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Client-led discovery review</h3>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-100">
          L6 ProCrow
        </span>
      </div>

      <p className="text-xs text-slate-500">{PROCROW_DISCOVERY_ACCEPT_DISCLAIMER}</p>

      {(startState?.ok === false ||
        changesState?.ok === false ||
        acceptState?.ok === false) && (
        <p className="cc-alert-warning text-sm" role="alert">
          {startState?.ok === false
            ? startState.error
            : changesState?.ok === false
              ? changesState.error
              : acceptState?.ok === false
                ? acceptState.error
                : null}
        </p>
      )}
      {(startState?.ok || changesState?.ok || acceptState?.ok) && (
        <p
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
          role="status"
        >
          {acceptState?.ok
            ? "Discovery accepted into blueprint input."
            : changesState?.ok
              ? "Change request sent to client."
              : "ProCrow review started."}
        </p>
      )}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Status</dt>
          <dd className="text-white">{discoveryStatusLabel(snapshot.status)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Blueprint input readiness</dt>
          <dd className={snapshot.blueprintInputReadiness.ready ? "text-emerald-300" : "text-amber-200"}>
            {snapshot.blueprintInputReadiness.detail}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Industry / stage / band</dt>
          <dd className="text-white">
            {snapshot.industryTemplate ?? "—"} · {snapshot.companyStageTemplate ?? "—"} ·{" "}
            {snapshot.employeeBand ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Client</dt>
          <dd className="text-white">
            {snapshot.clientName ?? "—"}
            {snapshot.clientEmail ? (
              <span className="block font-mono text-xs text-slate-400">{snapshot.clientEmail}</span>
            ) : null}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">Modules</dt>
          <dd className="text-white">
            {snapshot.selectedModules.length > 0
              ? snapshot.selectedModules.map((k) => moduleLabel(k)).join(", ")
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Departments / roles / workflows</dt>
          <dd className="text-white">
            {snapshot.departments.length} / {snapshot.roles.length} / {snapshot.workflows.length}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Security / SAREA</dt>
          <dd className="text-white text-xs">
            {snapshot.securityPreference ?? "—"} · {snapshot.sareaPreference ?? "—"}
          </dd>
        </div>
        {snapshot.clientNotes && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Client notes</dt>
            <dd className="text-slate-300 whitespace-pre-wrap">{snapshot.clientNotes}</dd>
          </div>
        )}
        {snapshot.submittedAt && (
          <div>
            <dt className="text-slate-500">Submitted</dt>
            <dd className="font-mono text-xs text-slate-300">{snapshot.submittedAt}</dd>
          </div>
        )}
        {snapshot.changeRequest && (
          <div className="sm:col-span-2 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
            <dt className="text-amber-200/90 text-xs font-semibold uppercase">Pending change request</dt>
            <dd className="mt-1 text-slate-300 text-sm whitespace-pre-wrap">
              {snapshot.changeRequest.message}
            </dd>
            <dd className="mt-1 text-xs text-slate-500">
              Sections: {snapshot.changeRequest.requestedSections.map((s) => SECTION_LABELS[s]).join(", ")}
            </dd>
          </div>
        )}
      </dl>

      {snapshot.recommendedOperatorActions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommended next
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
            {snapshot.recommendedOperatorActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-700/60 pt-4">
        {canStart && (
          <form action={startAction}>
            <input type="hidden" name="request_id" value={snapshot.requestId} />
            <button
              type="submit"
              disabled={startPending}
              className="cc-btn-primary text-sm disabled:opacity-50"
            >
              {startPending ? "Starting…" : "Start review"}
            </button>
          </form>
        )}

        {canChanges && (
          <details className="w-full">
            <summary className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300">
              Request changes from client
            </summary>
            <form action={changesAction} className="mt-3 space-y-3">
              <input type="hidden" name="request_id" value={snapshot.requestId} />
              <textarea
                name="message"
                required
                rows={4}
                maxLength={2000}
                placeholder="Describe what the client should revise…"
                className="cc-input w-full text-sm"
              />
              <fieldset className="space-y-2">
                <legend className="text-xs text-slate-500">Sections to revise</legend>
                <div className="flex flex-wrap gap-2">
                  {PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST.map((step) => (
                    <label
                      key={step}
                      className="flex items-center gap-1.5 rounded border border-slate-700 px-2 py-1 text-xs text-slate-300"
                    >
                      <input type="checkbox" name="sections" value={step} className="rounded" />
                      {SECTION_LABELS[step]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                type="submit"
                disabled={changesPending}
                className="cc-btn-secondary text-sm disabled:opacity-50"
              >
                {changesPending ? "Sending…" : "Request changes"}
              </button>
            </form>
          </details>
        )}

        {canAccept && (
          <form action={acceptAction}>
            <input type="hidden" name="request_id" value={snapshot.requestId} />
            <button
              type="submit"
              disabled={acceptPending}
              className="cc-btn-primary text-sm disabled:opacity-50"
            >
              {acceptPending ? "Accepting…" : "Accept into blueprint"}
            </button>
          </form>
        )}

        {accepted && (
          <div className="w-full space-y-2">
            <p className="text-sm text-emerald-300">
              Discovery accepted as official blueprint input
              {snapshot.acceptedAt ? ` · ${snapshot.acceptedAt}` : ""}.
            </p>
            {snapshot.blueprintId ? (
              <Link
                href={routes.blueprint(snapshot.blueprintId).overview}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Open blueprint overview →
              </Link>
            ) : (
              <Link
                href={routes.discovery(snapshot.requestId).organization}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Open ProCrow discovery workspace to generate blueprint draft →
              </Link>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600">
        Client portal (informational): /client/requests/{snapshot.requestId}/discovery
      </p>
    </section>
  );
}
