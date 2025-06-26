/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'tenerifly.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Кеширование для статических ресурсов
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
  // Настройка для compression
  compress: true,
  // Настройка для trailing slash
  trailingSlash: false,
  // Настройка для PoweredByHeader
  poweredByHeader: false,
  // Настройка для generateEtags
  generateEtags: true,
  // Оптимизация бандлов
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для production
    if (!dev) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          mantine: {
            test: /[\\/]node_modules[\\/]@mantine[\\/]/,
            name: 'mantine',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;