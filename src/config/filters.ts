export interface FilterConfig {
  id: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'number';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  category?: 'basic' | 'advanced';
  min?: number;
  max?: number;
  step?: number;
  marks?: { value: number; label: string }[]; // Для RangeSlider
}

// Фильтры для экскурсий
export const excursionFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Цена',
    category: 'basic',
    min: 0,
    max: 200,
    step: 5,
    marks: [
      { value: 0, label: '0€' },
      { value: 50, label: '50€' },
      { value: 100, label: '100€' },
      { value: 150, label: '150€' },
      { value: 200, label: '200€' }
    ]
  },
  {
    id: 'duration',
    type: 'select',
    label: 'Продолжительность',
    category: 'basic',
    options: [
      { value: 'half-day', label: 'Полдня (до 4 часов)' },
      { value: 'full-day', label: 'Полный день (4-8 часов)' },
      { value: 'multi-day', label: 'Несколько дней' }
    ]
  },
  {
    id: 'type',
    type: 'multiselect',
    label: 'Тип развлечения',
    category: 'basic',
    options: [
      { value: 'sightseeing', label: 'Осмотр достопримечательностей' },
      { value: 'adventure', label: 'Приключения' },
      { value: 'nature', label: 'Природа' },
      { value: 'cultural', label: 'Культурные' },
      { value: 'water-sports', label: 'Водные виды спорта' },
      { value: 'food-wine', label: 'Еда и вино' }
    ]
  },
  {
    id: 'language',
    type: 'select',
    label: 'Язык гида',
    category: 'advanced',
    options: [
      { value: 'russian', label: 'Русский' },
      { value: 'english', label: 'Английский' },
      { value: 'spanish', label: 'Испанский' },
      { value: 'german', label: 'Немецкий' },
      { value: 'french', label: 'Французский' }
    ]
  },
  {
    id: 'groupSize',
    type: 'range',
    label: 'Размер группы',
    category: 'advanced',
    min: 1,
    max: 20,
    step: 1,
    marks: [
      { value: 1, label: '1' },
      { value: 5, label: '5' },
      { value: 10, label: '10' },
      { value: 15, label: '15' },
      { value: 20, label: '20' }
    ]
  },
  {
    id: 'includesTransport',
    type: 'checkbox',
    label: 'Включен трансфер',
    category: 'advanced'
  },
  {
    id: 'includesMeals',
    type: 'checkbox',
    label: 'Включены обеды',
    category: 'advanced'
  },
  {
    id: 'location',
    type: 'multiselect',
    label: 'Район',
    category: 'advanced',
    options: [
      { value: 'south', label: 'Южная часть' },
      { value: 'north', label: 'Северная часть' },
      { value: 'central', label: 'Центральная часть' },
      { value: 'teide', label: 'Национальный парк Тейде' },
      { value: 'anaga', label: 'Горы Анага' },
      { value: 'coast', label: 'Побережье' }
    ]
  }
];

