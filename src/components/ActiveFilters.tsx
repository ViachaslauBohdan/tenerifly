import React from "react";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: Record<string, any>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  translations: {
    activeFilters: string;
    clearAll: string;
  };
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  translations,
}) => {
  // Получаем только активные (непустые) фильтры
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (value === undefined || value === null || value === "") return false;
    if (typeof value === "boolean" && !value) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  if (activeFilters.length === 0) {
    return null;
  }

  const formatFilterValue = (key: string, value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Да" : "Нет";
    }
    if (typeof value === "number") {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.join(" - ");
    }
    return value.toString();
  };

  const getFilterLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      propertyType: "Тип недвижимости",
      rooms: "Комнаты",
      areaFrom: "Площадь от",
      areaTo: "Площадь до",
      priceFrom: "Цена от",
      priceTo: "Цена до",
      city: "Город",
      district: "Район",
      brand: "Марка",
      model: "Модель",
      fuel: "Топливо",
      transmission: "КПП",
      location: "Локация",
      tourType: "Тип экскурсии",
      language: "Язык",
      category: "Категория",
      difficulty: "Сложность",
      transport: "Транспорт",
      meals: "Питание",
      tickets: "Билеты",
      balcony: "Балкон",
      terrace: "Терраса",
      garden: "Сад",
      parking: "Парковка",
      furnished: "Меблированная",
      airConditioner: "Кондиционер",
      wifi: "WiFi",
      washingMachine: "Стиральная машина",
      dishwasher: "Посудомоечная машина",
      type: "Тип",
      propertyStatus: "Статус",
      carStatus: "Статус",
      yearFrom: "Год от",
      yearTo: "Год до",
      mileageFrom: "Пробег от",
      mileageTo: "Пробег до",
      powerFrom: "Мощность от",
      powerTo: "Мощность до",
      duration: "Продолжительность",
      groupSize: "Размер группы",
      rating: "Рейтинг",
      floorFrom: "Этаж от",
      floorTo: "Этаж до",
      yearBuiltFrom: "Год постройки от",
      yearBuiltTo: "Год постройки до",
      condition: "Состояние",
      color: "Цвет",
      bodyType: "Тип кузова",
      doors: "Двери",
      availableFrom: "Доступна с",
      rearCamera: "Камера заднего вида",
      multimedia: "Мультимедиа",
    };

    return labelMap[key] || key;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          {translations.activeFilters} ({activeFilters.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {translations.clearAll}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            <span className="font-medium">{getFilterLabel(key)}:</span>
            <span>{formatFilterValue(key, value)}</span>
            <button
              onClick={() => onRemoveFilter(key)}
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
