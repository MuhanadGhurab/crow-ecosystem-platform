import { ServiceRequestWizard } from "@/components/client-service-request/service-request-wizard";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function ClientNewServiceRequestPage() {
  await requireClientAccess(routes.client.requestNew);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.home}
        backLabel="← Client home"
        eyebrow="Service request"
        title="Start a service request"
        description="Five focused steps — field, purpose, team, guidance, and submit. Crow handles the technical operating model during Discovery."
      />
      <ServiceRequestWizard />
    </div>
  );
}
