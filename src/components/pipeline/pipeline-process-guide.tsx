import Link from "next/link";
import { routes } from "@/lib/routes";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

const STEPS: { status: ImplementationRequestStatus; label: string; hint: string }[] = [
  { status: "PENDING_REVIEW", label: "Review", hint: "Accept and start discovery" },
  { status: "UNDER_DISCOVERY", label: "Discovery", hint: "Complete org, modules, security" },
  { status: "BLUEPRINT_BUILD", label: "Blueprint", hint: "Pricing, readiness, proposal" },
  { status: "GO_LIVE", label: "Live", hint: "Tenant provisioned — hand off to CEM" },
];

function stepIndex(status: ImplementationRequestStatus): number {
  if (status === "PENDING_REVIEW") return 0;
  if (status === "UNDER_DISCOVERY") return 1;
  if (status === "BLUEPRINT_BUILD" || status === "APPROVED") return 2;
  if (status === "GO_LIVE" || status === "TENANT_PROVISIONING" || status === "SECURITY_INIT" || status === "SAREA_INIT") return 3;
  return -1;
}

interface PipelineProcessGuideProps {
  status: ImplementationRequestStatus;
  requestId?: string;
  blueprintId?: string | null;
  tenantSlug?: string | null;
}

/** Compact delivery path — highlights where this request sits in Request → Discovery → Blueprint → Live. */
export function PipelineProcessGuide({
  status,
  requestId,
  blueprintId,
  tenantSlug,
}: PipelineProcessGuideProps) {
  const current = stepIndex(status);
  const nextHref =
    current === 0 && requestId
      ? routes.discovery(requestId).organization
      : current === 1 && requestId
        ? routes.discovery(requestId).summary
        : current === 2 && blueprintId
          ? routes.blueprint(blueprintId).readiness
          : tenantSlug
            ? routes.tenant(tenantSlug).dashboard
            : null;

  const nextLabel =
    current === 0
      ? "Start discovery →"
      : current === 1
        ? "Discovery summary →"
        : current === 2
          ? "Readiness & go-live →"
          : tenantSlug
            ? "Tenant dashboard →"
            : null;

  return (
    <section className="cc-glass-card space-y-4" aria-label="Delivery process">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-cyan-400">Product process</h3>
        {nextHref && nextLabel && (
          <Link href={nextHref} className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
            {nextLabel}
          </Link>
        )}
      </div>
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((step, i) => {
          const done = current > i;
          const active = current === i;
          return (
            <li
              key={step.status}
              className={`rounded-lg border px-3 py-2 text-xs ${
                active
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
                  : done
                    ? "border-teal-500/20 bg-teal-500/5 text-teal-200"
                    : "border-white/10 bg-white/[0.02] text-slate-500"
              }`}
            >
              <span className="font-medium">{step.label}</span>
              {active && <span className="mt-0.5 block text-[10px] text-slate-400">{step.hint}</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
