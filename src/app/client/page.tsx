import Link from "next/link";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalNextActions } from "@/components/client-portal/client-portal-next-actions";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { CLIENT_PORTAL_APPROVAL_BLOCKED_REASON } from "@/lib/client-portal/client-portal-contract";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { buildClientProfileDashboardHints } from "@/lib/services/client-profile.service";
import { routes } from "@/lib/routes";

export default async function ClientPortalHomePage() {
  const user = await requireClientAccess(routes.client.home);
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const profileHints = await buildClientProfileDashboardHints(user);

  const linked = snapshot.authState === "authenticated_linked";
  const staff = snapshot.authState === "platform_staff";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">
          Client Portal
        </p>
        <h1 className="cc-page-title mt-2">Your implementation journey</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track requests, proposals, and onboarding with ProCrow. This is a read-only preview of the
          full Client Portal experience.
        </p>
        {staff && (
          <p className="cc-alert-warning mt-4 text-sm">
            Staff preview — you are viewing the client area as platform staff.
          </p>
        )}
      </div>

      <ClientPortalNextActions snapshot={snapshot} />

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href={routes.client.profile} className="cc-glass-card block hover:border-teal-500/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Profile</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {profileHints.profileCompleteness}%
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {profileHints.profileMissingCount === 0
              ? "Basics complete"
              : `${profileHints.profileMissingCount} field(s) missing`}
          </p>
        </Link>
        <Link href={routes.client.company} className="cc-glass-card block hover:border-teal-500/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {profileHints.companyCompleteness != null ? `${profileHints.companyCompleteness}%` : "—"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {profileHints.companyCompleteness == null
              ? "Not linked yet"
              : profileHints.companyMissingCount === 0
                ? "Profile populated"
                : `${profileHints.companyMissingCount} gap(s)`}
          </p>
        </Link>
      </section>

      <ClientPortalApprovalBlocked reason={CLIENT_PORTAL_APPROVAL_BLOCKED_REASON} compact />

      <ClientPortalStatusCard
        title="Account connection"
        badge={
          linked ? "Linked" : staff ? "Staff preview" : "Not connected"
        }
        badgeTone={linked ? "success" : staff ? "info" : "warning"}
        description={
          linked
            ? `${snapshot.requests.length} request(s) linked to your sign-in.`
            : "No requests are linked to this account yet. Use the same email as your primary request contact."
        }
      >
        {!linked && (
          <Link href={routes.public.request} className="cc-btn-primary mt-4 inline-flex text-sm">
            Start a new request
          </Link>
        )}
      </ClientPortalStatusCard>

      {snapshot.requests.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Recent requests
          </h2>
          <ul className="space-y-3">
            {snapshot.requests.slice(0, 3).map((r) => (
              <li key={r.requestId}>
                <Link
                  href={routes.client.request(r.requestId)}
                  className="cc-glass-card block hover:border-teal-500/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{r.organizationName}</p>
                      <p className="font-mono text-xs text-slate-500">{r.referenceCode}</p>
                    </div>
                    <RequestStatusBadge status={r.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={routes.client.requests} className="text-sm text-teal-400 hover:text-teal-300">
            View all requests →
          </Link>
        </section>
      )}

      <ClientPortalStatusCard
        title="How ProCrow works with you"
        description="ProCrow (platform operations) reviews requests, prepares proposals and blueprints, and controls provisioning readiness."
      >
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          {snapshot.procrowCounterparts.slice(0, 3).map((c) => (
            <li key={c.area}>
              <span className="text-slate-300">{c.area}:</span> {c.procrowOwns}
            </li>
          ))}
        </ul>
      </ClientPortalStatusCard>
    </div>
  );
}
