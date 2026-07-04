import { PublicBlueprintPreview } from "@/components/public-v2/public-blueprint-preview";
import { PublicRuntimePreview } from "@/components/public-v2/public-runtime-preview";
import { PublicSareaRolePreview } from "@/components/public-v2/public-sarea-role-preview";
import { PublicSection } from "@/components/public-v2/public-section";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

export function PublicBlueprintToWorkspaceSection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.blueprintToWorkspace}
      eyebrow="Product demonstration"
      title="From Blueprint to workspace"
      description="Crow defines the organization. The approved Blueprint becomes the build source. SAREA presents the correct permitted workspace. Runtime connects attention, work, decisions, evidence, and outcomes."
      band="muted"
    >
      <div className="pv2-product-frame">
        <div className="pv2-product-rail" aria-hidden>
          <span className="rounded-full bg-[var(--pv2-violet-soft)] px-3 py-1 text-xs font-semibold text-[var(--pv2-violet)]">
            1 · Blueprint
          </span>
          <span className="text-[var(--pv2-text-muted)]">→</span>
          <span className="rounded-full bg-[var(--pv2-cyan-soft)] px-3 py-1 text-xs font-semibold text-[#0e7490]">
            2 · SAREA workspace
          </span>
          <span className="text-[var(--pv2-text-muted)]">→</span>
          <span className="rounded-full border border-[var(--pv2-border)] bg-[var(--pv2-surface)] px-3 py-1 text-xs font-semibold text-[var(--pv2-text-secondary)]">
            3 · Runtime work
          </span>
        </div>
        <PublicBlueprintPreview />
        <PublicSareaRolePreview />
        <PublicRuntimePreview />
      </div>
    </PublicSection>
  );
}
