import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // alunacampestre.com (+ www) = dominio de marca de ALUNA: sirve la landing en su
  // raíz SIN cambiar la URL (rewrite, no redirect). Otras rutas (/cotizador, /api,
  // /images) pasan igual. hayexperiencia.com/aluna sigue funcionando.
  async rewrites() {
    return [
      { source: "/", has: [{ type: "host", value: "alunacampestre.com" }], destination: "/aluna" },
      { source: "/", has: [{ type: "host", value: "www.alunacampestre.com" }], destination: "/aluna" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.wasi.co" },
      { protocol: "https", hostname: "images.wasi.co" },
      { protocol: "https", hostname: "static.wasi.co" },
      { protocol: "https", hostname: "hayexperiencia.com" },
    ],
  },
};

export default nextConfig;
