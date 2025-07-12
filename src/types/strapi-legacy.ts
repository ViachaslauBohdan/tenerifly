// Типы для старой структуры Strapi заказчика
// Файл: types/strapi-legacy.ts

// Базовые интерфейсы для изображений Strapi
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  ext: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  sizeInBytes: number;
}

export interface StrapiImageFormats {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
}

export interface StrapiImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: StrapiImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImage {
  id: number;
  attributes: StrapiImageAttributes;
}

// Компоненты для автомобилей
export interface CarRentalPricesLegacy {
  id: number;
  currency: 'EUR' | 'USD';
  day_1: number;
  day_2: number;
  day_3: number;
  day_4: number;
  day_5: number;
  day_6: number;
  day_7: number;
  day_8: number;
  day_9: number;
  day_10: number;
  month: number;
  year: number;
}

export interface CarSpecificationsLegacy {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  engine_size: string;
  power: number;
  seats: number;
  doors: number;
  color: string;
  body_type: string;
  drive_type: string;
}

export interface CarFeaturesLegacy {
  id: number;
  air_conditioning: boolean;
  navigation: boolean;
  bluetooth: boolean;
  parking_sensors: boolean;
  other_features: string;
}

export interface CarRentalTermsLegacy {
  id: number;
  min_rental_period: number;
  period_unit: 'day' | 'week' | 'month';
  deposit_amount: number;
  includes_insurance: boolean;
  mileage_limit: number;
  additional_driver: boolean;
  required_documents: string[];
  pickup_locations: string[];
  cancellation_policy: string;
}

export interface CarSaleTermsLegacy {
  id: number;
  warranty_months: number;
  financing_available: boolean;
  inspection_report: StrapiImage | null;
  service_history: boolean;
  ownership_history: number;
  registration_valid_until: string;
  negotiable: boolean;
  included_items: string[];
}

export interface SharedLocationLegacy {
  id: number;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

export interface SharedContactInfoLegacy {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  preferred_contact: 'phone' | 'email' | 'whatsapp' | 'telegram';
}

// Основной интерфейс автомобиля (старая структура)
export interface CarLegacy {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    images: {
      data: StrapiImage[];
    };
    type: 'rent' | 'sale';
    car_status: 'available' | 'reserved' | 'sold' | 'maintenance';
    featured: boolean;
    rental_prices: CarRentalPricesLegacy;
    specifications: CarSpecificationsLegacy;
    features: CarFeaturesLegacy;
    rental_terms: CarRentalTermsLegacy;
    sale_terms: CarSaleTermsLegacy;
    location: SharedLocationLegacy;
    contact: SharedContactInfoLegacy;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Ответ Strapi для списка автомобилей
export interface StrapiResponseLegacy<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Для экскурсий (РЕАЛЬНАЯ структура заказчика)
export interface ExcursionLegacy {
  id: number;
  documentId?: string; // Добавляем documentId
  attributes: {
    name: string; // в старой версии поле называется "name", а не "title"
    slug: string;
    description: string;
    duration: string;
    price: number; // decimal
    category: string;
    highlights: string[]; // JSON массив
    image: {
      data: StrapiImage | null; // ОДНО главное изображение
    };
    gallery: {
      data: StrapiImage[]; // Галерея изображений
    };
    isPopular: boolean; // вместо featured
    isActive: boolean;
    minAge: number | null;
    maxGroupSize: number | null; // вместо max_participants
    included: string[] | null; // JSON массив
    notIncluded: string[] | null; // JSON массив
    meetingPoint: string | null;
    whatToBring: string[] | null; // JSON массив
    cancellationPolicy: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Компоненты для недвижимости (РЕАЛЬНАЯ структура)
export interface SharedPriceLegacy {
  id: number;
  amount: number;
  currency: 'EUR' | 'USD';
  period: 'day' | 'week' | 'month' | 'year' | 'total';
}

export interface PropertySpecificationsLegacy {
  id: number;
  total_area: number;
  living_area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number;
  parking_spaces: number;
  furnished: boolean;
  property_type: string;
}

export interface PropertyFeaturesLegacy {
  id: number;
  has_air_conditioning: boolean;
  has_heating: boolean;
  has_internet: boolean;
  tv: boolean;
  washing_machine: boolean;
  dishwasher: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_terrace: boolean;
  has_garage: boolean;
  elevator: boolean;
  has_security: boolean;
  additional_features: string[];
}

export interface PropertyRentalTermsLegacy {
  id: number;
  minimum_stay: number;
  maximum_stay: number;
  min_rental_period: number;
  deposit_amount: number;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  utilities_included: boolean;
  additional_terms: string[];
}

export interface PropertySaleTermsLegacy {
  id: number;
  legal_info: string;
  additional_terms: string;
  ownership_type: string;
  tax_amount: number;
  hoa_fees: number;
  financing_available: boolean;
  mortgage_available: boolean;
  payment_methods: string[];
}

// Для недвижимости (РЕАЛЬНАЯ структура заказчика)
export interface PropertyLegacy {
  id: number;
  documentId?: string; // Добавляем documentId
  attributes: {
    title: string;
    slug: string;
    description: string;
    images: {
      data: StrapiImage[];
    };
    type: 'rent' | 'sale';
    property_status: 'available' | 'reserved' | 'sold' | 'under_contract';
    featured: boolean;
    category: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'commercial' | 'land' | 'building';
    price: SharedPriceLegacy; // Компонент shared.price
    specifications: PropertySpecificationsLegacy; // Компонент property.specifications
    features: PropertyFeaturesLegacy; // Компонент property.features
    rental_terms: PropertyRentalTermsLegacy; // Компонент property.rental-terms
    sale_terms: PropertySaleTermsLegacy; // Компонент property.sale-terms
    location: SharedLocationLegacy; // Компонент shared.location
    contact: SharedContactInfoLegacy; // Компонент shared.contact-info
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Для блога (предположительная структура)
export interface BlogPostLegacy {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    content: string;
    featured_image: {
      data: StrapiImage | null;
    };
    author: string;
    featured: boolean;
    reading_time: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}