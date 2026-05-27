import { SAREA_COPY } from "@/lib/constants/sarea-ux-depth";

type SareaExperienceBoundaryNoteProps = {
  variant?: "default" | "navigation" | "preview" | "widgets" | "mapping";
};

const VARIANT_COPY: Record<NonNullable<SareaExperienceBoundaryNoteProps["variant"]>, string> = {
  default: SAREA_COPY.rbacBoundary,
  navigation: SAREA_COPY.navigationPurpose,
  preview: SAREA_COPY.previewPurpose,
  widgets: SAREA_COPY.widgetsPurpose,
  mapping: SAREA_COPY.mappingPurpose,
};

export function SareaExperienceBoundaryNote({
  variant = "default",
}: SareaExperienceBoundaryNoteProps) {
  return (
    <section className="rounded-lg border border-cyan-500/15 bg-cyan-950/15 px-4 py-3 text-xs text-slate-400">
      <p className="font-medium text-cyan-200">RBAC vs SAREA</p>
      <p className="mt-1">{VARIANT_COPY[variant]}</p>
    </section>
  );
}
