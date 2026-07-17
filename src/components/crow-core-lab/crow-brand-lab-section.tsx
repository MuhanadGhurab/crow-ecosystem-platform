import { CrowBrandSurface } from "@/components/brand/crow-brand-surface";
import { CrowHeroBackground } from "@/components/brand/crow-hero-background";
import { CrowLoadingMark } from "@/components/brand/crow-loading-mark";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { ProductSection } from "@/components/product/product-section";

const VARIANTS = [
  { label: "Primary", variant: "primary" as const },
  { label: "Motion", variant: "motion" as const },
  { label: "Hero", variant: "hero" as const },
  { label: "Monochrome", variant: "monochrome" as const },
  { label: "Watermark", variant: "watermark" as const },
  { label: "High contrast", variant: "high-contrast" as const },
];

const SURFACES = [
  "public",
  "account",
  "client",
  "procrow",
  "business",
  "cybercrow",
  "sarea",
] as const;

export function CrowBrandLabSection() {
  return (
    <>
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
        Brand reference prototype — not final trademark or legal clearance. One Crow identity
        with contextual surface treatment across portals.
      </div>

      <ProductSection
        title="Crow Brand Identity"
        description="Canonical marks, loader continuity, homepage hero concept, and portal surfaces (C3)."
      >
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {VARIANTS.map((item) => (
            <div
              key={item.variant}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <CrowMarkSvg variant={item.variant} className="h-12 w-12" />
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </ProductSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductSection title="Loading mark" description="Shared motion outline — stops after startup.">
          <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-white/10 bg-[#04060c]">
            <CrowLoadingMark />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Reduced-motion: static outline with simple fade (see globals.css).
          </p>
        </ProductSection>

        <ProductSection
          title="Homepage hero concept"
          description="Balanced intensity, center-right — text remains primary."
        >
          <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-[#04060c]">
            <CrowHeroBackground intensity="balanced" position="center-right" motion="none" />
            <div className="relative z-10 flex h-full items-center px-6">
              <p className="max-w-[14rem] text-sm font-semibold text-white">
                Headline &amp; CTAs stay above the Crow atmosphere
              </p>
            </div>
          </div>
        </ProductSection>
      </div>

      <ProductSection title="Portal identity surfaces" description="One Crow — contextual emphasis per surface.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((surface) => (
            <CrowBrandSurface key={surface} surface={surface} />
          ))}
        </div>
      </ProductSection>

      <ProductSection title="Mobile simplification" description="Watermark-scale mark for small viewports.">
        <div className="relative h-32 overflow-hidden rounded-xl border border-white/10 bg-[#04060c]">
          <CrowMarkSvg
            variant="watermark"
            className="absolute -right-6 top-1/2 h-40 w-40 -translate-y-1/2"
          />
          <p className="relative z-10 p-4 text-sm text-slate-300">
            Simplified silhouette — network hidden, reduced opacity on narrow screens.
          </p>
        </div>
      </ProductSection>
    </>
  );
}
