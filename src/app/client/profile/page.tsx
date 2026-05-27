import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { routes } from "@/lib/routes";

export default async function ClientProfilePage() {
  const user = await requireClientAccess(routes.client.profile);
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const account = snapshot.account;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Profile</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your sign-in identity for the Client Portal. Company details live under Company.
        </p>
      </div>

      <ClientPortalStatusCard title="Signed-in account" badge="Read-only" badgeTone="info">
        {account ? (
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="text-white">{account.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Display name</dt>
              <dd className="text-white">{account.displayName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Access</dt>
              <dd className="text-white capitalize">{account.accessLevel}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-400">Sign in to view profile details.</p>
        )}
      </ClientPortalStatusCard>
    </div>
  );
}
