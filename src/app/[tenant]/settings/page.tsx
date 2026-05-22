import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { isEntraSsoEnabled } from "@/lib/auth/entra-sso";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantSettingsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const security = await getTenantSecuritySettings(tenant.id);
  const entraLive = isEntraSsoEnabled();
  const prefersEntra = security.idpPreference === "entra_id";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Workspace configuration for {tenant.organization.displayName}.
        </p>
      </div>

      <section className="cc-glass-card space-y-4">
        <h3 className="text-sm font-medium text-cyan-400">Identity & MFA (from discovery)</h3>
        <p className="text-xs text-slate-500">
          Source: {security.source === "discovery" ? "Discovery identity answers" : "Platform default"}
        </p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">MFA for admins</dt>
            <dd className={security.mfaRequired ? "text-teal-300" : "text-amber-300"}>
              {security.mfaLabel}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Identity provider</dt>
            <dd className="text-white">{security.idpLabel}</dd>
          </div>
        </dl>
        {security.ssoNotes && (
          <p className="text-sm text-slate-400">{security.ssoNotes}</p>
        )}
        {prefersEntra && (
          <p className="text-sm text-slate-400">
            Discovery specifies Microsoft Entra ID.
            {entraLive ? (
              <>
                {" "}
                <Link
                  href={`/auth/entra?next=${encodeURIComponent(routes.tenant(slug).dashboard)}`}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Sign in with Microsoft →
                </Link>
              </>
            ) : (
              <span className="text-amber-300/90">
                {" "}
                Enable <code className="text-cyan-300">AZURE_SSO_ENABLED=true</code> and configure
                Azure in Supabase — see <code className="text-cyan-300">docs/ENTRA_SSO.md</code>.
              </span>
            )}
          </p>
        )}
        <Link
          href={routes.tenant(slug).cybercrow.identity}
          className="inline-block text-sm text-cyan-400 hover:text-cyan-300"
        >
          CyberCrow identity →
        </Link>
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Organization</h3>
        <p className="mt-2 text-sm text-slate-300">Plan: {tenant.planKey}</p>
        <p className="mt-1 font-mono text-xs text-slate-500">/{tenant.slug}</p>
      </section>
    </div>
  );
}
