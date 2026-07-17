"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 400);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden motion-reduce:hidden"
      role="progressbar"
      aria-label="Page loading"
      aria-busy="true"
    >
      <div className="route-progress-bar h-full w-full origin-left bg-cyan-400/80" />
    </div>
  );
}
