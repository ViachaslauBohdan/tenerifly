"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import ToursFilter from "./ToursFilter";
import TourCard from "./TourCard";
import { parseUrlParams, TourFilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
import { useTranslation } from "@/hooks/useTranslation";
import translations from "@/i18n/tours.json";
// Переводы для всех языков

const getLoadingToursText = (language: string) => {
  const texts: Record<string, string> = {
    en: "Loading tours...",
    ru: "Загрузка экскурсий...",
    pl: "Ładowanie wycieczek...",
    fr: "Chargement des excursions...",
    uk: "Завантаження екскурсій...",
    de: "Laden von Touren...",
    es: "Cargando excursiones...",
  };
  return texts[language] || texts.en;
};

// Языки с флагами
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

// Определяем интерфейс для тура (соответствует структуре API)
interface Tour {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  language: string;
  available_days: string | null;
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
  location?: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  price?: {
    amount: number;
    currency: string;
    period: string;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    preferred_contact: string;
  } | null;
  // Дополнительные поля для совместимости с фильтрами
  type?: string;
  category?: string;
  groupSize?: string;
  difficulty?: string;
  rating?: number;
  reviewsCount?: number;
  features?: {
    transport?: boolean;
    meals?: boolean;
    tickets?: boolean;
    guide?: boolean;
    familyFriendly?: boolean;
    extreme?: boolean;
  };
  available?: boolean;
  [key: string]: any; // для дополнительных полей
}

interface ToursPageClientProps {
  initialTours?: any[] | undefined;
}

const defaultTourFilters: TourFilterParams = {
  location: "",
  tourType: "",
  priceFrom: "",
  priceTo: "",
  duration: "",
  durationType: "hours",
  availableFrom: "",
  language: "",
  category: "",
  groupSize: "",
  difficulty: "",
  rating: "",
  transport: false,
  meals: false,
  tickets: false,
};

const tourLanguageMap: Record<string, string> = {
  en: "EN",
  ru: "RU",
  pl: "PL",
  fr: "FR",
  uk: "UK",
  de: "DE",
  es: "ES",
};

const tourFilterKeys = Object.keys(defaultTourFilters) as Array<
  keyof TourFilterParams
>;

const normalizeTourFilters = (
  rawFilters: Record<string, any>,
  currentLocale?: string
): TourFilterParams => {
  const normalizedFilters = { ...defaultTourFilters };

  for (const key of tourFilterKeys) {
    if (rawFilters[key] !== undefined) {
      normalizedFilters[key] = rawFilters[key];
    }
  }

  const languageValue =
    typeof normalizedFilters.language === "string"
      ? normalizedFilters.language
      : "";
  const loweredLanguageValue = languageValue.toLowerCase();
  const isLowercaseLocaleCode = languageValue === loweredLanguageValue;
  const isLocaleParam =
    isLowercaseLocaleCode &&
    loweredLanguageValue === (currentLocale || "").toLowerCase() &&
    loweredLanguageValue in tourLanguageMap;
  const normalizedLanguage = isLocaleParam
    ? ""
    : tourLanguageMap[loweredLanguageValue] || languageValue.toUpperCase();

  return {
    ...normalizedFilters,
    priceFrom: normalizedFilters.priceFrom?.toString() || "",
    priceTo: normalizedFilters.priceTo?.toString() || "",
    duration: normalizedFilters.duration?.toString() || "",
    language: normalizedLanguage,
    durationType:
      normalizedFilters.durationType === "days"
        ? "days"
        : defaultTourFilters.durationType,
  };
};

const areTourFiltersEqual = (
  left: TourFilterParams,
  right: TourFilterParams
) =>
  Object.keys(defaultTourFilters).every(
    (key) => left[key] === right[key]
  );

const hasSupportedTourFilters = (filters: TourFilterParams) =>
  Boolean(
    filters.location ||
      filters.priceFrom ||
      filters.priceTo ||
      filters.duration ||
      filters.language
  );

export default function ToursPageClient({
  initialTours,
}: ToursPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Синхронизируем язык с URL
  useEffect(() => {
    setLanguage(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  }, [locale]);

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<TourFilterParams>(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      return normalizeTourFilters(urlFilters, locale);
    }
    return defaultTourFilters;
  });

  // Инициализация текущей страницы из URL параметров
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      return page ? parseInt(page, 10) : 1;
    }
    return 1;
  });
  // Исправляем тип для tours
  const [tours, setTours] = useState<Tour[]>(
    (initialTours as unknown as Tour[]) || []
  );
  const [initialLoadComplete, setInitialLoadComplete] =
    useState(!!initialTours);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "tours",
    filters,
    onFiltersChange: (newFilters) => {
      const normalizedFilters = normalizeTourFilters(
        newFilters as Record<string, any>,
        locale
      );
      setFilters((currentFilters) =>
        areTourFiltersEqual(currentFilters, normalizedFilters)
          ? currentFilters
          : normalizedFilters
      );
    },
  });

  const [itemsPerPage] = useState(12); // Show 12 tours per page

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загружаем все экскурсии только если нет initialTours
  useEffect(() => {
    if (initialTours) {
      console.log("Using initial tours from SSG:", {
        count: initialTours.length,
      });
      setTours(initialTours);
      setInitialLoadComplete(true);
      return;
    }

    const loadAllTours = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("Tours Page API URL:", apiUrl); // Для отладки

        const response = await fetch(`${apiUrl}/api/tours/?populate=*&pagination[pageSize]=1000`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Loaded tours from API:", {
          count: data.data?.length || 0,
        });

        if (data.data) {
          setTours(data.data);
        }
      } catch (error) {
        console.error("Error loading tours:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadAllTours();
  }, [initialTours]);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  // Синхронизируем язык с URL
  useEffect(() => {
    setLanguage(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  }, [locale]);

  // Синхронизация текущей страницы с URL при изменении searchParams
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const newPage = page ? parseInt(page, 10) : 1;
      // Проверяем валидность страницы перед установкой
      const maxPages = Math.max(1, Math.ceil(tours.length / itemsPerPage));
      const validPage = newPage >= 1 && newPage <= maxPages ? newPage : 1;
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    }
  }, [searchParams, currentPage, tours.length, itemsPerPage]);

  // Переключение языка через URL
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const resetFilters = () => {
    resetFiltersSync();
  };

  // Функция для обновления URL с пагинацией (объявляем раньше, чтобы использовать в других функциях)
  const updateUrlWithPage = useCallback((page: number) => {
    if (page < 1) return;
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    const path = createLocaleLink("/tours");
    const url = queryString ? `${path}?${queryString}` : path;
    router.replace(url, { scroll: false });
  }, [searchParams, router, createLocaleLink]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    handleFilterChangeSync(key, value);
    // Сбрасываем страницу при изменении фильтров
    if (currentPage !== 1) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  };

  // Теперь функция принимает правильный тип
  const handleToursUpdate = useCallback((updatedTours: Tour[]) => {
    console.log("Updating tours:", {
      previousCount: tours.length,
      newCount: updatedTours.length,
      currentPage,
    });
    setTours(updatedTours);
    // Сбрасываем страницу только если количество туров изменилось
    const newTotalPages = Math.ceil(updatedTours.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  }, [tours.length, currentPage, itemsPerPage, updateUrlWithPage]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(tours.length / itemsPerPage));
  
  // Проверка валидности текущей страницы
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  }, [totalPages, currentPage, updateUrlWithPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTours = tours.slice(startIndex, endIndex);
  const hasActiveFilters = hasSupportedTourFilters(filters);

  // Debug logging for pagination
  console.log("Pagination debug:", {
    totalTours: tours.length,
    itemsPerPage,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    currentToursCount: currentTours.length,
  });

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      updateUrlWithPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages, updateUrlWithPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={createLocaleLink("/")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t.backToHome}
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <span className="text-xl">{currentLanguage?.flag}</span>
              <span className="font-medium text-gray-700 hidden sm:block">
                {currentLanguage?.name}
              </span>
              <span className="font-medium text-gray-700 sm:hidden">
                {currentLanguage?.code.toUpperCase()}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    {t.selectLanguage}
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleLanguageChange(
                          lang.code as
                            | "en"
                            | "ru"
                            | "pl"
                            | "fr"
                            | "uk"
                            | "de"
                            | "es"
                        )
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {language === lang.code && (
                        <svg
                          className="w-4 h-4 ml-auto text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.toursInTenerife}
          </h1>
        </div>

        {/* Мини-секция Atlántico Excursiones */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                  Atlántico Excursiones
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {language === "ru"
                    ? "Откройте для себя больше экскурсий: автобусные туры, тематические парки, морские прогулки и VIP-экскурсии"
                    : language === "pl"
                    ? "Odkryj więcej wycieczek: wycieczki autokarowe, parki tematyczne, rejsy i doświadczenia VIP"
                    : language === "fr"
                    ? "Découvrez plus d'excursions: visites en bus, parcs à thème, croisières et expériences VIP"
                    : language === "de"
                    ? "Entdecken Sie mehr Ausflüge: Busreisen, Themenparks, Bootsfahrten und VIP-Erlebnisse"
                    : language === "es"
                    ? "Descubre más excursiones: tours en autobús, parques temáticos, paseos en barco y experiencias VIP"
                    : language === "uk"
                    ? "Відкрийте для себе більше екскурсій: автобусні тури, тематичні парки, морські прогулянки та VIP-екскурсії"
                    : "Discover more excursions: coach tours, theme parks, boat trips, and VIP experiences"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="https://en.atlanticoexcursiones.com/index.php?afId=3609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  {language === "ru"
                    ? "Все туры"
                    : language === "pl"
                    ? "Wszystkie wycieczki"
                    : language === "fr"
                    ? "Toutes les visites"
                    : language === "de"
                    ? "Alle Touren"
                    : language === "es"
                    ? "Todos los tours"
                    : language === "uk"
                    ? "Всі тури"
                    : "View All Tours"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <ToursFilter
            filters={filters as unknown as import('./ToursFilter').FilterState}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onToursUpdate={(updated: unknown[]) =>
              handleToursUpdate(updated as unknown as Tour[])
            }
            initialTours={initialTours}
            translations={t as unknown as Record<string, string>}
          />

          {/* Tours Grid */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <TourCard
                  translations={t}
                  language={language}
                  tours={currentTours}
                  totalToursCount={tours.length}
                  hasActiveFilters={hasActiveFilters}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      {language === "en"
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, tours.length)} of ${tours.length} tours`
                        : language === "ru"
                          ? `Показано ${startIndex + 1}-${Math.min(endIndex, tours.length)} из ${tours.length} экскурсий`
                          : language === "pl"
                            ? `Pokazano ${startIndex + 1}-${Math.min(endIndex, tours.length)} z ${tours.length} wycieczek`
                            : language === "fr"
                              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, tours.length)} sur ${tours.length} excursions`
                              : `Показано ${startIndex + 1}-${Math.min(endIndex, tours.length)} з ${tours.length} екскурсій`}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        {language === "en"
                          ? "Previous"
                          : language === "ru"
                            ? "Назад"
                            : language === "pl"
                              ? "Poprzednia"
                              : language === "fr"
                                ? "Précédent"
                                : "Попередня"}
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNumber: number;

                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === pageNumber
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}

                        {/* Show ellipsis if there are more pages */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {language === "en"
                          ? "Next"
                          : language === "ru"
                            ? "Вперед"
                            : language === "uk"
                              ? "Далі"
                              : language === "de"
                                ? "Weiter"
                                : language === "pl"
                                  ? "Następna"
                                  : language === "fr"
                                    ? "Suivant"
                                    : language === "es"
                                      ? "Siguiente"
                                      : "Наступна"}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  {getLoadingToursText(language)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isLanguageDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
