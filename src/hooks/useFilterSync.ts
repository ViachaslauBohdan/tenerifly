import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  BaseFilterParams,
  filtersToUrlParams,
  parseUrlParams,
} from "@/utils/filterUtils";
import { LOCALES, type Locale } from "@/types/locale";

interface UseFilterSyncOptions {
  pageType: "apartments" | "cars" | "tours";
  filters: BaseFilterParams;
  onFiltersChange: (filters: BaseFilterParams) => void;
  onFiltersChanged?: () => void;
}

export const useFilterSync = ({
  pageType,
  filters,
  onFiltersChange,
  onFiltersChanged,
}: UseFilterSyncOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Получаем локаль из пути
  const pathSegments = pathname.split("/");
  const localeFromPath = pathSegments[1] as Locale;
  const currentLocale: Locale =
    LOCALES.find((l) => l.code === localeFromPath)?.code || "en";

  // Синхронизация фильтров с URL при изменении фильтров
  const updateUrl = useCallback(
    (newFilters: BaseFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const path = `/${currentLocale}/${pageType}`;
      const url = queryString ? `${path}?${queryString}` : path;

      // Обновляем URL без перезагрузки страницы
      router.replace(url, { scroll: false });
    },
    [pageType, router, currentLocale]
  );

  // Обработка изменения фильтров
  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      onFiltersChange(newFilters);
      updateUrl(newFilters);
      onFiltersChanged?.();
    },
    [filters, onFiltersChange, updateUrl, onFiltersChanged]
  );

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    const emptyFilters: BaseFilterParams = {};
    onFiltersChange(emptyFilters);
    router.replace(`/${currentLocale}/${pageType}`, { scroll: false });
    onFiltersChanged?.();
  }, [pageType, onFiltersChange, router, onFiltersChanged, currentLocale]);

  // Синхронизация с URL при загрузке страницы
  useEffect(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      // Проверяем, есть ли различия между текущими фильтрами и URL фильтрами
      const hasChanges = Object.keys(urlFilters).some((key) => {
        return filters[key] !== urlFilters[key];
      });

      if (hasChanges) {
        onFiltersChange(urlFilters);
      }
    }
  }, [searchParams, filters, onFiltersChange]);

  return {
    handleFilterChange,
    resetFilters,
    updateUrl,
  };
};
