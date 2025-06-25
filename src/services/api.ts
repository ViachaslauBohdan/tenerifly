import { Tour, Car, Property, BlogPost } from '@/types/strapi';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

if (!API_URL || !API_TOKEN) {
  console.warn('Missing Strapi API configuration, using mock data');
}

// Интерфейс для параметров фильтрации
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
  
  // Популяция данных
  if (params.populate) {
    searchParams.append('populate', params.populate);
  } else {
    searchParams.append('populate', '*');
  }
  
  // Локализация
  if (params.locale) searchParams.append('locale', params.locale);
  
  // Фильтры
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          // Для массивов используем $in оператор
          value.forEach((item, index) => {
            searchParams.append(`filters[${key}][$in][${index}]`, item.toString());
          });
        } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          // Для диапазонов
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
  if (!API_URL || !API_TOKEN) {
    throw new Error('API configuration missing');
  }

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

// API для туров/экскурсий
export const toursAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}): Promise<{ data: Tour[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        populate: 'images,location,price,contact'
      });
      
      return await fetchAPI<{ data: Tour[] }>(`/tours?${params}`);
    } catch (error) {
      console.warn('Tours API failed, using fallback data:', error);
      
      // Мок-данные в случае ошибки
      const mockTours: Tour[] = [
        {
          id: 1,
          documentId: "tour-1",
          title: "Национальный парк Тейде",
          slug: "teide-national-park",
          description: "Посетите самую высокую гору Испании и насладитесь потрясающими видами",
          duration: "8 часов",
          language: 'RU' as const,
          available_days: ['monday', 'wednesday', 'friday'],
          images: [{ 
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
            id: 1,
            documentId: "img-1",
            name: "teide-1",
            alternativeText: "Национальный парк Тейде",
            caption: null,
            width: 800,
            height: 600,
            formats: {
              thumbnail: {
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
                width: 150,
                height: 113
              }
            },
            hash: "teide_hash",
            ext: ".webp",
            mime: "image/webp",
            size: 85000,
            previewUrl: null,
            provider: "cloudinary",
            provider_metadata: {},
            createdAt: "2025-01-20T00:00:00.000Z",
            updatedAt: "2025-01-20T00:00:00.000Z",
            publishedAt: "2025-01-20T00:00:00.000Z"
          }],
          price: { 
            id: 1,
            amount: 45,
            currency: "EUR",
            period: "person"
          },
          difficulty_level: 'moderate',
          category: 'nature',
          max_participants: 20,
          min_age: 6,
          includes_transport: true,
          includes_food: true,
          suitable_for_children: true,
          guide_languages: ['ru', 'en', 'es'],
          location: {
            id: 1,
            address: "Национальный парк Тейде",
            city: "Тенерифе",
            region: "Канарские острова",
            postal_code: "",
            latitude: 28.2722,
            longitude: -16.6356
          },
          contact: {
            id: 1,
            name: "Tenerifly",
            email: "tours@tenerifly.io",
            phone: "+34656641433",
            whatsapp: "+34656641433",
            telegram: null,
            preferred_contact: "whatsapp"
          },
          createdAt: "2025-01-20T00:00:00.000Z",
          updatedAt: "2025-01-20T00:00:00.000Z",
          publishedAt: "2025-01-20T00:00:00.000Z"
        },
        {
          id: 2,
          documentId: "tour-2",
          title: "Наблюдение за китами",
          slug: "whale-watching",
          description: "Увидите китов и дельфинов в их естественной среде обитания",
          duration: "4 часа",
          language: 'RU' as const,
          available_days: ['tuesday', 'thursday', 'saturday'],
          images: [{ 
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif",
            id: 2,
            documentId: "img-2",
            name: "whale-1",
            alternativeText: "Наблюдение за китами",
            caption: null,
            width: 800,
            height: 600,
            formats: {
              thumbnail: {
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif",
                width: 150,
                height: 113
              }
            },
            hash: "whale_hash",
            ext: ".avif",
            mime: "image/avif",
            size: 95000,
            previewUrl: null,
            provider: "cloudinary",
            provider_metadata: {},
            createdAt: "2025-01-18T00:00:00.000Z",
            updatedAt: "2025-01-18T00:00:00.000Z",
            publishedAt: "2025-01-18T00:00:00.000Z"
          }],
          price: { 
            id: 2,
            amount: 35,
            currency: "EUR",
            period: "person"
          },
          difficulty_level: 'easy',
          category: 'boat_trip',
          max_participants: 15,
          min_age: 0,
          includes_transport: false,
          includes_food: false,
          suitable_for_children: true,
          guide_languages: ['ru', 'en', 'es'],
          location: {
            id: 2,
            address: "Порт Лос-Хигантес",
            city: "Лос-Хигантес",
            region: "Тенерифе",
            postal_code: "",
            latitude: 28.2393,
            longitude: -16.8416
          },
          contact: {
            id: 2,
            name: "Tenerifly",
            email: "tours@tenerifly.io",
            phone: "+34656641433",
            whatsapp: "+34656641433",
            telegram: null,
            preferred_contact: "whatsapp"
          },
          createdAt: "2025-01-18T00:00:00.000Z",
          updatedAt: "2025-01-18T00:00:00.000Z",
          publishedAt: "2025-01-18T00:00:00.000Z"
        }
      ];
      
      return { data: mockTours };
    }
  },
  
  getById: async (id: number, locale: string = 'en'): Promise<{ data: Tour }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'images,location,price,contact'
      });
      
      return await fetchAPI<{ data: Tour }>(`/tours/${id}?${params}`);
    } catch (error) {
      throw new Error(`Failed to fetch tour ${id}: ${error}`);
    }
  },
};

