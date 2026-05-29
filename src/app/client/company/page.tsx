import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { ClientLinkingStatus } from "@/components/client-portal/client-linking-status";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientCompanyCompleteForm } from "@/components/client-portal/client-company-complete-form";
import { ClientProfileCompleteness } from "@/components/client-portal/client-profile-completeness";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { formatCompanyLinkStatusLabel } from "@/lib/client-portal/company-link-status-label";
import { registryFieldForLabel } from "@/lib/client-portal/client-company-profile-fields";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { getClientOrganizationAccessDecisionForRequest } from "@/lib/services/client-organization-link.service";
import { buildClientCompanyPageModel } from "@/lib/services/client-profile.service";
import { routes } from "@/lib/routes";

export default async function ClientCompanyPage() {
  const user = await requireClientAccess(routes.client.company);
  const model = await buildClientCompanyPageModel(user);
  const company = model.company;
  const decision = model.requestSummaries[0]?.requestId
    ? await getClientOrganizationAccessDecisionForRequest(user, model.requestSummaries[0].requestId).catch(
        () => null
      )
    : null;

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Organization"
        title="Company"
        description="Organization profile from your linked implementation request. You can update safe fields (such as employee band) when you own the request or have verified membership."
      />

      <ClientLinkingStatus state={model.accountLinkState} />

      <ClientPortalStatusCard title="Organization access (read-only)" badge="Membership context" badgeTone="info">
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Membership status</dt>
            <dd className="text-white">
              {decision?.membership?.status
                ? decision.membership.status.replace(/_/g, " ")
                : decision?.organization
                  ? "linked (no membership record)"
                  : "unlinked"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Link source</dt>
            <dd className="text-white">
              {decision?.linkSource ? decision.linkSource.replace(/_/g, " ") : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Access level</dt>
            <dd className="text-white">{decision?.accessLevel ?? "none"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Approval ability</dt>
            <dd className="text-white">
              {decision?.canApproveScope ? "Can approve scope" : "Review-only (approval blocked)"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">ProCrow verification</dt>
            <dd className="text-white">
              {decision?.canApproveScope
                ? "No extra verification required for approval (current decision rules)."
                : "Approvals require verified organization ownership (ProCrow workflow)."}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Future team members</dt>
            <dd className="text-white text-slate-300">
              Delegating reviews/approvals and inviting additional team members is planned for a later phase.
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Company editing</dt>
            <dd className="text-white text-slate-300">
              Safe fields (employee band) can be edited by the request submitter or verified organization
              owners. Email-only reviewers cannot edit company data.
            </dd>
          </div>
        </dl>
      </ClientPortalStatusCard>

      {company ? (
        <>
          <ClientProfileCompleteness
            title="Company profile completeness"
            percent={company.readiness.completenessPercent}
            missingFields={company.readiness.missingFields}
            completedFields={company.readiness.completedFields}
          />

          {company.readiness.missingFields.length > 0 && (
            <section className="cc-glass-card text-sm text-slate-400">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Why some fields are locked
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {company.readiness.missingFields.map((label) => {
                  const field = registryFieldForLabel(label);
                  if (field?.editableByClient) return null;
                  return (
                    <li key={label}>
                      <span className="text-slate-300">{label}:</span>{" "}
                      {field?.blockedReason ?? "Contact ProCrow to update this field."}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {(company.canEdit ||
            company.readiness.missingFields.includes("Employee band")) && (
            <ClientCompanyCompleteForm
              requestId={company.primaryRequestId}
              employeeBand={company.employeeBand}
              canEdit={company.canEdit}
              editBlockedReason={company.editBlockedReason}
            />
          )}

          <ClientPortalStatusCard
            title={company.companyName ?? "Company"}
            badge={`${company.readiness.completenessPercent}% complete`}
            badgeTone={company.readiness.missingFields.length === 0 ? "success" : "warning"}
            description={`${formatCompanyLinkStatusLabel(company.readiness.companyLinkStatus)} · ${company.requestCount} request(s)`}
          >
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Industry</dt>
                <dd className="text-white">{company.industry ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Employee band</dt>
                <dd className="text-white">{company.employeeBand ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Region</dt>
                <dd className="text-white">{company.region ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Primary contact</dt>
                <dd className="text-white">
                  {company.primaryContactName ?? "—"}
                  {company.primaryContactEmail && (
                    <span className="block text-slate-400">{company.primaryContactEmail}</span>
                  )}
                </dd>
              </div>
              {company.latestRequestReference && (
                <div>
                  <dt className="text-slate-500">Latest request</dt>
                  <dd className="font-mono text-xs text-slate-300">
                    {company.latestRequestReference}
                    {company.latestRequestStatus && (
                      <span className="mt-1 block">
                        <RequestStatusBadge status={company.latestRequestStatus} />
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </ClientPortalStatusCard>

          {company.selectedModules.length > 0 && (
            <ClientPortalStatusCard title="Selected modules" badge="From request">
              <ul className="mt-3 flex flex-wrap gap-2">
                {company.selectedModules.map((m) => (
                  <li
                    key={m}
                    className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </ClientPortalStatusCard>
          )}

          {company.securityRequirements.length > 0 && (
            <ClientPortalStatusCard title="Security & advisory" badge="From request">
              <ul className="mt-3 list-inside list-disc text-sm text-slate-400">
                {company.securityRequirements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </ClientPortalStatusCard>
          )}

          {model.requestSummaries.length > 1 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Linked requests
              </h2>
              <ul className="space-y-2">
                {model.requestSummaries.map((r) => (
                  <li key={r.requestId}>
                    <Link
                      href={routes.client.request(r.requestId)}
                      className="cc-glass-card block hover:border-teal-500/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-white">{r.organizationName}</p>
                          <p className="font-mono text-xs text-slate-500">{r.referenceCode}</p>
                        </div>
                        <RequestStatusBadge status={r.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!company.canEdit && company.editBlockedReason && (
            <ClientPortalStatusCard
              title="Company editing"
              badge="Read-only"
              badgeTone="warning"
              description={company.editBlockedReason}
            />
          )}
        </>
      ) : (
        <ClientPortalStatusCard
          title="No company profile linked yet"
          badge="Pending linkage"
          badgeTone="warning"
          description="When a request is linked to your account, your organization profile will appear here. Sign in with the same email as your primary request contact, or submit a new request."
        >
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.public.request} className="cc-btn-primary text-sm">
              Submit a request
            </Link>
            <Link href={routes.client.profile} className="text-sm text-teal-400 hover:text-teal-300">
              Update your profile →
            </Link>
          </div>
        </ClientPortalStatusCard>
      )}

      <ClientPortalApprovalBlocked context="general" reason={model.approvalBlockedReason} variant="guide" compact />

      <section className="cc-glass-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Recommended next steps
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {(company?.readiness.nextActions ?? [
            "Submit an implementation request to create a company profile.",
          ]).map((a) => (
            <li key={a} className="flex gap-2">
              <span className="text-teal-400" aria-hidden>
                →
              </span>
              <span>{a}</span>
            </li>
          ))}
          <li className="flex gap-2">
            <span className="text-teal-400" aria-hidden>
              →
            </span>
            <Link href={routes.client.requests} className="text-teal-400 hover:text-teal-300">
              View requests
            </Link>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400" aria-hidden>
              →
            </span>
            <Link href={routes.client.proposals} className="text-teal-400 hover:text-teal-300">
              Review proposals
            </Link>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400" aria-hidden>
              →
            </span>
            <Link href={routes.client.onboarding} className="text-teal-400 hover:text-teal-300">
              Onboarding tracker
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
