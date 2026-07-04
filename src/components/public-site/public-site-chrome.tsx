import type { ReactNode } from "react";

import { PublicSiteFooter } from "@/components/public-site/public-site-footer";
import { PublicSiteLayout } from "@/components/public-site/public-site-layout";
import { PublicSiteNavigation } from "@/components/public-site/public-site-navigation";

export function PublicSiteChrome({ children }: { children: ReactNode }) {
  return (
    <PublicSiteLayout navigation={<PublicSiteNavigation />} footer={<PublicSiteFooter />}>
      {children}
    </PublicSiteLayout>
  );
}
