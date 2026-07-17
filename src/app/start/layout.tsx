import { PublicSiteChrome } from "@/components/public-site/public-site-chrome";

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <PublicSiteChrome>{children}</PublicSiteChrome>;
}
