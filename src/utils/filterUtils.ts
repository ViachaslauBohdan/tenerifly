// Утилиты для работы с фильтрами и URL параметрами

// Базовый интерфейс для фильтров
export interface BaseFilterParams {
  [key: string]: string | string[] | number | boolean | undefined;
}

// Интерфейс для фильтров апартаментов
export interface ApartmentFilterParams {
  propertyType: string;
  rooms: string;
  areaFrom: string;
  areaTo: string;
  priceFrom: string;
  priceTo: string;
  floorFrom: string;
  floorTo: string;
  yearBuiltFrom: string;
  yearBuiltTo: string;
  condition: string;
  city: string;
  district: string;
  balcony: boolean;
  terrace: boolean;
  garden: boolean;
  parking: boolean;
  furnished: boolean;
  airConditioner: boolean;
  wifi: boolean;
  washingMachine: boolean;
  dishwasher: boolean;
  type: string;
  propertyStatus: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

// Интерфейс для фильтров автомобилей
export interface CarFilterParams {
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  mileageFrom: string;
  mileageTo: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  color: string;
  doors: string;
  powerFrom: string;
  powerTo: string;
  location: string;
  availableFrom: string;
  airConditioner: boolean;
  rearCamera: boolean;
  multimedia: boolean;
  bluetooth: boolean;
  gps: boolean;
  type: string;
  carStatus: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

// Интерфейс для фильтров туров
export interface TourFilterParams {
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
  [key: string]: string | string[] | number | boolean | undefined;
}

// Общий тип для всех фильтров
export type FilterParams =
  | ApartmentFilterParams
  | CarFilterParams
  | TourFilterParams;

/** URL keys handled outside filter state (pagination, etc.). */
export const NON_FILTER_URL_KEYS = new Set(["page"]);

/** Parse search params into filter fields, excluding pagination-only keys. */
export const parseUrlParamsExcludingPagination = (
  searchParams: URLSearchParams
): BaseFilterParams => {
  const all = parseUrlParams(searchParams);
  const out: BaseFilterParams = {};
  for (const [key, value] of Object.entries(all)) {
    if (!NON_FILTER_URL_KEYS.has(key)) {
      out[key] = value;
    }
  }
  return out;
};

// Парсинг URL параметров в объект фильтров
export const parseUrlParams = (
  searchParams: URLSearchParams
): BaseFilterParams => {
  const filters: BaseFilterParams = {};

  for (const [key, value] of searchParams.entries()) {
    // Обработка булевых значений
    if (value === "true" || value === "false") {
      filters[key] = value === "true";
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
export const filtersToUrlParams = (
  filters: BaseFilterParams
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "boolean") {
        params.append(key, value.toString());
      } else if (typeof value === "number") {
        params.append(key, value.toString());
      } else if (typeof value === "string") {
        params.append(key, value);
      }
    }
  });

  return params;
};

// Создание URL с фильтрами
export const createFilteredUrl = (
  basePath: string,
  filters: BaseFilterParams
): string => {
  const params = filtersToUrlParams(filters);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

// Очистка пустых фильтров
export const cleanEmptyFilters = (
  filters: BaseFilterParams
): BaseFilterParams => {
  const cleaned: BaseFilterParams = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== false
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

// Получение активных фильтров (непустых)
export const getActiveFilters = (
  filters: BaseFilterParams
): BaseFilterParams => {
  return cleanEmptyFilters(filters);
};
