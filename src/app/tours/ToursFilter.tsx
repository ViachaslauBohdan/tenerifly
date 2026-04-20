"use client";

import { useState, useEffect } from "react";

export interface FilterState {
  location: string;
  tourType: string;
  priceFrom: string;
  priceTo: string;
  duration: string;
  durationType: string;
  availableFrom: string;
  language: string;
  category: string;
  groupSize: string;
  difficulty: string;
  rating: string;
  transport: boolean;
  meals: boolean;
  tickets: boolean;
}

interface ToursFilterProps {
  filters: FilterState;
  onFilterChange: (key: string, value: string | boolean) => void;
  onResetFilters: () => void;
  onToursUpdate: (tours: unknown[]) => void;
  // optional initial tours from SSG — use to populate options and avoid client re-fetch
  initialTours?: unknown[];
  translations: Record<string, string>;
}

interface FilterOptions {
  cities: string[];
  regions: string[];
  languages: string[];
}

// Интерфейс для данных тура
interface TourData {
  id: number;
  documentId: string;
  location?: {
    city?: string;
    region?: string;
  };
  language?: string;
  price?: {
    amount?: number;
  };
  duration?: number;
  [key: string]: unknown;
}

const hasSupportedApiFilters = (filters: FilterState) =>
  Boolean(
    filters.location ||
      filters.priceFrom ||
      filters.priceTo ||
      filters.duration ||
      filters.language
  );

