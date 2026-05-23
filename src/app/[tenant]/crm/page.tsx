import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CrmAccountEditRow, CrmContactEditRow } from "@/components/tenant/crm/crm-edit-rows";
import { CrmAccountForm, CrmContactForm } from "@/components/tenant/crm/crm-forms";
import { MeemCrmHub } from "@/components/tenant/meem-crm-hub";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { listCrmAccounts, listCrmContacts } from "@/lib/services/crm.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantCrmPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const showMeemHub = showMeemErpHub(slug, tenant.organization.industry, tenantModules);
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "crm") : [];

  const [accounts, contacts] = await Promise.all([
    listCrmAccounts(tenant.id),
    listCrmContacts(tenant.id),
  ]);

  const accountOptions = accounts.map((a) => ({ id: a.id, name: a.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · CRM"
        title="Customer relationships"
        description={`Accounts and contacts for ${tenant.organization.displayName}.`}
      />

      {showMeemHub && (
        <MeemCrmHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          aiExtraKeys={aiExtraKeys}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CrmAccountForm tenantSlug={slug} />
        <CrmContactForm tenantSlug={slug} accounts={accountOptions} />
      </div>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Accounts ({accounts.length})</h3>
        {accounts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No accounts yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="text-white">{a.name}</span>
                  <span className="text-slate-500">{a._count.contacts} contacts</span>
                </div>
                <CrmAccountEditRow tenantSlug={slug} account={a} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Contacts ({contacts.length})</h3>
        {contacts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No contacts yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-cc border border-cyan-500/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-cyan-500/10 bg-white/5 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/5 text-slate-300">
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3" colSpan={4}>
                      <CrmContactEditRow tenantSlug={slug} contact={c} />
                      <p className="mt-1 text-xs text-slate-500">{c.account?.name ?? "No account"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Link href={routes.tenant(slug).dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Dashboard
      </Link>
    </div>
  );
}
