import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/compliance-chat": ["./docs/legal-corpus/**/*"],
  },
};

export default nextConfig;