export default function ToursFilter({
  filters,
  onFilterChange,
  onResetFilters,
  onToursUpdate,
  initialTours,
  translations: t,
}: ToursFilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    regions: [],
    languages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загрузка всех экскурсий и извлечение уникальных значений для фильтров
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("ToursFilter API URL:", apiUrl); // Для отладки

        // Prefer using initialTours passed from SSG to avoid extra client fetch
        const sourceTours: TourData[] = initialTours && Array.isArray(initialTours)
          ? (initialTours as unknown as TourData[])
          : await (async () => {
              const response = await fetch(`${apiUrl}/api/tours/?populate=*&pagination[pageSize]=1000`, {
                headers: getAuthHeaders(),
              });
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const data = await response.json();
              return data.data && Array.isArray(data.data) ? data.data : [];
            })();

        const tours: TourData[] = sourceTours;

          // Извлекаем уникальные значения для фильтров с проверкой типов
          const cities = [
            ...new Set(
              tours
                .map((tour: TourData) => tour.location?.city)
                .filter(
                  (city): city is string =>
                    Boolean(city) && typeof city === "string"
                )
            ),
          ].sort();

          const regions = [
            ...new Set(
              tours
                .map((tour: TourData) => tour.location?.region)
                .filter(
                  (region): region is string =>
                    Boolean(region) && typeof region === "string"
                )
            ),
          ].sort();

          const languages = [
            ...new Set(
              tours
                .map((tour: TourData) => tour.language)
                .filter(
                  (language): language is string =>
                    Boolean(language) && typeof language === "string"
                )
            ),
          ].sort();

          setFilterOptions({
            cities,
            regions,
            languages,
          });
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    loadFilterOptions();
  }, [initialTours]);

  // Применение фильтров и загрузка отфильтрованных экскурсий
  useEffect(() => {
    const applyFilters = async () => {
      // Apply only filters that are backed by the current Strapi tour schema.
      if (!hasSupportedApiFilters(filters)) {
        console.log("No active filters");

        if (initialTours && Array.isArray(initialTours)) {
          console.log("Using provided initialTours for update, count:", initialTours.length);
          onToursUpdate(initialTours);
          return;
        }

        setIsLoading(true);
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
          const response = await fetch(`${apiUrl}/api/tours/?populate=*&pagination[pageSize]=1000`, {
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Loaded all tours (no filters):", {
            totalCount: data.data?.length || 0,
          });
          onToursUpdate(data.data || []);
        } catch (error) {
          console.error("Error loading all tours:", error);
          onToursUpdate([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        // Строим URL с параметрами фильтрации
        const params = new URLSearchParams();

        // Базовый параметр для получения всех связанных данных
        params.append("populate", "*");

        // Фильтры по локации
        if (filters.location) {
          // Проверяем, город это или регион
          const isCity = filterOptions.cities.includes(filters.location);
          if (isCity) {
            params.append("filters[location][city][$eq]", filters.location);
          } else {
            params.append("filters[location][region][$eq]", filters.location);
          }
        }

        // Фильтры по цене
        if (filters.priceFrom) {
          params.append("filters[price][amount][$gte]", filters.priceFrom);
        }
        if (filters.priceTo) {
          params.append("filters[price][amount][$lte]", filters.priceTo);
        }

        // Фильтр по продолжительности
        if (filters.duration) {
          params.append("filters[duration][$eq]", filters.duration);
        }

        // Фильтр по языку
        if (filters.language) {
          params.append("filters[language][$eq]", filters.language.toUpperCase());
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  // Запрашиваем большой pageSize, чтобы получить все совпадающие экскурсии
  params.append('pagination[pageSize]', '1000');
  const url = `${apiUrl}/api/tours/?${params.toString()}`;
        console.log("Filter URL:", url); // Для отладки

        const response = await fetch(url, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Filter response:", {
          totalCount: data.data?.length || 0,
          hasData: !!data.data,
          filters: filters,
          url: url,
        });

        onToursUpdate(data.data || []);
      } catch (error) {
        console.error("Error applying filters:", error);
        onToursUpdate([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Применяем фильтры с небольшой задержкой для оптимизации
    console.log("Filters changed, scheduling apply:", filters);
    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, onToursUpdate, filterOptions, initialTours]);

  return (
    <div className="lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border p-6 max-h-screen overflow-y-auto">
        <div className="flex items-center mb-6">
          <svg
            className="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">{t.filters}</h2>
          {isLoading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Локация */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.location}
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.allLocations}</option>
            <optgroup label={t.cities}>
              {filterOptions.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.regions}>
              {filterOptions.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Тип развлечения */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.tourType}
          </label>
          <select
            value={filters.tourType}
            onChange={(e) => onFilterChange("tourType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.allTypes}</option>
            <option value="boat_trip">{t.boatTrip}</option>
            <option value="walking_tour">{t.walkingTour}</option>
            <option value="jeep_safari">{t.jeepSafari}</option>
            <option value="museum">{t.museum}</option>
            <option value="water_park">{t.waterPark}</option>
            <option value="volcano">{t.volcano}</option>
            <option value="winery">{t.wineyard}</option>
            <option value="dolphin_watching">{t.dolphinWatching}</option>
            <option value="cultural">{t.cultural}</option>
            <option value="adventure">{t.adventure}</option>
          </select>
        </div>

        {/* Цена */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.price}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t.from}
              value={filters.priceFrom}
              onChange={(e) => onFilterChange("priceFrom", e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <input
              type="number"
              placeholder={t.to}
              value={filters.priceTo}
              onChange={(e) => onFilterChange("priceTo", e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Продолжительность */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.duration}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="1-24"
              value={filters.duration}
              onChange={(e) => onFilterChange("duration", e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <select
              value={filters.durationType}
              onChange={(e) => onFilterChange("durationType", e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="hours">{t.hours}</option>
              <option value="days">{t.days}</option>
            </select>
          </div>
        </div>

        {/* Доступные даты */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.availableDates}
          </label>
          <input
            type="date"
            value={filters.availableFrom}
            onChange={(e) => onFilterChange("availableFrom", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Язык гида */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.guideLanguage}
          </label>
          <select
            value={filters.language}
            onChange={(e) => onFilterChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.allLanguages}</option>
            {filterOptions.languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "EN"
                  ? t.english
                  : lang === "ES"
                    ? t.spanish
                    : lang === "DE"
                      ? t.german
                      : lang === "FR"
                        ? t.french
                        : lang === "RU"
                          ? t.russian
                          : lang}
              </option>
            ))}
          </select>
        </div>

        {/* Категория экскурсии */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.tourCategory}
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.allCategories}</option>
            <option value="family_friendly">{t.familyFriendly}</option>
            <option value="for_children">{t.forChildren}</option>
            <option value="extreme">{t.extreme}</option>
            <option value="romantic">{t.romantic}</option>
            <option value="cultural">{t.cultural}</option>
          </select>
        </div>

        {/* Размер группы */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.groupSize}
          </label>
          <select
            value={filters.groupSize}
            onChange={(e) => onFilterChange("groupSize", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.anySize}</option>
            <option value="individual">{t.individual}</option>
            <option value="small_group">{t.smallGroup}</option>
            <option value="large_group">{t.largeGroup}</option>
          </select>
        </div>

        {/* Уровень сложности */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.difficultyLevel}
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange("difficulty", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">{t.allLevels}</option>
            <option value="easy">{t.easy}</option>
            <option value="medium">{t.medium}</option>
            <option value="hard">{t.hard}</option>
          </select>
        </div>

        {/* Включено */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t.included}
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.transport}
                onChange={(e) => onFilterChange("transport", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t.transport}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.meals}
                onChange={(e) => onFilterChange("meals", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t.meals}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tickets}
                onChange={(e) => onFilterChange("tickets", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t.tickets}</span>
            </label>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {t.resetFilters}
        </button>
      </div>
    </div>
  );
}
