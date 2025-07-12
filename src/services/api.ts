// Файл: services/api.ts
// Обновленный API для работы с новой структурой Strapi заказчика

import { 
  CarLegacy, 
  ExcursionLegacy, 
  PropertyLegacy, 
  BlogPostLegacy, 
  StrapiResponseLegacy 
} from '@/types/strapi-legacy';

// Получаем URL и TOKEN из environment переменных
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Интерфейс для параметров фильтрации (адаптированный под новую структуру)
interface FilterParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, any>;
  populate?: string;
  locale?: string;
}

// Функция для построения параметров фильтрации
function buildFilterParams(params: FilterParams = {}): string {
  const searchParams = new URLSearchParams();
  
  // Пагинация
  if (params.page) searchParams.append('pagination[page]', params.page.toString());
  if (params.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
  
  // Сортировка
  if (params.sort) searchParams.append('sort', params.sort);
  
  // Популяция данных - загружаем все связанные данные
  if (params.populate) {
    searchParams.append('populate', params.populate);
  } else {
    // Для новой структуры нужно указать конкретные поля для популяции
    searchParams.append('populate', 'images,rental_prices,specifications,features,rental_terms,sale_terms,location,contact');
  }
  
  // Локализация
  if (params.locale) searchParams.append('locale', params.locale);
  
  // Фильтры (адаптированные под новую структуру)
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item, index) => {
            searchParams.append(`filters[${key}][$in][${index}]`, item.toString());
          });
        } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          searchParams.append(`filters[${key}][$gte]`, value.min.toString());
          searchParams.append(`filters[${key}][$lte]`, value.max.toString());
        } else if (typeof value === 'boolean') {
          searchParams.append(`filters[${key}][$eq]`, value.toString());
        } else {
          searchParams.append(`filters[${key}][$containsi]`, value.toString());
        }
      }
    });
  }
  
  return searchParams.toString();
}

// Универсальная функция для выполнения запросов
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Функция для преобразования данных автомобилей в единый формат
function transformCarToUnified(car: CarLegacy) {
  const { attributes } = car;
  
  return {
    id: car.id,
    documentId: car.id,
    title: attributes.title,
    slug: attributes.slug,
    description: attributes.description,
    type: attributes.type,
    car_status: attributes.car_status,
    featured: attributes.featured,
    // Преобразуем rental_prices в удобный формат
    price: attributes.rental_prices?.day_1 || 0,
    rental_prices: attributes.rental_prices,
    specifications: attributes.specifications,
    features: attributes.features,
    rental_terms: attributes.rental_terms,
    sale_terms: attributes.sale_terms,
    location: attributes.location,
    contact: attributes.contact,
    // Преобразуем изображения в единый формат
    images: attributes.images?.data?.map(img => ({
      id: img.id,
      url: img.attributes.url,
      formats: img.attributes.formats,
      alternativeText: img.attributes.alternativeText,
      caption: img.attributes.caption,
      name: img.attributes.name,
      width: img.attributes.width,
      height: img.attributes.height
    })) || [],
    createdAt: attributes.createdAt,
    updatedAt: attributes.updatedAt,
    publishedAt: attributes.publishedAt
  };
}

// API для автомобилей (адаптированный для новой структуры)
export const carsAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}, page: number = 1, pageSize: number = 25): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        page,
        pageSize,
        sort: 'createdAt:desc'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<CarLegacy[]>>(`/cars?${params}`);
      
      // Преобразуем данные в единый формат
      const transformedData = response.data.map(transformCarToUnified);
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Cars API failed:', error);
      return { data: [] };
    }
  },

  getById: async (id: number | string, locale: string = 'en'): Promise<{ data: any }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'images,rental_prices,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      const response = await fetchAPI<{ data: CarLegacy }>(`/cars/${id}?${params}`);
      
      // Преобразуем данные в единый формат
      const transformedData = transformCarToUnified(response.data);
      
      return { data: transformedData };
    } catch (error) {
      console.warn(`Car API failed for id ${id}:`, error);
      throw new Error('Car not found');
    }
  },

  getFeatured: async (locale: string = 'en'): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters: { featured: true },
        pageSize: 3
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<CarLegacy[]>>(`/cars?${params}`);
      
      // Преобразуем данные в формат для главной страницы
      const transformedData = response.data.map(car => ({
        id: car.id,
        title: car.attributes.title,
        description: car.attributes.description?.substring(0, 100) + '...' || '',
        image: car.attributes.images?.data?.[0]?.attributes.url || '/placeholder.jpg',
        price: `€${car.attributes.rental_prices?.day_1 || 30}/день`,
        transmission: car.attributes.specifications?.transmission || 'Автомат',
        features: [
          car.attributes.features?.air_conditioning && 'Кондиционер',
          `${car.attributes.specifications?.seats || 5} мест`,
          car.attributes.features?.bluetooth && 'Bluetooth'
        ].filter(Boolean).join(', '),
        rating: 4.6
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Featured cars API failed:', error);
      return { data: [] };
    }
  }
};

