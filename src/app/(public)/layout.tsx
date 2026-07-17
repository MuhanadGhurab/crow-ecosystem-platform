import { PublicSiteChrome } from "@/components/public-site/public-site-chrome";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicSiteChrome>{children}</PublicSiteChrome>;
}
