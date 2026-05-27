import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  SAREA_COPY,
  SAREA_IDENTITY,
  SAREA_UX_AREA_LABELS,
  type SareaUXArea,
} from "@/lib/constants/sarea-ux-depth";

type SareaPageHeaderProps = {
  area: SareaUXArea;
  title: string;
  description?: string;
};

export function SareaPageHeader({ area, title, description }: SareaPageHeaderProps) {
  const areaLabel = SAREA_UX_AREA_LABELS[area];

  return (
    <header className="relative overflow-hidden rounded-cc-lg border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-slate-950/80 to-cyan-950/30 p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400">
        {SAREA_IDENTITY.procrowCapability}
      </p>
      <p className="mt-1 text-xs text-slate-500">{areaLabel}</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-white">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm text-slate-400">{description}</p> : null}
      <p className="mt-2 text-xs text-slate-500">{SAREA_IDENTITY.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link href={routes.admin.overview} className="text-rose-300 hover:text-rose-200">
          ProCrow overview →
        </Link>
        <Link href={routes.sarea.overview} className="text-cyan-300 hover:text-cyan-200">
          SAREA studio →
        </Link>
      </div>
      <p className="mt-3 text-[11px] text-slate-600">{SAREA_COPY.procrowOwnership}</p>
    </header>
  );
}