// API для экскурсий (адаптированный под новую структуру)
export const excursionsAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}, page: number = 1, pageSize: number = 25): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        page,
        pageSize,
        sort: 'createdAt:desc',
        populate: 'image,gallery'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<ExcursionLegacy[]>>(`/excursions?${params}`);
      
      // Преобразуем данные в единый формат
      const transformedData = response.data.map(excursion => ({
        id: excursion.id,
        documentId: excursion.documentId || excursion.id,
        title: excursion.attributes.name, // name -> title
        slug: excursion.attributes.slug,
        description: excursion.attributes.description,
        duration: excursion.attributes.duration,
        price: {
          amount: excursion.attributes.price,
          currency: 'EUR',
          period: 'person'
        },
        max_participants: excursion.attributes.maxGroupSize,
        category: excursion.attributes.category,
        highlights: excursion.attributes.highlights,
        included: excursion.attributes.included,
        notIncluded: excursion.attributes.notIncluded,
        meetingPoint: excursion.attributes.meetingPoint,
        whatToBring: excursion.attributes.whatToBring,
        cancellationPolicy: excursion.attributes.cancellationPolicy,
        featured: excursion.attributes.isPopular, // isPopular -> featured
        isActive: excursion.attributes.isActive,
        minAge: excursion.attributes.minAge,
        // Главное изображение
        image: excursion.attributes.image?.data ? {
          id: excursion.attributes.image.data.id,
          url: excursion.attributes.image.data.attributes.url,
          formats: excursion.attributes.image.data.attributes.formats,
          alternativeText: excursion.attributes.image.data.attributes.alternativeText,
          caption: excursion.attributes.image.data.attributes.caption,
          name: excursion.attributes.image.data.attributes.name
        } : null,
        // Галерея изображений
        images: excursion.attributes.gallery?.data?.map(img => ({
          id: img.id,
          url: img.attributes.url,
          formats: img.attributes.formats,
          alternativeText: img.attributes.alternativeText,
          caption: img.attributes.caption,
          name: img.attributes.name
        })) || [],
        createdAt: excursion.attributes.createdAt,
        updatedAt: excursion.attributes.updatedAt,
        publishedAt: excursion.attributes.publishedAt
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Excursions API failed:', error);
      return { data: [] };
    }
  },

  getById: async (id: number | string, locale: string = 'en'): Promise<{ data: any }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'image,gallery'
      });
      
      const response = await fetchAPI<{ data: ExcursionLegacy }>(`/excursions/${id}?${params}`);
      
      const excursion = response.data;
      const transformedData = {
        id: excursion.id,
        documentId: excursion.documentId || excursion.id,
        title: excursion.attributes.name,
        slug: excursion.attributes.slug,
        description: excursion.attributes.description,
        duration: excursion.attributes.duration,
        price: {
          amount: excursion.attributes.price,
          currency: 'EUR',
          period: 'person'
        },
        max_participants: excursion.attributes.maxGroupSize,
        category: excursion.attributes.category,
        highlights: excursion.attributes.highlights,
        included: excursion.attributes.included,
        notIncluded: excursion.attributes.notIncluded,
        meetingPoint: excursion.attributes.meetingPoint,
        whatToBring: excursion.attributes.whatToBring,
        cancellationPolicy: excursion.attributes.cancellationPolicy,
        featured: excursion.attributes.isPopular,
        isActive: excursion.attributes.isActive,
        minAge: excursion.attributes.minAge,
        image: excursion.attributes.image?.data ? {
          id: excursion.attributes.image.data.id,
          url: excursion.attributes.image.data.attributes.url,
          formats: excursion.attributes.image.data.attributes.formats,
          alternativeText: excursion.attributes.image.data.attributes.alternativeText,
          caption: excursion.attributes.image.data.attributes.caption,
          name: excursion.attributes.image.data.attributes.name
        } : null,
        images: excursion.attributes.gallery?.data?.map(img => ({
          id: img.id,
          url: img.attributes.url,
          formats: img.attributes.formats,
          alternativeText: img.attributes.alternativeText,
          caption: img.attributes.caption,
          name: img.attributes.name
        })) || []
      };
      
      return { data: transformedData };
    } catch (error) {
      console.warn(`Excursion API failed for id ${id}:`, error);
      throw new Error('Excursion not found');
    }
  },

  getFeatured: async (locale: string = 'en'): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters: { isPopular: true }, // isPopular вместо featured
        pageSize: 3,
        populate: 'image,gallery'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<ExcursionLegacy[]>>(`/excursions?${params}`);
      
      const transformedData = response.data.map(excursion => ({
        id: excursion.id,
        title: excursion.attributes.name,
        description: excursion.attributes.description,
        duration: excursion.attributes.duration,
        price: `€${excursion.attributes.price}`,
        rating: 4.8,
        groupSize: `Макс ${excursion.attributes.maxGroupSize || 20} человек`,
        image: excursion.attributes.image?.data?.attributes.url || '/placeholder.jpg'
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Featured excursions API failed:', error);
      return { data: [] };
    }
  }
};

