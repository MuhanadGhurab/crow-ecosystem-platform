import type { Metadata } from "next";

import { PublicHomepagePreview } from "@/components/public-v2/public-homepage-preview";
import { assertPublicV2PreviewEnabled } from "@/lib/public-v2/certification-gate";

export const metadata: Metadata = {
  title: "Public Homepage Preview | Crow",
  description: "Certification-only preview of the new Crow public homepage.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PublicHomePreviewPage() {
  assertPublicV2PreviewEnabled();
  return <PublicHomepagePreview />;
}
