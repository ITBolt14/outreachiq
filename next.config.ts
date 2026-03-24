import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
  },
};

export default nextConfig;
