import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.wasi.co" },
      { protocol: "https", hostname: "static.wasi.co" },
      { protocol: "https", hostname: "images.wasi.co" },
    ],
  },
};

export default nextConfig;
