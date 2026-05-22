import Link from "next/link";
import { routes } from "@/lib/routes";
import { ENTITY_THEME } from "@/lib/entity-theme";

export function SareaStudioPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const theme = ENTITY_THEME.sarea;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-cc border border-rose-500/15 bg-gradient-to-br from-rose-950/25 via-cc-elevated/60 to-amber-950/15 p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-25 blur-3xl"
          style={{ background: theme.accent }}
          aria-hidden
        />
        <span className={theme.badgeClass}>Experience Studio</span>
        <h2 className="cc-section-title relative mt-3 text-xl sm:text-2xl">{title}</h2>
        <p className="relative mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      </div>
      {children}
      <p className="pt-4">
        <Link
          href={routes.sarea.overview}
          className="text-sm text-rose-400 transition hover:text-rose-300"
        >
          ← Studio overview
        </Link>
      </p>
    </div>
  );
}
