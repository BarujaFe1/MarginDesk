import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export keeps the lab demo portable (GitHub Pages + Vercel).
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages serves under /MarginDesk when using project pages.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
