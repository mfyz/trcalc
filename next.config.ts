import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: [
    'http://172.245.180.239:3000',
    'http://172.245.180.239',
    '172.245.180.239',
  ],
};

export default nextConfig;
