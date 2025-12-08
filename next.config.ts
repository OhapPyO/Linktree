import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ideal-mosquito-512.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
