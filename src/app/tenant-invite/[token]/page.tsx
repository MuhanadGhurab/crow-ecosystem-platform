import Link from "next/link";

import { CrowMark } from "@/components/public/brand/crow-mark";
import { TenantInviteAcceptancePanel } from "@/components/tenant/tenant-invite-acceptance-panel";
import { getSessionUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { buildTenantInviteAcceptancePublicView } from "@/lib/services/tenant-invite-token.service";

export const dynamic = "force-dynamic";

export default async function TenantInviteAcceptancePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getSessionUser();
  const view = await buildTenantInviteAcceptancePublicView(token, user?.email ?? null);

  return (
    <div className="min-h-screen bg-[#070b14] px-4 py-10 text-slate-200">
      <div className="mx-auto max-w-lg space-y-6">
        <header className="text-center">
          <CrowMark href="/" size="md" className="mx-auto" />
          <h1 className="cc-section-title mt-4">Business Portal invite</h1>
          <p className="mt-2 text-sm text-slate-500">
            Accept a tenant membership invite after signing in with the invited email.
          </p>
        </header>

        <TenantInviteAcceptancePanel token={token} view={view} />

        <p className="text-center text-xs text-slate-600">
          <Link href={routes.access} className="text-slate-500 hover:text-slate-300">
            Access gateway
          </Link>
        </p>
      </div>
    </div>
  );
}
