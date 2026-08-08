import type { Transfer } from "@/lib/transfers";
import type { Locale } from "@/types/locale";

export type LanguageCode = Locale;

export type BookingItem = {
  title: string;
  price?: string;
  currency?: string;
  duration?: string;
  language?: string;
  brand?: string;
  model?: string;
  contact?: { email?: string };
};

export type HomeProperty = {
  id?: string | number;
  documentId?: string;
  title: string;
  image?: string;
  rating?: string | number;
  description?: string;
  location?: string;
  amenities?: string;
  price?: string;
  currency?: string;
  duration?: string;
  language?: string;
  brand?: string;
  model?: string;
  contact?: { email?: string };
};

export type HomeCar = {
  id?: string | number;
  documentId?: string;
  title: string;
  image?: string;
  images?: Array<{ url?: string } | null> | null;
  rating?: string | number;
  description?: string;
  type?: string;
  duration?: string;
  language?: string;
  contact?: { email?: string };
  price?: number | string;
  rental_prices?: {
    day_1?: number | string;
    currency?: string;
  };
  specifications?: {
    make?: string;
    model?: string;
    fuel?: string;
    transmission?: string;
  };
};

export type HomeBlogPost = {
  id?: string | number;
  documentId?: string;
  title: string;
  image?: string;
  rating?: string | number;
  description?: string;
  author?: string;
  readTime?: string;
  publishedDate?: string;
};

export type LocalePageInitialData = {
  properties: HomeProperty[];
  cars: HomeCar[];
  blogs: HomeBlogPost[];
  transfers?: Transfer[];
};
