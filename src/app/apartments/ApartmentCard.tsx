"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { cmsLocale } from "@/types/locale";
import { apartmentListingTypeLabel } from "./apartmentCardCopy";
import { DeferredSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import { formatPropertyPriceLabel } from "@/utils/propertyPrice";

interface PropertyData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  property_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  price?: {
    amount: number;
    currency: string;
    period: string;
  } | null;
  location?: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  } | null;
  features?: {
    has_pool: boolean;
    has_garden: boolean;
    has_garage: boolean;
    has_terrace: boolean;
    has_security: boolean;
    has_air_conditioning: boolean;
    has_heating: boolean;
    has_internet: boolean;
    furnished: boolean;
    additional_features?: string | null;
  } | null;
  specifications?: {
    total_area: number;
    living_area: number;
    bedrooms: number;
    bathrooms: number;
    floor: number;
    total_floors: number;
    year_built?: number | null;
    parking_spaces?: number | null;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    telegram?: string;
    preferred_contact: string;
  } | null;
}

interface ApartmentCardProps {
  translations: {
    available: string;
    viewDetails: string;
    bookNow: string;
    contact: string;
    apartmentDescription: string;
    apartment: string;
    house: string;
    plot: string;
    studio: string;
    room: string;
    rooms: string;
    sqm: string;
    perMonth: string;
    perDay: string;
    perTotal: string;
    balcony: string;
    terrace: string;
    garden: string;
    parking: string;
    furnished: string;
    airConditioner: string;
    wifi: string;
    washingMachine: string;
    dishwasher: string;
    pool: string;
    garage: string;
    heating: string;
    internet: string;
    security: string;
    from: string;
  };
  language: string;
  apartments?: PropertyData[];
  allFilteredApartments?: PropertyData[];
}

const getFoundPropertiesText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: "Found properties",
    ru: "Найдено объектов",
    pl: "Znaleziono nieruchomości",
    fr: "Propriétés trouvées",
    uk: "Знайдено об'єктів",    ua: "Знайдено об'єктів",
    de: "Gefundene Immobilien",
    es: "Propiedades encontradas",
  };
  return texts[locale] || texts.en;
};

const getFilterActiveText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: "🔍 Filter active",
    ru: "🔍 Фильтр активен",
    pl: "🔍 Filtr aktywny",
    fr: "🔍 Filtre actif",
    uk: "🔍 Фільтр активний",    ua: "🔍 Фільтр активний",
    de: "🔍 Filter aktiv",
    es: "🔍 Filtro activo",
  };
  return texts[locale] || texts.en;
};

