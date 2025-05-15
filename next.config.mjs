
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    runtime: 'edge',
  },
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/replicate/:path*',
        destination: 'https://api.replicate.com/:path*'
      }
    ];
  }
};

export default withNextIntl(nextConfig);