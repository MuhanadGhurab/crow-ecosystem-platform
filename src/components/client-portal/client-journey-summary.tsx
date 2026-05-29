import { ProductFlowStep } from "@/components/product/product-flow-step";
import { CLIENT_REQUEST_JOURNEY_STEPS } from "@/lib/constants/public-client-ux";

/** L3 — scannable client journey (informational). */
export function ClientJourneySummary() {
  return (
    <div className="cc-glass-card !p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your journey</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CLIENT_REQUEST_JOURNEY_STEPS.map((label, i) => (
          <ProductFlowStep key={label} index={i + 1} label={label} />
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-600">
        ProCrow owns review, provisioning readiness, and go-live discipline — F23-gated staging.
      </p>
    </div>
  );
}
