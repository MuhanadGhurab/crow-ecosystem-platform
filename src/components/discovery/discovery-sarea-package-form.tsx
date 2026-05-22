"use client";

import { useTransition } from "react";
import { saveSareaPackageDiscovery } from "@/lib/actions/discovery";
import { SAREA_PACKAGES, type SareaPackageKey } from "@/lib/constants/sarea-packages";
import { formatSar } from "@/lib/services/pricing.service";

export function DiscoverySareaPackageForm({
  requestId,
  currentKey,
  readOnly,
}: {
  requestId: string;
  currentKey: string | null;
  readOnly?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const selected = currentKey ?? "professional";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (readOnly) return;
    const key = e.target.value as SareaPackageKey;
    startTransition(() => saveSareaPackageDiscovery(requestId, key));
  }

  return (
    <form className="cc-glass-card space-y-4">
      <div>
        <label className="mb-1 block text-xs text-slate-500">SAREA experience package</label>
        <select
          name="sareaPackageKey"
          className="input-cc w-full max-w-md"
          value={selected}
          onChange={onChange}
          disabled={readOnly || pending}
        >
          {SAREA_PACKAGES.map((pkg) => (
            <option key={pkg.key} value={pkg.key}>
              {pkg.label} — {formatSar(pkg.monthlySar)}/mo
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-500">
          Saved to discovery and included in blueprint pricing (SAREA line on PricingEstimate).
        </p>
      </div>
      {pending && <p className="text-xs text-cyan-400">Saving package…</p>}
    </form>
  );
}
