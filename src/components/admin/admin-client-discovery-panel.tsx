import Link from "next/link";
import {
  discoveryStatusLabel,
  clientDiscoveryStepHref,
} from "@/lib/client-portal/client-discovery-contract";
import type { ClientDiscoveryAdminSummary } from "@/lib/services/client-discovery.service";
import { routes } from "@/lib/routes";

type Props = {
  requestId: string;
  summary: ClientDiscoveryAdminSummary | null;
};

export function AdminClientDiscoveryPanel({ requestId, summary }: Props) {
  const submitted =
    summary?.status === "submitted_for_procrow_review" ||
    summary?.status === "procrow_reviewing" ||
    summary?.status === "accepted_into_blueprint";

  return (
    <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Client-led discovery</h3>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-100">
          L4 advisory
        </span>
      </div>

      {!summary || summary.status === "not_started" ? (
        <p className="mt-3 text-sm text-slate-400">
          Client discovery not submitted yet. The client can complete guided discovery in the Client
          Portal before you finalize the blueprint.
        </p>
      ) : (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="text-white">{discoveryStatusLabel(summary.status)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Industry template</dt>
            <dd className="text-white">{summary.industryTemplate ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Company stage</dt>
            <dd className="text-white">{summary.companyStageTemplate ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Employee band</dt>
            <dd className="text-white">{summary.employeeBand ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Modules selected</dt>
            <dd className="text-white">{summary.moduleCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Departments / roles / workflows</dt>
            <dd className="text-white">
              {summary.departmentCount} / {summary.roleCount} / {summary.workflowCount}
            </dd>
          </div>
          {summary.submittedAt && (
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Submitted at</dt>
              <dd className="font-mono text-xs text-slate-300">{summary.submittedAt}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={routes.discovery(requestId).organization}
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          Open ProCrow discovery workspace →
        </Link>
        {submitted && (
          <span className="text-sm text-emerald-300/90">Ready for ProCrow review</span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Client portal path (informational): {clientDiscoveryStepHref(requestId, "review_submit")}
      </p>
    </section>
  );
}
