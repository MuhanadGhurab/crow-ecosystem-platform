import { shouldUseMockDiscovery } from "@/lib/mock/discovery";

/** Shown when discovery reads from mocks — writes do not persist without Postgres. */
export function DiscoveryMockBanner({ requestId }: { requestId: string }) {
  if (!shouldUseMockDiscovery(requestId)) return null;

  return (
    <div
      className="cc-alert-warning mb-6"
      role="status"
      data-testid="discovery-mock-banner"
    >
      <strong className="font-medium">Demo mode.</strong> Changes are not saved — connect
      Postgres and turn off <code className="text-amber-200/90">USE_MOCK_DATA</code> to persist
      discovery answers.
    </div>
  );
}
