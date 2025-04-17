import { StrapiResponse } from '@/types/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
  sort?: string[];
}

export async function fetchAPI<T>(
  path: string,
  options: FetchOptions = {}
): Promise<StrapiResponse<T>> {
  const { page = 1, pageSize = 25, filters = {}, sort = [] } = options;

  const queryParams = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    ...filters,
  });

  if (sort.length > 0) {
    queryParams.append('sort', sort.join(','));
  }

  const url = `${STRAPI_URL}/api${path}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  accommodations: {
    getAll: (options?: FetchOptions) =>
      fetchAPI('/accommodations', options),
    getOne: (id: number) =>
      fetchAPI(`/accommodations/${id}`),
  },
  excursions: {
    getAll: (options?: FetchOptions) =>
      fetchAPI('/excursions', options),
    getOne: (id: number) =>
      fetchAPI(`/excursions/${id}`),
  },
  cars: {
    getAll: (options?: FetchOptions) =>
      fetchAPI('/cars', options),
    getOne: (id: number) =>
      fetchAPI(`/cars/${id}`),
  },
}; 