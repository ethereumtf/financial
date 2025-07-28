/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  
  // Image optimization configuration
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Build optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable features not supported in static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Base path configuration (if needed for deployment)
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.netlify.app',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
