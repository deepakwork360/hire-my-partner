import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pinterest.com",
      "in.pinterest.com",
      "i.pinimg.com",
      "i1-e.pinimg.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "*.pinterest.com",
      }
    ]
  },
};

export default nextConfig;
