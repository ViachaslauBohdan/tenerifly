import { Tour, Car, Property } from '@/types/strapi';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

if (!API_URL || !API_TOKEN) {
  throw new Error('Missing required environment variables for Strapi API');
}

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Tours API
export const toursAPI = {
  getAll: async (): Promise<{ data: Tour[] }> => {
    return fetchAPI<{ data: Tour[] }>('/tours?populate=*');
  },
  
  getById: async (id: number): Promise<{ data: Tour }> => {
    return fetchAPI<{ data: Tour }>(`/tours/${id}?populate=*`);
  },
};

// Cars API
export const carsAPI = {
  getAll: async (): Promise<{ data: Car[] }> => {
    return fetchAPI<{ data: Car[] }>('/cars?populate=*');
  },
  
  getById: async (id: number): Promise<{ data: Car }> => {
    return fetchAPI<{ data: Car }>(`/cars/${id}?populate=*`);
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (): Promise<{ data: Property[] }> => {
    return fetchAPI<{ data: Property[] }>('/properties?populate=*');
  },
  
  getById: async (id: number): Promise<{ data: Property }> => {
    return fetchAPI<{ data: Property }>(`/properties/${id}?populate=*`);
  },
}; 