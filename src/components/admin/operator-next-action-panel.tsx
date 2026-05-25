import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  operatorAdvisoryWarnings,
  operatorHumanStatusLabel,
  operatorNextAction,
  OPERATOR_BUCKET_PHASE_MEANING,
  OPERATOR_BUCKET_STYLES,
  resolveOperatorLifecycleBucket,
  type OperatorPipelineInput,
} from "@/lib/operator-onboarding-lifecycle";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export function OperatorNextActionPanel({
  requestId,
  status,
  blueprintId,
  tenantSlug,
  discoveryAvailable,
}: {
  requestId: string;
  status: ImplementationRequestStatus;
  blueprintId: string | null;
  tenantSlug: string | null;
  discoveryAvailable: boolean;
}) {
  const pipelineInput: OperatorPipelineInput = {
    status,
    hasDiscoveryProfile: discoveryAvailable,
    hasBlueprint: Boolean(blueprintId),
    hasTenant: Boolean(tenantSlug),
  };
  const bucket = resolveOperatorLifecycleBucket(pipelineInput);
  const humanLabel = operatorHumanStatusLabel(pipelineInput);
  const next = operatorNextAction({ ...pipelineInput, requestId, blueprintId, tenantSlug });
  const warnings = operatorAdvisoryWarnings(pipelineInput);
  const phase = OPERATOR_BUCKET_PHASE_MEANING[bucket];

  const primaryHref =
    bucket === "pending_review" && discoveryAvailable
      ? routes.discovery(requestId).organization
      : bucket === "discovery_in_progress"
        ? routes.discovery(requestId).summary
        : bucket === "ready_go_live" && blueprintId
          ? routes.blueprint(blueprintId).goLive
          : bucket === "blueprint_pending" && blueprintId
            ? routes.blueprint(blueprintId).overview
            : tenantSlug
              ? routes.tenant(tenantSlug).dashboard
              : routes.admin.request(requestId);

  return (
    <section className="cc-glass-card space-y-4 border border-cyan-500/15 !p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-cyan-400">Operator next action</h3>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${OPERATOR_BUCKET_STYLES[bucket]}`}
        >
          {humanLabel}
        </span>
      </div>
      <p className="text-sm text-slate-400">{phase}</p>
      <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
        <p className="font-medium text-white">{next.label}</p>
        <p className="mt-1 text-xs text-slate-500">{next.hint}</p>
        <Link href={primaryHref} className="mt-3 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200">
          Continue →
        </Link>
      </div>
      {warnings.length > 0 && (
        <ul className="space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <p className="text-xs text-slate-600">
        Raw status: <span className="font-mono text-slate-500">{status}</span>
      </p>
    </section>
  );
}
