/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});



const nextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'affiliatemarketing-production.up.railway.app'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'affiliatemarketing-production.up.railway.app',
        pathname: '/backend/media/**',
      },
    ],
  },
}

module.exports = withPWA(nextConfig);
