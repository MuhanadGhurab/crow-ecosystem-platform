import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function ClientSettingsPage() {
  await requireClientAccess(routes.client.settings);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Notification and security preferences will be added in a later phase.
        </p>
      </div>

      <ClientPortalStatusCard
        title="Coming soon"
        badge="Placeholder"
        description="Email notifications, session security, and delegation settings are planned for I4+."
      />

      <ClientPortalStatusCard title="Security reminders">
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
          <li>Sign in with the same email as your request contact to link requests.</li>
          <li>Proposal email links do not grant approval without Client Portal sign-in.</li>
          <li>ProCrow staff manage internal review — not visible in client settings.</li>
        </ul>
      </ClientPortalStatusCard>
    </div>
  );
}
