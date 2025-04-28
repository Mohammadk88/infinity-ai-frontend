import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // 👈 السماح بتحميل الصور من localhost
  },
  /* config options here */
};

export default nextConfig;
