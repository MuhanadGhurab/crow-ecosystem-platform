import { isDiscoveryReadOnly } from "@/lib/discovery-editability";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export function DiscoveryReadonlyBanner({ status }: { status: ImplementationRequestStatus }) {
  if (!isDiscoveryReadOnly(status)) return null;

  return (
    <p
      className="mb-6 rounded-cc-sm border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-sm text-slate-300"
      data-testid="discovery-readonly-banner"
    >
      Discovery is read-only for this request ({status.replace(/_/g, " ").toLowerCase()}). Answers
      are loaded from Postgres; open blueprint pricing to adjust commercial totals.
    </p>
  );
}
