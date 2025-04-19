import { StrapiBaseAttributes, StrapiEntity } from './strapi';

export interface PropertyPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface PropertySpecifications {
  total_area: number;
  living_area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  year_built: number | null;
  parking_spaces: number;
}

export interface PropertyFeatures {
  has_pool: boolean;
  has_garden: boolean;
  has_garage: boolean;
  has_terrace: boolean;
  has_security: boolean;
  has_air_conditioning: boolean;
  has_heating: boolean;
  has_internet: boolean;
  furnished: boolean;
  additional_features: string | null;
}

export interface PropertyLocation {
  address: string;
  city: string;
  region: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyContact {
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  telegram: string | null;
  preferred_contact: string;
}

export interface PropertyAttributes {
  title: string;
  description: string;
  type: string;
  property_status: string;
  featured: boolean;
  category: string;
  price: PropertyPrice;
  specifications: PropertySpecifications;
  features: PropertyFeatures;
  location: PropertyLocation;
  contact: PropertyContact;
  images: {
    data: Array<{
      id: number;
      attributes: {
        url: string;
        formats: {
          thumbnail: { url: string };
          small: { url: string };
          medium: { url: string };
          large: { url: string };
        };
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Property {
  id: number;
  attributes: PropertyAttributes;
} 