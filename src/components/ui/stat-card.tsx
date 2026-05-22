import type { EntityId } from "@/lib/entity-theme";



interface StatCardProps {

  label: string;

  value: string | number;

  hint?: string;

  accent?: "cyan" | "star" | "teal" | "violet" | "rose" | "amber" | "indigo";

  entity?: EntityId;

  trend?: "up" | "down" | "neutral";

}



const accentClass = {

  cyan: "text-cyan-300",

  star: "text-cc-star",

  teal: "text-teal-300",

  violet: "text-violet-300",

  indigo: "text-indigo-300",

  rose: "text-rose-300",

  amber: "text-amber-300",

};



const entityCardClass: Record<EntityId, string> = {

  cem: "cc-stat-card--cem",

  cybercrow: "cc-stat-card--cybercrow",

  sarea: "cc-stat-card--sarea",

};



export function StatCard({

  label,

  value,

  hint,

  accent = "cyan",

  entity,

  trend,

}: StatCardProps) {

  return (

    <div className={`cc-glass-card relative overflow-hidden !p-5 ${entity ? entityCardClass[entity] : ""}`}>

      {entity && (

        <div

          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl"

          style={{ background: "var(--entity-accent)" }}

          aria-hidden

        />

      )}

      <div className="relative">

        <div className="flex items-baseline gap-2">

          <p className={`font-display text-3xl font-bold tabular-nums ${accentClass[accent]}`}>

            {value}

          </p>

          {trend === "down" && (

            <span className="text-xs font-medium text-teal-400">↓</span>

          )}

          {trend === "up" && (

            <span className="text-xs font-medium text-rose-400">↑</span>

          )}

        </div>

        <p className="mt-1 text-sm font-medium text-white">{label}</p>

        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}

      </div>

    </div>

  );

}

