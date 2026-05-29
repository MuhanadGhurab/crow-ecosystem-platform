import Link from "next/link";

import { notFound } from "next/navigation";

import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { ProCrowCapabilityFraming } from "@/components/procrow/procrow-capability-framing";
import { ProCrowWorkflowStrip } from "@/components/procrow/procrow-workflow-strip";

import { AdminClientReviewFeedbackPanel } from "@/components/admin/admin-client-review-feedback-panel";
import { AdminOnboardingReadinessPanel } from "@/components/admin/admin-onboarding-readiness-panel";
import { PromoteClientForm } from "@/components/admin/promote-client-form";
import { RequestAdminActions } from "@/components/admin/request-admin-actions";
import { AdminDiscoveryIntelligencePanel } from "@/components/admin/admin-discovery-intelligence-panel";
import { OperatorE2eChecklistPanel } from "@/components/admin/operator-e2e-checklist-panel";
import { OperatorNextActionPanel } from "@/components/admin/operator-next-action-panel";
import { RequestPipelineLinks } from "@/components/admin/request-pipeline-links";

import { RequestStatusBadge } from "@/components/admin/request-status-badge";

import { DeptChips } from "@/components/pipeline/dept-chips";
import { getRequestDeptContextFromRow } from "@/lib/pipeline/request-dept-context";

import { LifecycleStrip } from "@/components/pipeline/lifecycle-strip";
import { PipelineProcessGuide } from "@/components/pipeline/pipeline-process-guide";

import { PricingHeroPanel } from "@/components/blueprint/commercial/pricing-hero-panel";

import {
  industryLabel,
  moduleLabel,
  planLabel,
  securityPackageLabel,
} from "@/lib/catalog-labels";

import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";
import { routes } from "@/lib/routes";

import {

  formatSar,

  getRequestPricingEstimate,

  proposalStatusLabel,

} from "@/lib/services/commercial.service";

import { buildClientOnboardingTrackerForAdmin } from "@/lib/services/client-onboarding.service";
import { getImplementationRequest } from "@/lib/services/implementation-request.service";

import { isUseMockData } from "@/lib/mock/env";
import { getMockProposalApprovalOverrides, MOCK_PROPOSAL_TOKEN } from "@/lib/mock/blueprint";
import { MOCK_PIPELINE_REQUESTS, MOCK_PRICING_ESTIMATE } from "@/lib/mock/pipeline";

