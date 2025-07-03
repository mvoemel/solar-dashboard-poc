import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/weather/:path*",
        destination: `https://api.openweathermap.org/data/2.5/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [new URL("https://openweathermap.org/img/**")],
  },
};

export default nextConfig;
