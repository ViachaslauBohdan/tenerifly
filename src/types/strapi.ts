export interface StrapiResponse<T> {
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

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImageFormats {
  thumbnail: StrapiImageFormat;
  small: StrapiImageFormat;
  medium: StrapiImageFormat;
  large: StrapiImageFormat;
}

export interface StrapiImageAttributes {
  url: string;
  formats: StrapiImageFormats;
}

export interface StrapiImage {
  data: {
    id: number;
    attributes: StrapiImageAttributes;
  };
}

export interface StrapiBaseAttributes {
  title: string;
  description: string;
  price: number;
  images: StrapiImage[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Общие компоненты
export interface Location {
  id: number;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Price {
  id: number;
  amount: number;
  currency: string;
  period: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  telegram: string | null;
  preferred_contact: string;
}

// Изображения для Tour
export interface TourImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Интерфейс Tour
export interface Tour {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  short_description?: string; 
  duration: string;
  language: 'RU' | 'EN' | 'ES';
  available_days: string[] | null;
  images: TourImage[];
  location: Location;
  price: Price;
  contact: Contact;
  difficulty_level?: 'easy' | 'moderate' | 'hard';
  category?: string;
  max_participants?: number;
  min_age?: number;
  includes_transport?: boolean;
  includes_food?: boolean;
  includes_tickets?: boolean;
  suitable_for_children?: boolean;
  guide_languages?: string[];
  rating?: number;
  reviews_count?: number;
  highlights?: string[];
  what_to_bring?: string[];
  meeting_point?: string;
  cancellation_policy?: string;
  featured?: boolean; 
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Спецификации автомобиля
export interface CarSpecifications {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string | null;
  transmission: string | null;
  engine_size: string | null;
  power: string | null;
  seats: number | null;
  doors: number | null;
  color: string | null;
  body_type: string | null;
  drive_type: string | null;
}

// Характеристики автомобиля
export interface CarFeatures {
  id: number;
  air_conditioning: boolean;
  navigation: boolean;
  bluetooth: boolean;
  parking_sensors: boolean;
  backup_camera: boolean;
  cruise_control: boolean;
  additional_features: string[];
}

// Условия аренды автомобиля
export interface CarRentalTerms {
  id: number;
  min_rental_period: number;
  deposit_amount: number;
  insurance_included: boolean;
  mileage_limit: number;
  additional_terms: string[];
}

// Условия продажи автомобиля
export interface CarSaleTerms {
  id: number;
  warranty_included: boolean;
  warranty_duration: number;
  financing_available: boolean;
  trade_in_accepted: boolean;
  additional_terms: string[];
}

// Изображения автомобиля
export interface CarImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CarRentalPrices {
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

// Интерфейс автомобиля
export interface Car {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string | null;
  short_description?: string; 
  type: 'rent' | 'sale';
  car_status: 'available' | 'reserved' | 'sold' | 'maintenance';
  featured: boolean;
  price: Price;
  specifications: CarSpecifications;
  features: CarFeatures | null;
  rental_terms: CarRentalTerms | null;
  sale_terms: CarSaleTerms | null;
  rental_prices?: CarRentalPrices | null; 
  location: Location | null;
  contact: Contact | null;
  images: CarImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Спецификации недвижимости
export interface PropertySpecifications {
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
  property_type?: string;
}

// Характеристики недвижимости
export interface PropertyFeatures {
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

// Условия аренды недвижимости
export interface PropertyRentalTerms {
  id: number;
  minimum_stay: number;  
  maximum_stay?: number; 
  min_rental_period: number;
  deposit_amount: number;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  utilities_included: boolean;
  additional_terms: string[];
}

// Условия продажи недвижимости
export interface PropertySaleTerms {
  id: number;
  legal_info?: string; 
  additional_terms?: string; 
  ownership_type: string;
  tax_amount: number;
  hoa_fees: number;
  financing_available: boolean;
  mortgage_available?: boolean;
  payment_methods?: any;
}

export interface Property {
  id: number;
  title: string;
  slug?: string | null;
  description: string;
  short_description?: string;
  type: 'rent' | 'sale';
  property_status: 'available' | 'reserved' | 'sold' | 'under_contract';
  featured?: boolean;
  category: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'commercial' | 'land' | 'building';
  price: Price;
  specifications: PropertySpecifications;
  features?: PropertyFeatures;
  rental_terms?: PropertyRentalTerms;
  sale_terms?: PropertySaleTerms;
  location: Location;
  contact?: Contact;
  images: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: string | null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    };
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Интерфейс для блога
export type PaymentCategory = 'tour' | 'car' | 'apartment';
export type PaymentTransactionStatus = 'completed' | 'refunded';

export interface PaymentTransaction {
  id?: number;
  documentId?: string;
  amount: number;
  currency: string;
  categories: PaymentCategory[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerNote?: string | null;
  locale: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  status: PaymentTransactionStatus;
  paidAt: string;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string; 
  content: string;
  featured_image: TourImage | null;
  author: string; 
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: string[];
  published_date: string;
  reading_time: number;
  featured: boolean;
  is_featured?: boolean; 
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}