// API для автомобилей
export const carsAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}): Promise<{ data: Car[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        populate: 'images,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      return await fetchAPI<{ data: Car[] }>(`/cars?${params}`);
    } catch (error) {
      console.warn('Cars API failed, using fallback data:', error);
      
      // Мок-данные для автомобилей
      const mockCars: Car[] = [
        {
          id: 1,
          documentId: "car-1",
          title: "Toyota Yaris 2018",
          slug: "toyota-yaris-2018",
          description: "Компактный и экономичный автомобиль",
          type: 'rent',
          car_status: 'available',
          featured: false,
          price: { id: 1, amount: 30, currency: "EUR", period: "day" },
          specifications: {
            id: 1,
            make: "Toyota",
            model: "Yaris",
            year: 2018,
            mileage: 25000,
            fuel: "petrol",
            transmission: "automatic",
            engine_size: "1.5L",
            power: "75",
            seats: 5,
            doors: 5,
            color: "Silver",
            body_type: "hatchback",
            drive_type: "fwd"
          },
          features: {
            id: 1,
            air_conditioning: true,
            navigation: false,
            bluetooth: true,
            parking_sensors: false,
            backup_camera: false,
            cruise_control: false,
            additional_features: ["USB", "Electric windows"]
          },
          rental_terms: {
            id: 1,
            min_rental_period: 1,
            deposit_amount: 150,
            insurance_included: true,
            mileage_limit: 200,
            additional_terms: ["Full tank policy"]
          },
          sale_terms: null,
          location: {
            id: 1,
            address: "Los Gigantes",
            city: "Tenerife",
            region: "Canary Islands",
            postal_code: "38683",
            latitude: 28.2393,
            longitude: -16.8416
          },
          contact: {
            id: 1,
            name: "Tenerifly",
            email: "cars@tenerifly.io",
            phone: "+34656641433",
            whatsapp: "+34656641433",
            telegram: null,
            preferred_contact: "whatsapp"
          },
          images: [{
            id: 1,
            documentId: "car-img-1",
            name: "toyota-yaris-1",
            alternativeText: "Toyota Yaris",
            caption: null,
            width: 800,
            height: 600,
            formats: {
              thumbnail: {
                ext: ".jpg",
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg",
                hash: "yaris_hash",
                mime: "image/jpeg",
                name: "yaris-thumb",
                path: null,
                size: 15000,
                width: 150,
                height: 113,
                sizeInBytes: 15000
              }
            },
            hash: "yaris_main_hash",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 85000,
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg",
            previewUrl: null,
            provider: "cloudinary",
            provider_metadata: {},
            createdAt: "2025-01-20T00:00:00.000Z",
            updatedAt: "2025-01-20T00:00:00.000Z",
            publishedAt: "2025-01-20T00:00:00.000Z"
          }],
          createdAt: "2025-01-20T00:00:00.000Z",
          updatedAt: "2025-01-20T00:00:00.000Z",
          publishedAt: "2025-01-20T00:00:00.000Z"
        }
      ];
      
      return { data: mockCars };
    }
  },
  
  getById: async (id: number, locale: string = 'en'): Promise<{ data: Car }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'images,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      return await fetchAPI<{ data: Car }>(`/cars/${id}?${params}`);
    } catch (error) {
      throw new Error(`Failed to fetch car ${id}: ${error}`);
    }
  },
};

