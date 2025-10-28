/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/estondistributors' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/estondistributors/' : '',
};

export default nextConfig;