import type { NextConfig } from "next";

// Si el sitio vive en usuario.github.io/nombre-del-repo, definir NEXT_PUBLIC_BASE_PATH=/nombre-del-repo
// (el workflow de GitHub lo hace solo). Con dominio propio o repo usuario.github.io, dejar vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
