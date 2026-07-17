import { assertAuthCanaryRouteEnabled } from "@/lib/auth/c3-auth-canary";

export const dynamic = "force-dynamic";

export default function AuthCanaryLayout({ children }: { children: React.ReactNode }) {
  assertAuthCanaryRouteEnabled();
  return (
    <div className="cc-starfield min-h-[100dvh] px-4 py-10 sm:px-6">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
