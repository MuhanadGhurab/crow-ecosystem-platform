import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { LifecycleStrip } from "@/components/pipeline/lifecycle-strip";
import { PipelineProcessGuide } from "@/components/pipeline/pipeline-process-guide";
import { routes } from "@/lib/routes";
import type { LighthousePipelineSnapshot } from "@/lib/services/lighthouse-pipeline.service";

export function AdminLighthousePipelineCard({
  pipeline,
}: {
  pipeline: LighthousePipelineSnapshot;
}) {
  return (
    <section className="cc-glass-card space-y-5 border border-cyan-500/20 !p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Lighthouse pipeline
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-white">
            {pipeline.organizationName}
          </h2>
          <p className="mt-0.5 font-mono text-sm text-slate-400">{pipeline.referenceCode}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <RequestStatusBadge status={pipeline.status} />
          <Link
            href={routes.admin.request(pipeline.requestId)}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            Open request detail →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Request status
          </p>
          <p className="mt-1 text-base font-semibold text-white">{pipeline.statusLabel}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">{pipeline.status}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Current step toward runtime readiness
          </p>
          <p className="mt-1 text-base font-semibold text-white">
            {pipeline.currentLifecycleStep}
          </p>
          {pipeline.isGoLive ? (
            <p className="mt-1 text-sm text-green-300">
              Staging tenant prepared — production remains F23 / Go/No-Go gated.
            </p>
          ) : pipeline.nextLifecycleStep ? (
            <p className="mt-1 text-sm text-slate-400">
              Next: <span className="text-cyan-300">{pipeline.nextLifecycleStep}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Final lifecycle step reached.</p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Full platform lifecycle
        </p>
        <LifecycleStrip status={pipeline.status} />
      </div>

      <PipelineProcessGuide
        status={pipeline.status}
        requestId={pipeline.requestId}
        blueprintId={pipeline.blueprintId}
        tenantSlug={pipeline.tenantSlug}
      />
    </section>
  );
}
