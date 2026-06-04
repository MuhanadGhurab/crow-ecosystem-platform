import Link from "next/link";
import { PortalAccessGateway } from "@/components/portal/portal-access-gateway";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { getSessionUser } from "@/lib/auth/session";
import { buildCrowAccessGatewaySnapshot } from "@/lib/services/portal-access.service";
import { routes } from "@/lib/routes";

export default async function AccessGatewayPage() {
  const user = await getSessionUser();
  const snapshot = buildCrowAccessGatewaySnapshot(user);

  return (
    <div className="cc-safe-x mx-auto max-w-4xl space-y-10 py-10">
      <ProductPageHeader
        eyebrow="Crow ecosystem"
        title="Access gateway"
        description="One sign-in — choose the portal that matches your role. Client Portal for requests and onboarding; Business Portal for day-to-day CEM operations; ProCrow for internal operators only."
        statusChip={
          snapshot.isAuthenticated
            ? { label: "Signed in", tone: "success" }
            : { label: "Sign in required", tone: "warning" }
        }
      />

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
