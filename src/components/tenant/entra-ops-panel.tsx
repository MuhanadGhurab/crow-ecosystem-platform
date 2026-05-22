import Link from "next/link";
import { ENTRA_SSO_HELP_ROUTE } from "@/lib/constants/docs-links";
import {
  getConfiguredEntraAuthority,
  getConfiguredSupabaseAzureRedirectUri,
  isEntraSsoEnabled,
} from "@/lib/auth/entra-sso";
import type { TenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { routes } from "@/lib/routes";

type EntraOpsPanelProps = {
  security: TenantSecuritySettings;
  /** Enterprise or discovery identity answers — show full Entra narrative */
  showEntraNarrative: boolean;
  variant?: "settings" | "identity" | "login";
  tenantSlug?: string;
};

const ENTRA_CHECKLIST = [
  "Azure app registration — redirect URI = Supabase `/auth/v1/callback` (not app `/auth/callback`)",
  "Supabase Azure provider enabled with client ID + secret",
  "Supabase allow list includes `{origin}/auth/callback` exactly (no query on redirectTo)",
  "Crow env: `AZURE_SSO_ENABLED=true`, `NEXT_PUBLIC_AZURE_TENANT_ID`",
  "MFA via Entra Conditional Access for production admins",
  "Assign `crow_role` + `tenant_slugs` in Supabase app_metadata after first sign-in",
] as const;

function checklistItemClass(done: boolean) {
  return done
    ? "text-teal-300/90 before:content-['✓'] before:mr-2 before:text-teal-400"
    : "text-slate-400 before:content-['○'] before:mr-2 before:text-slate-600";
}

export function EntraOpsPanel({
  tenantSlug,
  security,
  showEntraNarrative,
  variant = "settings",
}: EntraOpsPanelProps) {
  const entraLive = isEntraSsoEnabled();
  const prefersEntra = security.idpPreference === "entra_id";
  const supabaseCallback = getConfiguredSupabaseAzureRedirectUri();
  const authority = getConfiguredEntraAuthority();
  const dashboardNext = tenantSlug
    ? encodeURIComponent(routes.tenant(tenantSlug).dashboard)
    : encodeURIComponent("/portal/requests");
  const isLogin = variant === "login";

  if (!showEntraNarrative && !prefersEntra && variant !== "login") {
    return null;
  }

  const showChecklist = variant === "settings" || variant === "identity";
  const title =
    variant === "identity"
      ? "Microsoft Entra ID & Crow"
      : variant === "login"
        ? "Microsoft Entra ID (operations)"
        : "Identity provider (Entra ID)";

  return (
    <section
      className={
        isLogin
          ? "mt-6 rounded-cc-sm border border-cyan-500/15 bg-cyan-500/5 px-4 py-4 text-left"
          : "cc-glass-card space-y-4"
      }
    >
      <div>
        <h3 className={`text-sm font-medium ${isLogin ? "text-cyan-400" : "text-cyan-400"}`}>
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Crow ties one Microsoft identity to the client portal, tenant workspace, and platform admin.
          Discovery records <code className="text-cyan-300/90">entra_id</code> when customers choose Entra;
          sign-in uses Supabase Auth with the Azure OAuth provider (not direct MSAL in the Next app).
        </p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Discovery IdP</dt>
          <dd className="text-white">{security.idpLabel}</dd>
          <dd className="mt-0.5 text-xs text-slate-500">
            Source: {security.source === "discovery" ? "identity answers" : "platform default"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">MFA posture</dt>
          <dd className={security.mfaRequired ? "text-teal-300" : "text-amber-300"}>
            {security.mfaLabel}
          </dd>
          <dd className="mt-0.5 text-xs text-slate-500">
            Enforce MFA in Entra Conditional Access for production; Crow reads discovery intent here.
          </dd>
        </div>
      </dl>

      {security.ssoNotes && (
        <p className="text-sm text-slate-400">
          <span className="text-slate-500">Discovery notes: </span>
          {security.ssoNotes}
        </p>
      )}

      <div className="rounded-cc-sm border border-white/10 bg-white/[0.02] px-3 py-3 text-xs text-slate-400">
        <p className="font-medium text-slate-300">SSO callback path</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>
            User → <code className="text-cyan-300">/auth/entra</code> or Microsoft button (sets{" "}
            <code className="text-cyan-300">crow_oauth_next</code> cookie)
          </li>
          <li>Microsoft → Supabase {supabaseCallback ?? "https://&lt;ref&gt;.supabase.co/auth/v1/callback"}</li>
          <li>
            Supabase → <code className="text-cyan-300">/auth/callback</code> on your app (allow-listed, no
            query on <code className="text-cyan-300">redirectTo</code>)
          </li>
          <li>Crow reads cookie → checks <code className="text-cyan-300">app_metadata.crow_role</code></li>
        </ol>
        {authority && (
          <p className="mt-2 text-slate-500">
            Authority: <span className="font-mono text-cyan-300/80">{authority}</span>
          </p>
        )}
      </div>

      {!isLogin && prefersEntra && (
        <p className="text-sm text-slate-400">
          {entraLive ? (
            <>
              Platform Entra is enabled.{" "}
              <Link
                href={`/auth/entra?next=${dashboardNext}`}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Sign in with Microsoft →
              </Link>
            </>
          ) : (
            <span className="text-amber-300/90">
              Set <code className="text-cyan-300">AZURE_SSO_ENABLED=true</code> and tenant ID — see setup
              guide below.
            </span>
          )}
        </p>
      )}

      {showChecklist && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Entra checklist</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {ENTRA_CHECKLIST.map((item) => {
              const done =
                item.includes("AZURE_SSO") || item.includes("MFA")
                  ? entraLive && security.mfaRequired
                  : item.includes("crow_role")
                    ? entraLive
                    : item.includes("Supabase Azure")
                      ? entraLive
                      : item.includes("redirect URI")
                        ? Boolean(supabaseCallback)
                        : false;
              return (
                <li key={item} className={checklistItemClass(done)}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-sm">
        <Link href={ENTRA_SSO_HELP_ROUTE} className="text-cyan-400 hover:text-cyan-300">
          Entra SSO setup guide →
        </Link>
        {!isLogin && tenantSlug && (
          <>
            {" · "}
            <Link
              href={routes.tenant(tenantSlug).cybercrow.identity}
              className="text-violet-400 hover:text-violet-300"
            >
              CyberCrow identity →
            </Link>
          </>
        )}
      </p>
    </section>
  );
}

/** Show Entra ops copy for enterprise plans or discovery identity answers. */
export function shouldShowEntraOpsNarrative(
  planKey: string,
  security: TenantSecuritySettings
): boolean {
  return (
    planKey === "enterprise" ||
    security.source === "discovery" ||
    security.idpPreference === "entra_id" ||
    security.idpPreference === "saml"
  );
}