// API для недвижимости
export const propertiesAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}): Promise<{ data: Property[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        populate: 'images,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      return await fetchAPI<{ data: Property[] }>(`/properties?${params}`);
    } catch (error) {
      console.warn('Properties API failed, using fallback data:', error);
      
      // Мок-данные для недвижимости
      const mockProperties: Property[] = [
        {
          id: 1,
          title: "Apartment with Ocean View",
          slug: "apartment-ocean-view",
          description: "Beautiful apartment with stunning ocean views",
          images: [{
            id: 1,
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
            formats: {
              thumbnail: {
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
                width: 150,
                height: 113
              }
            }
          }],
          type: 'rent',
          property_status: 'available',
          featured: true,
          category: 'apartment',
          price: { id: 1, amount: 1200, currency: "EUR", period: "month" },
          specifications: {
            id: 1,
            total_area: 85,
            living_area: 70,
            bedrooms: 2,
            bathrooms: 1,
            floor: 3,
            total_floors: 5,
            year_built: 2015,
            parking_spaces: 1,
            furnished: true
          },
          features: {
            id: 1,
            air_conditioning: true,
            heating: false,
            internet: true,
            tv: true,
            washing_machine: true,
            dishwasher: false,
            pool: true,
            garden: false,
            terrace: true,
            garage: false,
            elevator: true,
            security: false,
            additional_features: ["Ocean view", "Balcony"]
          },
          location: {
            id: 1,
            address: "Los Gigantes",
            city: "Los Gigantes",
            region: "Tenerife",
            postal_code: "38683",
            latitude: 28.2393,
            longitude: -16.8416
          },
          contact: {
            id: 1,
            name: "Tenerifly",
            email: "properties@tenerifly.io",
            phone: "+34656641433",
            whatsapp: "+34656641433",
            telegram: null,
            preferred_contact: "whatsapp"
          },
          createdAt: "2025-01-20T00:00:00.000Z",
          updatedAt: "2025-01-20T00:00:00.000Z",
          publishedAt: "2025-01-20T00:00:00.000Z"
        }
      ];
      
      return { data: mockProperties };
    }
  },
  
  getById: async (id: number, locale: string = 'en'): Promise<{ data: Property }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'images,specifications,features,rental_terms,sale_terms,location,contact'
      });
      
      return await fetchAPI<{ data: Property }>(`/properties/${id}?${params}`);
    } catch (error) {
      throw new Error(`Failed to fetch property ${id}: ${error}`);
    }
  },
};

// API для блога
export const blogAPI = {
  getAll: async (locale: string = 'en', filters: Record<string, any> = {}): Promise<{ data: BlogPost[] }> => {
    try {
      const params = buildFilterParams({
        locale,
        filters,
        populate: 'featured_image,author,author.avatar,category'
      });
      
      return await fetchAPI<{ data: BlogPost[] }>(`/blog-posts?${params}`);
    } catch (error) {
      console.warn('Blog API failed, using fallback data:', error);
      
      // Мок-данные для блога
      const mockPosts: BlogPost[] = [
        {
          id: 1,
          documentId: "blog-1",
          title: "Почему стоит посетить Тенерифе в 2025 году",
          slug: "why-visit-tenerife-2025",
          description: "Откройте для себя все причины, по которым Тенерифе — идеальное место для отдыха в 2025 году",
          content: "Тенерифе — это остров вечной весны, где каждый найдет что-то для себя...",
          featured_image: {
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
            id: 1,
            documentId: "blog-img-1",
            name: "tenerife-2025",
            alternativeText: "Тенерифе 2025",
            caption: null,
            width: 1200,
            height: 630,
            formats: {
              thumbnail: {
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
                width: 150,
                height: 79
              }
            },
            hash: "tenerife_blog_hash",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 185000,
            previewUrl: null,
            provider: "cloudinary",
            provider_metadata: {},
            createdAt: "2025-01-20T00:00:00.000Z",
            updatedAt: "2025-01-20T00:00:00.000Z",
            publishedAt: "2025-01-20T00:00:00.000Z"
          },
          author: {
            id: 1,
            name: "Команда Tenerifly"
          },
          category: {
            id: 1,
            name: "Путешествия",
            slug: "travel"
          },
          tags: ["Тенерифе", "2025", "Путешествия", "Отдых"],
          published_date: "2025-01-20T00:00:00.000Z",
          reading_time: 5,
          featured: true,
          seo: {
            metaTitle: "Почему стоит посетить Тенерифе в 2025 году | Tenerifly",
            metaDescription: "Откройте для себя все причины, по которым Тенерифе — идеальное место для отдыха в 2025 году",
            keywords: ["Тенерифе", "2025", "Путешествия", "Отдых", "Канарские острова"]
          },
          createdAt: "2025-01-20T00:00:00.000Z",
          updatedAt: "2025-01-20T00:00:00.000Z",
          publishedAt: "2025-01-20T00:00:00.000Z"
        }
      ];
      
      return { data: mockPosts };
    }
  },
  
  getById: async (id: number, locale: string = 'en'): Promise<{ data: BlogPost }> => {
    try {
      const params = buildFilterParams({
        locale,
        populate: 'featured_image,author,author.avatar,category'
      });
      
      return await fetchAPI<{ data: BlogPost }>(`/blog-posts/${id}?${params}`);
    } catch (error) {
      throw new Error(`Failed to fetch blog post ${id}: ${error}`);
    }
  },
};