import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hayexperiencia.com" },
      { protocol: "https", hostname: "studio.hayexperiencia.com" },
    ],
  },
};

export default nextConfig;
