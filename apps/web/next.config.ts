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
};
export default nextConfig;
