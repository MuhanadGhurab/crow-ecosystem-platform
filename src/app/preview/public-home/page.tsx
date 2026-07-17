import { redirect } from "next/navigation";

import { assertPublicV2PreviewEnabled } from "@/lib/public-v2/certification-gate";

export const metadata = {
  title: "Public Homepage Preview | Crow",
  description: "Certification-only alias — redirects to the canonical public homepage.",
  robots: { index: false, follow: false, nocache: true },
};

/** CROW.PUBLIC.2 — preview route redirects to real `/` on certification hosts. */
export default function PublicHomePreviewPage() {
  assertPublicV2PreviewEnabled();
  redirect("/");
}
