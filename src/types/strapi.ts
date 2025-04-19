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
    attributes: StrapiImageAttributes;
  };
}

interface StrapiBaseAttributes {
  title: string;
  description: string;
  price: number;
  images: StrapiImage[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExcursionAttributes extends StrapiBaseAttributes {
  duration: string;
  maxGroupSize: number;
}

export interface CarAttributes extends StrapiBaseAttributes {
  brand: string;
  model: string;
  year: number;
  transmission: string;
  seats: number;
  features: string;
}

export interface AccommodationAttributes extends StrapiBaseAttributes {
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string;
}

interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export type Excursion = StrapiEntity<ExcursionAttributes>;
export type Car = StrapiEntity<CarAttributes>;
export type Accommodation = StrapiEntity<AccommodationAttributes>; 