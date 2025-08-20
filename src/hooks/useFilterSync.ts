import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterParams, filtersToUrlParams, parseUrlParams } from '@/utils/filterUtils';

interface UseFilterSyncOptions {
  pageType: 'apartments' | 'cars' | 'tours';
  filters: FilterParams;
  onFiltersChange: (filters: FilterParams) => void;
}

export const useFilterSync = ({ pageType, filters, onFiltersChange }: UseFilterSyncOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Синхронизация фильтров с URL при изменении фильтров
  const updateUrl = useCallback((newFilters: FilterParams) => {
    const params = filtersToUrlParams(newFilters);
    const queryString = params.toString();
    const path = `/${pageType}`;
    const url = queryString ? `${path}?${queryString}` : path;
    
    // Обновляем URL без перезагрузки страницы
    router.replace(url, { scroll: false });
  }, [pageType, router]);

  // Обработка изменения фильтров
  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
    updateUrl(newFilters);
  }, [filters, onFiltersChange, updateUrl]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    const emptyFilters: FilterParams = {};
    onFiltersChange(emptyFilters);
    router.replace(`/${pageType}`, { scroll: false });
  }, [pageType, onFiltersChange, router]);

  // Синхронизация с URL при загрузке страницы
  useEffect(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      // Проверяем, есть ли различия между текущими фильтрами и URL фильтрами
      const hasChanges = Object.keys(urlFilters).some(key => {
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
