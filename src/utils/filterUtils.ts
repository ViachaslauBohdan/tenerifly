// Утилиты для работы с фильтрами и URL параметрами

export interface FilterParams {
  [key: string]: string | string[] | number | boolean | undefined;
}

// Парсинг URL параметров в объект фильтров
export const parseUrlParams = (searchParams: URLSearchParams): FilterParams => {
  const filters: FilterParams = {};

  for (const [key, value] of searchParams.entries()) {
    // Обработка булевых значений
    if (value === 'true' || value === 'false') {
      filters[key] = value === 'true';
    }
    // Обработка чисел
    else if (!isNaN(Number(value))) {
      filters[key] = Number(value);
    }
    // Обработка строк
    else {
      filters[key] = value;
    }
  }

  return filters;
};

// Преобразование фильтров в URL параметры
export const filtersToUrlParams = (filters: FilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        params.append(key, value.toString());
      } else if (typeof value === 'number') {
        params.append(key, value.toString());
      } else if (typeof value === 'string') {
        params.append(key, value);
      }
    }
  });

  return params;
};

// Создание URL с фильтрами
export const createFilteredUrl = (
  basePath: string,
  filters: FilterParams
): string => {
  const params = filtersToUrlParams(filters);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

// Очистка пустых фильтров
export const cleanEmptyFilters = (filters: FilterParams): FilterParams => {
  const cleaned: FilterParams = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

// Получение активных фильтров (непустых)
export const getActiveFilters = (filters: FilterParams): FilterParams => {
  return cleanEmptyFilters(filters);
};