// Фильтры для автомобилей
export const carFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Цена за день',
    category: 'basic',
    min: 15,
    max: 150,
    step: 5,
    marks: [
      { value: 15, label: '15€' },
      { value: 50, label: '50€' },
      { value: 100, label: '100€' },
      { value: 150, label: '150€' }
    ]
  },
  {
    id: 'carType',
    type: 'select',
    label: 'Тип автомобиля',
    category: 'basic',
    options: [
      { value: 'economy', label: 'Эконом' },
      { value: 'compact', label: 'Компактный' },
      { value: 'intermediate', label: 'Средний' },
      { value: 'standard', label: 'Стандартный' },
      { value: 'suv', label: 'Внедорожник' },
      { value: 'luxury', label: 'Премиум' }
    ]
  },
  {
    id: 'transmission',
    type: 'select',
    label: 'Коробка передач',
    category: 'basic',
    options: [
      { value: 'manual', label: 'Механическая' },
      { value: 'automatic', label: 'Автоматическая' }
    ]
  },
  {
    id: 'fuelType',
    type: 'select',
    label: 'Тип топлива',
    category: 'advanced',
    options: [
      { value: 'petrol', label: 'Бензин' },
      { value: 'diesel', label: 'Дизель' },
      { value: 'electric', label: 'Электро' },
      { value: 'hybrid', label: 'Гибрид' }
    ]
  },
  {
    id: 'seats',
    type: 'select',
    label: 'Количество мест',
    category: 'advanced',
    options: [
      { value: '2', label: '2 места' },
      { value: '4', label: '4 места' },
      { value: '5', label: '5 мест' },
      { value: '7', label: '7 мест' },
      { value: '9', label: '9 мест' }
    ]
  },
  {
    id: 'features',
    type: 'multiselect',
    label: 'Дополнительные опции',
    category: 'advanced',
    options: [
      { value: 'gps', label: 'GPS навигация' },
      { value: 'child-seat', label: 'Детское кресло' },
      { value: 'wifi', label: 'Wi-Fi' },
      { value: 'bluetooth', label: 'Bluetooth' },
      { value: 'usb', label: 'USB порты' },
      { value: 'roof-rack', label: 'Багажник на крыше' }
    ]
  }
];

// Фильтры для недвижимости
export const propertyFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Цена за ночь',
    category: 'basic',
    min: 20,
    max: 500,
    step: 10,
    marks: [
      { value: 20, label: '20€' },
      { value: 100, label: '100€' },
      { value: 250, label: '250€' },
      { value: 500, label: '500€' }
    ]
  },
  {
    id: 'propertyType',
    type: 'select',
    label: 'Тип жилья',
    category: 'basic',
    options: [
      { value: 'apartment', label: 'Квартира' },
      { value: 'villa', label: 'Вилла' },
      { value: 'house', label: 'Дом' },
      { value: 'studio', label: 'Студия' },
      { value: 'hotel', label: 'Отель' }
    ]
  },
  {
    id: 'bedrooms',
    type: 'select',
    label: 'Количество спален',
    category: 'basic',
    options: [
      { value: '1', label: '1 спальня' },
      { value: '2', label: '2 спальни' },
      { value: '3', label: '3 спальни' },
      { value: '4', label: '4 спальни' },
      { value: '5+', label: '5+ спален' }
    ]
  },
  {
    id: 'guests',
    type: 'range',
    label: 'Количество гостей',
    category: 'advanced',
    min: 1,
    max: 12,
    step: 1,
    marks: [
      { value: 1, label: '1' },
      { value: 4, label: '4' },
      { value: 8, label: '8' },
      { value: 12, label: '12' }
    ]
  },
  {
    id: 'amenities',
    type: 'multiselect',
    label: 'Удобства',
    category: 'advanced',
    options: [
      { value: 'pool', label: 'Бассейн' },
      { value: 'wifi', label: 'Wi-Fi' },
      { value: 'parking', label: 'Парковка' },
      { value: 'kitchen', label: 'Кухня' },
      { value: 'balcony', label: 'Балкон/Терраса' },
      { value: 'sea-view', label: 'Вид на море' },
      { value: 'air-conditioning', label: 'Кондиционер' },
      { value: 'washing-machine', label: 'Стиральная машина' }
    ]
  },
  {
    id: 'location',
    type: 'multiselect',
    label: 'Район',
    category: 'advanced',
    options: [
      { value: 'playa-americas', label: 'Плайя де лас Америкас' },
      { value: 'costa-adeje', label: 'Коста Адехе' },
      { value: 'los-cristianos', label: 'Лос Кристианос' },
      { value: 'puerto-cruz', label: 'Пуэрто де ла Крус' },
      { value: 'santa-cruz', label: 'Санта-Крус' },
      { value: 'la-laguna', label: 'Ла Лагуна' }
    ]
  }
];