import type { EntityId } from "@/lib/entity-theme";

import { ENTITY_THEME } from "@/lib/entity-theme";



interface PagePlaceholderProps {

  area: string;

  route: string;

  description?: string;

  entity?: EntityId;

}



export function PagePlaceholder({

  area,

  route,

  description,

  entity = "cem",

}: PagePlaceholderProps) {

  const theme = ENTITY_THEME[entity];



  return (

    <div

      className="cc-glass-card border-dashed !bg-white/[0.02] text-center"

      style={{ borderColor: "var(--entity-border)" }}

    >

      <div

        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ring-1"

        style={{

          background: `linear-gradient(135deg, ${theme.accentMuted}33, ${theme.accent}22)`,

          borderColor: "var(--entity-border)",

        }}

      >

        <span className="text-xl text-cc-star" aria-hidden>

          ✦

        </span>

      </div>

      <span className={theme.badgeClass}>{area}</span>

      <p className="mt-3 font-mono text-sm text-slate-300">{route}</p>

      {description && (

        <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">{description}</p>

      )}

      <p className="mt-6 text-xs text-slate-600">Route shell — full UI implementation pending</p>

    </div>

  );

}

