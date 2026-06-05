import type { NextConfig } from "next";

/** Vercel standard builders: 8 GB RAM — avoid worker + large heap exceeding cgroup. */
const isVercelBuild = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    preloadEntriesOnStart: false,
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
  webpack: (config, { dev }) => {
    if (!dev && isVercelBuild) {
      config.cache = false;
      config.parallelism = 1;
    }
    return config;
  },
};

export default nextConfig;
