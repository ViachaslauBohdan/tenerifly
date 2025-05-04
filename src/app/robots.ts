import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/static/',
        '/admin/',
        '/dashboard/',
      ],
    },
    sitemap: 'https://tenerifly.io/sitemap.xml',
  };
} 