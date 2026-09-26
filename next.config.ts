import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["nodemailer"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
