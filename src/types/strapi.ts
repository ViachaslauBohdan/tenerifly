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

export interface StrapiImage {
  data: {
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
  };
}

export interface Accommodation {
  id: number;
  attributes: {
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    images: StrapiImage[];
    amenities: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface Excursion {
  id: number;
  attributes: {
    title: string;
    description: string;
    price: number;
    duration: string;
    maxGroupSize: number;
    images: StrapiImage[];
    included: string[];
    schedule: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface Car {
  id: number;
  attributes: {
    title: string;
    description: string;
    price: number;
    brand: string;
    model: string;
    year: number;
    transmission: string;
    seats: number;
    images: StrapiImage[];
    features: string[];
    createdAt: string;
    updatedAt: string;
  };
} 