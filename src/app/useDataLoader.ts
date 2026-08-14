"use client";

import { useState, useEffect } from "react";
import { Transfer } from "@/lib/transfers";
import {
  HOME_CARS_FETCH_LIMIT,
  HOME_PREVIEW_LIMIT,
  HOME_LOCALE_OVERLAY_PAGE_SIZE,
  homeListQuery,
  homePopulateQuery,
  pickHomeCarsByLocale,
} from "@/lib/homeListing";
import { mergeLocalizedCatalog } from "@/lib/cmsLocalizedContent";
import { cmsLocale, localeContentKey } from "@/types/locale";
import { formatPropertyPriceLabel } from "@/utils/propertyPrice";

type LanguageCode = "en" | "ru" | "pl" | "fr" | "ua" | "de" | "es";

const getLocalizedText = (language: LanguageCode, textKey: string): string => {
  const texts: Record<string, Record<string, string>> = {
    airConditioning: {
      en: "AC",
      ru: "Кондиционер",
      pl: "Klimatyzacja",
      fr: "Climatisation",
      uk: "Кондиціонер",
      de: "Klimaanlage",
      es: "Aire acondicionado",
    },
    bedrooms: {
      en: "bedrooms",
      ru: "спальни",
      pl: "sypialnie",
      fr: "chambres",
      uk: "спальні",
      de: "Schlafzimmer",
      es: "dormitorios",
    },
    bathrooms: {
      en: "bathrooms",
      ru: "ванные",
      pl: "łazienki",
      fr: "salles de bain",
      uk: "ванні",
      de: "Badezimmer",
      es: "baños",
    },
    minRead: {
      en: "min read",
      ru: "мин чтения",
      pl: "min czytania",
      fr: "min de lecture",
      uk: "хв читання",
      de: "Min. Lesezeit",
      es: "min de lectura",
    },
    night: {
      en: "night",
      ru: "ночь",
      pl: "noc",
      fr: "nuit",
      uk: "ніч",
      de: "Nacht",
      es: "noche",
    },
    month: {
      en: "month",
      ru: "месяц",
      pl: "miesiąc",
      fr: "mois",
      uk: "місяць",
      de: "Monat",
      es: "mes",
    },
  };

  const lang = localeContentKey(language);
  return texts[textKey]?.[lang] || texts[textKey]?.en || "";
};

