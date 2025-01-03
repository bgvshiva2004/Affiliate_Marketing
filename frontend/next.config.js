/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'localhost',
        '127.0.0.1',
        // Add your production domain here, for example:
        // 'your-production-domain.com',
        // If using AWS S3:
        // 'your-bucket-name.s3.amazonaws.com',
        // If using other cloud storage, add their domains here
      ],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
        // {
        //   protocol: 'https',
        //   hostname: 'your-production-domain.com',
        //   pathname: '/media/**',
        // },
      ],
    },
    // Other Next.js config options if needed
  }
  
  module.exports = nextConfig