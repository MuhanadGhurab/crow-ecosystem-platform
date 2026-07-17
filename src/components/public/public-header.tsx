import { Suspense } from "react";

import { PublicHeaderAuthResolver } from "@/components/public/public-header-auth-resolver";
import { PublicHeaderNav } from "@/components/public/public-header-nav";

export function PublicHeader() {
  return (
    <Suspense
      fallback={
        <PublicHeaderNav
          portalCta={null}
          isAccountSession={false}
          showSignOut={false}
          authLoading
        />
      }
    >
      <PublicHeaderAuthResolver />
    </Suspense>
  );
}
