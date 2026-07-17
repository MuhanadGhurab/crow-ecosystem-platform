import type { CrowBrandSurface } from "@/components/brand/types";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";

const SURFACE_COPY: Record<
  CrowBrandSurface,
  { title: string; emphasis: string }
> = {
  public: {
    title: "Public website",
    emphasis: "Ecosystem symbol — observation at platform scale",
  },
  account: { title: "Account portal", emphasis: "Guidance and entry" },
  client: {
    title: "Client portal",
    emphasis: "Organizational intelligence",
  },
  procrow: { title: "ProCrow", emphasis: "Orchestration and control" },
  business: { title: "Business portal", emphasis: "Coordinated work" },
  cybercrow: {
    title: "CyberCrow",
    emphasis: "Trust, observation, and protection",
  },
  sarea: { title: "SAREA", emphasis: "Adaptation and human understanding" },
  "architecture-lab": {
    title: "Architecture Lab",
    emphasis: "Brand reference prototype",
  },
};

export type CrowBrandSurfaceProps = {
  surface: CrowBrandSurface;
  className?: string;
};

export function CrowBrandSurface({ surface, className = "" }: CrowBrandSurfaceProps) {
  const copy = SURFACE_COPY[surface];
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 ${className}`}
    >
      <CrowMarkSvg
        variant="watermark"
        className="absolute -right-4 -top-4 h-24 w-24 opacity-40"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
        {copy.title}
      </p>
      <p className="mt-2 text-sm text-slate-300">{copy.emphasis}</p>
    </div>
  );
}
