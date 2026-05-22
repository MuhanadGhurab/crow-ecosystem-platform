import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { AI_EXTRAS } from "@/lib/constants/ai-extras";
import { EMPLOYEE_BANDS, typicalMarketMonthlySar } from "@/lib/constants/employee-bands";
import { CEM_MODULES } from "@/lib/constants/modules";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { SAREA_PACKAGES } from "@/lib/constants/sarea-packages";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";
import { calculateMonthlyEstimate, formatSar } from "@/lib/services/pricing.service";

const COMPARISON_HEADCOUNT = 150;

const meemIllustrative = calculateMonthlyEstimate({
  planKey: "enterprise",
  moduleKeys: ["logistics", "warehouse", "inventory", "crm", "hr"],
  securityPackageKeys: ["crow_sentinel", "crow_fortress"],
  employeeBand: "50-250",
  sareaPackageKey: "executive",
  aiExtraKeys: ["route_optimization", "demand_forecast", "anomaly_detection"],
});

const odooTypical = typicalMarketMonthlySar(COMPARISON_HEADCOUNT, "odoo");
const zohoTypical = typicalMarketMonthlySar(COMPARISON_HEADCOUNT, "zoho");
const crowVsOdooPct = Math.round((1 - meemIllustrative.totalMonthlySar / odooTypical) * 100);
const crowVsZohoPct = Math.round((1 - meemIllustrative.totalMonthlySar / zohoTypical) * 100);

