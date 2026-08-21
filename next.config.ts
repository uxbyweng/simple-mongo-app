import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wichtig für Docker: erzeugt ein schlankes Server-Bundle in .next/standalone,
  // statt den vollen node_modules-Ordner ins Runtime-Image zu kopieren.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/og-image-bulletin-board.png",
        headers: [{ key: "Content-Type", value: "image/png" }],
      },
    ];
  },
};

export default nextConfig;
