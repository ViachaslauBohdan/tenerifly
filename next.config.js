/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'tenerifly.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;