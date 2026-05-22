import { ENTITY_THEME } from "@/lib/entity-theme";

type DeptChipsProps = {
  hasSecurity?: boolean;
  hasModules?: boolean;
  showSarea?: boolean;
  className?: string;
};

/** Platform dept ownership — CyberCrow (security), SAREA (experience), Crow (CEM/plan). */
export function DeptChips({
  hasSecurity = true,
  hasModules = true,
  showSarea = true,
  className = "",
}: DeptChipsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`.trim()} aria-label="Department ownership">
      <span className="cc-dept-chip cc-dept-chip--platform" title="Crow platform / CEM">
        <span className="cc-dept-chip-dot bg-cyan-400" aria-hidden />
        Crow · {ENTITY_THEME.cem.shortLabel}
      </span>
      {hasModules && (
        <span className="cc-dept-chip cc-dept-chip--cem" title="CEM modules & provisioning">
          <span className="cc-dept-chip-dot bg-cyan-400" aria-hidden />
          {ENTITY_THEME.cem.shortLabel}
        </span>
      )}
      {hasSecurity && (
        <span className="cc-dept-chip cc-dept-chip--cybercrow" title="CyberCrow security dept">
          <span className="cc-dept-chip-dot bg-violet-400" aria-hidden />
          {ENTITY_THEME.cybercrow.shortLabel}
        </span>
      )}
      {showSarea && (
        <span
          className="cc-dept-chip cc-dept-chip--sarea"
          title="SAREA experience — customer acceptance at go-live"
        >
          <span className="cc-dept-chip-dot bg-rose-400" aria-hidden />
          {ENTITY_THEME.sarea.shortLabel}
        </span>
      )}
    </div>
  );
}
