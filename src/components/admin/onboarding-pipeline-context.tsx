import Link from "next/link";
import { BLUEPRINT_RUNTIME_PREP_NAV_LABEL } from "@/lib/constants/tenant-provisioning-wording";
import { routes } from "@/lib/routes";
import {
  operatorNextAction,
  resolveOperatorLifecycleBucket,
  type OperatorPipelineInput,
} from "@/lib/operator-onboarding-lifecycle";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type OnboardingPipelineContextProps = {
  requestId: string;
  status: ImplementationRequestStatus;
  blueprintId: string | null;
  tenantSlug: string | null;
  discoveryAvailable: boolean;
  /** Highlight current workspace in the strip (optional). */
  current?: "request" | "discovery" | "org_intel" | "blueprint" | "readiness" | "go_live" | "tenant";
  compact?: boolean;
  className?: string;
};

type NavItem = {
  key: OnboardingPipelineContextProps["current"];
  label: string;
  href: string | null;
};

function buildNavItems(props: OnboardingPipelineContextProps): NavItem[] {
  const { requestId, blueprintId, tenantSlug, discoveryAvailable } = props;
  const d = routes.discovery(requestId);
  const b = blueprintId ? routes.blueprint(blueprintId) : null;

  return [
    { key: "request", label: "Request", href: routes.admin.request(requestId) },
    {
      key: "discovery",
      label: "Discovery",
      href: discoveryAvailable ? d.organization : null,
    },
    {
      key: "org_intel",
      label: "Org intel",
      href: discoveryAvailable ? d.organizationModel : null,
    },
    { key: "blueprint", label: "Blueprint", href: b?.overview ?? null },
    { key: "readiness", label: "Readiness", href: b?.readiness ?? null },
    { key: "go_live", label: BLUEPRINT_RUNTIME_PREP_NAV_LABEL, href: b?.goLive ?? null },
    {
      key: "tenant",
      label: "Tenant",
      href: tenantSlug ? routes.tenant(tenantSlug).dashboard : null,
    },
  ];
}

/** Compact operator pipeline bridge — request → discovery → blueprint → tenant. */
export function OnboardingPipelineContext({
  requestId,
  status,
  blueprintId,
  tenantSlug,
  discoveryAvailable,
  current,
  compact = false,
  className = "",
}: OnboardingPipelineContextProps) {
  const pipelineInput: OperatorPipelineInput = {
    status,
    hasDiscoveryProfile: discoveryAvailable,
    hasBlueprint: Boolean(blueprintId),
    hasTenant: Boolean(tenantSlug),
  };
  const next = operatorNextAction({
    ...pipelineInput,
    requestId,
    blueprintId,
    tenantSlug,
  });
  const bucket = resolveOperatorLifecycleBucket(pipelineInput);
  const items = buildNavItems({
    requestId,
    status,
    blueprintId,
    tenantSlug,
    discoveryAvailable,
    current,
    compact,
  });

  return (
    <nav
      className={`cc-glass-card ${compact ? "!p-3" : "!p-4"} ${className}`.trim()}
      aria-label="Onboarding pipeline"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pipeline context
        </p>
        {!compact && (
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] text-cyan-200">
            {bucket.replace(/_/g, " ")}
          </span>
        )}
      </div>
      {!compact && (
        <p className="mt-1 text-xs text-slate-500">
          Next: <span className="text-slate-300">{next.label}</span>
          <span className="text-slate-600"> — {next.hint}</span>
        </p>
      )}
      <div className={`mt-3 flex flex-wrap gap-1.5 ${compact ? "mt-2" : ""}`}>
        {items.map((item) => {
          const isCurrent = current === item.key;
          const disabled = !item.href;
          const base =
            "rounded-md border px-2.5 py-1 text-xs font-medium transition";
          const active = "border-cyan-500/40 bg-cyan-500/10 text-cyan-100";
          const idle = "border-white/10 bg-white/[0.02] text-slate-400 hover:border-cyan-500/20 hover:text-cyan-200";
          const muted = "border-white/5 bg-transparent text-slate-600 cursor-not-allowed";

          if (disabled) {
            return (
              <span key={item.label} className={`${base} ${muted}`} title="Not available yet">
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`${base} ${isCurrent ? active : idle}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
