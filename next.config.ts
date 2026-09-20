import type { NextConfig } from "next";

const spacesHostname = process.env.SPACES_BUCKET && process.env.SPACES_REGION
  ? `${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com`
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(spacesHostname
        ? [{ protocol: "https" as const, hostname: spacesHostname }]
        : []),
      { protocol: "https" as const, hostname: "**.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;
