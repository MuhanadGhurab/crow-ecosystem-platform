import Link from "next/link";
import { planLabel } from "@/lib/catalog-labels";
import { isStripeConfigured } from "@/lib/billing/env";
import { routes } from "@/lib/routes";
import {
  listSubscriptionPlansWithUsage,
  listTenantSubscriptions,
} from "@/lib/services/platform-admin.service";

export default async function AdminSubscriptionsPage() {
  const stripeConfigured = isStripeConfigured();
  const [plans, subscriptions] = await Promise.all([
    listSubscriptionPlansWithUsage(),
    listTenantSubscriptions(),
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-white">Subscriptions</h2>
      <p className="text-sm text-slate-400">
        Catalog plans from seed data and active tenant subscriptions.
      </p>

      {stripeConfigured ? (
        <p className="rounded-cc-sm border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-sm text-teal-100">
          Stripe keys detected —{" "}
          <Link href="/api/billing/status" className="text-cyan-300 hover:text-cyan-200">
            billing status →
          </Link>
        </p>
      ) : (
        <p className="rounded-cc-sm border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          Stripe not configured — set <code className="text-amber-50">STRIPE_*</code> env vars for
          live checkout (see docs/internal/STRIPE_BILLING.md).
        </p>
      )}

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Plans</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {plans.map((p) => (
            <li key={p.id} className="cc-glass-card">
              <p className="font-medium text-white">{p.nameEn}</p>
              <p className="text-xs text-slate-500">{planLabel(p.key)}</p>
              <p className="mt-2 text-cyan-300">{String(p.baseMonthlySar)} SAR/mo</p>
              <p className="text-xs text-slate-500">{p._count.tenantSubscriptions} tenants</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Active tenant subscriptions</h3>
        {subscriptions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No tenant subscriptions yet. Run <code className="text-cyan-400">npm run db:seed</code>{" "}
            for plans.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {subscriptions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap justify-between gap-2 rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={routes.tenant(s.tenant.slug).dashboard}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    {s.tenant.organization.displayName}
                  </Link>
                  {s.stripeCustomerId && (
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      Stripe customer: {s.stripeCustomerId}
                    </p>
                  )}
                </div>
                <span className="text-slate-500">
                  {s.plan.nameEn} · {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
