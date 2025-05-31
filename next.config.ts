import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'], // Allow images from localhost and Unsplash
  },
  /* config options here */
};

export default nextConfig;
