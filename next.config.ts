import type { NextConfig } from "next";

/** Vercel standard builders: 8 GB RAM — avoid worker + large heap exceeding cgroup. */
const isVercelBuild = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    webpackMemoryOptimizations: true,
    ...(isVercelBuild
      ? {
          cpus: 1,
          webpackBuildWorker: false,
          staticGenerationMaxConcurrency: 1,
        }
      : {
          webpackBuildWorker: true,
        }),
  },
};

export default nextConfig;
