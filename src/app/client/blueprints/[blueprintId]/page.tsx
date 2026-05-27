import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { ClientReviewProcrowCounterpart } from "@/components/client-portal/client-review-procrow-counterpart";
import { ClientReviewSecurityNotes } from "@/components/client-portal/client-review-security-notes";
import { requireClientAccess } from "@/lib/auth/session";
import { proposalStatusLabel } from "@/lib/services/commercial.service";
import { getClientBlueprintReviewModel } from "@/lib/services/client-review.service";
import { routes } from "@/lib/routes";

export default async function ClientBlueprintDetailPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const user = await requireClientAccess(routes.client.blueprint(blueprintId));

  const { access, model } = await getClientBlueprintReviewModel(user, blueprintId);

  if (access === "not_found" || !model) {
    if (access === "not_linked" || access === "ownership_unverified") notFound();
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.client.requests} className="text-sm text-teal-400 hover:text-teal-300">
          ← Requests
        </Link>
        <h1 className="cc-page-title mt-4">Blueprint — {model.organizationName}</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">{model.referenceCode}</p>
        <p className="mt-2 text-sm text-violet-300">{model.readinessLabel}</p>
        {access === "platform_staff_preview" && (
          <p className="cc-alert-warning mt-3 text-sm">Staff preview — client linkage rules apply.</p>
        )}
      </div>

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
          {model.proposalId && (
            <Link href={routes.client.proposal(model.proposalId)} className="cc-btn-secondary text-sm">
              View proposal
              {model.proposalStatus ? ` (${proposalStatusLabel(model.proposalStatus)})` : ""}
            </Link>
          )}
        </div>
      </ClientPortalStatusCard>

      <ClientReviewProcrowCounterpart counterpart={model.procrowCounterpart} />

      <ClientPortalApprovalBlocked context="blueprint" />

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
