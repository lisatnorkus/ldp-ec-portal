import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/compliance-chat": ["./docs/legal-corpus/**/*"],
  },
  // Dev-only: Next 16 blocks client connections from hosts not listed
  // here. Without 127.0.0.1, hitting the dev server via IP instead of
  // "localhost" left pages stuck on the pre-hydration splash. Production
  // serves on Vercel where this check doesn't apply.
  allowedDevOrigins: ["127.0.0.1", "192.168.86.132"],
};

export default nextConfig;
