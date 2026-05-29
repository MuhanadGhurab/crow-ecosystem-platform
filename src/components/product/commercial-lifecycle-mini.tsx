import { COMMERCIAL_LIFECYCLE_SAFETY_COPY, COMMERCIAL_LIFECYCLE_STEPS } from "@/lib/constants/commercial-lifecycle";
import { PRICING_COMMERCIAL_HONESTY } from "@/lib/constants/public-client-ux";

type CommercialLifecycleMiniProps = {
  variant?: "public" | "client";
};

export function CommercialLifecycleMini({ variant = "public" }: CommercialLifecycleMiniProps) {
  const highlights =
    variant === "public"
      ? [
          PRICING_COMMERCIAL_HONESTY.setupFee,
          PRICING_COMMERCIAL_HONESTY.subscription,
          PRICING_COMMERCIAL_HONESTY.onboardingSupport,
        ]
      : [
          "Scope approval confirms interest — not payment.",
          PRICING_COMMERCIAL_HONESTY.setupFee,
          PRICING_COMMERCIAL_HONESTY.subscription,
        ];

  return (
    <div className="cc-glass-card space-y-3 !p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Commercial lifecycle</p>
      <ul className="space-y-2 text-xs text-slate-400">
        {highlights.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
      <p className="text-[10px] text-slate-600">{COMMERCIAL_LIFECYCLE_SAFETY_COPY}</p>
      <details className="text-[10px] text-slate-600">
        <summary className="cursor-pointer text-slate-500">Full lifecycle steps</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          {COMMERCIAL_LIFECYCLE_STEPS.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
