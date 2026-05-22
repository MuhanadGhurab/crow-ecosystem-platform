import type { CrowEngineEntity } from "@/components/public/crow-engine-card";

interface PlatformCardProps {
  entity?: CrowEngineEntity;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
}

const ENTITY_GLOW: Record<CrowEngineEntity, string> = {
  cem: "from-cyan-600/20 to-teal-500/10",
  cybercrow: "from-violet-600/20 to-indigo-500/10",
  sarea: "from-rose-600/20 to-amber-500/10",
  discovery: "from-amber-500/15 to-cc-star/10",
  blueprint: "from-violet-600/18 to-cyan-500/10",
};

const ENTITY_LABEL: Record<CrowEngineEntity, string> = {
  cem: "text-cyan-400",
  cybercrow: "text-violet-400",
  sarea: "text-rose-300",
  discovery: "text-amber-300",
  blueprint: "text-violet-300",
};

export function PlatformCard({
  entity = "blueprint",
  name,
  fullName,
  tagline,
  description,
}: PlatformCardProps) {
  const glow = ENTITY_GLOW[entity];
  const label = ENTITY_LABEL[entity];

  return (
    <article className={`cc-bento-card cc-engine-card--${entity} group relative overflow-hidden lg:p-8`}>
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${glow} blur-2xl transition duration-500 group-hover:scale-110`}
        aria-hidden
      />
      <span className={`cc-entity-badge cc-entity-badge--${entity}`}>{name}</span>
      <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">{fullName}</h3>
      <p className={`mt-3 text-sm font-medium italic ${label}`}>{tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{description}</p>
      <div
        className="mt-6 h-px w-12 bg-gradient-to-r from-current to-transparent opacity-40"
        style={{ color: "var(--entity-accent, #22d3ee)" }}
        aria-hidden
      />
    </article>
  );
}
