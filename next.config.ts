import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGithubPages
    ? {
        output: "export",
        images: { unoptimized: true },
        ...(pagesBasePath ? { basePath: pagesBasePath } : {}),
      }
    : {}),
};

export default nextConfig;
