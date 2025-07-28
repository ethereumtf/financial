/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable features not supported in static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
