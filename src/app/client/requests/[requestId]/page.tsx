import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { LifecycleStrip } from "@/components/pipeline/lifecycle-strip";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { isUseMockData } from "@/lib/mock/env";
import { getMockClientRequest, isMockClientRequestId } from "@/lib/mock/portal";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
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
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const profileHints = await buildClientProfileDashboardHints(user);
  const steps = snapshot.onboardingSteps.filter((s) => s.relatedRoute?.includes(requestId));

  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.client.requests} className="text-sm text-teal-400 hover:text-teal-300">
          ← All requests
        </Link>
        <h1 className="cc-page-title mt-4">{organizationName}</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">{referenceCode}</p>
        <div className="mt-4">
          <RequestStatusBadge status={status} />
        </div>
      </div>

      <LifecycleStrip status={status} />

      <ClientPortalStatusCard title="Review materials" badge="I5" badgeTone="info">
        <p className="text-sm text-slate-400">
          Proposal and blueprint views are read-only until verified ownership and approval audit
          (I6).
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

      {steps.length > 0 && (
        <ClientPortalStatusCard title="Onboarding progress" badge="Tracker" badgeTone="info">
          <ol className="mt-4 space-y-3">
            {steps.map((step) => (
              <li key={step.key} className="flex gap-3 text-sm">
                <span className="text-teal-400 capitalize">{step.status.replace("_", " ")}</span>
                <div>
                  <p className="text-white">{step.label}</p>
                  <p className="text-slate-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </ClientPortalStatusCard>
      )}

      <ClientPortalApprovalBlocked context="proposal" />
    </div>
  );
}
