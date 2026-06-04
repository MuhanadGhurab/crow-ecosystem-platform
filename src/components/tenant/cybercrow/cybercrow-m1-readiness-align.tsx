import type { CyberCrowTenantTrustSnapshot } from "@/lib/cybercrow/cybercrow-tenant-trust-contract";
import { CYBERCROW_GRC_SAFE_TERMS } from "@/lib/constants/cybercrow-grc-readiness";

type Area = "evidence" | "grc" | "risk";

type Props = {
  area: Area;
  snapshot: CyberCrowTenantTrustSnapshot | null;
};

export function CybercrowM1ReadinessAlign({ area, snapshot }: Props) {
  if (!snapshot) return null;

  const copy =
    area === "evidence"
      ? {
          title: CYBERCROW_GRC_SAFE_TERMS.evidenceReadiness,
          body: `Sources: ${snapshot.evidence.evidenceSources.slice(0, 3).join(" · ")}. Missing: ${snapshot.evidence.missingEvidence.length} item(s). Operator checklist on dashboard.`,
        }
      : area === "grc"
        ? {
            title: CYBERCROW_GRC_SAFE_TERMS.compliancePosture,
            body: `${snapshot.grc.policyMapping}. ${snapshot.grc.controlMapping}. Not certified compliance.`,
          }
        : {
            title: "Risk register posture",
            body: `Level: ${snapshot.risk.riskLevel}. ${snapshot.risk.mainRisks.join(" · ") || "No open signals"}. Recommended mitigations are operator-owned — not autonomous remediation.`,
          };

  return (
    <section className="rounded-lg border border-violet-500/15 bg-violet-950/15 px-4 py-3 text-sm">
      <p className="font-medium text-violet-200">{copy.title}</p>
      <p className="mt-1 text-xs text-slate-400">{copy.body}</p>
    </section>
  );
}
