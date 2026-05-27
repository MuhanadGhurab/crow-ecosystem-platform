import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { LifecycleStrip } from "@/components/pipeline/lifecycle-strip";
import { ClientOnboardingSummaryCard } from "@/components/client-portal/client-onboarding-summary-card";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { isUseMockData } from "@/lib/mock/env";
import { getMockClientRequest, isMockClientRequestId } from "@/lib/mock/portal";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { buildClientOnboardingTracker } from "@/lib/services/client-onboarding.service";
import { buildClientProfileDashboardHints } from "@/lib/services/client-profile.service";
import { buildClientRequestReviewLinks } from "@/lib/services/client-review.service";
import { getImplementationRequest } from "@/lib/services/implementation-request.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function ClientRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireClientAccess(routes.client.request(requestId));

  if (isUseMockData() && isMockClientRequestId(requestId)) {
    const mock = getMockClientRequest(requestId);
    if (!mock) notFound();
    const { links } = await buildClientRequestReviewLinks(user, requestId);
    return (
      <RequestDetail
        referenceCode={mock.referenceCode}
        organizationName={mock.organizationName}
        status={mock.status}
        requestId={requestId}
        reviewLinks={links}
      />
    );
  }

  if (!user.email) notFound();

  const allowed = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  if (!allowed) notFound();

  const request = await getImplementationRequest(requestId).catch(() => null);
  if (!request) notFound();

  const { links } = await buildClientRequestReviewLinks(user, requestId);

  return (
    <RequestDetail
      referenceCode={request.referenceCode}
      organizationName={request.organizationName}
      status={request.status as ImplementationRequestStatus}
      requestId={requestId}
      reviewLinks={links}
    />
  );
}

async function RequestDetail({
  referenceCode,
  organizationName,
  status,
  requestId,
  reviewLinks,
}: {
  referenceCode: string;
  organizationName: string;
  status: ImplementationRequestStatus;
  requestId: string;
  reviewLinks: Awaited<ReturnType<typeof buildClientRequestReviewLinks>>["links"];
}) {
  const user = await requireClientAccess(routes.client.request(requestId));
  const [profileHints, onboardingTracker] = await Promise.all([
    buildClientProfileDashboardHints(user),
    buildClientOnboardingTracker(user, requestId),
  ]);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.requests}
        backLabel="← All requests"
        title={organizationName}
        description={referenceCode}
      />
      <div>
        <RequestStatusBadge status={status} />
      </div>

      <LifecycleStrip status={status} />

      <ClientOnboardingSummaryCard tracker={onboardingTracker} />

      <ClientPortalStatusCard title="Review materials" badge="Review" badgeTone="info">
        <p className="text-sm text-slate-400">
          Review proposal and blueprint scope here. Scope approval is available on the proposal
          detail page when your account is the verified request submitter (not email-only linkage).
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Commercial proposal</dt>
            <dd className="text-white">
              {reviewLinks?.proposalLabel ?? "Not sent yet"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Enterprise blueprint</dt>
            <dd className="text-white">{reviewLinks?.blueprintLabel ?? "Not available"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Profile readiness</dt>
            <dd className="text-white">{profileHints.profileCompleteness}% complete</dd>
          </div>
          <div>
            <dt className="text-slate-500">Company profile</dt>
            <dd className="text-white">
              {profileHints.companyCompleteness != null
                ? `${profileHints.companyCompleteness}% complete`
                : "Not linked"}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-3">
          {reviewLinks?.proposalHref && (
            <Link href={reviewLinks.proposalHref} className="cc-btn-secondary text-sm">
              Review proposal
            </Link>
          )}
          {reviewLinks?.blueprintHref && (
            <Link href={reviewLinks.blueprintHref} className="cc-btn-secondary text-sm">
              Review blueprint
            </Link>
          )}
          <Link href={routes.client.profile} className="cc-btn-secondary text-sm">
            Profile
          </Link>
          <Link href={routes.client.company} className="cc-btn-secondary text-sm">
            Company
          </Link>
        </div>
      </ClientPortalStatusCard>

      <ClientPortalApprovalBlocked context="proposal" variant="guide" />
    </div>
  );
}
