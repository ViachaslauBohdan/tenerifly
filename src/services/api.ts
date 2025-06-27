import { Tour, Car, Property, BlogPost } from '@/types/strapi';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

console.log('API_URL:', process.env.NEXT_PUBLIC_STRAPI_API_URL);
console.log('API_TOKEN:', process.env.NEXT_PUBLIC_STRAPI_API_TOKEN);

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
                ext: ".webp",
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
                hash: "teide_thumb",
                mime: "image/webp",
                name: "teide-thumb",
                path: null,
                size: 15000,
                width: 150,
                height: 113,
                sizeInBytes: 15000
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
                ext: ".avif",
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif",
                hash: "whale_thumb",
                mime: "image/avif",
                name: "whale-thumb",
                path: null,
                size: 15000,
                width: 150,
                height: 113,
                sizeInBytes: 15000
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
      console.warn(`Tours API failed for ID ${id}, using fallback data:`, error);
      const mockTour: Tour = {
        id: id,
        documentId: "tour-1",
        title: "Национальный парк Тейде",
        slug: "teide-national-park",
        description: "Посетите самую высокую гору Испании и насладитесь потрясающими видами вулканических пейзажей. Включает транспорт, гида и обед.",
        duration: "8 часов",
        language: 'RU' as const,
        available_days: ['monday', 'wednesday', 'friday'],
        rating: 4.8,
        reviews_count: 127,
        highlights: [
          "Поездка на канатной дороге на высоту 3555 метров",
          "Обед с видом на вулканические пейзажи", 
          "Профессиональный гид-геолог",
          "Транспорт туда и обратно включен"
        ],
        what_to_bring: [
          "Теплая одежда (температура может быть на 20°C ниже)",
          "Удобная обувь для ходьбы",
          "Солнцезащитные очки",
          "Камера для фотографий"
        ],
        meeting_point: "Отель Los Gigantes, главный вход",
        cancellation_policy: "Бесплатная отмена за 24 часа до начала тура",
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
              ext: ".webp",
              url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
              hash: "teide_thumb",
              mime: "image/webp",
              name: "teide-thumb",
              path: null,
              size: 15000,
              width: 150,
              height: 113,
              sizeInBytes: 15000
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
        includes_tickets: true,
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
      };
      
      return { data: mockTour };
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
                hash: "yaris_thumb",
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
      console.warn(`Cars API failed for ID ${id}, using fallback data:`, error);
      
      // Fallback к мок-данным
      const mockCar: Car = {
        id: id,
        documentId: "car-1",
        title: "Toyota Yaris 2018",
        slug: "toyota-yaris-2018",
        description: "Компактный и экономичный автомобиль идеально подходящий для путешествий по Тенерифе. Автоматическая коробка передач, кондиционер, низкий расход топлива.",
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
          additional_terms: ["Full tank policy", "Driver must be 21+"]
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
              hash: "yaris_thumb",
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
      };
      
      return { data: mockCar };
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
                ext: ".jpg",
                url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
                hash: "property_thumb",
                mime: "image/jpeg",
                name: "property-thumb",
                path: null,
                size: 15000,
                width: 150,
                height: 113,
                sizeInBytes: 15000
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
      console.warn(`Properties API failed for ID ${id}, using fallback data:`, error);
      
      // Fallback к мок-данным
      const mockProperty: Property = {
        id: id,
        title: "Apartment with Ocean View",
        slug: "apartment-ocean-view",
        description: "Beautiful apartment with stunning ocean views in Los Gigantes, Tenerife. Perfect for vacation rental with modern amenities and breathtaking scenery.",
        images: [{
          id: 1,
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
          formats: {
            thumbnail: {
              ext: ".jpg",
              url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
              hash: "property_thumb",
              mime: "image/jpeg",
              name: "property-thumb",
              path: null,
              size: 15000,
              width: 150,
              height: 113,
              sizeInBytes: 15000
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
        rental_terms: {
          id: 1,
          minimum_stay: 7,
          min_rental_period: 7,
          deposit_amount: 500,
          pets_allowed: false,
          smoking_allowed: false,
          utilities_included: true,
          additional_terms: ["No parties", "Check-in after 3 PM"]
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
      };
      
      return { data: mockProperty };
    }
  },
};

// API для блога
export const blogAPI = {
  getAll: async (locale: string) => {
    const mockPosts: BlogPost[] = [
      {
        id: 1,
        documentId: 'why-visit-tenerife-2025',
        title: 'Почему стоит посетить Тенерифе в 2025 году',
        slug: 'why-visit-tenerife-2025',
        description: 'Открывайте для себя все причины, по которым Тенерифе должен стать вашим следующим направлением для путешествий в 2025 году.',
        excerpt: 'Тенерифе предлагает идеальное сочетание пляжей, природы, культуры и развлечений для незабываемого отдыха.',
        content: `<h2>Введение</h2>
          <p>Тенерифе — это остров бесконечных возможностей, где каждый путешественник найдет что-то особенное для себя.</p>
          
          <h3>Климат круглый год</h3>
          <p>Одним из главных преимуществ Тенерифе является его субтропический климат. Средняя температура воздуха колеблется от 18°C зимой до 28°C летом, что делает остров идеальным местом для отдыха в любое время года.</p>
          
          <h3>Удивительная природа</h3>
          <p>От заснеженной вершины вулкана Тейде до черных пляжей и пышных лесов — природное разнообразие Тенерифе поражает воображение.</p>
          
          <h3>Богатая культура</h3>
          <p>Канарские острова имеют уникальную культуру, сочетающую испанские, африканские и латиноамериканские традиции.</p>`,
        featured_image: {
          id: 1,
          documentId: 'blog-img-1',
          name: 'tenerife-2025',
          alternativeText: 'Тенерифе 2025',
          caption: null,
          width: 800,
          height: 600,
          formats: {
            thumbnail: {
              ext: ".jpg",
              url: "/images/blog/tenerife-2025.jpg",
              hash: "tenerife_thumb",
              mime: "image/jpeg",
              name: "tenerife-thumb",
              path: null,
              size: 15000,
              width: 150,
              height: 113,
              sizeInBytes: 15000
            }
          },
          hash: "tenerife_hash",
          ext: ".jpg",
          mime: "image/jpeg",
          size: 85000,
          url: '/images/blog/tenerife-2025.jpg',
          previewUrl: null,
          provider: "local",
          provider_metadata: {},
          createdAt: "2024-12-15T10:00:00.000Z",
          updatedAt: "2024-12-15T10:00:00.000Z",
          publishedAt: "2024-12-15T10:00:00.000Z"
        },
        author: 'Мария Гонсалес',
        category: {
          id: 1,
          name: 'Путешествия',
          slug: 'travel'
        },
        tags: ['Тенерифе', 'Путешествия', '2025', 'Канарские острова'],
        published_date: '2024-12-15',
        reading_time: 8,
        featured: true,
        seo: {
          metaTitle: 'Почему стоит посетить Тенерифе в 2025 году',
          metaDescription: 'Узнайте все причины выбрать Тенерифе для отдыха в 2025 году',
          keywords: ['Тенерифе', 'отдых', '2025', 'Канарские острова']
        },
        createdAt: '2024-12-15T10:00:00.000Z',
        updatedAt: '2024-12-15T10:00:00.000Z',
        publishedAt: '2024-12-15T10:00:00.000Z'
      },
      {
        id: 2,
        documentId: 'best-beaches-tenerife',
        title: 'Лучшие пляжи Тенерифе: гид по райским местам',
        slug: 'best-beaches-tenerife',
        description: 'Полный гид по самым красивым пляжам Тенерифе',
        excerpt: 'От золотых до черных пляжей — откройте для себя лучшие места для пляжного отдыха на острове.',
        content: `<h2>Топ-5 пляжей Тенерифе</h2>
          <p>Каждый пляж на Тенерифе уникален и имеет свой характер...</p>`,
        featured_image: {
          id: 2,
          documentId: 'blog-img-2',
          name: 'beaches-tenerife',
          alternativeText: 'Пляжи Тенерифе',
          caption: null,
          width: 800,
          height: 600,
          formats: {
            thumbnail: {
              ext: ".jpg",
              url: "/images/blog/beaches-tenerife.jpg",
              hash: "beaches_thumb",
              mime: "image/jpeg",
              name: "beaches-thumb",
              path: null,
              size: 15000,
              width: 150,
              height: 113,
              sizeInBytes: 15000
            }
          },
          hash: "beaches_hash",
          ext: ".jpg",
          mime: "image/jpeg",
          size: 85000,
          url: '/images/blog/beaches-tenerife.jpg',
          previewUrl: null,
          provider: "local",
          provider_metadata: {},
          createdAt: "2024-12-10T10:00:00.000Z",
          updatedAt: "2024-12-10T10:00:00.000Z",
          publishedAt: "2024-12-10T10:00:00.000Z"
        },
        author: 'Хуан Карлос',
        category: {
          id: 1,
          name: 'Путешествия',
          slug: 'travel'
        },
        tags: ['Пляжи', 'Тенерифе', 'Отдых'],
        published_date: '2024-12-10',
        reading_time: 6,
        featured: false,
        seo: {
          metaTitle: 'Лучшие пляжи Тенерифе',
          metaDescription: 'Откройте для себя самые красивые пляжи Тенерифе'
        },
        createdAt: '2024-12-10T10:00:00.000Z',
        updatedAt: '2024-12-10T10:00:00.000Z',
        publishedAt: '2024-12-10T10:00:00.000Z'
      }
    ];

    return Promise.resolve({ data: mockPosts });
  },

  getBySlug: async (slug: string, locale: string) => {
    const allPosts = await blogAPI.getAll(locale);
    const post = allPosts.data.find(p => p.slug === slug);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return Promise.resolve({ data: post });
  }
};