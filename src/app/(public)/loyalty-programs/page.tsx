import { redirect } from "next/navigation";

import { publicLegacyRedirects } from "@/lib/public/routes";

export default function LoyaltyProgramsRedirectPage() {
  redirect(publicLegacyRedirects.loyaltyPrograms);
}
