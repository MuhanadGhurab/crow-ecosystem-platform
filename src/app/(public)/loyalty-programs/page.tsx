import { PublicPageHeader } from "@/components/public/public-page-header";
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function LoyaltyProgramsPage() {
  return (
    <>
      <PublicPageHeader
        badge="Growth"
        title="Loyalty programs"
        description="Customer engagement modules integrated with CEM and SAREA experiences."
      />
      <div className="cc-public-section">
        <PagePlaceholder area="Public Portal" route="/loyalty-programs" />
      </div>
    </>
  );
}
