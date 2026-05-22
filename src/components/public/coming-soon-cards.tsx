const CASE_STUDY_PLACEHOLDERS = [
  {
    sector: "Logistics & supply chain",
    status: "Coming soon",
    summary: "Multi-branch CEM rollout with CyberCrow Sentinel and SAREA frontline density.",
  },
  {
    sector: "Retail & franchise",
    status: "Coming soon",
    summary: "Growth-tier blueprint with CRM, inventory modules, and NCA-aligned audit posture.",
  },
  {
    sector: "Healthcare & regulated",
    status: "Coming soon",
    summary: "Enterprise tier with Entra ID SSO, Fortress security package, and executive personas.",
  },
] as const;

export function ComingSoonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {CASE_STUDY_PLACEHOLDERS.map((card) => (
        <article key={card.sector} className="cc-glass-card flex flex-col opacity-90">
          <span className="cc-star-badge !text-[9px]">{card.status}</span>
          <h3 className="mt-3 font-display text-base font-semibold text-white">{card.sector}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{card.summary}</p>
        </article>
      ))}
    </div>
  );
}
