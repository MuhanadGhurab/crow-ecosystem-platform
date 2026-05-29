import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintProvisionForm } from "@/components/blueprint/blueprint-provision-form";
import { BlueprintPlanDiffPanel } from "@/components/blueprint/blueprint-plan-diff-panel";
import { GoLiveSubscriptionSection } from "@/components/blueprint/go-live-subscription-section";
import { BlueprintStatusBadge } from "@/components/admin/blueprint-status-badge";
import { EngineBadges } from "@/components/pipeline/engine-badges";
import { routes } from "@/lib/routes";
import { slugifyOrganization } from "@/lib/slugify";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { evaluateBlueprintSubscriptionReadiness } from "@/lib/services/subscription-readiness.service";
import { computeBlueprintPlanDiff } from "@/lib/services/blueprint-plan-diff.service";
import { resolveBlueprintPlanContext } from "@/lib/services/subscription-capability.service";
import {
  evaluateGroupedBlueprintReadiness,
  evaluatePreProvisionReadiness,
  isReadinessGateEnabled,
} from "@/lib/services/readiness.service";
import { evaluateDiscoveryBlueprintGate } from "@/lib/services/discovery-completion-gate.service";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import { OnboardingPipelineContext } from "@/components/admin/onboarding-pipeline-context";
import { industryLabel, moduleLabel } from "@/lib/catalog-labels";
import {
  BLUEPRINT_RUNTIME_PREP_PAGE_LEAD,
  BLUEPRINT_RUNTIME_PREP_PAGE_TITLE,
  BLUEPRINT_RUNTIME_PREP_TENANT_READY,
  TENANT_PROVISION_SUCCESS_HINT,
} from "@/lib/constants/tenant-provisioning-wording";
import { RUNTIME_PREP_BLOCKED_TITLE } from "@/lib/constants/runtime-readiness-wording";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function BlueprintGoLivePage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);
  if (!blueprint) notFound();

  const suggestedSlug = slugifyOrganization(blueprint.request.organizationName);
  const hasTenant = Boolean(blueprint.tenant);
  const sectorKey = resolveSectorTemplateKey({
    industry: blueprint.request.industry,
    moduleKeys: blueprint.modules.filter((m) => m.enabled).map((m) => m.moduleKey),
  });
  const enabledModules = blueprint.modules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const [grouped, preProvision, subscriptionReadiness, planContext, planDiff, discoveryGate] =
    await Promise.all([
      hasTenant ? null : evaluateGroupedBlueprintReadiness(blueprintId).catch(() => null),
      hasTenant ? null : evaluatePreProvisionReadiness(blueprintId).catch(() => null),
      evaluateBlueprintSubscriptionReadiness(blueprintId).catch(() => null),
      resolveBlueprintPlanContext(blueprintId).catch(() => null),
      computeBlueprintPlanDiff(blueprintId).catch(() => null),
      hasTenant
        ? null
        : evaluateDiscoveryBlueprintGate(blueprint.requestId).catch(() => null),
    ]);
  const gateEnabled = isReadinessGateEnabled();
  const uiBlockers = preProvision?.blockers ?? [];
  const b = routes.blueprint(blueprintId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <OnboardingPipelineContext
        requestId={blueprint.requestId}
        status={blueprint.request.status as ImplementationRequestStatus}
        blueprintId={blueprintId}
        tenantSlug={blueprint.tenant?.slug ?? null}
        discoveryAvailable={Boolean(blueprint.request.discoveryProfile)}
        current="go_live"
      />

      <header className="cc-go-live-hero">
        <span className="cc-star-badge">Runtime preparation</span>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">
          {BLUEPRINT_RUNTIME_PREP_PAGE_TITLE}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{BLUEPRINT_RUNTIME_PREP_PAGE_LEAD}</p>
        <EngineBadges className="mt-4" />
      </header>

      <section className="cc-glass-card flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">Blueprint</span>
        <BlueprintStatusBadge status={blueprint.status} />
      </section>

      {hasTenant && blueprint.tenant ? (
        <section className="cc-go-live-hero">
          <p className="text-sm font-medium text-teal-300">{BLUEPRINT_RUNTIME_PREP_TENANT_READY}</p>
          <p className="mt-2 text-sm text-slate-400">{TENANT_PROVISION_SUCCESS_HINT}</p>
          <p className="mt-2 text-xs text-slate-500">
            Production remains F23-gated. Re-provisioning the same blueprint slug is not required.
          </p>
          <p className="mt-3 font-mono text-2xl text-cyan-300">/{blueprint.tenant.slug}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={routes.tenant(blueprint.tenant.slug).dashboard}
              className="cc-btn-primary text-sm"
            >
              Open CEM dashboard →
            </Link>
            <Link
              href={routes.tenant(blueprint.tenant.slug).logistics}
              className="cc-btn-secondary text-sm"
            >
              Logistics hub
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="cc-glass-card space-y-3 text-sm text-slate-300">
            <h3 className="text-sm font-medium text-cyan-400">Staging runtime scope</h3>
            <p className="text-xs text-slate-500">
              One tenant per blueprint. Slug must be unique; existing tenants are linked, not
              duplicated.
            </p>
            <dl className="cc-meta-dl !border-0 !bg-transparent !p-0 text-xs">
              <div>
                <dt className="text-slate-500">Organization</dt>
                <dd>{blueprint.request.organizationName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Suggested slug</dt>
                <dd className="font-mono text-cyan-300">/{suggestedSlug}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Industry / sector</dt>
                <dd>
                  {industryLabel(blueprint.request.industry)} · sector{" "}
                  <span className="font-mono text-slate-400">{sectorKey}</span>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">CEM modules</dt>
                <dd>
                  {enabledModules.length
                    ? enabledModules.map((k) => moduleLabel(k)).join(", ")
                    : "None enabled on blueprint"}
                </dd>
              </div>
              {planContext && (
                <div>
                  <dt className="text-slate-500">Plan (advisory)</dt>
                  <dd>{planContext.planDisplayName}</dd>
                </div>
              )}
            </dl>
            {discoveryGate && discoveryGate.warnings.length > 0 && (
              <ul className="space-y-1 text-xs text-amber-100/90">
                {discoveryGate.warnings.slice(0, 4).map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="cc-glass-card space-y-2 text-sm text-slate-300">
            <h3 className="text-sm font-medium text-white">Pre-provision checklist</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-slate-400">
              <li>Client discovery completed and reviewed by ProCrow</li>
              <li>Blueprint approved (not draft) for runtime preparation</li>
              <li>Org intelligence accepted (recommended) for CEM structure seed</li>
              <li>Required readiness checks green; recommended checks may stay open</li>
              <li>Slug confirmed unique — provision fails if slug already exists</li>
              <li>CyberCrow baseline + SAREA personas seeded on first provision only</li>
            </ul>
            <Link
              href={routes.discovery(blueprint.requestId).summary}
              className="inline-block text-xs text-cyan-400 hover:text-cyan-300"
            >
              Discovery summary →
            </Link>
          </section>

          {subscriptionReadiness && planContext && (
            <GoLiveSubscriptionSection
              readiness={subscriptionReadiness}
              planContext={planContext}
            />
          )}
          {planDiff && <BlueprintPlanDiffPanel diff={planDiff} />}
          <Link
            href={b.readiness}
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            Review runtime readiness checklist →
          </Link>
          {gateEnabled && (
            <p className="text-xs text-slate-500">
              Readiness gate enabled (<code className="text-cyan-400">GO_LIVE_READINESS_GATE=true</code>
              ).
            </p>
          )}
          {grouped && !grouped.canProvision && (
            <section className="rounded-lg border border-amber-500/25 bg-amber-950/15 p-4 text-sm text-amber-100/90">
              <p className="font-medium text-amber-200">{RUNTIME_PREP_BLOCKED_TITLE}</p>
              <p className="mt-1 text-xs text-slate-400">
                {grouped.requiredPassed}/{grouped.requiredTotal} required checks passed ·{" "}
                <Link href={b.readiness} className="text-cyan-400 hover:text-cyan-300">
                  Open full checklist
                </Link>
              </p>
            </section>
          )}
          <BlueprintProvisionForm
            blueprintId={blueprintId}
            suggestedSlug={suggestedSlug}
            blockers={uiBlockers}
            warnings={preProvision?.warnings ?? []}
          />
        </>
      )}

      <ol className="cc-glass-card space-y-3 !p-5 text-sm text-slate-300">
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-cyan-400">01</span>
          Create organization + tenant slug
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-cyan-400">02</span>
          Seed departments, roles, workflows from discovery
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-violet-400">03</span>
          Initialize CyberCrow audit baseline
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-rose-400">04</span>
          Create SAREA personas with default layouts and rules
        </li>
      </ol>

      <Link href={b.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Blueprint overview
      </Link>
    </div>
  );
}
