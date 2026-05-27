import Link from "next/link";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { routes } from "@/lib/routes";

export default async function ClientCompanyPage() {
  const user = await requireClientAccess(routes.client.company);
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const profile = snapshot.companyProfile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Company</h1>
        <p className="mt-2 text-sm text-slate-400">
          Organization profile from your linked implementation request. Editing will arrive in a
          later phase.
        </p>
      </div>

      {profile ? (
        <ClientPortalStatusCard
          title={profile.companyName}
          badge={`${profile.profileCompleteness}% complete`}
          badgeTone={profile.missingFields.length === 0 ? "success" : "warning"}
        >
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Industry</dt>
              <dd className="text-white">{profile.industry ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Employee band</dt>
              <dd className="text-white">{profile.employeeBand ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Region</dt>
              <dd className="text-white">{profile.region ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Primary contact</dt>
              <dd className="text-white">
                {profile.primaryContactName ?? "—"}
                {profile.primaryContactEmail && (
                  <span className="block text-slate-400">{profile.primaryContactEmail}</span>
                )}
              </dd>
            </div>
          </dl>
          {profile.missingFields.length > 0 && (
            <p className="mt-4 text-xs text-amber-200/80">
              Missing: {profile.missingFields.join(", ")} — ProCrow may request updates during
              discovery.
            </p>
          )}
        </ClientPortalStatusCard>
      ) : (
        <ClientPortalStatusCard
          title="Company not connected yet"
          badge="Pending linkage"
          badgeTone="warning"
          description="When a request is linked to your account, your organization profile will appear here."
        >
          <Link href={routes.public.request} className="cc-btn-primary mt-4 inline-flex text-sm">
            Submit a request
          </Link>
        </ClientPortalStatusCard>
      )}
    </div>
  );
}
