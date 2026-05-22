import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cc-starfield cc-noise relative min-h-screen">
      <PublicHeader />
      <main className="relative z-10">{children}</main>
      <PublicFooter />
    </div>
  );
}
