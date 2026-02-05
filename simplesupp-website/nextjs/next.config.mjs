/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js treats this directory as the project root
  // This prevents detection of parent directory's package files
  reactStrictMode: true,
  
  // Configure to ignore parent workspace
  experimental: {
    // Turbopack configuration if needed
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
