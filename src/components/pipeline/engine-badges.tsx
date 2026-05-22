import { ENTITY_THEME } from "@/lib/entity-theme";

/** Sibling engines on go-live / readiness — CEM · CyberCrow · SAREA */
export function EngineBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`cc-engine-badges ${className}`.trim()} aria-label="Ecosystem engines">
      {(["cem", "cybercrow", "sarea"] as const).map((id) => (
        <span key={id} className={`cc-engine-badge cc-engine-badge--${id}`}>
          <span className="cc-engine-badge-dot" aria-hidden />
          {ENTITY_THEME[id].shortLabel}
        </span>
      ))}
    </div>
  );
}
