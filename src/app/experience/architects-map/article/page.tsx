import { redirect } from "next/navigation";

import { publicLegacyRedirects } from "@/lib/public/routes";

export default function ArchitectsMapArticleRedirectPage() {
  redirect(publicLegacyRedirects.architectsMapArticle);
}
