import Link from "next/link";
import { SareaOperatorNextActions, type SareaNextActionItem } from "@/components/sarea/sarea-operator-next-actions";
import { SareaPageHeader } from "@/components/sarea/sarea-page-header";
import { SareaStudioStrip } from "@/components/sarea/sarea-studio-strip";
import type { SareaUXArea } from "@/lib/constants/sarea-ux-depth";
import { routes } from "@/lib/routes";

export function SareaStudioPage({
  area,
  title,
  description,
  children,
  showStudioStrip = true,
  operatorActions,
}: {
  area?: SareaUXArea;
  title: string;
  description?: string;
  children: React.ReactNode;
  showStudioStrip?: boolean;
  operatorActions?: SareaNextActionItem[];
}) {
  return (
    <div className="space-y-6">
      {area ? (
        <SareaPageHeader area={area} title={title} description={description} />
      ) : (
        <div className="relative overflow-hidden rounded-cc-lg border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-slate-950/80 to-cyan-950/30 p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400">
            SAREA · Experience Studio
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
        </div>
      )}

      {area && showStudioStrip ? <SareaStudioStrip /> : null}

      {children}

      {operatorActions?.length ? <SareaOperatorNextActions items={operatorActions} /> : null}

      <p className="pt-4 text-xs text-slate-500">
        <Link href={routes.sarea.overview} className="text-rose-300 hover:text-rose-200">
          ← Studio overview
        </Link>
        {" · "}
        <Link href={routes.admin.overview} className="text-slate-500 hover:text-slate-300">
          ProCrow overview
        </Link>
      </p>
    </div>
  );
}
