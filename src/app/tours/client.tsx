"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ToursFilter from "./ToursFilter";
import TourCard from "./TourCard";
import { parseUrlParams, FilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
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
  initialTours?: any[];
}

export default function ToursPageClient({
  initialTours,
}: ToursPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<FilterParams>(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      return {
        location: (urlFilters.location as string) || "",
        tourType: (urlFilters.tourType as string) || "",
        priceFrom: (urlFilters.priceFrom as string) || "",
        priceTo: (urlFilters.priceTo as string) || "",
        duration: (urlFilters.duration as string) || "",
        durationType: (urlFilters.durationType as string) || "hours",
        availableFrom: (urlFilters.availableFrom as string) || "",
        language: (urlFilters.language as string) || "",
        category: (urlFilters.category as string) || "",
        groupSize: (urlFilters.groupSize as string) || "",
        difficulty: (urlFilters.difficulty as string) || "",
        rating: (urlFilters.rating as string) || "",
        transport: (urlFilters.transport as boolean) || false,
        meals: (urlFilters.meals as boolean) || false,
        tickets: (urlFilters.tickets as boolean) || false,
      };
    }
    return {
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
  const [tours, setTours] = useState<Tour[]>(initialTours || []);
  const [initialLoadComplete, setInitialLoadComplete] =
    useState(!!initialTours);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "tours",
    filters,
    onFiltersChange: setFilters,
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
      setTours(initialTours);
      setInitialLoadComplete(true);
      return;
    }

    const loadAllTours = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("Tours Page API URL:", apiUrl); // Для отладки

        const response = await fetch(`${apiUrl}/api/tours/?populate=*`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

  // Загрузка сохраненного языка из localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (
      savedLanguage &&
      translations[savedLanguage as keyof typeof translations]
    ) {
      setLanguage(
        savedLanguage as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
      );
    }
  }, []);

  // Синхронизация текущей страницы с URL при изменении searchParams
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const newPage = page ? parseInt(page, 10) : 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  }, [searchParams, currentPage]);

  // Сохранение языка в localStorage
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    setLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    setIsLanguageDropdownOpen(false);
  };

  const resetFilters = () => {
    resetFiltersSync();
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    handleFilterChangeSync(key, value);
    // Сбрасываем страницу при изменении фильтров
    if (currentPage !== 1) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  };

  // Теперь функция принимает правильный тип
  const handleToursUpdate = (updatedTours: Tour[]) => {
    setTours(updatedTours);
    // Сбрасываем страницу только если количество туров изменилось
    const newTotalPages = Math.ceil(updatedTours.length / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  };

  // Функция для обновления URL с пагинацией
  const updateUrlWithPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    const path = "/tours";
    const url = queryString ? `${path}?${queryString}` : path;
    router.replace(url, { scroll: false });
  };

  // Pagination logic
  const totalPages = Math.ceil(tours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTours = tours.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlWithPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            href="/"
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <ToursFilter
            filters={filters as any}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onToursUpdate={handleToursUpdate}
            translations={t}
          />

          {/* Tours Grid */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <TourCard
                  translations={t}
                  language={language}
                  tours={currentTours}
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
