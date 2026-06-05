import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminClientReviewFeedbackPanel } from "@/components/admin/admin-client-review-feedback-panel";
import { AdminProcrowDiscoveryReviewPanel } from "@/components/admin/admin-procrow-discovery-review-panel";
import { AdminDiscoveryIntelligencePanel } from "@/components/admin/admin-discovery-intelligence-panel";
import { AdminOnboardingReadinessPanel } from "@/components/admin/admin-onboarding-readiness-panel";
import { OperatorE2eChecklistPanel } from "@/components/admin/operator-e2e-checklist-panel";
import { OperatorNextActionPanel } from "@/components/admin/operator-next-action-panel";
import { PromoteClientForm } from "@/components/admin/promote-client-form";
import { RequestAdminActions } from "@/components/admin/request-admin-actions";
import { RequestPipelineLinks } from "@/components/admin/request-pipeline-links";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { PricingHeroPanel } from "@/components/blueprint/commercial/pricing-hero-panel";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { PipelineProcessGuide } from "@/components/pipeline/pipeline-process-guide";
import { ProCrowBlockerList } from "@/components/procrow/procrow-blocker-list";
import { ProCrowCommercialLifecycleCompact } from "@/components/procrow/procrow-commercial-lifecycle-compact";
import {
  ProCrowContextLinkGrid,
  type ProCrowContextLink,
} from "@/components/procrow/procrow-context-link-grid";
import { ProCrowRequestLifecyclePanel } from "@/components/procrow/procrow-request-lifecycle-panel";
import { ProCrowStageSummaryCard } from "@/components/procrow/procrow-stage-summary-card";
import { ProCrowTenantRuntimeFraming } from "@/components/procrow/procrow-tenant-runtime-framing";
import { ProCrowWorkbenchPageHeader } from "@/components/procrow/procrow-workbench-page-header";
import { ProCrowWorkbenchSection } from "@/components/procrow/procrow-workbench-section";
import {
  industryLabel,
  moduleLabel,
  planLabel,
  securityPackageLabel,
} from "@/lib/catalog-labels";
import {
  operatorAdvisoryWarnings,
  operatorHumanStatusLabel,
  resolveOperatorLifecycleBucket,
  type OperatorPipelineInput,
} from "@/lib/operator-onboarding-lifecycle";
import { getRequestDeptContextFromRow } from "@/lib/pipeline/request-dept-context";
import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";
import { routes } from "@/lib/routes";
import {
  formatSar,
  getRequestPricingEstimate,
  proposalStatusLabel,
} from "@/lib/services/commercial.service";
import { buildClientOnboardingTrackerForAdmin } from "@/lib/services/client-onboarding.service";
import { buildProCrowDiscoveryReviewSnapshot } from "@/lib/services/procrow-discovery-review.service";
import { buildPricingPackageEstimateForRequest } from "@/lib/services/pricing-package-recommendation.service";
import { buildCyberCrowTrustPreparationPreviewForRequest } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceMappingPreviewForRequest } from "@/lib/services/sarea-experience-mapping.service";
import { AdminProcrowPricingPackagePanel } from "@/components/admin/admin-procrow-pricing-package-panel";
import { AdminCybercrowTrustReadinessPanel } from "@/components/admin/admin-cybercrow-trust-readiness-panel";
import { AdminSareaExperienceMappingPanel } from "@/components/admin/admin-sarea-experience-mapping-panel";
import { getImplementationRequest } from "@/lib/services/implementation-request.service";
import { isUseMockData } from "@/lib/mock/env";
import { getMockProposalApprovalOverrides, MOCK_PROPOSAL_TOKEN } from "@/lib/mock/blueprint";
import { MOCK_PIPELINE_REQUESTS, MOCK_PRICING_ESTIMATE } from "@/lib/mock/pipeline";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export const dynamic = "force-dynamic";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const mockRow = MOCK_PIPELINE_REQUESTS.find((m) => m.id === requestId);
  let request = isUseMockData()
    ? null
    : await getImplementationRequest(requestId).catch(() => null);
  let estimate =
    request && !isUseMockData()
      ? await getRequestPricingEstimate(requestId).catch(() => null)
      : null;

  if (isUseMockData()) {
    if (!mockRow) notFound();
    estimate = MOCK_PRICING_ESTIMATE;
  } else if (!request && mockRow) {
    estimate = MOCK_PRICING_ESTIMATE;
  }

  if (!request && !mockRow) notFound();

  const status = (request?.status ?? mockRow!.status) as ImplementationRequestStatus;
  const orgName = request?.organizationName ?? mockRow!.organizationName;
  const refCode = request?.referenceCode ?? mockRow!.referenceCode;
  const planKey = request?.requestedPlans[0]?.planKey ?? mockRow?.planKey;
  const primaryContact = request?.contacts.find((c) => c.isPrimary) ?? request?.contacts[0];
  const mockBlueprintId = mockRow?.blueprintId ?? null;
  const mockApprovalOverrides = isUseMockData() ? getMockProposalApprovalOverrides() : null;
  const blueprint =
    request?.enterpriseBlueprint ??
    (mockBlueprintId
      ? {
          id: mockBlueprintId,
          proposalStatus: mockApprovalOverrides?.proposalStatus ?? ("SENT" as const),
          proposalToken: MOCK_PROPOSAL_TOKEN,
          clientApprovedAt: mockApprovalOverrides?.clientApprovedAt ?? null,
        }
      : null);
  const proposalStatus =
    request?.enterpriseBlueprint?.proposalStatus ?? blueprint?.proposalStatus ?? null;
  const clientApprovedAt =
    request?.enterpriseBlueprint?.clientApprovedAt ?? blueprint?.clientApprovedAt ?? null;
  const adminOnboardingTracker = await buildClientOnboardingTrackerForAdmin(requestId);
  const procrowDiscoveryReview = !isUseMockData()
    ? await buildProCrowDiscoveryReviewSnapshot(requestId).catch(() => null)
    : null;
  const pricingPackageEstimate = !isUseMockData()
    ? await buildPricingPackageEstimateForRequest(requestId).catch(() => null)
    : null;
  const cybercrowTrustPreview = !isUseMockData()
    ? await buildCyberCrowTrustPreparationPreviewForRequest(requestId).catch(() => null)
    : null;
  const sareaExperiencePreview = !isUseMockData()
    ? await buildSareaExperienceMappingPreviewForRequest(requestId).catch(() => null)
    : null;
  const tenantSlug = request?.enterpriseBlueprint?.tenant?.slug ?? null;
  const blueprintId = request?.enterpriseBlueprint?.id ?? mockBlueprintId;
  const discoveryAvailable = Boolean(request?.discoveryProfile ?? mockRow?.discoveryAvailable);
  const discoveryHref = mockRow?.discoveryAvailable ? routes.discovery(requestId).organization : null;

  const dept = request
    ? getRequestDeptContextFromRow({
        status: request.status,
        requestedSecurityPkgs: request.requestedSecurityPkgs,
        requestedModules: request.requestedModules,
        discoveryProfile: request.discoveryProfile,
      })
    : getRequestDeptContextFromRow({
        status,
        requestedSecurityPkgs: mockRow?.hasSecurity ? [1] : [],
        requestedModules: mockRow?.hasModules ? [1] : [],
        discoveryProfile:
          mockRow?.status === "BLUEPRINT_BUILD"
            ? {
                answers: [
                  {
                    sectionKey: "experience",
                    questionKey: "sareaPackageKey",
                    valueJson: "professional",
                  },
                ],
              }
            : null,
      });

  const pipelineInput: OperatorPipelineInput = {
    status,
    hasDiscoveryProfile: discoveryAvailable,
    hasBlueprint: Boolean(blueprintId),
    hasTenant: Boolean(tenantSlug),
  };
  const blockers = operatorAdvisoryWarnings(pipelineInput);
  const humanLabel = operatorHumanStatusLabel(pipelineInput);
  const bucket = resolveOperatorLifecycleBucket(pipelineInput);

  const contextLinks: ProCrowContextLink[] = [
    { label: "Operator queue", href: routes.admin.queue },
    { label: "All requests", href: routes.admin.requests },
    { label: "Go / No-Go", href: routes.admin.goNoGo },
  ];
  if (discoveryHref) {
    contextLinks.push({ label: "Discovery", href: discoveryHref });
  }
  if (blueprintId) {
    contextLinks.push({
      label: "Blueprint",
      href: routes.blueprint(blueprintId).overview,
    });
  }
  const tenantId = request?.enterpriseBlueprint?.tenant?.id;
  if (tenantId) {
    contextLinks.push({
      label: "Tenant control room",
      href: routes.admin.tenant(tenantId),
    });
  }

  return (
    <div className="space-y-6">
      <ProCrowWorkbenchPageHeader
        eyebrow="ProCrow · Request workspace"
        title={orgName}
        purpose={`${refCode} — work this company from intake through tenant handoff. Client portal actions feed this workspace.`}
        statusChip={humanLabel}
        actions={
          <div className="flex flex-col items-end gap-2">
            <RequestStatusBadge status={status} />
            <DeptChips {...dept} />
          </div>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <ProCrowStageSummaryCard label="Queue stage" value={requestStatusToOperatorQueueHint(status)} />
        <ProCrowStageSummaryCard
          label="Operator bucket"
          value={humanLabel}
          hint={bucket.replace(/_/g, " ")}
        />
        <ProCrowStageSummaryCard
          label="Proposal"
          value={proposalStatus ? proposalStatus.replace(/_/g, " ") : "—"}
          tone={proposalStatus === "CLIENT_APPROVED" ? "success" : "muted"}
        />
        <ProCrowStageSummaryCard
          label="Tenant"
          value={tenantSlug ? `/${tenantSlug}` : "Not provisioned"}
          tone={tenantSlug ? "success" : "attention"}
        />
      </div>

      <ProCrowRequestLifecyclePanel status={status} proposalStatus={proposalStatus} />

      <OperatorNextActionPanel
        requestId={requestId}
        status={status}
        blueprintId={blueprintId}
        tenantSlug={tenantSlug}
        discoveryAvailable={discoveryAvailable}
      />

      <ProCrowWorkbenchSection title="Blockers & advisories">
        <ProCrowBlockerList blockers={blockers} />
      </ProCrowWorkbenchSection>

      <ProCrowContextLinkGrid links={contextLinks} />

      {proposalStatus === "CLIENT_APPROVED" && (
        <section className="cc-glass-card border-teal-500/25 bg-teal-500/5 !p-4">
          <p className="text-sm font-semibold text-teal-200">Client approved commercial scope</p>
          <p className="mt-1 text-xs text-slate-500">
            Authenticated Client Portal — not legal signature, payment, or production go-live.
            {clientApprovedAt && ` Recorded ${clientApprovedAt.toLocaleString()}.`}
          </p>
        </section>
      )}

      <ProCrowWorkbenchSection title="Client interaction" description="Portal linkage, onboarding, feedback.">
        <AdminOnboardingReadinessPanel tracker={adminOnboardingTracker} />
        <AdminProcrowDiscoveryReviewPanel snapshot={procrowDiscoveryReview} />
        <AdminClientReviewFeedbackPanel requestId={requestId} />
      </ProCrowWorkbenchSection>

      <ProCrowWorkbenchSection
        title="Advisory pricing package"
        description="Startup / Growth / Enterprise direction from discovery — not final quote or checkout."
      >
        <AdminProcrowPricingPackagePanel
          requestId={requestId}
          estimate={pricingPackageEstimate}
          blueprintId={blueprintId}
        />
      </ProCrowWorkbenchSection>

      <ProCrowWorkbenchSection
        title="Blueprint & proposal"
        description="Commercial estimate and pipeline tools."
      >
        <RequestPipelineLinks
          requestId={requestId}
          status={status}
          blueprintId={blueprintId}
          tenantSlug={tenantSlug}
          discoveryAvailable={discoveryAvailable}
        />
        <PipelineProcessGuide
          status={status}
          requestId={requestId}
          blueprintId={blueprintId}
          tenantSlug={tenantSlug}
        />
        {request?.discoveryProfile ? (
          <AdminDiscoveryIntelligencePanel requestId={requestId} />
        ) : null}
      </ProCrowWorkbenchSection>

      <ProCrowTenantRuntimeFraming />

      <ProCrowWorkbenchSection
        title="Trust & experience"
        description="Advisory checks before runtime handoff."
      >
        {cybercrowTrustPreview && (
          <AdminCybercrowTrustReadinessPanel
            snapshot={cybercrowTrustPreview}
            variant={tenantSlug ? "tenant" : "request-preview"}
          />
        )}
        {sareaExperiencePreview && (
          <AdminSareaExperienceMappingPanel
            snapshot={sareaExperiencePreview}
            variant={tenantSlug ? "tenant" : "request-preview"}
          />
        )}
        <ProCrowContextLinkGrid
          links={[
            {
              label: "Security baselines",
              href: routes.admin.securityBaselines,
              description: "Platform trust posture",
            },
            {
              label: "SAREA studio",
              href: routes.sarea.overview,
              description: "Experience readiness",
            },
            ...(tenantSlug
              ? [
                  {
                    label: "CyberCrow dashboard",
                    href: routes.tenant(tenantSlug).cybercrow.dashboard,
                    description: "Tenant trust cockpit",
                  },
                ]
              : []),
          ]}
        />
      </ProCrowWorkbenchSection>

      <div className="grid gap-6 lg:grid-cols-[1fr_min(20rem,36%)] lg:items-start">
        <div className="space-y-6">
          {request && (
            <ProCrowWorkbenchSection title="Pipeline actions">
              <RequestAdminActions
                requestId={request.id}
                status={status}
                blueprintId={request.enterpriseBlueprint?.id ?? null}
                tenantSlug={tenantSlug}
              />
            </ProCrowWorkbenchSection>
          )}

          <ProCrowWorkbenchSection title="Organization & contact" collapsible defaultOpen={false}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="cc-entity-block cc-entity-block--cem space-y-2 !p-4">
                <h3 className="text-sm font-medium text-cyan-400">Organization</h3>
                {request ? (
                  <dl className="cc-meta-dl !border-0 !bg-transparent !p-0 text-sm">
                    <div>
                      <dt>Name</dt>
                      <dd>{request.organizationName}</dd>
                    </div>
                    {request.industry && (
                      <div>
                        <dt>Industry</dt>
                        <dd>{industryLabel(request.industry)}</dd>
                      </div>
                    )}
                    {request.employeeBand && (
                      <div>
                        <dt>Employees</dt>
                        <dd>{request.employeeBand}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-sm text-slate-500">Demo record — connect database for metadata.</p>
                )}
              </div>
              <div className="cc-glass-card space-y-2 !p-4">
                <h3 className="text-sm font-medium text-cyan-400">Contact</h3>
                {primaryContact ? (
                  <dl className="cc-meta-dl !border-0 !bg-transparent !p-0 text-sm">
                    <div>
                      <dt>Name</dt>
                      <dd>{primaryContact.fullName}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd className="text-cyan-300">{primaryContact.email}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-slate-500">No contact on file.</p>
                )}
              </div>
            </div>
            {request?.enterpriseBlueprint?.tenant && primaryContact?.email && (
              <PromoteClientForm
                tenantId={request.enterpriseBlueprint.tenant.id}
                tenantSlug={request.enterpriseBlueprint.tenant.slug}
                contactEmail={primaryContact.email}
              />
            )}
          </ProCrowWorkbenchSection>

          <ProCrowWorkbenchSection title="Plan, modules & security" collapsible defaultOpen={false}>
            <p className="text-sm text-white">
              Plan: <span className="text-cyan-300">{planKey ? planLabel(planKey) : "—"}</span>
            </p>
            {request && (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <ul className="space-y-1 text-sm text-slate-300">
                  {request.requestedModules.map((m) => (
                    <li key={m.id}>{moduleLabel(m.moduleKey)}</li>
                  ))}
                </ul>
                <ul className="space-y-1 text-sm text-slate-300">
                  {request.requestedSecurityPkgs.map((p) => (
                    <li key={p.id}>{securityPackageLabel(p.packageKey)}</li>
                  ))}
                </ul>
              </div>
            )}
          </ProCrowWorkbenchSection>

          <ProCrowWorkbenchSection title="Operator tools" collapsible defaultOpen={false}>
            <OperatorE2eChecklistPanel referenceCode={refCode} />
            {request?.notes && (
              <p className="text-sm text-slate-400">
                <span className="text-slate-500">Notes: </span>
                {request.notes}
              </p>
            )}
          </ProCrowWorkbenchSection>

          {mockRow && !request && (
            <p className="cc-alert-warning text-sm text-amber-100">
              Demo request — pipeline actions require a database record.
            </p>
          )}
        </div>

        <aside id="commercial" className="space-y-4 scroll-mt-24">
          <ProCrowCommercialLifecycleCompact />
          {estimate ? (
            <PricingHeroPanel
              breakdown={estimate}
              storedTotal={
                request?.estimatedMonthlySar ? Number(request.estimatedMonthlySar) : mockRow?.estimatedMonthlySar
              }
              proposalStatusLabel={blueprint ? proposalStatusLabel(blueprint.proposalStatus) : undefined}
            />
          ) : (
            <p className="cc-glass-card text-sm text-slate-500">Pricing estimate unavailable.</p>
          )}
          {blueprint?.proposalToken && (
            <Link
              href={`/proposal/${blueprint.proposalToken}`}
              className="block text-center text-xs text-cyan-400 hover:text-cyan-300"
            >
              Open client proposal →
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
