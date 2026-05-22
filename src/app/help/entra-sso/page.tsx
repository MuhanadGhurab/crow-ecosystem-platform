import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { ENTRA_SSO_DOC_PATH } from "@/lib/constants/docs-links";
import {
  getConfiguredEntraAuthority,
  getConfiguredSupabaseAzureRedirectUri,
  isEntraSsoEnabled,
} from "@/lib/auth/entra-sso";
import { routes } from "@/lib/routes";

export default function EntraSsoHelpPage() {
  const entraLive = isEntraSsoEnabled();
  const supabaseCallback = getConfiguredSupabaseAzureRedirectUri();
  const authority = getConfiguredEntraAuthority();

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh] px-4 py-10 sm:px-6 sm:py-16">
      <div className="relative z-10 mx-auto max-w-2xl space-y-8">
        <PageHeader
          badge="Operations"
          title="Microsoft Entra ID SSO"
          description="How Crow connects Entra ID to Supabase Auth and tenant access. Full checklist lives in the repository doc."
        />

        <section className="cc-glass-card space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Repository guide:</strong>{" "}
            <code className="text-cyan-300">{ENTRA_SSO_DOC_PATH}</code> (Azure redirect URIs, Supabase
            provider, env vars, troubleshooting).
          </p>
          <p>
            <strong className="text-white">Status:</strong>{" "}
            {entraLive ? (
              <span className="text-teal-300">Entra enabled in this environment</span>
            ) : (
              <span className="text-amber-300">
                Entra not enabled — set AZURE_SSO_ENABLED and NEXT_PUBLIC_AZURE_TENANT_ID
              </span>
            )}
          </p>
          {supabaseCallback && (
            <p>
              <strong className="text-white">Azure redirect (register in Entra):</strong>
              <br />
              <code className="mt-1 inline-block break-all text-cyan-300">{supabaseCallback}</code>
            </p>
          )}
          {authority && (
            <p>
              <strong className="text-white">Authority:</strong>{" "}
              <code className="text-cyan-300">{authority}</code>
            </p>
          )}
          <p>
            <strong className="text-white">App callback (Supabase allow list):</strong>{" "}
            <code className="text-cyan-300">/auth/callback</code> on your site origin — post-login path uses
            the <code className="text-cyan-300">crow_oauth_next</code> cookie, not query on{" "}
            <code className="text-cyan-300">redirectTo</code>.
          </p>
        </section>

        <p className="text-sm text-slate-500">
          <Link href={routes.auth.login} className="text-cyan-400 hover:text-cyan-300">
            ← Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
