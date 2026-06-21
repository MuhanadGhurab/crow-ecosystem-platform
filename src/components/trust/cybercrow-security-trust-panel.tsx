"use client";

import {
  COMPLIANCE_ALIGNMENT_DISCLAIMER,
  COMPLIANCE_ALIGNMENT_STATEMENT,
  COMPLIANCE_REFERENCE_STANDARDS,
} from "@/lib/legal/compliance-positioning";
import { CYBERCROW_SECURITY_LAYERS } from "@/lib/constants/cybercrow-security-layers";

type Props = {
  /** Compact layout for account legal sidebar; default full section */
  variant?: "full" | "compact";
  className?: string;
};

export function CyberCrowSecurityTrustPanel({
  variant = "full",
  className = "",
}: Props) {
  const isCompact = variant === "compact";

  return (
    <section
      className={`rounded-xl border border-violet-500/20 bg-violet-950/20 p-6 ${className}`}
      aria-labelledby="cybercrow-trust-heading"
    >
      <h2
        id="cybercrow-trust-heading"
        className={`font-semibold text-white ${isCompact ? "text-base" : "text-lg"}`}
      >
        CyberCrow Security &amp; Trust
      </h2>
      <p className="mt-2 text-sm text-violet-100/80">
        Informational overview of Crow&apos;s seven-layer security model. This section does not
        grant access, replace your security stack, or imply certification.
      </p>

      <p className="mt-4 text-sm font-medium text-violet-200/90">{COMPLIANCE_ALIGNMENT_STATEMENT}</p>
      <p className="mt-2 text-xs text-violet-200/70">{COMPLIANCE_ALIGNMENT_DISCLAIMER}</p>

      {!isCompact && (
        <ul className="mt-4 list-inside list-disc text-xs text-violet-200/60">
          {COMPLIANCE_REFERENCE_STANDARDS.map((ref) => (
            <li key={ref}>{ref}</li>
          ))}
        </ul>
      )}

      <ol className={`mt-6 space-y-4 ${isCompact ? "text-sm" : ""}`}>
        {CYBERCROW_SECURITY_LAYERS.map((layer) => (
          <li key={layer.id} className="border-l-2 border-violet-500/30 pl-4">
            <p className="font-medium text-white">
              {layer.order}. {layer.name}
            </p>
            <p className="mt-1 text-sm text-slate-400">{layer.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
