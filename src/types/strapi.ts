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
      url: string;
      width: number;
      height: number;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

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

interface CarRentalTerms {
  id: number;
  min_rental_period: number;
  deposit_amount: number;
  insurance_included: boolean;
  mileage_limit: number;
  additional_terms: string[];
}

interface CarSaleTerms {
  id: number;
  warranty_included: boolean;
  warranty_duration: number;
  financing_available: boolean;
  trade_in_accepted: boolean;
  additional_terms: string[];
}

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
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

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

interface PropertyRentalTerms {
  id: number;
  min_rental_period: number;
  deposit_amount: number;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  utilities_included: boolean;
  additional_terms: string[];
}

interface PropertySaleTerms {
  id: number;
  ownership_type: string;
  tax_amount: number;
  hoa_fees: number;
  financing_available: boolean;
  additional_terms: string[];
}

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
        url: string;
        width: number;
        height: number;
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