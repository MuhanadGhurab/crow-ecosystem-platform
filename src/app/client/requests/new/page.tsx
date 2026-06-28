import { ServiceRequestWizard } from "@/components/client-service-request/service-request-wizard";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { requireClientAccess } from "@/lib/auth/session";
import { deriveAccountScopeKey } from "@/lib/client-state/scoped-storage";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { routes } from "@/lib/routes";

export default async function ClientNewServiceRequestPage() {
  const user = await requireClientAccess(routes.client.requestNew);
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    throw new Error("Complete account registration before starting a service request.");
  }
  const accountScopeKey = deriveAccountScopeKey(account.id);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.home}
        backLabel="← Client home"
        eyebrow="Service request"
        title="Start a service request"
        description="Five focused steps — field, purpose, team, guidance, and submit. Crow handles the technical operating model during Discovery."
      />
      <ServiceRequestWizard accountScopeKey={accountScopeKey} />
    </div>
  );
}
