import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // force root = C:\Users\chris\dev\mysite
  },
};

export default nextConfig;
