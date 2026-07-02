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
    >
      <PublicFoundationDiagram />

      <div className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-200/90">
          Trust evidence
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PUBLIC_TRUST_EVIDENCE.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2 text-sm text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </PublicSection>
  );
}
