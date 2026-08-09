"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApartmentCard from "./ApartmentCard";
import ApartmentsFilter from "./ApartmentsFilter";
import {
  parseUrlParamsExcludingPagination,
  ApartmentFilterParams,
} from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import translations from "@/i18n/apartments.json";

const DEFAULT_APARTMENT_FILTERS: ApartmentFilterParams = {
  propertyType: "",
  rooms: "",
  areaFrom: "",
  areaTo: "",
  priceFrom: "",
  priceTo: "",
  floorFrom: "",
  floorTo: "",
  yearBuiltFrom: "",
  yearBuiltTo: "",
  condition: "",
  city: "",
  district: "",
  balcony: false,
  terrace: false,
  garden: false,
  parking: false,
  furnished: false,
  airConditioner: false,
  wifi: false,
  washingMachine: false,
  dishwasher: false,
  type: "",
  propertyStatus: "",
};

const getLoadingPropertiesText = (locale: string) => {
  const texts: Record<string, string> = {
    en: "Loading properties...",
    ru: "Загрузка недвижимости...",
    pl: "Ładowanie nieruchomości...",
    fr: "Chargement des propriétés...",
    uk: "Завантаження нерухомості...",    ua: "Завантаження нерухомості...",
    de: "Immobilien werden geladen...",
    es: "Cargando inmuebles...",
  };
  return texts[locale] || texts.en;
};

// Определяем интерфейс для недвижимости
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
    width?: number;
    height?: number;
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

interface ApartmentsPageClientProps {
  initialProperties?: PropertyData[];
}

