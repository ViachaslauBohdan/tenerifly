"use client";

import { useState, useEffect } from "react";
import { Transfer } from "@/lib/transfers";

type LanguageCode = "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es";

// Добавить эту функцию в начало файла useDataLoader.ts
const getLocalizedText = (language: LanguageCode, textKey: string): string => {
  const texts: Record<string, Record<string, string>> = {
    max: {
      en: "Max",
      ru: "Макс",
      pl: "Maks",
      fr: "Max",
      uk: "Макс",
      de: "Max",
      es: "Máx",
    },
    people: {
      en: "people",
      ru: "человек",
      pl: "osób",
      fr: "personnes",
      uk: "осіб",
      de: "Personen",
      es: "personas",
    },
    day: {
      en: "day",
      ru: "день",
      pl: "dzień",
      fr: "jour",
      uk: "день",
      de: "Tag",
      es: "día",
    },
    seats: {
      en: "seats",
      ru: "мест",
      pl: "miejsc",
      fr: "places",
      uk: "місць",
      de: "Sitze",
      es: "asientos",
    },
    automatic: {
      en: "Automatic",
      ru: "Автомат",
      pl: "Automatyczna",
      fr: "Automatique",
      uk: "Автомат",
      de: "Automatik",
      es: "Automático",
    },
    manual: {
      en: "Manual",
      ru: "Механика",
      pl: "Manualna",
      fr: "Manuelle",
      uk: "Механіка",
      de: "Manuell",
      es: "Manual",
    },
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

  return texts[textKey]?.[language] || texts[textKey]?.["en"] || "";
};

// Функция для API запросов
const fetchFromStrapi = async (endpoint: string) => {
  const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://tenerifly-strapi-production.up.railway.app";
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  try {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Функция для получения URL изображения (по образцу CarCard.tsx)
const getImageUrl = (item: any): string => {
  if (typeof item.image === "string") {
    return item.image;
  }

  if (item.images && item.images.length > 0) {
    // Если URL уже полный (начинается с http), возвращаем как есть
    if (item.images[0].url.startsWith("http")) {
      return item.images[0].url;
    }
    // Если URL относительный, добавляем базовый URL Strapi
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${item.images[0].url}`;
  }

  // Для других полей изображений
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

export function useDataLoader(mounted: boolean, language: LanguageCode) {
  const [excursions, setExcursions] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [accommodation, setAccommodation] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadFeaturedData = async () => {
      if (!language) return;

      try {
        setDataLoading(true);
        setHasError(false);

        // Параллельная загрузка всех данных
        const [
          toursResult,
          carsResult,
          propertiesResult,
          blogsResult,
          transfersResult,
        ] =
          await Promise.allSettled([
            fetchFromStrapi("/tours/?populate=*&pagination[pageSize]=1000"),
            fetchFromStrapi("/cars/?populate=*&pagination[pageSize]=1000"),
            fetchFromStrapi("/properties/?populate=*&pagination[pageSize]=1000"),
            fetchFromStrapi("/blog-posts/?populate=*&pagination[pageSize]=1000"),
            fetchFromStrapi("/transfers/?populate=*&pagination[pageSize]=100"),
          ]);

        // Обработка туров
        if (
          toursResult.status === "fulfilled" &&
          toursResult.value?.data?.length > 0
        ) {
          const transformedTours = toursResult.value.data.map((tour: any) => ({
            id: tour.id,
            documentId: tour.documentId,
            slug: tour.slug,
            isPopular: tour.isPopular === true,
            title: tour.name || tour.title || "Tour",
            description:
              tour.description || "Discover amazing places in Tenerife",
            duration: tour.duration || "3 hours",
            price: `€${tour.price?.amount || tour.cost || tour.pricing?.amount || 50}`,
            rating: 4.8,
            groupSize: `${getLocalizedText(language, "max")} ${tour.maxGroupSize || tour.max_group_size || 20} ${getLocalizedText(language, "people")}`,
            image: getImageUrl(tour),
          }));
          setExcursions(transformedTours);
        }

        // Обработка машин
        if (
          carsResult.status === "fulfilled" &&
          carsResult.value?.data?.length > 0
        ) {
          const transformedCars = carsResult.value.data.map((car: any) => ({
            id: car.id,
            documentId: car.documentId,
            title:
              car.title ||
              `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim(),
            description: car.description || "Reliable car for your journey",
            image: getImageUrl(car),
            price: `€${car.rental_prices?.day_1 || 30}/${getLocalizedText(language, "day")}`,
            transmission:
              car.specifications?.transmission === "automatic"
                ? getLocalizedText(language, "automatic")
                : getLocalizedText(language, "manual"),
            features: [
              car.features?.air_conditioning &&
                getLocalizedText(language, "airConditioning"),
              `${car.specifications?.seats || 5} ${getLocalizedText(language, "seats")}`,
              car.features?.bluetooth && "Bluetooth",
              car.specifications?.fuel,
              car.specifications?.year && `${car.specifications.year}`,
            ]
              .filter(Boolean)
              .join(", "),
            rating: 4.6,
            specifications: car.specifications,
            location: car.location,
            rental_prices: car.rental_prices,
            type: car.type,
            car_status: car.car_status,
          }));
          setCars(transformedCars);
        }

        // Обработка недвижимости
        if (
          propertiesResult.status === "fulfilled" &&
          propertiesResult.value?.data?.length > 0
        ) {
          const transformedProperties = propertiesResult.value.data.map(
            (property: any) => ({
              id: property.id,
              documentId: property.documentId,
              title: property.title || "Property",
              description:
                property.description || "Beautiful accommodation in Tenerife",
              image: getImageUrl(property),
              price: `€${property.price?.amount || 0}/${
                property.type === "rent"
                  ? getLocalizedText(language, "month")
                  : getLocalizedText(language, "night")
              }`,
              location: property.location?.city || "Tenerife",
              amenities: [
                "WiFi",
                getLocalizedText(language, "airConditioning"),
                property.specifications?.bedrooms &&
                  `${property.specifications.bedrooms} ${getLocalizedText(language, "bedrooms")}`,
                property.specifications?.bathrooms &&
                  `${property.specifications.bathrooms} ${getLocalizedText(language, "bathrooms")}`,
              ]
                .filter(Boolean)
                .join(", "),
              rating: 4.5,
              contact: property.contact, // ✅ Added contact field
            })
          );
          setAccommodation(transformedProperties);
        }

        // Обработка блогов
        if (
          blogsResult.status === "fulfilled" &&
          blogsResult.value?.data?.length > 0
        ) {
          const transformedBlogs = blogsResult.value.data.map((blog: any) => ({
            id: blog.id,
            documentId: blog.documentId,
            title: blog.title || "Blog Post",
            description:
              blog.excerpt ||
              blog.description ||
              "Interesting article about Tenerife",
            image: getImageUrl(blog),
            author: blog.author || "Admin",
            readTime: `${blog.readTime || blog.read_time || 5} ${getLocalizedText(language, "minRead")}`,
            publishedDate: blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
            rating: 4.7,
          }));
          setBlogPosts(transformedBlogs);
        }

        if (transfersResult.status === "fulfilled") {
          const transfersData = Array.isArray(transfersResult.value?.data)
            ? transfersResult.value.data
            : [];
          setTransfers(
            transfersData.map((transfer: any) => ({
              id: transfer.id,
              documentId: transfer.documentId,
              title: transfer.title || "Airport transfer",
              description:
                transfer.description || "Private airport transfer in Tenerife",
              seats: Number(transfer.seats || 0),
              price_south_airport: Number(transfer.price_south_airport || 50),
              price_north_airport: Number(transfer.price_north_airport || 100),
              currency: transfer.currency || "EUR",
              image:
                typeof transfer.image === "string" && transfer.image.length > 0
                  ? transfer.image
                  : undefined,
              images: transfer.images,
              contact: transfer.contact,
            }))
          );
        } else {
          setTransfers([]);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setDataLoading(false);
      }
    };

    if (mounted && language) {
      loadFeaturedData();
    }
  }, [mounted, language]);

  return {
    excursions,
    cars,
    accommodation,
    blogPosts,
    transfers,
    dataLoading,
    hasError,
  };
}
