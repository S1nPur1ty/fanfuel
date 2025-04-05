import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'ui-avatars.com' },
      { hostname: 'api.dicebear.com' },
      { hostname: 'replicate.delivery' },
      { hostname: 'ipfs.io' },
      { hostname: 'gateway.pinata.cloud' },
    ],
  },
};

export default nextConfig;