// API для недвижимости (адаптированный для новой структуры)
export const propertiesAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}, page: number = 1, pageSize: number = 25): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        page,
        pageSize,
        sort: 'createdAt:desc',
        populate: 'images,price,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<PropertyLegacy[]>>(`/properties?${params}`);
      
      const transformedData = response.data.map(property => ({
        id: property.id,
        documentId: property.documentId || property.id,
        title: property.attributes.title,
        slug: property.attributes.slug,
        description: property.attributes.description,
        type: property.attributes.type,
        property_status: property.attributes.property_status,
        category: property.attributes.category,
        price: {
          amount: property.attributes.price.amount,
          currency: property.attributes.price.currency,
          period: property.attributes.type === 'rent' ? 'month' : 'total'
        },
        specifications: {
          bedrooms: property.attributes.specifications.bedrooms,
          bathrooms: property.attributes.specifications.bathrooms,
          total_area: property.attributes.specifications.total_area
        },
        featured: property.attributes.featured,
        location: property.attributes.location,
        contact: property.attributes.contact,
        images: property.attributes.images?.data?.map(img => ({
          id: img.id,
          url: img.attributes.url,
          formats: img.attributes.formats,
          alternativeText: img.attributes.alternativeText,
          caption: img.attributes.caption,
          name: img.attributes.name
        })) || [],
        createdAt: property.attributes.createdAt,
        updatedAt: property.attributes.updatedAt,
        publishedAt: property.attributes.publishedAt
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Properties API failed:', error);
      return { data: [] };
    }
  },

  getFeatured: async (locale: string = 'en'): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters: { featured: true },
        pageSize: 3,
        populate: 'images,price,specifications,location,contact'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<PropertyLegacy[]>>(`/properties?${params}`);
      
      const transformedData = response.data.map(property => ({
        id: property.id,
        title: property.attributes.title,
        description: property.attributes.description,
        price: `€${property.attributes.price.amount}/${property.attributes.type === 'rent' ? 'месяц' : 'всего'}`,
        bedrooms: property.attributes.specifications.bedrooms,
        bathrooms: property.attributes.specifications.bathrooms,
        area: property.attributes.specifications.total_area,
        location: property.attributes.location?.city || 'Тенерифе',
        image: property.attributes.images?.data?.[0]?.attributes.url || '/placeholder.jpg'
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Featured properties API failed:', error);
      return { data: [] };
    }
  }
};

// API для блога (адаптированный для новой структуры)
export const blogAPI = {
  getAll: async (locale: string = 'en'): Promise<{ data: any[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'featured_image'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<BlogPostLegacy[]>>(`/blog-posts?${params}`);
      
      const transformedData = response.data.map(post => ({
        id: post.id,
        documentId: post.id,
        title: post.attributes.title,
        slug: post.attributes.slug,
        description: post.attributes.description,
        content: post.attributes.content,
        author: post.attributes.author,
        featured: post.attributes.featured,
        reading_time: post.attributes.reading_time,
        featured_image: post.attributes.featured_image?.data ? {
          url: post.attributes.featured_image.data.attributes.url,
          alternativeText: post.attributes.featured_image.data.attributes.alternativeText,
          caption: post.attributes.featured_image.data.attributes.caption,
          name: post.attributes.featured_image.data.attributes.name
        } : null,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        publishedAt: post.attributes.publishedAt
      }));
      
      return { data: transformedData };
    } catch (error) {
      console.warn('Blog API failed:', error);
      return { data: [] };
    }
  },

  getBySlug: async (slug: string, locale: string = 'en'): Promise<{ data: any }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters: { slug },
        populate: 'featured_image'
      });
      
      const response = await fetchAPI<StrapiResponseLegacy<BlogPostLegacy[]>>(`/blog-posts?${params}`);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Post not found');
      }
      
      const post = response.data[0];
      const transformedData = {
        id: post.id,
        documentId: post.id,
        title: post.attributes.title,
        slug: post.attributes.slug,
        description: post.attributes.description,
        content: post.attributes.content,
        author: post.attributes.author,
        featured: post.attributes.featured,
        reading_time: post.attributes.reading_time,
        featured_image: post.attributes.featured_image?.data ? {
          url: post.attributes.featured_image.data.attributes.url,
          alternativeText: post.attributes.featured_image.data.attributes.alternativeText,
          caption: post.attributes.featured_image.data.attributes.caption,
          name: post.attributes.featured_image.data.attributes.name
        } : null,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        publishedAt: post.attributes.publishedAt
      };
      
      return { data: transformedData };
    } catch (error) {
      console.warn(`Blog post API failed for slug ${slug}:`, error);
      throw new Error('Post not found');
    }
  }
};

// Экспортируем API под старыми именами для совместимости
export const toursAPI = excursionsAPI; // tours -> excursions
export const carsAPILegacy = carsAPI;
export const excursionsAPILegacy = excursionsAPI;
export const propertiesAPILegacy = propertiesAPI;
export const blogAPILegacy = blogAPI;