export default function ApartmentsPageClient({
  initialProperties,
}: ApartmentsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, createLocaleLink } = useTranslation();

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<ApartmentFilterParams>(() => {
    if (searchParams) {
      const urlFilters = parseUrlParamsExcludingPagination(searchParams);
      return {
        ...DEFAULT_APARTMENT_FILTERS,
        ...urlFilters,
      };
    }

    return { ...DEFAULT_APARTMENT_FILTERS };
  });

  // Состояния для всех и отфильтрованных апартаментов
  const [allApartments, setAllApartments] = useState<PropertyData[]>(
    initialProperties || []
  );
  const [filteredApartments, setFilteredApartments] = useState<PropertyData[]>(
    initialProperties || []
  );
  const [initialLoadComplete, setInitialLoadComplete] =
    useState(!!initialProperties);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "apartments",
    filters,
    onFiltersChange: (newFilters) => {
      setFilters(newFilters as ApartmentFilterParams);
    },
    onFiltersChanged: () => setFiltersChanged(true),
  });

  const apartmentSearchQueryKey = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!searchParams) return;
    const raw = parseUrlParamsExcludingPagination(searchParams);
    setFilters((prev) => {
      const next = { ...DEFAULT_APARTMENT_FILTERS, ...raw } as ApartmentFilterParams;
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  }, [apartmentSearchQueryKey, searchParams]);

  // Инициализация текущей страницы из URL параметров
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const pageNumber = page ? parseInt(page, 10) : 1;
      return pageNumber >= 1 ? pageNumber : 1;
    }
    return 1;
  });
  const [itemsPerPage] = useState(12); // Show 12 apartments per page
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // SSG data initialization - use server data if available
  useEffect(() => {
    if (initialProperties && initialProperties.length > 0) {
      // Use SSG data - this is the primary path for production
      console.log("🏠 Using SSG data:", initialProperties.length, "properties");
      setAllApartments(initialProperties);
      setFilteredApartments(initialProperties);
      setInitialLoadComplete(true);
    } else {
      // Fallback: only load on client if no SSG data available
      console.log("⚠️ No SSG data, loading on client as fallback");
      const loadAllApartments = async () => {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_STRAPI_API_URL ||
            "https://tenerifly-strapi-production.up.railway.app";

          const response = await fetch(
            `${apiUrl}/api/properties?populate=*&pagination[pageSize]=1000`,
            { headers: getAuthHeaders() }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.data) {
            setAllApartments(data.data);
            setFilteredApartments(data.data);
          }
        } catch (error) {
          console.error("Error loading properties:", error);
        } finally {
          setInitialLoadComplete(true);
        }
      };

      loadAllApartments();
    }
  }, [initialProperties]);

  const t = pickLocaleBundle(translations, locale);

  // Синхронизация текущей страницы с URL при изменении searchParams
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const newPage = page ? parseInt(page, 10) : 1;
      // Проверяем валидность страницы перед установкой
      const maxPages = Math.max(
        1,
        Math.ceil(filteredApartments.length / itemsPerPage)
      );
      const validPage = newPage >= 1 && newPage <= maxPages ? newPage : 1;
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    }
  }, [searchParams, currentPage, filteredApartments.length, itemsPerPage]);

  // Функция для обновления URL с пагинацией
  const updateUrlWithPage = useCallback(
    (page: number) => {
      if (page < 1) return;

      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      const queryString = params.toString();
      const path = createLocaleLink("/apartments");
      const url = queryString ? `${path}?${queryString}` : path;
      router.replace(url, { scroll: false });
    },
    [searchParams, router, createLocaleLink]
  );

  // Дополнительная проверка для корректной работы пагинации
  useEffect(() => {
    const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  }, [filteredApartments.length, currentPage, itemsPerPage, updateUrlWithPage]);

  // Optimized function for updating filtered apartments
  const handleApartmentsUpdate = useCallback(
    (updatedApartments: PropertyData[]) => {
      console.log("🔄 handleApartmentsUpdate called:", {
        updatedLength: updatedApartments.length,
        currentLength: filteredApartments.length,
        filtersChanged,
      });

      // Only update if the data actually changed
      if (
        JSON.stringify(updatedApartments) !== JSON.stringify(filteredApartments)
      ) {
        console.log("📝 Updating filtered apartments");
        setFilteredApartments(updatedApartments);

        // Сбрасываем страницу на первую только при изменении фильтров
        if (filtersChanged) {
          console.log("🔧 Filters changed, resetting to page 1");
          setCurrentPage(1);
          updateUrlWithPage(1);
          setFiltersChanged(false);
        } else {
          // Проверяем, что текущая страница не превышает общее количество страниц
          const newTotalPages = Math.ceil(
            updatedApartments.length / itemsPerPage
          );
          if (currentPage > newTotalPages && newTotalPages > 0) {
            console.log("📄 Current page exceeds total, resetting to page 1");
            setCurrentPage(1);
            updateUrlWithPage(1);
          }
        }
      } else {
        console.log("⏭️ No update needed, data unchanged");
      }
    },
    [
      filteredApartments,
      currentPage,
      itemsPerPage,
      updateUrlWithPage,
      filtersChanged,
    ]
  );

  // Memoized pagination logic for instant updates
  const paginationData = useMemo(() => {
    console.log("🧮 Recalculating pagination:", {
      filteredApartments: filteredApartments.length,
      currentPage,
      itemsPerPage,
    });

    const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentApartments = filteredApartments.slice(startIndex, endIndex);

    console.log("📊 Pagination result:", {
      totalPages,
      startIndex,
      endIndex,
      currentApartments: currentApartments.length,
    });

    return { totalPages, startIndex, endIndex, currentApartments };
  }, [filteredApartments, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentApartments } =
    paginationData;

  // Optimized pagination handlers for instant updates
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        console.log("🔄 Page change:", currentPage, "->", page);
        const startTime = performance.now();

        setCurrentPage(page);
        updateUrlWithPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });

        const endTime = performance.now();
        console.log("⚡ Page change completed in:", endTime - startTime, "ms");
      }
    },
    [currentPage, totalPages, updateUrlWithPage]
  );

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <CatalogDetailShell>
        <CatalogBackLink
          href={createLocaleLink("/")}
          label={t.backToHome}
        />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.apartmentsInTenerife}
          </h1>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="font-medium">
              {showMobileFilters ? t.hideFilters : t.showFilters}
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - передаем все апартаменты в компонент фильтра */}
          <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <ApartmentsFilter
              filters={filters}
              onFilterChange={handleFilterChangeSync}
              onResetFilters={resetFiltersSync}
              onApartmentsUpdate={handleApartmentsUpdate}
              translations={t}
              allApartments={allApartments}
            />
          </div>

          {/* Apartments Grid - показываем отфильтрованные апартаменты */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <ApartmentCard
                  translations={t}
                  language={locale}
                  apartments={currentApartments}
                  allFilteredApartments={filteredApartments}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      {locale === "en"
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} of ${filteredApartments.length} properties`
                        : locale === "ru"
                          ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} из ${filteredApartments.length} объектов`
                          : locale === "pl"
                            ? `Pokazano ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} z ${filteredApartments.length} nieruchomości`
                            : locale === "fr"
                              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} sur ${filteredApartments.length} propriétés`
                              : `Показано ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} з ${filteredApartments.length} об'єктів`}
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
                        {locale === "en"
                          ? "Previous"
                          : locale === "ru"
                            ? "Назад"
                            : locale === "pl"
                              ? "Poprzednia"
                              : locale === "fr"
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
                        {locale === "en"
                          ? "Next"
                          : locale === "ru"
                            ? "Вперед"
                            : locale === "pl"
                              ? "Następna"
                              : locale === "fr"
                                ? "Suivant"
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
                  {getLoadingPropertiesText(locale)}
                </span>
              </div>
            )}
          </div>
        </div>

    </CatalogDetailShell>
  );
}
