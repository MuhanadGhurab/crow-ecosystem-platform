import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalAccessGateway } from "@/components/portal/portal-access-gateway";
import { TenantAccessBlockedPanel } from "@/components/tenant/tenant-access-blocked-panel";

export const dynamic = "force-dynamic";
import { ProductPageHeader } from "@/components/product/product-page-header";
import {
  isAuthoritativeClientOnlyScope,
  resolveClientOnlyLifecycleDestination,
} from "@/lib/auth/client-only-lifecycle-landing";
import { resolveAuthoritativeCrowAuthContext } from "@/lib/auth/authoritative-crow-auth";
import { getSessionUser } from "@/lib/auth/session";
import { buildCrowAccessGatewaySnapshot } from "@/lib/services/portal-access.service";
import { routes } from "@/lib/routes";

export default async function AccessGatewayPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; tenant?: string; message?: string }>;
}) {
  const { reason, tenant, message } = await searchParams;
  const sessionUser = await getSessionUser();
  const authContext = sessionUser
    ? await resolveAuthoritativeCrowAuthContext(sessionUser)
    : null;
  const user = authContext?.user ?? null;

  if (user && (await isAuthoritativeClientOnlyScope(user.id))) {
    redirect(await resolveClientOnlyLifecycleDestination(user.id));
  }

  const snapshot = await buildCrowAccessGatewaySnapshot(user);
  const showBlocked = reason === "business_portal_blocked";

  return (
    <div className="cc-safe-x mx-auto max-w-4xl space-y-10 py-10">
      <ProductPageHeader
        eyebrow="Crow ecosystem"
        title="Choose your workspace"
        description="Client Portal — request, discovery, proposal, onboarding. Business Portal — run daily company operations. ProCrow — prepare, govern, and validate tenants (operators only)."
        statusChip={
          snapshot.isAuthenticated
            ? { label: "Signed in", tone: "success" }
            : { label: "Sign in required", tone: "warning" }
        }
      />

      {showBlocked && (
        <TenantAccessBlockedPanel
          tenantSlug={tenant}
          message={message ? decodeURIComponent(message) : undefined}
        />
      )}

      <PortalAccessGateway
        availablePortals={snapshot.availablePortals}
        unavailablePortals={snapshot.unavailablePortals}
        recommendedNextAction={snapshot.recommendedNextAction}
        safetyNotes={snapshot.safetyNotes}
        signedOut={!snapshot.isAuthenticated}
      />

      <p className="text-center text-sm text-slate-500">
        <Link href={routes.public.home} className="text-teal-400 hover:text-teal-300">
          ← Back to public site
        </Link>
      </p>
    </div>
  );
}
