import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pos.nvncdn.com' },
      { protocol: 'https', hostname: 'bizweb.dktcdn.net' },
    ],
  },
};

export default nextConfig;