const ApartmentCard = ({
  translations,
  language,
  apartments: providedApartments,
  allFilteredApartments,
}: ApartmentCardProps) => {
  const [apartments, setApartments] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const apartmentBooking = getApartmentBookingCopy(language);

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    // Если переданы отфильтрованные апартаменты, используем их
    if (providedApartments !== undefined) {
      setApartments(providedApartments);
      setLoading(false);
      setError(null);
      return;
    }

    // Если нет переданных апартаментов, загружаем все
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "https://tenerifly-strapi-production.up.railway.app";
        console.log("ApartmentCard API URL:", apiUrl); // Для отладки

        const response = await fetch(
          `${apiUrl}/api/properties?populate=*&pagination[pageSize]=1000&locale=${cmsLocale(language)}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status}`);
        }

        const data = await response.json();
        setApartments(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching properties:", err);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [providedApartments, language]);

  // Обновляем апартаменты при изменении отфильтрованного списка
  useEffect(() => {
    if (providedApartments) {
      setApartments(providedApartments);
      setLoading(false);
    }
  }, [providedApartments]);

  const router = useRouter();
  const { createLocaleLink, locale } = useTranslation();

  const handleViewDetails = (propertyDocumentId: string) => {
    router.push(createLocaleLink(`/apartments/${propertyDocumentId}`));
  };

  const handleBookNow = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedProperty(null);
  };

  const getImageUrl = (property: PropertyData) => {
    if (property.images && property.images.length > 0) {
      // Если URL уже полный (начинается с http), возвращаем как есть
      if (property.images[0].url.startsWith("http")) {
        return property.images[0].url;
      }
      // Если URL относительный, добавляем базовый URL Strapi
      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
        "https://tenerifly-strapi-production.up.railway.app";
      return `${apiUrl}${property.images[0].url}`;
    }
    return "/placeholder.svg?height=200&width=300";
  };

  const getPrice = (property: PropertyData) => {
    if (property.price && property.price.amount) {
      return formatPropertyPriceLabel({
        amount: property.price.amount,
        currency: property.price.currency,
        period: property.price.period,
        language,
      });
    }
    return property.type === "rent" ? "≈ €850/day" : "€250000";
  };

  const getCurrency = (property: PropertyData) => {
    // Price label already includes currency symbol when using formatPropertyPriceLabel.
    if (property.price && property.price.amount) {
      return "";
    }
    return "EUR";
  };

  const getLocation = (property: PropertyData) => {
    if (property.location) {
      const parts = [];
      if (property.location.city) parts.push(property.location.city);
      if (property.location.region) parts.push(property.location.region);
      return parts.join(", ") || "—";
    }
    return "—";
  };

  const getPropertyType = (property: PropertyData) => {
    if (property.category) {
      switch (property.category) {
        case "apartment":
          return translations.apartment;
        case "house":
          return translations.house;
        case "plot":
          return translations.plot;
        default:
          return property.category;
      }
    }
    return "—";
  };

  const getRoomsText = (property: PropertyData) => {
    if (
      property.specifications &&
      property.specifications.bedrooms !== undefined
    ) {
      const rooms = property.specifications.bedrooms;
      if (rooms === 0) return translations.studio;
      return `${rooms} ${rooms === 1 ? translations.room : translations.rooms}`;
    }
    return "—";
  };

  const getArea = (property: PropertyData) => {
    if (property.specifications && property.specifications.total_area) {
      return `${property.specifications.total_area} ${translations.sqm}`;
    }
    return "—";
  };

  const getFloor = (property: PropertyData) => {
    if (property.specifications && property.specifications.floor) {
      return property.specifications.floor;
    }
    return "—";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return translations.available;
      case "reserved":
        return "RESERVED";
      case "rented":
        return "RENTED";
      case "sold":
        return "SOLD";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "rented":
        return "bg-red-100 text-red-800";
      case "sold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFeatures = (property: PropertyData) => {
    const features = [];
    if (property.features) {
      if (property.features.has_pool) features.push(translations.pool);
      if (property.features.has_garden) features.push(translations.garden);
      if (property.features.has_garage) features.push(translations.garage);
      if (property.features.has_terrace) features.push(translations.terrace);
      if (property.features.has_air_conditioning)
        features.push(translations.airConditioner);
      if (property.features.has_heating) features.push(translations.heating);
      if (property.features.has_internet) features.push(translations.internet);
      if (property.features.furnished) features.push(translations.furnished);
      if (property.features.has_security) features.push(translations.security);
    }

    if (features.length === 0) {
      return ["—"];
    }

    return features;
  };

  const getFloorText = () => {
    switch (language) {
      case "en":
        return "Floor";
      case "ru":
        return "Этаж";
      case "pl":
        return "Piętro";
      case "fr":
        return "Étage";
      case "ua":
        return "Поверх";
      default:
        return "Floor";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">Error loading properties</div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-500 text-lg mb-2">
          {allFilteredApartments && allFilteredApartments.length > 0
            ? language === "en"
              ? "No properties available on this page"
              : language === "ru"
                ? "Нет недвижимости на этой странице"
                : language === "pl"
                  ? "Brak nieruchomości na tej stronie"
                  : language === "fr"
                    ? "Aucune propriété disponible sur cette page"
                    : "Немає нерухомості на цій сторінці"
            : language === "en"
              ? "No properties available"
              : language === "ru"
                ? "Нет доступной недвижимости"
                : language === "pl"
                  ? "Brak dostępnych nieruchomości"
                  : language === "fr"
                    ? "Aucune propriété disponible"
                    : "Немає доступної нерухомості"}
        </div>
        {allFilteredApartments && allFilteredApartments.length > 0 && (
          <div className="text-gray-400 text-sm">
            {language === "en"
              ? "Try changing the page or adjusting filters"
              : language === "ru"
                ? "Попробуйте изменить страницу или настройки фильтрации"
                : language === "pl"
                  ? "Spróbuj zmienić stronę lub dostosować filtry"
                  : language === "fr"
                    ? "Essayez de changer la page ou d'ajuster les filtres"
                    : "Спробуйте змінити сторінку або налаштування фільтрів"}
          </div>
        )}
        {(!allFilteredApartments || allFilteredApartments.length === 0) && (
          <div className="text-gray-400 text-sm">
            {language === "en"
              ? "Try adjusting your search filters"
              : language === "ru"
                ? "Попробуйте изменить параметры фильтрации"
                : language === "pl"
                  ? "Spróbuj dostosować filtry wyszukiwania"
                  : language === "fr"
                    ? "Essayez d'ajuster vos filtres de recherche"
                    : "Спробуйте змінити параметри фільтрації"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Счетчик результатов */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          {getFoundPropertiesText(language)}:{" "}
          <span className="font-semibold text-gray-900">
            {apartments.length}
          </span>
        </div>
        {providedApartments !== undefined && (
          <div className="text-sm text-blue-600">
            {getFilterActiveText(language)}
          </div>
        )}
      </div>

      {/* Сетка недвижимости */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apartments.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative bg-gray-100">
              <Image
                src={getImageUrl(property)}
                alt={property.title}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleViewDetails(property.documentId)}
              />
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => handleViewDetails(property.documentId)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {apartmentListingTypeLabel(property.type, language)}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {property.description}
                </p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {getPropertyType(property)}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  {getRoomsText(property)}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  {getArea(property)}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                    />
                  </svg>
                  {getFloor(property) === "—"
                    ? "—"
                    : `${getFloor(property)} ${getFloorText()}`}
                </div>
                <div className="flex items-center col-span-2">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {getLocation(property)}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {getFeatures(property)
                  .slice(0, 3)
                  .map((feature, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        feature === "—"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
              </div>

              {/* Availability and Price */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.property_status)}`}
                >
                  {getStatusText(property.property_status)}
                </span>
                <div className="text-right">
                  {property.type === "rent" ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {translations.from} {getPrice(property)}
                      </span>
                      <span className="max-w-[14rem] text-right text-[11px] leading-snug text-gray-500">
                        {apartmentBooking.priceDisclaimer}
                      </span>
                    </div>
                  ) : (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {getCurrency(property)}
                      {getPrice(property)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {(property.property_status === "available" ||
                  property.property_status === "reserved") && (
                  <button
                    onClick={() => handleBookNow(property)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {apartmentBooking.checkPrice}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal — lazy-loaded when opened */}
      {selectedProperty && isBookingModalOpen && (
        <DeferredSimpleBookingPopup
          opened={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          item={{
            name: selectedProperty.title,
            price: selectedProperty.price
              ? getPrice(selectedProperty)
              : undefined,
            currency: selectedProperty.price?.currency,
            contactEmail: selectedProperty.contact?.email,
          }}
          variant="apartment"
          currentLocale={locale}
        />
      )}
    </div>
  );
};

export default ApartmentCard;