const fetchFromStrapi = async (endpoint: string) => {
  const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://tenerifly-strapi-production.up.railway.app";
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const getImageUrl = (item: {
  images?: Array<{ url: string }>;
  image?: { url: string } | string;
}): string => {
  if (typeof item.image === "string") {
    return item.image;
  }

  if (item.images && item.images.length > 0) {
    if (item.images[0].url.startsWith("http")) {
      return item.images[0].url;
    }
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${item.images[0].url}`;
  }

  if (item.image?.url) {
    if (item.image.url.startsWith("http")) {
      return item.image.url;
    }
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${item.image.url}`;
  }

  return "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
};

type UseDataLoaderOptions = {
  enabled?: boolean;
};

export function useDataLoader(
  mounted: boolean,
  language: LanguageCode,
  options?: UseDataLoaderOptions
) {
  const enabled = options?.enabled ?? true;
  const [cars, setCars] = useState<Record<string, unknown>[]>([]);
  const [accommodation, setAccommodation] = useState<Record<string, unknown>[]>(
    []
  );
  const [blogPosts, setBlogPosts] = useState<Record<string, unknown>[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [dataLoading, setDataLoading] = useState(enabled);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDataLoading(false);
      return;
    }

    const loadFeaturedData = async () => {
      if (!language) return;

      try {
        setDataLoading(true);
        setHasError(false);

        const list = homeListQuery(HOME_PREVIEW_LIMIT);
        const populate = homePopulateQuery();
        const key = cmsLocale(language);
        const carsBase = `/cars?${populate}&${homeListQuery(HOME_CARS_FETCH_LIMIT)}&sort=title:ASC`;
        const propertiesBase = `/properties?${populate}&${list}&sort=updatedAt:DESC`;

        const fetchWithLocaleFallback = async (basePath: string) => {
          try {
            const primary = await fetchFromStrapi(`${basePath}&locale=${key}`);
            if (primary?.data?.length || key === "en") return primary;
            return await fetchFromStrapi(`${basePath}&locale=en`);
          } catch (error) {
            if (key === "en") throw error;
            return await fetchFromStrapi(`${basePath}&locale=en`);
          }
        };

        const fetchPropertiesMerged = async () => {
          const en = await fetchFromStrapi(`${propertiesBase}&locale=en`);
          if (key === "en") return en;
          let localized: { data?: Array<Record<string, unknown>> } = {
            data: [],
          };
          try {
            localized = await fetchFromStrapi(
              `/properties?${populate}&pagination[pageSize]=${HOME_LOCALE_OVERLAY_PAGE_SIZE}&publicationState=live&locale=${key}`
            );
          } catch {
            localized = { data: [] };
          }
          const enRows = (en?.data || []) as Array<
            Record<string, unknown> & { documentId?: string }
          >;
          const locRows = (localized?.data || []) as Array<
            Record<string, unknown> & { documentId?: string }
          >;
          return { data: mergeLocalizedCatalog(enRows, locRows) };
        };

        const [carsResult, propertiesResult, blogsResult, transfersResult] =
          await Promise.allSettled([
            fetchWithLocaleFallback(carsBase),
            fetchPropertiesMerged(),
            fetchFromStrapi(
              `/blog-posts?${populate}&${list}&sort=publishedAt:DESC`
            ),
            fetchFromStrapi(`/transfers?${populate}&${list}`),
          ]);

        if (
          carsResult.status === "fulfilled" &&
          carsResult.value?.data?.length > 0
        ) {
          const carRows = carsResult.value.data as Array<
            Record<string, unknown> & { locale?: string }
          >;
          const picked = pickHomeCarsByLocale(carRows, language);

          setCars(
            picked.map((car: Record<string, unknown>) => {
              const first = Array.isArray(car.images)
                ? (car.images[0] as { url?: string })
                : undefined;
              return {
                id: car.id,
                documentId: car.documentId,
                title:
                  car.title ||
                  `${(car.specifications as { make?: string })?.make || "Car"} ${(car.specifications as { model?: string })?.model || ""}`.trim(),
                images: first?.url ? [first] : [],
                specifications: car.specifications,
                type: car.type,
                rental_prices: car.rental_prices,
              };
            })
          );
        }

        if (
          propertiesResult.status === "fulfilled" &&
          propertiesResult.value?.data?.length > 0
        ) {
          setAccommodation(
            propertiesResult.value.data.map((property: Record<string, unknown>) => ({
              id: property.id,
              documentId: property.documentId,
              title: property.title || "Property",
              description:
                property.description || "Beautiful stay in Tenerife",
              image: getImageUrl(
                property as { images?: Array<{ url: string }> }
              ),
              price: formatPropertyPriceLabel({
                amount: (property.price as { amount?: number })?.amount || 0,
                currency: (property.price as { currency?: string })?.currency,
                period: (property.price as { period?: string })?.period,
                language,
              }),
              location:
                (property.location as { city?: string })?.city || "Tenerife",
              amenities: [
                "WiFi",
                getLocalizedText(language, "airConditioning"),
                (property.specifications as { bedrooms?: number })?.bedrooms &&
                  `${(property.specifications as { bedrooms?: number }).bedrooms} ${getLocalizedText(language, "bedrooms")}`,
                (property.specifications as { bathrooms?: number })?.bathrooms &&
                  `${(property.specifications as { bathrooms?: number }).bathrooms} ${getLocalizedText(language, "bathrooms")}`,
              ]
                .filter(Boolean)
                .join(", "),
              rating: 4.5,
              contact: property.contact,
            }))
          );
        }

        if (
          blogsResult.status === "fulfilled" &&
          blogsResult.value?.data?.length > 0
        ) {
          setBlogPosts(
            blogsResult.value.data.map((blog: Record<string, unknown>) => ({
              id: blog.id,
              documentId: blog.documentId,
              title: blog.title || "Blog Post",
              description:
                blog.excerpt ||
                blog.description ||
                "Interesting article about Tenerife",
              image: getImageUrl(blog as { images?: Array<{ url: string }> }),
              author: blog.author || "Admin",
              readTime: `${blog.readTime || blog.read_time || 5} ${getLocalizedText(language, "minRead")}`,
              publishedDate: blog.publishedAt
                ? new Date(blog.publishedAt as string).toLocaleDateString()
                : new Date().toLocaleDateString(),
              rating: 4.7,
            }))
          );
        }

        if (transfersResult.status === "fulfilled") {
          const transfersData = Array.isArray(transfersResult.value?.data)
            ? transfersResult.value.data
            : [];
          setTransfers(
            transfersData.map((transfer: Record<string, unknown>) => ({
              id: transfer.id as number,
              documentId: transfer.documentId as string,
              title: (transfer.title as string) || "Airport transfer",
              description:
                (transfer.description as string) ||
                "Private airport transfer in Tenerife",
              seats: Number(transfer.seats || 0),
              price_south_airport: Number(transfer.price_south_airport || 50),
              price_north_airport: Number(transfer.price_north_airport || 100),
              currency: (transfer.currency as string) || "EUR",
              image:
                typeof transfer.image === "string" && transfer.image.length > 0
                  ? transfer.image
                  : undefined,
              images: transfer.images as Transfer["images"],
              contact: transfer.contact as Transfer["contact"],
            }))
          );
        } else {
          setTransfers([]);
        }
      } catch {
        setHasError(true);
      } finally {
        setDataLoading(false);
      }
    };

    if (mounted && language) {
      loadFeaturedData();
    }
  }, [enabled, mounted, language]);

  return {
    cars,
    accommodation,
    blogPosts,
    transfers,
    dataLoading,
    hasError,
  };
}
