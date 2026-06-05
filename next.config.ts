import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
  },
};

export default nextConfig;
