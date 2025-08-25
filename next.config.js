/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tenerifly-strapi-production.up.railway.app",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tenerifly.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },

  transpilePackages: [
    "@mantine/core",
    "@mantine/hooks",
    "@mantine/dates",
    "@mantine/carousel",
  ],

  // Упрощенная webpack конфигурация
  webpack: (config) => {
    return config;
  },

  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: true,

  // SSG оптимизации
  output: "standalone",

  // Кэширование для статических ресурсов
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
