import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import { getMockProposalByToken, MOCK_PROPOSAL_TOKEN } from "@/lib/mock/blueprint";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import type { ProposalStatus } from "@prisma/client";
import { proposalStatusLabel } from "@/lib/services/commercial.service";

export default async function ClientProposalDetailPage({
  params,
}: {
  params: Promise<{ proposalId: string }>;
}) {
  const { proposalId } = await params;
  const user = await requireClientAccess(routes.client.proposal(proposalId));

  if (isUseMockData() && proposalId === "mock-bp-001") {
    const mock = getMockProposalByToken(MOCK_PROPOSAL_TOKEN);
    if (!mock) notFound();
    return (
      <ProposalDetail
        title={`Commercial proposal — ${mock.blueprint.request.organizationName}`}
        status={mock.blueprint.proposalStatus}
        referenceCode={mock.blueprint.request.referenceCode}
        requestId="mock-req-001"
        procrowNote="ProCrow prepared this proposal. Approval is not enabled in this phase."
      />
    );
  }

  if (!user.email) notFound();

  const blueprint = await prisma.enterpriseBlueprint
    .findUnique({
      where: { id: proposalId },
      include: { request: { select: { id: true, referenceCode: true, organizationName: true } } },
    })
    .catch(() => null);

  if (!blueprint) notFound();

  const allowed = await clientCanAccessRequest(user.id, user.email, blueprint.requestId).catch(
    () => false
  );
  if (!allowed) notFound();

  return (
    <ProposalDetail
      title={`Commercial proposal — ${blueprint.request.organizationName}`}
      status={blueprint.proposalStatus}
      referenceCode={blueprint.request.referenceCode}
      requestId={blueprint.requestId}
      procrowNote="ProCrow manages proposal status and internal review. Client approval requires verified ownership (future phase)."
    />
  );
}

function ProposalDetail({
  title,
  status,
  referenceCode,
  requestId,
  procrowNote,
}: {
  title: string;
  status: ProposalStatus;
  referenceCode: string;
  requestId: string;
  procrowNote: string;
}) {
  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.client.proposals} className="text-sm text-teal-400 hover:text-teal-300">
          ← All proposals
        </Link>
        <h1 className="cc-page-title mt-4">{title}</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">{referenceCode}</p>
        <p className="mt-2 text-sm text-cyan-300">{proposalStatusLabel(status)}</p>
      </div>

      <ClientPortalStatusCard title="ProCrow status" badge="Read-only" badgeTone="info">
        <p className="text-sm text-slate-400">{procrowNote}</p>
        <Link
          href={routes.client.request(requestId)}
          className="cc-btn-secondary mt-4 inline-flex text-sm"
        >
          View request
        </Link>
      </ClientPortalStatusCard>

      <ClientPortalApprovalBlocked context="proposal" />
    </div>
  );
}
