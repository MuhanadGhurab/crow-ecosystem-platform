import {
  COMMERCIAL_LIFECYCLE_SAFETY_COPY,
  COMMERCIAL_LIFECYCLE_STEPS,
} from "@/lib/constants/commercial-lifecycle";
import { ProductSection } from "@/components/product/product-section";

export function ProCrowCommercialLifecycleCard() {
  return (
    <ProductSection
      title="Commercial lifecycle"
      description="Staging clarity — manual commercial steps; no automated checkout."
    >
      <div className="cc-glass-card space-y-4 !p-5">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMERCIAL_LIFECYCLE_STEPS.map((step, i) => (
            <li key={step.id} className="rounded-lg border border-slate-700/50 bg-white/[0.02] p-3">
              <p className="font-mono text-[10px] font-bold text-cc-star">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-sm font-medium text-white">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.summary}</p>
              {step.paymentNote && (
                <p className="mt-2 text-[11px] text-amber-200/80">{step.paymentNote}</p>
              )}
            </li>
          ))}
        </ol>
        <p className="text-xs text-slate-500">{COMMERCIAL_LIFECYCLE_SAFETY_COPY}</p>
      </div>
    </ProductSection>
  );
}
