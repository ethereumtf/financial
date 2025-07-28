import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable features not supported in static export
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
