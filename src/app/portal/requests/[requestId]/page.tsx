import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { LifecycleStrip } from "@/components/pipeline/lifecycle-strip";
import { requireClientAccess } from "@/lib/auth/session";
import { planLabel } from "@/lib/catalog-labels";
import { isUseMockData } from "@/lib/mock/env";
import { getMockClientRequest, isMockClientRequestId } from "@/lib/mock/portal";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { getImplementationRequest } from "@/lib/services/implementation-request.service";
import { formatSar } from "@/lib/services/commercial.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function PortalRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireClientAccess();

  if (isUseMockData() && isMockClientRequestId(requestId)) {
    const mock = getMockClientRequest(requestId);
    if (!mock) notFound();
    return (
      <PortalRequestDetail
        referenceCode={mock.referenceCode}
        organizationName={mock.organizationName}
        status={mock.status}
        planKey={mock.planKey}
        estimatedMonthlySar={mock.estimatedMonthlySar}
        proposalToken={mock.proposalToken}
        contactName="Demo sponsor"
        contactEmail={user.email ?? "client.demo@alnoor.test"}
      />
    );
  }

  if (!user.email) {
    notFound();
  }

  const allowed = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  if (!allowed) {
    notFound();
  }

  const request = await getImplementationRequest(requestId).catch(() => null);
  if (!request) {
    notFound();
  }

  const primary = request.contacts.find((c) => c.isPrimary) ?? request.contacts[0];
  const planKey = request.requestedPlans[0]?.planKey;

  return (
    <PortalRequestDetail
      referenceCode={request.referenceCode}
      organizationName={request.organizationName}
      status={request.status as ImplementationRequestStatus}
      planKey={planKey}
      estimatedMonthlySar={
        request.estimatedMonthlySar ? Number(request.estimatedMonthlySar) : null
      }
      proposalToken={request.enterpriseBlueprint?.proposalToken ?? null}
      contactName={primary?.fullName}
      contactEmail={primary?.email}
    />
  );
}

function PortalRequestDetail({
  referenceCode,
  organizationName,
  status,
  planKey,
  estimatedMonthlySar,
  proposalToken,
  contactName,
  contactEmail,
}: {
  referenceCode: string;
  organizationName: string;
  status: ImplementationRequestStatus;
  planKey?: string;
  estimatedMonthlySar: number | null;
  proposalToken: string | null;
  contactName?: string;
  contactEmail?: string;
}) {
  return (
    <div className="space-y-8">
      <Link href={routes.portal.requests} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← All requests
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">
            Request detail
          </p>
          <h1 className="cc-page-title mt-2">{organizationName}</h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{referenceCode}</p>
        </div>
        <RequestStatusBadge status={status} />
      </div>

      <LifecycleStrip status={status} />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="cc-glass-card space-y-3">
          <h2 className="text-sm font-medium text-cyan-400">Contact</h2>
          {contactName && <p className="text-white">{contactName}</p>}
          {contactEmail && <p className="text-sm text-slate-400">{contactEmail}</p>}
        </section>

        <section className="cc-glass-card space-y-3">
          <h2 className="text-sm font-medium text-cyan-400">Commercial</h2>
          {planKey && <p className="text-sm text-slate-300">Plan: {planLabel(planKey)}</p>}
          {estimatedMonthlySar != null && (
            <p className="text-lg font-semibold text-white">
              Est. {formatSar(estimatedMonthlySar)}
              <span className="text-sm font-normal text-slate-500"> / month</span>
            </p>
          )}
        </section>
      </div>

      {proposalToken && (
        <section className="cc-glass-card">
          <h2 className="text-sm font-medium text-violet-300">Proposal</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your commercial proposal is ready for review.
          </p>
          <Link
            href={routes.public.proposal(proposalToken)}
            className="cc-btn-primary mt-4 inline-flex"
          >
            Open proposal
          </Link>
        </section>
      )}

      <p className="text-center text-xs text-slate-600">
        Questions? Reply to your Crow contact or submit updates via{" "}
        <Link href={routes.public.request} className="text-cyan-400 hover:text-cyan-300">
          /request
        </Link>
      </p>
    </div>
  );
}
