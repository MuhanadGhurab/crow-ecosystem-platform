import { OnboardingPipelineContext } from "@/components/admin/onboarding-pipeline-context";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

/** Request-detail pipeline map — delegates to shared onboarding bridge. */
export function RequestPipelineLinks({
  requestId,
  status,
  blueprintId,
  tenantSlug,
  discoveryAvailable,
}: {
  requestId: string;
  status: ImplementationRequestStatus;
  blueprintId: string | null;
  tenantSlug: string | null;
  discoveryAvailable: boolean;
}) {
  return (
    <OnboardingPipelineContext
      requestId={requestId}
      status={status}
      blueprintId={blueprintId}
      tenantSlug={tenantSlug}
      discoveryAvailable={discoveryAvailable}
      current="request"
    />
  );
}
