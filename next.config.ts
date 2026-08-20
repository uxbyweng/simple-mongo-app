import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wichtig für Docker: erzeugt ein schlankes Server-Bundle in .next/standalone,
  // statt den vollen node_modules-Ordner ins Runtime-Image zu kopieren.
  output: "standalone",
};

export default nextConfig;
