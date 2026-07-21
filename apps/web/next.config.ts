import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: [
    "@ghuravia/config",
    "@ghuravia/contracts",
    "@ghuravia/domain",
    "@ghuravia/data",
    "@ghuravia/provider-mocks",
  ],
  serverExternalPackages: ["postgres", "drizzle-orm"],
  /** 0B slice does not authorize Image Optimization; keep disabled until later Gate. */
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
