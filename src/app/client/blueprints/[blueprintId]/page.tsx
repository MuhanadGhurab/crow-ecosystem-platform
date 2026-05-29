import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientOnboardingSummaryCard } from "@/components/client-portal/client-onboarding-summary-card";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { ClientReviewFeedbackPanel } from "@/components/client-portal/client-review-feedback-panel";
import { ClientReviewProcrowCounterpart } from "@/components/client-portal/client-review-procrow-counterpart";
import { ClientReviewSecurityNotes } from "@/components/client-portal/client-review-security-notes";
import { requireClientAccess } from "@/lib/auth/session";
import { proposalStatusLabel } from "@/lib/services/commercial.service";
import { buildClientOnboardingTracker } from "@/lib/services/client-onboarding.service";
import { getClientBlueprintReviewModel } from "@/lib/services/client-review.service";
import {
  getClientRequestChangesEligibility,
  listClientReviewNotesForRequest,
} from "@/lib/services/client-review-notes.service";
import { routes } from "@/lib/routes";

export default async function ClientBlueprintDetailPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const user = await requireClientAccess(routes.client.blueprint(blueprintId));

  const { access, model } = await getClientBlueprintReviewModel(user, blueprintId);

  const feedbackBundle =
    model && access !== "not_found"
      ? await Promise.all([
          getClientRequestChangesEligibility(user, {
            requestId: model.requestId,
            blueprintId,
            proposalId: model.proposalId ?? undefined,
          }),
          listClientReviewNotesForRequest(user, model.requestId),
        ])
      : null;

  const onboardingTracker =
    model && access !== "not_found"
      ? await buildClientOnboardingTracker(user, model.requestId)
      : null;

  if (access === "not_found" || !model) {
    if (access === "not_linked" || access === "ownership_unverified") notFound();
    notFound();
  }

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.requests}
        backLabel="← Requests"
        title={`Blueprint — ${model.organizationName}`}
        description={`${model.referenceCode} · ${model.readinessLabel}`}
      />
      {access === "platform_staff_preview" && (
        <p className="cc-alert-warning text-sm">Staff preview — client linkage rules apply.</p>
      )}

      <ClientOnboardingSummaryCard tracker={onboardingTracker} />

      <ClientPortalStatusCard title="Operating model" badge="Summary" badgeTone="info">
        <p className="text-sm text-slate-300">{model.operatingModel}</p>
        {model.sector && (
          <p className="mt-2 text-sm text-slate-400">
            <span className="text-slate-500">Sector: </span>
            {model.sector}
          </p>
        )}
      </ClientPortalStatusCard>

      {model.recommendedModules.length > 0 && (
        <ClientPortalStatusCard
          title="Recommended modules"
          badge={`${model.recommendedModules.length}`}
          badgeTone="info"
        >
          <ul className="mt-3 list-inside list-disc text-sm text-slate-300">
            {model.recommendedModules.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <ClientPortalStatusCard
          title="Departments"
          badge={String(model.departments.length)}
          badgeTone="neutral"
        >
          {model.departments.length === 0 ? (
            <p className="text-sm text-slate-500">Not captured in discovery yet.</p>
          ) : (
            <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
              {model.departments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </ClientPortalStatusCard>
        <ClientPortalStatusCard title="Roles" badge={String(model.roles.length)} badgeTone="neutral">
          {model.roles.length === 0 ? (
            <p className="text-sm text-slate-500">Not captured yet.</p>
          ) : (
            <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
              {model.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </ClientPortalStatusCard>
        <ClientPortalStatusCard
          title="Workflows"
          badge={String(model.workflows.length)}
          badgeTone="neutral"
        >
          {model.workflows.length === 0 ? (
            <p className="text-sm text-slate-500">Not captured yet.</p>
          ) : (
            <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
              {model.workflows.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
        </ClientPortalStatusCard>
      </div>

      {model.missingInputs.length > 0 && (
        <ClientPortalStatusCard title="Inputs still needed" badge="Readiness" badgeTone="warning">
          <ul className="mt-2 list-inside list-disc text-sm text-amber-200/90">
            {model.missingInputs.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </ClientPortalStatusCard>
      )}

      <ClientPortalStatusCard title="ProCrow notes" badge="ProCrow" badgeTone="info">
        <p className="text-sm text-slate-400">{model.procrowNotes}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={routes.client.request(model.requestId)} className="cc-btn-secondary text-sm">
            View request
          </Link>
          {model.proposalId && model.proposalStatus && model.proposalStatus !== "DRAFT" ? (
            <Link href={routes.client.proposal(model.proposalId)} className="cc-btn-secondary text-sm">
              Open proposal for review
              {model.proposalStatus ? ` (${proposalStatusLabel(model.proposalStatus)})` : ""}
            </Link>
          ) : (
            <p className="text-sm text-amber-200/90">
              Proposal not ready for approval yet — continue blueprint review or wait for ProCrow to
              send commercial scope.
            </p>
          )}
        </div>
      </ClientPortalStatusCard>

      <ClientReviewProcrowCounterpart counterpart={model.procrowCounterpart} />

      {feedbackBundle && (
        <ClientReviewFeedbackPanel
          eligibility={feedbackBundle[0]}
          notes={feedbackBundle[1]}
          defaultBlueprintId={blueprintId}
          defaultProposalId={model.proposalId}
        />
      )}

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
