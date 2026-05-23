import { MOCK_SAREA_MONTHLY_SAR } from "@/lib/mock/pipeline";
import { formatSar } from "@/lib/commercial-display";
import { SAUDI_VAT_RATE } from "@/lib/services/pricing.service";

export type PricingBreakdown = {
  baseMonthlySar: number;
  modulesMonthlySar: number;
  securityMonthlySar: number;
  totalMonthlySar: number;
  sareaMonthlySar?: number;
  vatRate?: number;
  vatAmountSar?: number;
  totalInclVatSar?: number;
};

type PricingHeroPanelProps = {
  breakdown: PricingBreakdown;
  storedTotal?: number | null;
  proposalStatusLabel?: string;
  footer?: React.ReactNode;
  className?: string;
};

export function PricingHeroPanel({
  breakdown,
  storedTotal,
  proposalStatusLabel,
  footer,
  className = "",
}: PricingHeroPanelProps) {
  const subtotalExclVat = storedTotal ?? breakdown.totalMonthlySar;
  const vatRate = breakdown.vatRate ?? SAUDI_VAT_RATE;
  const vatAmount =
    breakdown.vatAmountSar ?? Math.round(subtotalExclVat * vatRate * 100) / 100;
  const totalInclVat =
    breakdown.totalInclVatSar ?? Math.round((subtotalExclVat + vatAmount) * 100) / 100;
  const showVat = vatRate > 0;
  const sarea = breakdown.sareaMonthlySar ?? MOCK_SAREA_MONTHLY_SAR;

  const lines = [
    { key: "base", label: "Base plan (CEM)", amount: breakdown.baseMonthlySar, entity: "cem" as const },
    { key: "modules", label: "Modules add-on", amount: breakdown.modulesMonthlySar, entity: "cem" as const },
    {
      key: "security",
      label: "CyberCrow security",
      amount: breakdown.securityMonthlySar,
      entity: "cybercrow" as const,
    },
    { key: "sarea", label: "SAREA experience", amount: sarea, entity: "sarea" as const },
  ];

  return (
    <aside className={`cc-pricing-panel ${className}`.trim()}>
      <header className="cc-pricing-panel-header">
        <span className="cc-star-badge">Pricing control room</span>
        {proposalStatusLabel && (
          <p className="mt-2 text-xs text-slate-400">
            Proposal · <span className="text-white">{proposalStatusLabel}</span>
          </p>
        )}
      </header>

      <ul className="cc-pricing-lines">
        {lines.map((line) => (
          <li key={line.key} className={`cc-pricing-line cc-pricing-line--${line.entity}`}>
            <span className="cc-pricing-line-label">{line.label}</span>
            <span className="cc-pricing-line-amount">{formatSar(line.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="cc-pricing-totals space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-slate-400">Subtotal (excl. VAT)</span>
          <span className="tabular-nums text-slate-200">
            {formatSar(subtotalExclVat)}
            <span className="text-xs text-slate-500"> / mo</span>
          </span>
        </div>
        {showVat && (
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-slate-400">VAT ({Math.round(vatRate * 100)}%)</span>
            <span className="tabular-nums text-slate-300">{formatSar(vatAmount, 2)}</span>
          </div>
        )}
        <div className="cc-pricing-total">
          <span className="cc-pricing-total-label">
            {showVat ? "Total (incl. VAT)" : "Total estimated"}
          </span>
          <p className="cc-pricing-total-value">
            {formatSar(showVat ? totalInclVat : subtotalExclVat, showVat ? 2 : 0)}
            <span className="cc-pricing-total-unit"> / month</span>
          </p>
        </div>
        {showVat && (
          <p className="text-[10px] leading-relaxed text-slate-500">15% VAT applied at invoice.</p>
        )}
      </div>

      {footer && <div className="cc-pricing-panel-footer">{footer}</div>}
    </aside>
  );
}
