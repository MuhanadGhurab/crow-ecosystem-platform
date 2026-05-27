import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientProfilePageModel } from "@/lib/services/client-profile.service";
import { routes } from "@/lib/routes";

export default async function ClientSettingsPage() {
  const user = await requireClientAccess(routes.client.settings);
  const model = await buildClientProfilePageModel(user);
  const { profile } = model;

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        title="Settings"
        description="Account and security readiness for the Client Portal. Advanced preferences arrive in a later phase."
      />

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
        description="Email notifications for proposal updates and onboarding milestones are planned for a future release."
      />

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
        <ul className="mt-3 list-inside list-disc text-sm text-slate-500">
          <li>Notification preferences</li>
          <li>Delegated reviewers (organization contacts)</li>
          <li>Two-factor guidance</li>
          <li>Data export requests</li>
        </ul>
      </ClientPortalStatusCard>
    </div>
  );
}
