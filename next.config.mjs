/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  trailingSlash: true,
  basePath: isProduction ? '/estondistributors' : '',
  assetPrefix: isProduction ? '/estondistributors/' : '',
  // Remove the experimental section if it exists
};

export default nextConfig;