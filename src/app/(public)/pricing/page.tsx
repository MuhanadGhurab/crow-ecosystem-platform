import Link from "next/link";
import { CommercialLifecycleMini } from "@/components/product/commercial-lifecycle-mini";
import { CrowMotif } from "@/components/public/crow-motif";
import { PublicRequestGateNote } from "@/components/public/public-request-gate-note";
import { PRICING_COMMERCIAL_HONESTY } from "@/lib/constants/public-client-ux";
import { PricingTierCard } from "@/components/public/pricing-tier-card";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSectionIntro } from "@/components/public/public-section-intro";
import { AI_EXTRAS } from "@/lib/constants/ai-extras";
import { PRICING_EMPLOYEE_BANDS, typicalMarketMonthlySar } from "@/lib/constants/employee-bands";
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
        title={
          <>
            Subscription tiers{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-rose-300 bg-clip-text text-transparent">
              & bands
            </span>
          </>
        }
        description="Advisory catalog pricing for CEM + CyberCrow + SAREA — final quote follows discovery and blueprint. Checkout is not enabled on this site."
      />

      <div className="cc-public-section space-y-16">
        <CommercialLifecycleMini variant="public" />
        <PublicRequestGateNote />
        <p className="text-sm text-slate-500">{PRICING_COMMERCIAL_HONESTY.advisory}</p>
        <section className="cc-public-band relative overflow-hidden rounded-2xl border border-cyan-500/15 p-6 sm:p-8">
          <CrowMotif variant="wing" className="pointer-events-none absolute -end-4 top-4 h-20 w-24 opacity-15" />
          <PublicSectionIntro
            badge="CEM platform"
            title="Platform tiers"
            description={
              <>
                Base monthly platform fee before employee-band scale, module, security, SAREA, and AI
                add-ons. Prices <strong className="text-slate-300">excl. 15% VAT</strong> unless stated.
              </>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SUBSCRIPTION_TIERS.map((t, i) => (
              <PricingTierCard
                key={t.key}
                entity="cem"
                badge="CEM"
                icon={t.icon}
                title={t.nameEn}
                subtitle={t.nameAr}
                highlight={i === 1}
                price={
                  <>
                    {t.baseMonthlySar.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-slate-400">SAR/mo</span>
                  </>
                }
                footer={
                  t.authMode === "entra_id" ? "Microsoft Entra ID SSO" : "Native authentication"
                }
              >
                {t.descriptionEn}
              </PricingTierCard>
            ))}
          </div>
        </section>

        <section>
          <PublicSectionIntro
            badge="Scale"
            title="Employee band fees"
            description="Monthly band fee on top of tier base — one scale ladder from startup to enterprise headcount."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PRICING_EMPLOYEE_BANDS.map((b) => (
              <li
                key={b.key}
                className="cc-bento-stat flex items-center justify-between gap-3 rounded-xl border border-cyan-500/10 bg-white/[0.03] px-4 py-3"
              >
                <span className="font-medium text-white">{b.labelEn}</span>
                <span className="shrink-0 text-xs font-medium text-cyan-400">
                  {b.monthlyBandSar === 0 ? "Included" : `+${b.monthlyBandSar.toLocaleString()} SAR/mo`}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cc-public-band rounded-2xl border border-cyan-500/10 p-6 sm:p-8">
          <PublicSectionIntro
            badge="Modules"
            title="CEM module add-ons"
            description="Selected at intake and seeded from your approved blueprint."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CEM_MODULES.map((m) => (
              <li
                key={m.key}
                className="cc-list-item cc-engine-card--cem flex items-center gap-3 transition hover:border-cyan-500/25"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 font-mono text-[10px] font-bold uppercase tracking-wide text-cyan-300"
                  aria-hidden
                >
                  {m.key.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-white">{m.nameEn}</span>
                  <span className="text-xs text-cyan-400">+{m.monthlyAddonSar.toLocaleString()} SAR/mo</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/modules" className="mt-6 inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
            Full module catalog →
          </Link>
        </section>

        <section>
          <PublicSectionIntro
            badge="CyberCrow"
            title="Security packages"
            description="NCA-aware packages — violet entity in pipeline pricing."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {SECURITY_PACKAGES.map((p) => (
              <PricingTierCard
                key={p.key}
                entity="cybercrow"
                badge="CyberCrow"
                icon={p.icon}
                title={p.nameEn}
                price={
                  <>
                    +{p.monthlyAddonSar.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-violet-300/90">SAR/mo</span>
                  </>
                }
              >
                {p.descriptionEn}
              </PricingTierCard>
            ))}
          </ul>
          <Link href="/security" className="mt-6 inline-flex text-sm text-violet-300 hover:text-violet-200">
            Security package details →
          </Link>
        </section>

        <section className="cc-public-band rounded-2xl border border-rose-500/10 p-6 sm:p-8">
          <PublicSectionIntro
            badge="SAREA"
            title="Experience packages"
            description="Frontline, Manager, and Executive persona density — validated with your team at go-live."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {SAREA_PACKAGES.map((p) => (
              <PricingTierCard
                key={p.key}
                entity="sarea"
                badge="SAREA"
                title={p.label}
                price={
                  <>
                    +{p.monthlySar.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-rose-300/90">SAR/mo</span>
                  </>
                }
              >
                {p.description}
              </PricingTierCard>
            ))}
          </ul>
        </section>

        <section>
          <PublicSectionIntro
            badge="AI extras"
            title="Intelligence add-ons"
            description="Optional lines from discovery — priced below buying separate AI point tools."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {AI_EXTRAS.map((a) => (
              <li
                key={a.key}
                className="cc-list-item flex items-center justify-between gap-3 border-teal-500/15"
              >
                <span className="font-medium text-white">{a.nameEn}</span>
                <span className="shrink-0 text-xs font-medium text-teal-300">
                  +{a.monthlySar.toLocaleString()} SAR/mo
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cc-public-band rounded-2xl border border-cc-star/20 p-6 sm:p-8">
          <PublicSectionIntro
            badge="Market"
            title="Typical comparison"
            description={
              <>
                Illustrative only — not a legal quote. Monthly SAR{" "}
                <strong className="text-slate-300">excluding 15% VAT</strong>. Crow bundle mirrors a
                logistics enterprise stack at {COMPARISON_HEADCOUNT} employees.
              </>
            }
          />
          <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 text-right font-medium">Monthly SAR (excl. VAT)</th>
                  <th className="px-4 py-3 text-right font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">Odoo Enterprise + security uplift</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatSar(odooTypical)}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">
                    ~USD 48/user/mo × {COMPARISON_HEADCOUNT}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">Zoho One + security uplift</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatSar(zohoTypical)}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">
                    ~USD 42/user/mo × {COMPARISON_HEADCOUNT}
                  </td>
                </tr>
                <tr className="border-b border-white/5 bg-teal-500/5">
                  <td className="px-4 py-3 font-medium text-cc-star">Crow bundle (illustrative)</td>
                  <td className="px-4 py-3 text-right font-display font-semibold tabular-nums text-teal-300">
                    {formatSar(meemIllustrative.totalMonthlySar)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-teal-400/90">
                    ~{crowVsOdooPct}% vs Odoo · ~{crowVsZohoPct}% vs Zoho
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-500">Crow incl. VAT (15%)</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                    {formatSar(meemIllustrative.totalInclVatSar, 2)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">
                    VAT {formatSar(meemIllustrative.vatAmountSar, 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-cc-star/25 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-transparent p-8 text-center sm:p-10">
          <CrowMotif variant="constellation" className="pointer-events-none absolute start-6 top-6 opacity-20" />
          <p className="mx-auto max-w-2xl text-sm text-slate-400">
            Final commercial terms follow discovery and blueprint — illustrative totals on this page are
            not a binding quote.
          </p>
          <p className="mt-2 text-xs text-slate-500">15% VAT applied at invoice.</p>
          <div className="mx-auto mt-4 max-w-lg rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-left text-xs leading-relaxed text-slate-400">
            <p className="font-medium text-amber-200/90">{PRICING_COMMERCIAL_HONESTY.noCheckout}</p>
            <p className="mt-1">
              Enterprise billing is manual and coordinated after scope approval — not activated from this
              website.
            </p>
          </div>
          <Link href="/request" className="cc-btn-primary mt-6 inline-block">
            Start implementation request
          </Link>
        </section>
      </div>
    </>
  );
}
