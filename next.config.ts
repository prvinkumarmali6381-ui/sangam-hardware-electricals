import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.glideos.app",
      },
      {
        protocol: "https",
        hostname: "**.glideapps.dev",
      },
    ],
  },
};

export default nextConfig;