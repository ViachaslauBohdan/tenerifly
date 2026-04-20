"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import CarCard from "./CarCard";
import CarsFilter from "./CarsFilter";
import { parseUrlParams, CarFilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
import { useTranslation } from "@/hooks/useTranslation";
import translations from "@/i18n/cars.json";
import {
  getCanariasRentacarAffiliateUrl,
  getCanariasRentacarBannerImageUrl,
} from "@/lib/canariasAffiliate";

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
  locale?: string;
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
  initialCarsByLocale?: Record<string, unknown[]>;
}

export default function CarsPageClient({
  initialCarsByLocale,
}: CarsPageClientProps) {
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
  const [filters, setFilters] = useState<CarFilterParams>(() => {
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
        bluetooth: (urlFilters.bluetooth as boolean) || false,
        gps: (urlFilters.gps as boolean) || false,
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
      bluetooth: false,
      gps: false,
      type: "",
      carStatus: "",
    };
  });

  // Состояния для всех и отфильтрованных автомобилей
  const [allCarsByLocale, setAllCarsByLocale] = useState<
    Record<string, unknown[]>
  >(initialCarsByLocale || {});
  const [filteredCars, setFilteredCars] = useState<CarData[]>(() => {
    if (initialCarsByLocale && initialCarsByLocale[language]) {
      // Берем автомобили для текущего языка напрямую из объекта
      return (initialCarsByLocale[language] as CarData[]) || [];
    }
    return [];
  });
  const [initialLoadComplete, setInitialLoadComplete] =
    useState(!!initialCarsByLocale);
  // const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // const [bookingItem, setBookingItem] = useState<CarData | null>(null);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "cars",
    filters,
    onFiltersChange: (newFilters) => {
      setFilters(newFilters as CarFilterParams);
    },
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

  // Функция для обновления URL с пагинацией
  const updateUrlWithPage = useCallback(
    (page: number) => {
      if (page < 1) return;
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      const queryString = params.toString();
      const path = createLocaleLink("/cars");
      const url = queryString ? `${path}?${queryString}` : path;
      router.replace(url, { scroll: false });
    },
    [searchParams, router, createLocaleLink]
  );

  // Функция для обновления отфильтрованных автомобилей — используется в CarsFilter
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
    [currentPage, itemsPerPage, updateUrlWithPage]
  );

  // Функция для загрузки автомобилей по локалям
  const loadCarsByLocales = useCallback(async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
        "https://tenerifly-strapi-production.up.railway.app";

      // Получаем ВСЕ автомобили одним запросом (как в getAllCars)
      const pageSize = 50;
      let page = 1;
      const allItems: unknown[] = [];

      while (true) {
        const params = new URLSearchParams();
        params.set("populate", "*");
        params.set("publicationState", "live");
        params.set("sort", "title:ASC");
        params.set("pagination[page]", String(page));
        params.set("pagination[pageSize]", String(pageSize));

        const response = await fetch(
          `${apiUrl}/api/documents/cars?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch cars page ${page}: ${response.status}`);
          break;
        }

        const data = await response.json();
        const batch = data.data || [];
        allItems.push(...batch);

        const pageCount = data?.meta?.pagination?.pageCount;
        const currentPage = data?.meta?.pagination?.page;
        if (!pageCount || !currentPage || currentPage >= pageCount) break;
        page += 1;
      }

      console.log(`✅ Total cars from all pages: ${allItems.length}`);

      // Группируем автомобили по локалям
      const carsByLocale: Record<string, unknown[]> = {
        en: [],
        ru: [],
        pl: [],
        fr: [],
        uk: [],
        de: [],
        es: [],
      };

      allItems.forEach((car: unknown) => {
        const carData = car as {
          id?: number;
          documentId?: string;
          locale?: string;
          localizations?: Array<{
            id: number;
            locale: string;
            documentId: string;
            title: string;
            description: string;
            [key: string]: unknown;
          }>;
        };

        // Используем documentId для дедупликации (одинаковый для всех локалей одного автомобиля)
        const carDocumentId = carData.documentId;
        const carTitle = (carData as { title?: string }).title;

        // Добавляем основную запись (текущая локаль)
        const mainLocale = carData.locale || "en";
        if (carsByLocale[mainLocale] && carDocumentId) {
          // Проверяем, нет ли уже автомобиля с таким documentId или title в этой локали
          const existingCar = carsByLocale[mainLocale].find(
            (existingCar: unknown) => {
              const existing = existingCar as {
                documentId?: string;
                title?: string;
              };
              return (
                existing.documentId === carDocumentId ||
                (carTitle && existing.title === carTitle)
              );
            }
          );
          if (!existingCar) {
            carsByLocale[mainLocale].push(car);
          }
        }

        // Добавляем локализованные версии ТОЛЬКО для других локалей (не для основной локали)
        // НЕ добавляем локализации для английского языка (en) - только основные записи с locale="en"
        if (carData.localizations && Array.isArray(carData.localizations)) {
          carData.localizations.forEach((localization) => {
            // Пропускаем локализацию, если она для той же локали, что и основная запись
            if (localization.locale === mainLocale) {
              return;
            }

            // НЕ добавляем локализации для английского языка
            // Английский язык должен содержать только записи с основной локалью "en"
            if (localization.locale === "en") {
              return;
            }

            if (carsByLocale[localization.locale] && localization.documentId) {
              // Проверяем, нет ли уже автомобиля с таким documentId или title в этой локали
              // Проверяем как по documentId локализации, так и по основному documentId и title
              const existingCar = carsByLocale[localization.locale].find(
                (existingCar: unknown) => {
                  const existing = existingCar as {
                    documentId?: string;
                    title?: string;
                  };
                  return (
                    existing.documentId === localization.documentId ||
                    existing.documentId === carDocumentId ||
                    (localization.title &&
                      existing.title === localization.title)
                  );
                }
              );
              if (!existingCar) {
                // Создаем гибридный объект: локализованные title и description + остальное из оригинала
                const originalCar = car as Record<string, unknown>;
                const hybridCar = {
                  ...originalCar, // Берем все из оригинального объекта
                  title: localization.title, // Перезаписываем title локализованной версией
                  description: localization.description, // Перезаписываем description локализованной версией
                  locale: localization.locale, // Устанавливаем правильную локаль
                  documentId: localization.documentId, // Используем documentId из локализации
                };
                carsByLocale[localization.locale].push(hybridCar);
              }
            }
          });
        }
      });

      // Логируем результат для отладки
      console.log("🚗 Cars by locale summary (client):");
      Object.entries(carsByLocale).forEach(([locale, cars]) => {
        console.log(`  ${locale}: ${cars.length} cars`);
      });

      // ВАЖНО: исключаем "лишние" английские автомобили, у которых нет пары в RU по documentId.
      // (такие записи часто воспринимаются как "встроенные", потому что не видны в RU локали в CMS)
      const ruDocIds = new Set(
        (carsByLocale.ru || [])
          .map((c: unknown) => (c as { documentId?: string }).documentId)
          .filter((id): id is string => Boolean(id))
      );
      if (ruDocIds.size > 0 && Array.isArray(carsByLocale.en)) {
        carsByLocale.en = carsByLocale.en.filter((c: unknown) => {
          const docId = (c as { documentId?: string }).documentId;
          return Boolean(docId) && ruDocIds.has(docId as string);
        });
      }

      setAllCarsByLocale(carsByLocale);
      setFilteredCars((carsByLocale[language] as CarData[]) || []);
    } catch (error) {
      console.error("Error loading cars by locales:", error);
    } finally {
      setInitialLoadComplete(true);
    }
  }, [language]);

  // Загружаем все автомобили только если нет initialCarsByLocale
  useEffect(() => {
    if (initialCarsByLocale && Object.keys(initialCarsByLocale).length > 0) {
      // Сохраняем все автомобили по локалям
      setAllCarsByLocale(initialCarsByLocale);
      // Устанавливаем автомобили для текущего языка
      setFilteredCars((initialCarsByLocale[language] as CarData[]) || []);
      setInitialLoadComplete(true);
      return;
    }

    // Fallback: загружаем автомобили для всех локалей
    loadCarsByLocales();
  }, [initialCarsByLocale, language, loadCarsByLocales]);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  // Обновляем отфильтрованные данные при смене языка (без догрузки)
  useEffect(() => {
    setFilteredCars((allCarsByLocale[language] as CarData[]) || []);
  }, [language, allCarsByLocale]);

  // Синхронизация текущей страницы с URL при изменении searchParams
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const newPage = page ? parseInt(page, 10) : 1;
      // Проверяем валидность страницы перед установкой
      const maxPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage));
      const validPage = newPage >= 1 && newPage <= maxPages ? newPage : 1;
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    }
  }, [searchParams, currentPage, filteredCars.length, itemsPerPage]);

  // Переключение языка через URL
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Мемоизированная функция сброса фильтров

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage));
  
  // Проверка валидности текущей страницы
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  }, [totalPages, currentPage, updateUrlWithPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

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

  console.log("allCarsByLocale:", allCarsByLocale);
  console.log("filteredCars:", filteredCars);
  console.log("filteredCars:", initialCarsByLocale);
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
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.carsInTenerife}
          </h1>
        </div>
        <div className="flex justify-start items-center gap-2 py-2">
          <span className="ps-1 text-sm text-gray-600">Rent a car</span>
          <Link
              href={getCanariasRentacarAffiliateUrl(language)}
              className="text-sm text-blue-600 hover:text-blue-600"
              target="_blank"
              rel="nofollow"
          >
            Canarias.com
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - передаем все автомобили в компонент фильтра */}
          <CarsFilter
            filters={filters}
            onFilterChange={handleFilterChangeSync}
            onResetFilters={resetFiltersSync}
            onCarsUpdate={handleCarsUpdate}
            translations={t}
            allCars={(allCarsByLocale[language] as CarData[]) || []}
          />

          {/* Cars Grid - показываем отфильтрованные автомобили */}
          <div className="flex-1">
            {/* Баннер Canarias.com рядом с верхней линией списка машин (на уровне с левым сайдбаром), выровнен по центру колонки */}
            <div className="mb-6 flex justify-center lg:justify-center">
              <a
                href={getCanariasRentacarAffiliateUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={getCanariasRentacarBannerImageUrl(language)}
                  alt="rentacar canarias.com"
                  className="max-w-full h-auto"
                />
              </a>
            </div>
            {initialLoadComplete ? (
              <>
                <CarCard
                  translations={t}
                  language={language}
                  cars={currentCars}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-4">
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
