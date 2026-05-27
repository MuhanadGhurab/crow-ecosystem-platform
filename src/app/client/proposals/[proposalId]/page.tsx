import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientProposalApprovalPanel } from "@/components/client-portal/client-proposal-approval-panel";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { getClientApprovalEligibility } from "@/lib/services/client-approval.service";
import { ClientReviewProcrowCounterpart } from "@/components/client-portal/client-review-procrow-counterpart";
import { ClientReviewSecurityNotes } from "@/components/client-portal/client-review-security-notes";
import { requireClientAccess } from "@/lib/auth/session";
import { proposalStatusLabel } from "@/lib/services/commercial.service";
import { getClientProposalReviewModel } from "@/lib/services/client-review.service";
import { routes } from "@/lib/routes";

export default async function ClientProposalDetailPage({
  params,
}: {
  params: Promise<{ proposalId: string }>;
}) {
  const { proposalId } = await params;
  const user = await requireClientAccess(routes.client.proposal(proposalId));

  const [{ access, model }, eligibility] = await Promise.all([
    getClientProposalReviewModel(user, proposalId),
    getClientApprovalEligibility(user, proposalId),
  ]);

  if (access === "not_found" || !model) {
    if (access === "not_linked" || access === "ownership_unverified") notFound();
    if (access === "login_required") notFound();
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.client.proposals} className="text-sm text-teal-400 hover:text-teal-300">
          ← All proposals
        </Link>
        <h1 className="cc-page-title mt-4">{model.title}</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">{model.referenceCode}</p>
        <p className="mt-2 text-sm text-cyan-300">{proposalStatusLabel(model.status)}</p>
        {access === "platform_staff_preview" && (
          <p className="cc-alert-warning mt-3 text-sm">Staff preview — client linkage rules apply.</p>
        )}
      </div>

      <ClientPortalStatusCard title="Scope summary" badge="Read-only" badgeTone="info">
        <p className="text-sm text-slate-400">{model.summary}</p>
        <p className="mt-3 text-sm text-slate-300">
          <span className="text-slate-500">Plan: </span>
          {model.planLabel}
        </p>
        {model.estimatedRange && (
          <p className="mt-2 text-sm text-teal-300/90">
            <span className="text-slate-500">Advisory estimate: </span>
            {model.estimatedRange}
          </p>
        )}
      </ClientPortalStatusCard>

      {model.modules.length > 0 && (
        <ClientPortalStatusCard title="Recommended modules" badge={`${model.modules.length}`} badgeTone="info">
          <ul className="mt-3 list-inside list-disc text-sm text-slate-300">
            {model.modules.map((m) => (
              <li key={m.key}>{m.label}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      {model.securityLayer.length > 0 && (
        <ClientPortalStatusCard title="Security layer" badge="Add-ons" badgeTone="info">
          <ul className="mt-3 list-inside list-disc text-sm text-slate-300">
            {model.securityLayer.map((s) => (
              <li key={s.key}>{s.label}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <ClientPortalStatusCard title="ProCrow review status" badge="ProCrow" badgeTone="info">
        <p className="text-sm text-slate-400">{model.procrowStatus}</p>
        <p className="mt-2 text-sm text-slate-500">{model.procrowNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={routes.client.request(model.requestId)} className="cc-btn-secondary text-sm">
            View request
          </Link>
          <Link href={routes.client.blueprint(model.blueprintId)} className="cc-btn-secondary text-sm">
            View blueprint
          </Link>
        </div>
      </ClientPortalStatusCard>

      <ClientReviewProcrowCounterpart counterpart={model.procrowCounterpart} />

      <ClientProposalApprovalPanel proposalId={proposalId} eligibility={eligibility} />

      {model.nextActions.length > 0 && (
        <ClientPortalStatusCard title="Next steps" badge="Client" badgeTone="neutral">
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
            {model.nextActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <ClientReviewSecurityNotes notes={model.securityNotes} />
    </div>
  );
}
