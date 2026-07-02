import { PublicBlueprintPreview } from "@/components/public-v2/public-blueprint-preview";
import { PublicRuntimePreview } from "@/components/public-v2/public-runtime-preview";
import { PublicSareaRolePreview } from "@/components/public-v2/public-sarea-role-preview";
import { PublicSection } from "@/components/public-v2/public-section";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

function ProgressConnector() {
  return (
    <div className="hidden items-center justify-center py-2 lg:flex" aria-hidden>
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-cyan-500/20" />
    </div>
  );
}

export function PublicBlueprintToWorkspaceSection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.blueprintToWorkspace}
      eyebrow="Product demonstration"
      title="From Blueprint to workspace"
      description="Crow defines the organization. The approved Blueprint becomes the build source. SAREA presents the correct permitted workspace. Runtime connects attention, work, decisions, evidence, and outcomes."
      variant="inset"
    >
      <div className="space-y-6">
        <PublicBlueprintPreview />
        <ProgressConnector />
        <p className="text-center text-xs text-slate-500 lg:hidden" aria-hidden>
          ↓ Same organization · different permitted presentation ↓
        </p>
        <PublicSareaRolePreview />
        <ProgressConnector />
        <p className="text-center text-xs text-slate-500 lg:hidden" aria-hidden>
          ↓ Connected runtime work areas ↓
        </p>
        <PublicRuntimePreview />
      </div>
    </PublicSection>
  );
}
