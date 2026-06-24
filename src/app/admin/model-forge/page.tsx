import { redirect } from "next/navigation";
import { ModelForgeContent } from "@/components/procrow/model-forge-content";
import { requireAuthoritativeCrowAuth } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { buildProCrowClientDesignReviewSnapshot } from "@/lib/services/procrow-client-design-review.service";

export const dynamic = "force-dynamic";

/** ProCrow Model Forge — PLATFORM_ADMIN only; draft enterprise models, no provisioning. */
export default async function AdminModelForgePage({
  searchParams,
}: {
  searchParams: Promise<{ clientDesignRequestId?: string }>;
}) {
  const { auth } = await requireAuthoritativeCrowAuth(routes.admin.modelForge);
  if (auth.role !== "platform_admin") {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  const { clientDesignRequestId } = await searchParams;
  const clientDesignHandoff = clientDesignRequestId
    ? await buildProCrowClientDesignReviewSnapshot(clientDesignRequestId)
    : null;
  return (
    <ModelForgeContent
      clientDesignHandoff={
        clientDesignHandoff
          ? {
              requestId: clientDesignRequestId!,
              snapshot: clientDesignHandoff.snapshot,
              clientSelections: clientDesignHandoff.clientSelections,
            }
          : null
      }
    />
  );
}
