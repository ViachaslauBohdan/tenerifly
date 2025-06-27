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

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

// Общие компоненты
interface Location {
  id: number;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
}

interface Price {
  id: number;
  amount: number;
  currency: string;
  period: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  telegram: string | null;
  preferred_contact: string;
}

// Изображения для Tour
interface TourImage {
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
// Обновленный интерфейс Tour с дополнительными полями для фильтров
export interface Tour {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
// Спецификации автомобиля
interface CarSpecifications {
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
interface CarFeatures {
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
interface CarRentalTerms {
  id: number;
  min_rental_period: number;
  deposit_amount: number;
  insurance_included: boolean;
  mileage_limit: number;
  additional_terms: string[];
}

// Условия продажи автомобиля
interface CarSaleTerms {
  id: number;
  warranty_included: boolean;
  warranty_duration: number;
  financing_available: boolean;
  trade_in_accepted: boolean;
  additional_terms: string[];
}

// Изображения автомобиля
interface CarImage {
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

// Интерфейс автомобиля
export interface Car {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string | null;
  type: 'rent' | 'sale';
  car_status: 'available' | 'reserved' | 'sold' | 'maintenance';
  featured: boolean;
  price: Price;
  specifications: CarSpecifications;
  features: CarFeatures | null;
  rental_terms: CarRentalTerms | null;
  sale_terms: CarSaleTerms | null;
  location: Location | null;
  contact: Contact | null;
  images: CarImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Спецификации недвижимости
interface PropertySpecifications {
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
}

// Характеристики недвижимости
interface PropertyFeatures {
  id: number;
  air_conditioning: boolean;
  heating: boolean;
  internet: boolean;
  tv: boolean;
  washing_machine: boolean;
  dishwasher: boolean;
  pool: boolean;
  garden: boolean;
  terrace: boolean;
  garage: boolean;
  elevator: boolean;
  security: boolean;
  additional_features: string[];
}

// Условия аренды недвижимости
interface PropertyRentalTerms {
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
interface PropertySaleTerms {
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

// Интерфейс недвижимости
export interface Property {
  id: number;
  title: string;
  slug: string | null;
  description: string;
  images: {
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
  }[];
  type: 'rent' | 'sale';
  property_status: 'available' | 'reserved' | 'sold' | 'under_contract';
  featured: boolean;
  category: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'commercial' | 'land' | 'building';
  price: Price;
  specifications: PropertySpecifications;
  features?: PropertyFeatures;
  rental_terms?: PropertyRentalTerms;
  sale_terms?: PropertySaleTerms;
  location: Location;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Интерфейс для блога
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