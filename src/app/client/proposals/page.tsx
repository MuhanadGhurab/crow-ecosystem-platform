import Link from "next/link";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { ClientReviewSecurityNotes } from "@/components/client-portal/client-review-security-notes";
import { requireClientAccess } from "@/lib/auth/session";
import { proposalStatusLabel } from "@/lib/services/commercial.service";
import { buildClientProposalsListModel } from "@/lib/services/client-review.service";
import { routes } from "@/lib/routes";

export default async function ClientProposalsPage() {
  const user = await requireClientAccess(routes.client.proposals);
  const list = await buildClientProposalsListModel(user);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">
          Authenticated review
        </p>
        <h1 className="cc-page-title mt-2">Proposals</h1>
        <p className="mt-2 text-sm text-slate-400">
          Commercial proposals appear here only when your sign-in is safely linked to the
          implementation request. Email proposal links help you find materials — they do not
          authorize approval without this portal.
        </p>
      </div>

      <ClientPortalApprovalBlocked context="proposal" />

      {list.accessState === "not_linked" && list.proposals.length === 0 ? (
        <ClientPortalStatusCard
          title="No linked proposals"
          badge="Not linked"
          badgeTone="warning"
          description="Submit a request or sign in with the same email as your primary contact to see proposals here."
        >
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.client.requests} className="cc-btn-secondary text-sm">
              Your requests
            </Link>
            <Link href={routes.client.company} className="cc-btn-secondary text-sm">
              Company profile
            </Link>
          </div>
        </ClientPortalStatusCard>
      ) : list.proposals.length === 0 ? (
        <ClientPortalStatusCard
          title="No proposals yet"
          description="When ProCrow sends a commercial proposal for your linked request, it will appear here."
        />
      ) : (
        <ul className="space-y-4">
          {list.proposals.map((p) => (
            <li key={p.proposalId}>
              <Link
                href={p.reviewRoute}
                className="cc-glass-card block hover:border-teal-500/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-semibold text-white">{p.title}</p>
                  <span className="text-xs font-mono text-slate-500">{p.referenceCode}</span>
                </div>
                <p className="mt-2 text-sm text-cyan-300">{proposalStatusLabel(p.status)}</p>
                {p.approvalState === "approved" && (
                  <p className="mt-1 text-xs font-medium text-teal-300/90">
                    Scope approved — awaiting ProCrow review
                  </p>
                )}
                {p.approvalState === "eligible" && (
                  <p className="mt-1 text-xs font-medium text-amber-200/90">
                    Ready for scope approval on detail page
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-400">{p.summary}</p>
                {p.estimatedRange && (
                  <p className="mt-2 text-sm text-teal-300/90">{p.estimatedRange}</p>
                )}
                <p className="mt-3 text-xs text-slate-500">{p.procrowStatus}</p>
                {p.blueprintRoute && (
                  <p className="mt-2 text-xs text-teal-400/80">
                    Blueprint review available →
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {list.nextActions.length > 0 && (
        <ClientPortalStatusCard title="Suggested next steps" badge="Review" badgeTone="info">
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
            {list.nextActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <ClientReviewSecurityNotes notes={list.securityNotes} />
    </div>
  );
}
