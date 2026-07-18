import Link from "next/link";
import { DiscoveryMvpAdaptiveFieldForm } from "@/components/discovery/discovery-mvp-adaptive-field-form";
import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import type { DiscoveryMvpWorkspaceModel } from "@/lib/discovery/discovery-workspace-context";
import { routes } from "@/lib/routes";

const JOURNEY_LABELS: Record<string, string> = {
  NEW: "Build New",
  TRANSFORM: "Transform Existing",
};

const ORG_CONTEXT_LABELS: Record<string, string> = {
  NEW_BUSINESS: "New business",
  NEW_DIVISION: "New division",
  EXISTING_ORGANIZATION: "Existing organization",
  MODERNIZATION: "Modernization",
};

function asJourneyKind(value: string | null): RequestJourneyKind | null {
  return value === "NEW" || value === "TRANSFORM" ? value : null;
}

function asOrgContext(value: string | null): OrganizationContextKind | null {
  if (
    value === "NEW_BUSINESS" ||
    value === "NEW_DIVISION" ||
    value === "EXISTING_ORGANIZATION" ||
    value === "MODERNIZATION"
  ) {
    return value;
  }
  return null;
}

export function DiscoveryMvpWorkspaceShell({
  model,
  variant = "client",
}: {
  model: DiscoveryMvpWorkspaceModel;
  variant?: "client" | "operator";
}) {
  const journeyLabel = model.journeyKind
    ? (JOURNEY_LABELS[model.journeyKind] ?? model.journeyKind)
    : "Not captured on request brief";
  const orgLabel = model.organizationContext
    ? (ORG_CONTEXT_LABELS[model.organizationContext] ?? model.organizationContext)
    : "Not captured on request brief";

  return (
    <section
      className="cc-glass-card space-y-6"
      data-crow-discovery-mvp="d0-d7"
      data-evidence-mode={model.evidenceMode}
      data-blueprint-complete-blocked={model.blueprintCompleteBlocked ? "true" : "false"}
    >
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-cyan-400/90">
          Discovery MVP · D0–D7 foundation
        </p>
        <h2 className="text-lg font-semibold text-slate-100">Discovery workspace</h2>
        <p className="text-sm text-slate-400">{model.d0d2ScopeNote}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Linked request</p>
          <p className="mt-1 text-sm font-medium text-slate-100">
            {model.organizationName} · {model.referenceCode}
          </p>
          <Link
            href={
              variant === "client"
                ? routes.client.request(model.requestId)
                : routes.admin.request(model.requestId)
            }
            className="mt-2 inline-block text-xs text-teal-400 hover:text-teal-300"
          >
            Open request detail
          </Link>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Product Discovery status</p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{model.productStatusLabel}</p>
          <p className="mt-1 text-xs text-slate-500">
            Request DB: {model.requestStatus}
            {model.discoveryProfileStatus ? ` · Profile: ${model.discoveryProfileStatus}` : ""}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Journey kind</p>
          <p className="mt-1 text-sm text-slate-100" data-crow-journey-kind={model.journeyKind ?? "none"}>
            {journeyLabel}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">Organization context</p>
          <p
            className="mt-1 text-sm text-slate-100"
            data-crow-organization-context={model.organizationContext ?? "none"}
          >
            {orgLabel}
          </p>
        </div>
      </div>

      {!model.qualifiedForDiscovery && model.productStatus === "NOT_STARTED" && (
        <p className="text-sm text-amber-200/90">
          ProCrow must record <span className="font-medium">Qualified for Discovery</span> before
          Discovery handoff. Qualification does not grant tenant authority.
        </p>
      )}

      <div>
        <h3 className="text-sm font-medium text-slate-200">Stages 1–7 overview</h3>
        <p className="mt-1 text-xs text-slate-500">
          Stages 1–7 adaptive fields are active (local-first). Hosted persistence and Blueprint
          generation remain blocked.
        </p>
        <ol className="mt-3 space-y-2">
          {model.stages.map((stage) => (
            <li
              key={stage.key}
              className="flex gap-3 rounded-md border border-white/5 bg-black/10 px-3 py-2"
              data-crow-discovery-stage={stage.id}
            >
              <span className="text-xs font-semibold text-cyan-400/80">{stage.id}</span>
              <div>
                <p className="text-sm text-slate-200">{stage.title}</p>
                <p className="text-xs text-slate-500">{stage.summary}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-600">
                  Active (D7 local-first)
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <DiscoveryMvpAdaptiveFieldForm
        requestId={model.requestId}
        journeyKind={asJourneyKind(model.journeyKind)}
        organizationContext={asOrgContext(model.organizationContext)}
        variant={variant}
      />

      <div className="rounded-lg border border-dashed border-white/15 bg-black/10 p-3">
        <p className="text-xs font-medium text-slate-300">Evidence references</p>
        <p className="mt-1 text-sm text-slate-400" data-crow-evidence-mode="refs_only">
          Stage 6 captures text names, types, descriptions, and availability only. File uploads are
          not part of Discovery MVP.
        </p>
      </div>

      {model.blueprintCompleteBlocked && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3">
          <p className="text-xs font-medium text-amber-200">Blueprint generation blocked (D0–D7)</p>
          <p className="mt-1 text-sm text-amber-100/80">
            Completing Discovery to create a Blueprint remains out of scope. D6–D7 provide local
            handoff and review preparation only — no tenant build, payment, or CroAI from Discovery.
          </p>
        </div>
      )}

      <ul className="space-y-1 border-t border-white/10 pt-4">
        {model.nonClaims.map((line) => (
          <li key={line} className="text-xs text-slate-500">
            · {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
