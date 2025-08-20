# Синхронизация фильтров с URL

## Обзор

Система синхронизации фильтров с URL обеспечивает правильную передачу параметров между главной страницей и страницами списков. Фильтры сохраняются в URL и восстанавливаются при обновлении страницы.

## Компоненты

### 1. Утилиты фильтрации (`src/utils/filterUtils.ts`)

Основные функции для работы с фильтрами:

```typescript
// Парсинг URL параметров в объект фильтров
export const parseUrlParams = (searchParams: URLSearchParams): FilterParams

// Преобразование фильтров в URL параметры
export const filtersToUrlParams = (filters: FilterParams): URLSearchParams

// Создание URL с фильтрами
export const createFilteredUrl = (basePath: string, filters: FilterParams): string

// Очистка пустых фильтров
export const cleanEmptyFilters = (filters: FilterParams): FilterParams
```

### 2. Хук синхронизации (`src/hooks/useFilterSync.ts`)

Хук для автоматической синхронизации фильтров с URL:

```typescript
const { handleFilterChange, resetFilters } = useFilterSync({
  pageType: "apartments",
  filters,
  onFiltersChange: setFilters,
});
```

## Использование

### Главная страница

На главной странице фильтры собираются в объект и передаются через URL параметры:

```typescript
const handleSearch = () => {
  const params = new URLSearchParams();

  // Добавляем фильтры в зависимости от активной вкладки
  if (accommodationFilters.propertyType) {
    params.append("propertyType", accommodationFilters.propertyType);
  }

  router.push(`/apartments?${params.toString()}`);
};
```

### Страницы списков

На страницах списков фильтры инициализируются из URL параметров:

```typescript
const [filters, setFilters] = useState<FilterParams>(() => {
  if (searchParams) {
    const urlFilters = parseUrlParams(searchParams);
    return {
      propertyType: (urlFilters.propertyType as string) || "",
      // ... остальные фильтры
    };
  }
  return defaultFilters;
});
```

### Синхронизация с URL

При изменении фильтров URL автоматически обновляется:

```typescript
const { handleFilterChange } = useFilterSync({
  pageType: "apartments",
  filters,
  onFiltersChange: setFilters,
});

// При изменении фильтра URL обновится автоматически
const handleFilterChange = (key: string, value: any) => {
  handleFilterChange(key, value);
};
```

## Обновленные страницы

Система синхронизации применена к следующим страницам:

1. **Апартаменты** (`/apartments`) - фильтры недвижимости
2. **Автомобили** (`/cars`) - фильтры автомобилей
3. **Экскурсии** (`/tours`) - фильтры экскурсий

## Примеры URL

### Апартаменты

```
/apartments?propertyType=apartment&priceFrom=1000&priceTo=3000&city=santa-cruz
```

### Автомобили

```
/cars?brand=toyota&fuel=petrol&transmission=automatic&priceFrom=50&priceTo=100
```

### Экскурсии

```
/tours?tourType=adventure&difficulty=medium&transport=true&priceFrom=50&priceTo=200
```

## Преимущества

1. **Синхронизация с URL** - фильтры сохраняются в URL и восстанавливаются при обновлении страницы
2. **Правильная передача параметров** - фильтры с главной страницы корректно передаются на страницы списков
3. **Поддержка браузерной навигации** - кнопки "Назад" и "Вперед" работают корректно
4. **Единообразная система** - все страницы списков используют одинаковый подход к фильтрации

## Расширение

Для добавления новых фильтров:

1. Обновите интерфейс фильтров в соответствующем файле страницы
2. Добавьте маппинг в `parseUrlParams()` и `filtersToUrlParams()`
3. Добавьте новые фильтры в функцию поиска на главной странице
