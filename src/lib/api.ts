import { Property } from '@/types/strapi';

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/properties?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }

  const data = await response.json();
  return data.data;
} 