export default function PricingPage() {
  return (
    <>
      <PublicPageHeader
        badge="Commercial catalog"
        title="Subscription tiers"
        description="Orchestration pricing for CEM + CyberCrow + SAREA — monthly SAR by tier and employee band, not a per-seat ERP clone. Deal totals finalize on your Enterprise Blueprint."
      />
      <div className="cc-public-section">
        <section>
          <h2 className="font-display text-lg font-semibold text-white">CEM platform tiers</h2>
          <p className="mt-2 text-sm text-slate-400">
            Base monthly platform fee before employee-band scale, module, security, SAREA, and AI add-ons.
            Prices excl. 15% VAT unless stated.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {SUBSCRIPTION_TIERS.map((t) => (
              <article key={t.key} className="cc-glass-card cc-engine-card--cem flex flex-col">
                <span className="cc-entity-badge cc-entity-badge--cem">CEM</span>
                <span className="mt-3 text-3xl">{t.icon}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{t.nameEn}</h3>
                <p className="text-sm text-slate-500">{t.nameAr}</p>
                <p className="mt-4 font-display text-2xl font-bold text-cc-star">
                  {t.baseMonthlySar.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-slate-400">SAR/mo</span>
                </p>
                <p className="mt-3 flex-1 text-sm text-slate-400">{t.descriptionEn}</p>
                <p className="mt-4 text-xs font-medium text-cyan-400">
                  Auth: {t.authMode === "entra_id" ? "Microsoft Entra ID SSO" : "Native"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">Employee band scale</h2>
          <p className="mt-2 text-sm text-slate-400">
            Monthly band fee on top of tier base — aligns MEEM-scale logistics (50–250) without per-user ERP math.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EMPLOYEE_BANDS.map((b) => (
              <li key={b.key} className="cc-list-item">
                <span className="font-medium text-white">{b.labelEn}</span>
                <span className="text-xs text-cyan-400">
                  {b.monthlyBandSar === 0 ? "Included in tier" : `+${b.monthlyBandSar.toLocaleString()} SAR/mo`}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">CEM module add-ons</h2>
          <p className="mt-2 text-sm text-slate-400">
            Selected at intake and seeded from your approved blueprint.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CEM_MODULES.map((m) => (
              <li key={m.key} className="cc-list-item cc-engine-card--cem">
                <span className="text-lg">{m.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-white">{m.nameEn}</span>
                  <span className="text-xs text-cyan-400">+{m.monthlyAddonSar.toLocaleString()} SAR/mo</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/modules" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
            Full module catalog →
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">CyberCrow security add-ons</h2>
          <p className="mt-2 text-sm text-slate-400">NCA-aware packages — violet entity in pipeline pricing.</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {SECURITY_PACKAGES.map((p) => (
              <li key={p.key} className="cc-glass-card cc-engine-card--cybercrow text-sm">
                <span className="text-xl">{p.icon}</span>
                <p className="mt-2 font-semibold text-white">{p.nameEn}</p>
                <p className="mt-1 text-violet-300">+{p.monthlyAddonSar.toLocaleString()} SAR/mo</p>
              </li>
            ))}
          </ul>
          <Link href="/security" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
            Security package details →
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">SAREA experience packages</h2>
          <p className="mt-2 text-sm text-slate-400">Frontline, Manager, and Executive persona density.</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {SAREA_PACKAGES.map((p) => (
              <li key={p.key} className="cc-glass-card cc-engine-card--sarea text-sm">
                <p className="font-semibold text-white">{p.label}</p>
                <p className="mt-1 text-rose-300">+{p.monthlySar.toLocaleString()} SAR/mo</p>
                <p className="mt-2 text-xs text-slate-500">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">AI extras</h2>
          <p className="mt-2 text-sm text-slate-400">
            Optional lines from discovery — priced below buying separate AI point tools.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {AI_EXTRAS.map((a) => (
              <li key={a.key} className="cc-list-item">
                <span className="font-medium text-white">{a.nameEn}</span>
                <span className="text-xs text-teal-300">+{a.monthlySar.toLocaleString()} SAR/mo</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-white">Typical market comparison</h2>
          <p className="mt-2 text-sm text-slate-400">
            Illustrative only — not a legal quote. All figures below are monthly SAR{" "}
            <strong className="font-medium text-slate-300">excluding 15% VAT</strong> (Odoo/Zoho references
            are market seat stacks; Crow is band-based). Typical enterprise ERP + security stack at{" "}
            {COMPARISON_HEADCOUNT} employees vs a comparable Crow bundle (logistics modules, Sentinel +
            Fortress, Executive SAREA, three AI extras, 50–250 band).
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Reference</th>
                  <th className="pb-3 pr-4 text-right font-medium">Monthly SAR (excl. VAT)</th>
                  <th className="pb-3 text-right font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Odoo Enterprise + security uplift</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatSar(odooTypical)}</td>
                  <td className="py-3 text-right text-xs text-slate-500">~USD 48/user/mo × {COMPARISON_HEADCOUNT}</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Zoho One + security uplift</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatSar(zohoTypical)}</td>
                  <td className="py-3 text-right text-xs text-slate-500">~USD 42/user/mo × {COMPARISON_HEADCOUNT}</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-cc-star">Crow bundle (illustrative)</td>
                  <td className="py-3 pr-4 text-right font-display font-semibold tabular-nums text-teal-300">
                    {formatSar(meemIllustrative.totalMonthlySar)}
                  </td>
                  <td className="py-3 text-right text-xs text-teal-400/90">
                    ~{crowVsOdooPct}% vs Odoo · ~{crowVsZohoPct}% vs Zoho
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-slate-500">Crow incl. VAT (15%)</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-slate-400">
                    {formatSar(meemIllustrative.totalInclVatSar, 2)}
                  </td>
                  <td className="py-2 text-right text-xs text-slate-500">
                    VAT {formatSar(meemIllustrative.vatAmountSar, 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="cc-glass-card mt-14 border-cc-star/20 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-400">
            Final commercial terms follow discovery and blueprint — totals recalc via pricing.service.
          </p>
          <p className="mt-2 text-xs text-slate-500">15% VAT applied at invoice.</p>
          <Link href="/request" className="cc-btn-primary mt-6 inline-block">
            Start implementation request
          </Link>
        </div>
      </div>
    </>
  );
}
