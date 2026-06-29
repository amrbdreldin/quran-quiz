/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['watawanu.com'],
  },
  // Enables App Router features
  experimental: {},
};

module.exports = nextConfig;

