import { PublicFoundationDiagram } from "@/components/public-v2/public-foundation-diagram";
import { PublicSection } from "@/components/public-v2/public-section";
import { PUBLIC_TRUST_EVIDENCE } from "@/lib/public-v2/representative-data";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

export function PublicGovernedFoundationSection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.governedFoundation}
      eyebrow="Architecture"
      title="One governed foundation"
      description="Four coordinated responsibilities support one organization — not four disconnected products."
      band="muted"
    >
      <PublicFoundationDiagram />

      <div className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--pv2-amber)]">
          Trust evidence
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PUBLIC_TRUST_EVIDENCE.map((item) => (
            <li key={item} className="pv2-trust-chip">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv2-amber)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </PublicSection>
  );
}
