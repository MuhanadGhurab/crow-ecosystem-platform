import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientProfilePageModel } from "@/lib/services/client-profile.service";
import { listClientRequests } from "@/lib/services/client-request-link.service";
import { getClientOrganizationAccessDecisionForRequest } from "@/lib/services/client-organization-link.service";
import { PORTAL_GATEWAY_SAFETY_NOTES } from "@/lib/portal/portal-access-contract";
import { routes } from "@/lib/routes";

function PlannedFeatureRow({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) {
  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-slate-400">{label}</span>
      <span
        className="inline-flex w-fit cursor-not-allowed rounded-full bg-slate-700/40 px-2.5 py-0.5 text-xs font-medium text-slate-500"
        title={detail}
        aria-disabled="true"
      >
        Planned
      </span>
    </li>
  );
}

export default async function ClientSettingsPage() {
  const user = await requireClientAccess(routes.client.settings);
  const model = await buildClientProfilePageModel(user);
  const { profile } = model;
  const decision = user.email
    ? await listClientRequests(user.id, user.email)
        .then((rows) =>
          rows[0]?.id ? getClientOrganizationAccessDecisionForRequest(user, rows[0].id) : null
        )
        .catch(() => null)
    : null;

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        title="Settings"
        description="Account and security readiness for the Client Portal. Advanced preferences arrive in a later phase."
      />

      <ClientPortalStatusCard title="Portal boundaries" badge="Important" badgeTone="info">
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
          {PORTAL_GATEWAY_SAFETY_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard title="Account & security" badge="Readiness" badgeTone="info">
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">Signed-in email</dt>
            <dd className="text-white">{profile.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Sign-in method</dt>
            <dd className="capitalize text-white">{profile.authProvider ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Account link</dt>
            <dd className="text-white capitalize">{model.accountLinkState.replace(/_/g, " ")}</dd>
          </div>
        </dl>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard
        title="Notifications"
        badge="Coming soon"
        badgeTone="warning"
        description="Email notifications for proposal updates and onboarding milestones are not yet available."
      >
        <p
          className="mt-3 inline-flex cursor-not-allowed rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200/70"
          title="Notification delivery will be enabled in a future release. This control is not active yet."
          aria-disabled="true"
        >
          Notifications — Coming soon
        </p>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard
        title="Organization access (read-only)"
        badge="Membership context"
        badgeTone="info"
      >
        <dl className="mt-4 space-y-3 text-sm">
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
          <div>
            <dt className="text-slate-500">ProCrow verification</dt>
            <dd className="text-sm text-white">
              {decision?.canApproveScope
                ? "No extra verification required for approval under current decision rules."
                : "Approvals require verified organization ownership (ProCrow workflow)."}
            </dd>
          </div>
        </dl>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard title="Privacy & access" badge="Important" badgeTone="info">
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
          <li>Sign in with the same email as your request contact to link requests.</li>
          <li>Proposal email links locate your proposal — they do not grant approval rights.</li>
          <li>
            This portal does not grant platform admin access. ProCrow staff use separate admin
            tools.
          </li>
          <li>Session security is managed by your identity provider (Supabase Auth).</li>
        </ul>
      </ClientPortalStatusCard>

      <ClientPortalStatusCard title="Future settings" badge="Planned">
        <ul className="mt-3 space-y-3 text-sm">
          <PlannedFeatureRow
            label="Notification preferences"
            detail="Per-organization notification routing will be configurable in a future release."
          />
          <PlannedFeatureRow
            label="Delegated reviewers"
            detail="Organization contact delegation for discovery review is planned."
          />
          <PlannedFeatureRow
            label="Two-factor guidance"
            detail="Account hardening guidance will be added when self-service MFA flows ship."
          />
          <PlannedFeatureRow
            label="Data export requests"
            detail="Self-service data export and formal data-subject requests are planned."
          />
        </ul>
      </ClientPortalStatusCard>
    </div>
  );
}
