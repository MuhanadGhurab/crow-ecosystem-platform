type Props = {
  compact?: boolean;
  showSareaNote?: boolean;
};

export function CybercrowSocPhilosophyBanner({ compact, showSareaNote }: Props) {
  return (
    <section
      className={
        compact
          ? "rounded-lg border border-violet-500/15 bg-violet-950/15 px-3 py-2 text-xs text-slate-400"
          : "rounded-lg border border-violet-500/20 bg-violet-950/20 px-4 py-3 text-sm"
      }
    >
      <p className={compact ? "font-medium text-violet-200" : "font-medium text-violet-100"}>
        CyberCrow protects the organization — observed activity, auditability, and advisory posture.
      </p>
      <p className={`mt-1 ${compact ? "text-[11px]" : "text-xs"} text-slate-400`}>
        This is not a SIEM replacement, autonomous AI detection, or guaranteed compliance
        certification. Language stays honest: risk indicators, review recommended, evidence readiness,
        workflow trust.
      </p>
      {showSareaNote ? (
        <p className={`mt-2 ${compact ? "text-[11px]" : "text-xs"} text-cyan-400/90`}>
          CyberCrow supplies security posture data. SAREA adapts the analyst experience. RBAC
          controls access.
        </p>
      ) : null}
    </section>
  );
}
