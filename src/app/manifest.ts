import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tenerifly.io - Your Guide to Tenerife',
    short_name: 'Tenerifly',
    description: 'Find your perfect accommodation, tours or car rental in Tenerife',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait',
    categories: ['travel', 'lifestyle', 'business'],
    screenshots: [
      {
        src: 'https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
        label: 'Tenerifly.io Homepage',
      },
    ],
    prefer_related_applications: false,
  };
} 