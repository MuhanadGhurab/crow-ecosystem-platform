import Link from "next/link";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { proposalStatusLabel } from "@/lib/services/commercial.service";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { routes } from "@/lib/routes";

export default async function ClientProposalsPage() {
  const user = await requireClientAccess(routes.client.proposals);
  const snapshot = await buildClientPortalDashboardSnapshot(user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Proposals</h1>
        <p className="mt-2 text-sm text-slate-400">
          Commercial proposals for your linked requests. ProCrow sends and tracks proposal status.
        </p>
      </div>

      <ClientPortalApprovalBlocked context="proposal" />

      {snapshot.proposals.length === 0 ? (
        <ClientPortalStatusCard
          title="No proposals yet"
          description="When ProCrow sends a commercial proposal for your linked request, it will appear here."
        />
      ) : (
        <ul className="space-y-4">
          {snapshot.proposals.map((p) => (
            <li key={p.proposalId}>
              <Link
                href={routes.client.proposal(p.proposalId)}
                className="cc-glass-card block hover:border-teal-500/30"
              >
                <p className="font-semibold text-white">{p.title}</p>
                <p className="mt-2 text-sm text-cyan-300">
                  {proposalStatusLabel(p.status)}
                </p>
                <p className="mt-2 text-xs text-slate-500">{p.approvalBlockedReason}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
