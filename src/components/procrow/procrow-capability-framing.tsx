import { PROCROW_CAPABILITY_COPY } from "@/lib/constants/procrow-portal";
import type { EntityId } from "@/lib/entity-theme";

type ProCrowCapabilityFramingProps = {
  capability: keyof typeof PROCROW_CAPABILITY_COPY;
  className?: string;
};

const ENTITY_BADGE: Record<EntityId, string> = {
  cem: "cc-entity-badge",
  cybercrow: "cc-entity-badge cc-entity-badge--cybercrow",
  sarea: "cc-entity-badge cc-entity-badge--sarea",
};

const CAPABILITY_ENTITY: Record<keyof typeof PROCROW_CAPABILITY_COPY, EntityId> = {
  procrow: "cem",
  cybercrow: "cybercrow",
  sarea: "sarea",
  runtimeCohesion: "cem",
  customerFlow: "cem",
  deployment: "cem",
};

/** Compact banner: capability is part of ProCrow, not a separate product silo. */
export function ProCrowCapabilityFraming({
  capability,
  className = "",
}: ProCrowCapabilityFramingProps) {
  const copy = PROCROW_CAPABILITY_COPY[capability];
  const entity = CAPABILITY_ENTITY[capability];

  return (
    <div
      className={`rounded-cc border border-white/10 bg-white/[0.02] px-4 py-3 ${className}`.trim()}
      data-procrow="capability-framing"
    >
      <span className={ENTITY_BADGE[entity]}>{copy.tagline}</span>
      <p className="mt-2 text-sm text-slate-400">{copy.description}</p>
    </div>
  );
}
