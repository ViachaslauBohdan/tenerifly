/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tenerifly-strapi-production.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'tenerifly.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },

  transpilePackages: ['@mantine/core', '@mantine/hooks', '@mantine/dates', '@mantine/carousel'],

  // Упрощенная webpack конфигурация
  webpack: (config) => {
    return config;
  },

  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: true,
};

module.exports = nextConfig;
