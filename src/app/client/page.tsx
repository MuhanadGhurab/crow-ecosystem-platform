import Link from "next/link";
import { ClientOnboardingDashboardTile } from "@/components/client-portal/client-onboarding-dashboard-tile";
import { ClientJourneySummary } from "@/components/client-portal/client-journey-summary";
import { ClientNextActionPanel } from "@/components/client-portal/client-next-action-panel";
import { CommercialLifecycleMini } from "@/components/product/commercial-lifecycle-mini";
import { CLIENT_PORTAL_PURPOSE } from "@/lib/constants/public-client-ux";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { ClientPortalTrustStrip } from "@/components/client-portal/client-portal-trust-strip";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientOnboardingDashboardTile } from "@/lib/services/client-onboarding.service";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { buildClientProfileDashboardHints } from "@/lib/services/client-profile.service";
import { routes } from "@/lib/routes";

export default async function ClientPortalHomePage() {
  const user = await requireClientAccess(routes.client.home);
  const [snapshot, profileHints, onboardingTile] = await Promise.all([
    buildClientPortalDashboardSnapshot(user),
    buildClientProfileDashboardHints(user),
    buildClientOnboardingDashboardTile(user),
  ]);

  const linked = snapshot.authState === "authenticated_linked";
  const staff = snapshot.authState === "platform_staff";

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Client Portal"
        title="Request and configure Crow"
        description={CLIENT_PORTAL_PURPOSE}
      />
      {staff && (
        <p className="cc-alert-warning text-sm">
          Staff preview — you are viewing the client area as platform staff. Client linkage and
          approval rules still apply.
        </p>
      )}

      <ClientPortalTrustStrip />

      <ClientNextActionPanel snapshot={snapshot} />
      <ClientJourneySummary />
      <CommercialLifecycleMini variant="client" />

      <ClientOnboardingDashboardTile tile={onboardingTile!} />

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href={routes.client.profile} className="cc-home-card block">
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
        <Link href={routes.client.company} className="cc-home-card block">
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
                  className="cc-home-card block"
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
          <Link href={routes.client.requests} className="text-sm text-cyan-300/90 hover:text-cyan-200">
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
