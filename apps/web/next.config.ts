import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: [
    "@ghuravia/config",
    "@ghuravia/contracts",
    "@ghuravia/domain",
  ],
};
export default nextConfig;
