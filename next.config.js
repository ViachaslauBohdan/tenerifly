/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // We'll handle ESLint separately
  },
  images: {
    domains: ['localhost', 'tenerifly.com'], // Add your image domains here
  },
};

module.exports = nextConfig; 