import type { ImplementationRequestStatus } from "@/lib/types/platform";



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



  if (!request && !mockRow) {

    notFound();

  }



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
  const discoveryHref =
    mockRow?.discoveryAvailable ? routes.discovery(requestId).organization : null;



  return (

    <div className="space-y-8">

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Link href={routes.admin.requests} className="text-cyan-400 hover:text-cyan-300">
          ← All requests
        </Link>
        <Link href={routes.admin.queue} className="text-slate-500 hover:text-cyan-300">
          Operator queue →
        </Link>
      </div>



      <ProCrowPageHeader

        badge="ProCrow · Customer flow"

        title={orgName}

        description={`${refCode} — Platform Admin review; client portal actions feed this queue.`}

        actions={

          <div className="flex flex-col items-end gap-2">

            <RequestStatusBadge status={status} />

            <DeptChips {...dept} />

            <a href="#commercial" className="text-xs text-cyan-400 hover:text-cyan-300">
              Commercial estimate ↓
            </a>

          </div>

        }

      />

      <ProCrowCapabilityFraming capability="customerFlow" />

      <ProCrowWorkflowStrip compact />

      <section className="cc-glass-card border-cyan-500/20 !p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Operator queue (derived)</h2>
        <p className="mt-1 text-sm text-white">
          Current stage:{" "}
          <span className="text-cyan-300">{requestStatusToOperatorQueueHint(status)}</span>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Advisory label from request status — tenant provisioning and go-live remain ProCrow-controlled; no
          automatic provisioning from this view.
        </p>
      </section>

      <LifecycleStrip status={status} />

      {proposalStatus === "CLIENT_APPROVED" && (
        <section className="cc-glass-card border-teal-500/25 bg-teal-500/5">
          <h2 className="text-sm font-semibold text-teal-200">Client approved commercial scope</h2>
          <p className="mt-2 text-sm text-slate-400">
            The client recorded scope approval for ProCrow review via the authenticated Client
            Portal. This is not a legal signature, payment authorization, or production go-live.
          </p>
          {clientApprovedAt && (
            <p className="mt-2 text-xs text-slate-500">
              Recorded {clientApprovedAt.toLocaleString()}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Next: review onboarding readiness, provisioning checklist, and go/no-go (ProCrow-owned).
          </p>
        </section>
      )}

      <AdminOnboardingReadinessPanel tracker={adminOnboardingTracker} />

      <AdminClientReviewFeedbackPanel requestId={requestId} />

      <>
        <OperatorNextActionPanel
          requestId={requestId}
          status={status}
          blueprintId={request?.enterpriseBlueprint?.id ?? mockBlueprintId}
          tenantSlug={request?.enterpriseBlueprint?.tenant?.slug ?? null}
          discoveryAvailable={Boolean(request?.discoveryProfile ?? mockRow?.discoveryAvailable)}
        />
        <RequestPipelineLinks
          requestId={requestId}
          status={status}
          blueprintId={request?.enterpriseBlueprint?.id ?? mockBlueprintId}
          tenantSlug={request?.enterpriseBlueprint?.tenant?.slug ?? null}
          discoveryAvailable={Boolean(request?.discoveryProfile ?? mockRow?.discoveryAvailable)}
        />
        <OperatorE2eChecklistPanel referenceCode={refCode} />
        {request?.discoveryProfile ? (
          <AdminDiscoveryIntelligencePanel requestId={requestId} />
        ) : null}
      </>

      <PipelineProcessGuide
        status={status}
        requestId={requestId}
        blueprintId={request?.enterpriseBlueprint?.id ?? mockBlueprintId}
        tenantSlug={request?.enterpriseBlueprint?.tenant?.slug ?? null}
      />

      {mockRow && !request && (
        <section className="cc-alert-warning text-sm text-amber-100">
          Demo request — pipeline actions and live pricing require a database record. Turn off{" "}
          <code className="rounded bg-black/30 px-1">USE_MOCK_DATA</code> or seed this request in Postgres.
        </section>
      )}



      <div className="grid gap-8 lg:grid-cols-[1fr_min(22rem,38%)] lg:items-start">

        <div className="space-y-6">

          {request && (

            <section className="cc-glass-card">

              <h3 className="text-sm font-medium text-cyan-400">Pipeline actions</h3>

              <div className="mt-4">

                <RequestAdminActions

                  requestId={request.id}

                  status={status}

                  blueprintId={request.enterpriseBlueprint?.id ?? null}

                  tenantSlug={request.enterpriseBlueprint?.tenant?.slug ?? null}

                />

              </div>

            </section>

          )}



          <div className="grid gap-6 md:grid-cols-2">

            <section className="cc-entity-block cc-entity-block--cem space-y-3">

              <h3 className="text-sm font-medium text-cyan-400">Organization</h3>

              {request ? (

                <dl className="cc-meta-dl !border-0 !bg-transparent !p-0">

                  <div>

                    <dt>Name (EN)</dt>

                    <dd>{request.organizationName}</dd>

                  </div>

                  {request.organizationNameAr && (

                    <div>

                      <dt>Name (AR)</dt>

                      <dd dir="rtl">{request.organizationNameAr}</dd>

                    </div>

                  )}

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

                  <div>

                    <dt>Country</dt>

                    <dd>{request.countryCode}</dd>

                  </div>

                </dl>

              ) : (

                <p className="text-sm text-slate-400">Demo record — connect database for full org metadata.</p>

              )}

            </section>



            <section className="cc-glass-card space-y-3">

              <h3 className="text-sm font-medium text-cyan-400">Contact</h3>

              {primaryContact ? (

                <dl className="cc-meta-dl !border-0 !bg-transparent !p-0">

                  <div>

                    <dt>Name</dt>

                    <dd>{primaryContact.fullName}</dd>

                  </div>

                  <div>

                    <dt>Email</dt>

                    <dd className="text-cyan-300">{primaryContact.email}</dd>

                  </div>

                  {primaryContact.phone && (

                    <div>

                      <dt>Phone</dt>

                      <dd>{primaryContact.phone}</dd>

                    </div>

                  )}

                </dl>

              ) : (

                <p className="text-sm text-slate-500">No contact on file.</p>

              )}

            </section>

            {request?.enterpriseBlueprint?.tenant && primaryContact?.email && (
              <section className="cc-glass-card">
                <h3 className="text-sm font-medium text-teal-400">Client → tenant</h3>
                <div className="mt-4">
                  <PromoteClientForm
                    tenantId={request.enterpriseBlueprint.tenant.id}
                    tenantSlug={request.enterpriseBlueprint.tenant.slug}
                    contactEmail={primaryContact.email}
                  />
                </div>
              </section>
            )}

          </div>



          <section className="cc-entity-block cc-entity-block--cem space-y-3">

            <h3 className="text-sm font-medium text-cyan-400">CEM · Plan & modules</h3>

            <p className="text-sm text-white">

              Plan: <span className="text-cyan-300">{planKey ? planLabel(planKey) : "—"}</span>

            </p>

            {request && (

              <ul className="mt-2 space-y-1 text-sm text-slate-300">

                {request.requestedModules.length === 0 ? (

                  <li className="text-slate-500">None selected</li>

                ) : (

                  request.requestedModules.map((m) => (

                    <li key={m.id}>{moduleLabel(m.moduleKey)}</li>

                  ))

                )}

              </ul>

            )}

          </section>



          <section className="cc-entity-block cc-entity-block--cybercrow space-y-3">

            <h3 className="text-sm font-medium text-violet-300">CyberCrow · Security</h3>

            {request ? (

              <ul className="space-y-1 text-sm text-slate-300">

                {request.requestedSecurityPkgs.length === 0 ? (

                  <li className="text-slate-500">None selected</li>

                ) : (

                  request.requestedSecurityPkgs.map((p) => (

                    <li key={p.id}>{securityPackageLabel(p.packageKey)}</li>

                  ))

                )}

              </ul>

            ) : (

              <p className="text-sm text-violet-200/80">Shield + Sentinel (demo)</p>

            )}

          </section>



          {request?.notes && (

            <section className="cc-glass-card">

              <h3 className="text-sm font-medium text-cyan-400">Notes</h3>

              <p className="mt-2 text-sm text-slate-300">{request.notes}</p>

            </section>

          )}



          {(request || mockRow) && (
            <section className="cc-glass-card space-y-2 text-sm text-slate-500">
              {request && <p>Submitted {request.createdAt.toLocaleString()}</p>}
              {discoveryHref && (
                <p>
                  <Link href={discoveryHref} className="text-cyan-400 hover:text-cyan-300">
                    Open discovery workspace →
                  </Link>
                </p>
              )}
              {mockBlueprintId && (
                <p>
                  <Link
                    href={routes.blueprint(mockBlueprintId).overview}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Open blueprint overview →
                  </Link>
                  {" · "}
                  <Link
                    href={routes.blueprint(mockBlueprintId).pricing}
                    className="text-violet-300/90 hover:text-violet-200"
                  >
                    Pricing tab
                  </Link>
                </p>
              )}
            </section>
          )}

        </div>



        <div id="commercial" className="space-y-4 scroll-mt-24">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Commercial estimate</p>

          {estimate ? (

            <PricingHeroPanel

              breakdown={estimate}

              storedTotal={

                request?.estimatedMonthlySar ? Number(request.estimatedMonthlySar) : mockRow?.estimatedMonthlySar

              }

              proposalStatusLabel={

                blueprint ? proposalStatusLabel(blueprint.proposalStatus) : undefined

              }

            />

          ) : (

            <section className="cc-pricing-panel">

              <p className="text-sm text-slate-400">Pricing estimate unavailable.</p>

            </section>

          )}



          {blueprint?.proposalToken && (

            <p className="text-center text-xs text-slate-500">

              <a

                href={`/proposal/${blueprint.proposalToken}`}

                className="text-cyan-400 hover:text-cyan-300"

              >

                Open client proposal →

              </a>

            </p>

          )}



          {estimate && !blueprint && (

            <p className="text-center text-xs text-slate-500">

              Estimated {formatSar(estimate.totalMonthlySar)}/mo from request selections

            </p>

          )}

        </div>

      </div>

    </div>

  );

}

