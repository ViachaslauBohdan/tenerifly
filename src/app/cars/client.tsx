"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import CarCard from "./CarCard";
import CarsFilter from "./CarsFilter";
import { parseUrlParams, FilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";
import translations from "@/i18n/cars.json";

const getLoadingCarsText = (language: string) => {
  const texts: Record<string, string> = {
    en: "Loading cars...",
    ru: "Загрузка автомобилей...",
    pl: "Ładowanie samochodów...",
    fr: "Chargement des voitures...",
    uk: "Завантаження автомобілів...",
    de: "Autos werden geladen...",
    es: "Cargando coches...",
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

// Определяем интерфейс для автомобиля
interface CarData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  car_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  rental_prices?: {
    day_1: number;
    day_3?: number;
    day_7?: number;
    month: number;
    currency: string;
  } | null;
  specifications?: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    fuel: string;
    transmission: string;
    power: number;
    seats: number;
    doors: number;
    color: string;
    body_type: string;
    drive_type: string;
  } | null;
  features?: {
    air_conditioning: boolean;
    bluetooth: boolean;
    navigation: boolean;
    parking_sensors: boolean;
    other_features?: string;
  } | null;
  location?: {
    city: string;
    region?: string | null;
    address: string;
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

interface CarsPageClientProps {
  initialCars?: any[];
}

export default function CarsPageClient({ initialCars }: CarsPageClientProps) {
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
        brand: (urlFilters.brand as string) || "",
        model: (urlFilters.model as string) || "",
        yearFrom: (urlFilters.yearFrom as string) || "",
        yearTo: (urlFilters.yearTo as string) || "",
        priceFrom: (urlFilters.priceFrom as string) || "",
        priceTo: (urlFilters.priceTo as string) || "",
        mileageFrom: (urlFilters.mileageFrom as string) || "",
        mileageTo: (urlFilters.mileageTo as string) || "",
        fuel: (urlFilters.fuel as string) || "",
        transmission: (urlFilters.transmission as string) || "",
        bodyType: (urlFilters.bodyType as string) || "",
        color: (urlFilters.color as string) || "",
        doors: (urlFilters.doors as string) || "",
        powerFrom: (urlFilters.powerFrom as string) || "",
        powerTo: (urlFilters.powerTo as string) || "",
        location: (urlFilters.location as string) || "",
        availableFrom: (urlFilters.availableFrom as string) || "",
        airConditioner: (urlFilters.airConditioner as boolean) || false,
        rearCamera: (urlFilters.rearCamera as boolean) || false,
        multimedia: (urlFilters.multimedia as boolean) || false,
        type: (urlFilters.type as string) || "",
        carStatus: (urlFilters.carStatus as string) || "",
      };
    }
    return {
      brand: "",
      model: "",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      mileageFrom: "",
      mileageTo: "",
      fuel: "",
      transmission: "",
      bodyType: "",
      color: "",
      doors: "",
      powerFrom: "",
      powerTo: "",
      location: "",
      availableFrom: "",
      airConditioner: false,
      rearCamera: false,
      multimedia: false,
      type: "",
      carStatus: "",
    };
  });

  // Состояния для всех и отфильтрованных автомобилей
  const [allCars, setAllCars] = useState<CarData[]>(initialCars || []);
  const [filteredCars, setFilteredCars] = useState<CarData[]>(
    initialCars || []
  );
  const [initialLoadComplete, setInitialLoadComplete] = useState(!!initialCars);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<any>(null);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "cars",
    filters,
    onFiltersChange: setFilters,
  });

  // Инициализация текущей страницы из URL параметров
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      return page ? parseInt(page, 10) : 1;
    }
    return 1;
  });
  const [itemsPerPage] = useState(12); // Show 12 cars per page

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загружаем все автомобили только если нет initialCars
  useEffect(() => {
    if (initialCars) {
      setAllCars(initialCars);
      setFilteredCars(initialCars);
      setInitialLoadComplete(true);
      return;
    }

    const loadAllCars = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "https://tenerifly-strapi-production.up.railway.app";

        const response = await fetch(
          `${apiUrl}/api/cars?populate=*&pagination[pageSize]=1000`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data) {
          setAllCars(data.data);
          setFilteredCars(data.data);
        }
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadAllCars();
  }, [initialCars]);

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

  // Мемоизированная функция сброса фильтров
  const resetFilters = useCallback(() => {
    setFilters({
      brand: "",
      model: "",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      mileageFrom: "",
      mileageTo: "",
      fuel: "",
      transmission: "",
      bodyType: "",
      color: "",
      doors: "",
      powerFrom: "",
      powerTo: "",
      location: "",
      availableFrom: "",
      airConditioner: false,
      rearCamera: false,
      multimedia: false,
      type: "",
      carStatus: "",
    });
  }, []);

  // Мемоизированная функция изменения фильтров
  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Функция для обновления URL с пагинацией
  const updateUrlWithPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    const path = "/cars";
    const url = queryString ? `${path}?${queryString}` : path;
    router.replace(url, { scroll: false });
  };

  // Мемоизированная функция обновления отфильтрованных автомобилей
  const handleCarsUpdate = useCallback(
    (updatedCars: CarData[]) => {
      setFilteredCars(updatedCars);
      // Сбрасываем страницу только если количество автомобилей изменилось
      const newTotalPages = Math.ceil(updatedCars.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
        updateUrlWithPage(1);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
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
            {t.carsInTenerife}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - передаем все автомобили в компонент фильтра */}
          <CarsFilter
            filters={filters as any}
            onFilterChange={handleFilterChangeSync}
            onResetFilters={resetFiltersSync}
            onCarsUpdate={handleCarsUpdate}
            translations={t}
            allCars={allCars}
          />

          {/* Cars Grid - показываем отфильтрованные автомобили */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <CarCard
                  translations={t}
                  language={language}
                  cars={currentCars}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      {language === "en"
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} of ${filteredCars.length} cars`
                        : language === "ru"
                          ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} из ${filteredCars.length} автомобилей`
                          : language === "pl"
                            ? `Pokazano ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} z ${filteredCars.length} samochodów`
                            : language === "fr"
                              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} sur ${filteredCars.length} voitures`
                              : language === "uk"
                                ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} з ${filteredCars.length} автомобілів`
                                : language === "de"
                                  ? `Zeige ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} von ${filteredCars.length} Autos`
                                  : `Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} de ${filteredCars.length} coches`}
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
                                : language === "uk"
                                  ? "Попередня"
                                  : language === "de"
                                    ? "Zurück"
                                    : "Anterior"}
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
                            : language === "pl"
                              ? "Następna"
                              : language === "fr"
                                ? "Suivant"
                                : language === "uk"
                                  ? "Наступна"
                                  : language === "de"
                                    ? "Weiter"
                                    : "Siguiente"}
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
                  {getLoadingCarsText(language)}
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
