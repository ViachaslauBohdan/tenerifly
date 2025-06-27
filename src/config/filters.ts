export interface FilterConfig {
  id: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'number' | 'date';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  category?: 'basic' | 'advanced';
  min?: number;
  max?: number;
  step?: number;
  marks?: { value: number; label: string }[]; // Для RangeSlider
}

// 🏠 Фильтры для недвижимости согласно ТЗ
export const propertyFilters: FilterConfig[] = [
  // Основные фильтры
  {
    id: 'priceRange',
    type: 'range',
    label: 'Цена',
    category: 'basic',
    min: 0,
    max: 10000,
    step: 100,
    marks: [
      { value: 0, label: '0€' },
      { value: 2500, label: '2.5k€' },
      { value: 5000, label: '5k€' },
      { value: 7500, label: '7.5k€' },
      { value: 10000, label: '10k€' }
    ]
  },
  {
    id: 'type',
    type: 'select',
    label: 'Тип сделки',
    category: 'basic',
    options: [
      { value: 'rent', label: 'Аренда' },
      { value: 'sale', label: 'Продажа' }
    ]
  },
  {
    id: 'category',
    type: 'select',
    label: 'Тип недвижимости',
    category: 'basic',
    options: [
      { value: 'apartment', label: 'Квартира' },
      { value: 'house', label: 'Дом' },
      { value: 'villa', label: 'Вилла' },
      { value: 'penthouse', label: 'Пентхаус' },
      { value: 'studio', label: 'Студия' },
      { value: 'commercial', label: 'Коммерческая' },
      { value: 'land', label: 'Участок' },
      { value: 'building', label: 'Здание' }
    ]
  },
  {
    id: 'bedrooms',
    type: 'select',
    label: 'Количество комнат',
    category: 'basic',
    options: [
      { value: '1', label: '1 комната' },
      { value: '2', label: '2 комнаты' },
      { value: '3', label: '3 комнаты' },
      { value: '4', label: '4 комнаты' },
      { value: '5+', label: '5+ комнат' }
    ]
  },

  // Дополнительные фильтры
  {
    id: 'location',
    type: 'multiselect',
    label: 'Локация',
    category: 'advanced',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус де Тенерифе' },
      { value: 'la-laguna', label: 'Ла Лагуна' },
      { value: 'puerto-cruz', label: 'Пуэрто де ла Крус' },
      { value: 'costa-adeje', label: 'Коста Адехе' },
      { value: 'playa-americas', label: 'Плайя де лас Америкас' },
      { value: 'los-cristianos', label: 'Лос Кристианос' },
      { value: 'los-gigantes', label: 'Лос Хигантес' },
      { value: 'candelaria', label: 'Канделария' }
    ]
  },
  {
    id: 'area',
    type: 'range',
    label: 'Площадь (м²)',
    category: 'advanced',
    min: 20,
    max: 500,
    step: 10,
    marks: [
      { value: 20, label: '20м²' },
      { value: 100, label: '100м²' },
      { value: 200, label: '200м²' },
      { value: 350, label: '350м²' },
      { value: 500, label: '500м²' }
    ]
  },
  {
    id: 'floor',
    type: 'range',
    label: 'Этаж',
    category: 'advanced',
    min: 0,
    max: 20,
    step: 1,
    marks: [
      { value: 0, label: '0' },
      { value: 5, label: '5' },
      { value: 10, label: '10' },
      { value: 15, label: '15' },
      { value: 20, label: '20' }
    ]
  },
  {
    id: 'yearBuilt',
    type: 'range',
    label: 'Год постройки',
    category: 'advanced',
    min: 1950,
    max: 2025,
    step: 5,
    marks: [
      { value: 1950, label: '1950' },
      { value: 1980, label: '1980' },
      { value: 2000, label: '2000' },
      { value: 2015, label: '2015' },
      { value: 2025, label: '2025' }
    ]
  },
  {
    id: 'condition',
    type: 'select',
    label: 'Состояние недвижимости',
    category: 'advanced',
    options: [
      { value: 'needs_renovation', label: 'Требует ремонта' },
      { value: 'good', label: 'Хорошее' },
      { value: 'excellent', label: 'Отличное' },
      { value: 'new', label: 'Новое' }
    ]
  },
  {
    id: 'amenities',
    type: 'multiselect',
    label: 'Удобства',
    category: 'advanced',
    options: [
      { value: 'balcony', label: 'Балкон/Терраса' },
      { value: 'garden', label: 'Сад' },
      { value: 'pool', label: 'Бассейн' },
      { value: 'garage', label: 'Гараж/Парковка' },
      { value: 'air_conditioning', label: 'Кондиционер' },
      { value: 'heating', label: 'Отопление' },
      { value: 'internet', label: 'Интернет' },
      { value: 'security', label: 'Охрана' },
      { value: 'elevator', label: 'Лифт' }
    ]
  },
  {
    id: 'furnished',
    type: 'checkbox',
    label: 'Меблированное',
    category: 'advanced'
  },
  {
    id: 'availableFrom',
    type: 'date',
    label: 'Доступность с',
    category: 'advanced'
  }
];

// 🚗 Фильтры для автомобилей согласно ТЗ
export const carFilters: FilterConfig[] = [
  // Основные фильтры
  {
    id: 'priceRange',
    type: 'range',
    label: 'Цена',
    category: 'basic',
    min: 15,
    max: 200,
    step: 5,
    marks: [
      { value: 15, label: '15€' },
      { value: 50, label: '50€' },
      { value: 100, label: '100€' },
      { value: 150, label: '150€' },
      { value: 200, label: '200€' }
    ]
  },
  {
    id: 'type',
    type: 'select',
    label: 'Тип сделки',
    category: 'basic',
    options: [
      { value: 'rent', label: 'Аренда' },
      { value: 'sale', label: 'Продажа' }
    ]
  },
  {
    id: 'make',
    type: 'multiselect',
    label: 'Марка',
    category: 'basic',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'bmw', label: 'BMW' },
      { value: 'mercedes', label: 'Mercedes-Benz' },
      { value: 'audi', label: 'Audi' },
      { value: 'seat', label: 'Seat' },
      { value: 'opel', label: 'Opel' },
      { value: 'fiat', label: 'Fiat' },
      { value: 'nissan', label: 'Nissan' },
      { value: 'kia', label: 'Kia' },
      { value: 'mazda', label: 'Mazda' },
      { value: 'mini', label: 'Mini' },
      { value: 'dacia', label: 'Dacia' }
    ]
  },
  {
    id: 'transmission',
    type: 'select',
    label: 'Коробка передач',
    category: 'basic',
    options: [
      { value: 'manual', label: 'Механическая' },
      { value: 'automatic', label: 'Автоматическая' },
      { value: 'semi-automatic', label: 'Полуавтоматическая' }
    ]
  },

  // Дополнительные фильтры
  {
    id: 'yearRange',
    type: 'range',
    label: 'Год выпуска',
    category: 'advanced',
    min: 2015,
    max: 2025,
    step: 1,
    marks: [
      { value: 2015, label: '2015' },
      { value: 2018, label: '2018' },
      { value: 2021, label: '2021' },
      { value: 2024, label: '2024' },
      { value: 2025, label: '2025' }
    ]
  },
  {
    id: 'mileage',
    type: 'range',
    label: 'Пробег (км)',
    category: 'advanced',
    min: 0,
    max: 200000,
    step: 10000,
    marks: [
      { value: 0, label: '0' },
      { value: 50000, label: '50к' },
      { value: 100000, label: '100к' },
      { value: 150000, label: '150к' },
      { value: 200000, label: '200к' }
    ]
  },
  {
    id: 'fuel',
    type: 'multiselect',
    label: 'Тип топлива',
    category: 'advanced',
    options: [
      { value: 'petrol', label: 'Бензин' },
      { value: 'diesel', label: 'Дизель' },
      { value: 'hybrid', label: 'Гибрид' },
      { value: 'electric', label: 'Электрический' },
      { value: 'lpg', label: 'Газ (LPG)' }
    ]
  },
  {
    id: 'bodyType',
    type: 'multiselect',
    label: 'Тип кузова',
    category: 'advanced',
    options: [
      { value: 'sedan', label: 'Седан' },
      { value: 'hatchback', label: 'Хэтчбек' },
      { value: 'suv', label: 'Внедорожник' },
      { value: 'van', label: 'Фургон' },
      { value: 'coupe', label: 'Купе' },
      { value: 'convertible', label: 'Кабриолет' },
      { value: 'wagon', label: 'Универсал' }
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
      { value: '9', label: '9+ мест' }
    ]
  },
  {
    id: 'doors',
    type: 'select',
    label: 'Количество дверей',
    category: 'advanced',
    options: [
      { value: '3', label: '3 двери' },
      { value: '5', label: '5 дверей' }
    ]
  },
  {
    id: 'features',
    type: 'multiselect',
    label: 'Дополнительные опции',
    category: 'advanced',
    options: [
      { value: 'air_conditioning', label: 'Кондиционер' },
      { value: 'navigation', label: 'Навигация' },
      { value: 'bluetooth', label: 'Bluetooth' },
      { value: 'parking_sensors', label: 'Парктроники' },
      { value: 'backup_camera', label: 'Камера заднего вида' },
      { value: 'cruise_control', label: 'Круиз-контроль' },
      { value: 'usb_ports', label: 'USB порты' },
      { value: 'roof_rack', label: 'Багажник на крыше' }
    ]
  },
  {
    id: 'location',
    type: 'select',
    label: 'Локация автомобиля',
    category: 'advanced',
    options: [
      { value: 'los-gigantes', label: 'Лос Хигантес' },
      { value: 'costa-adeje', label: 'Коста Адехе' },
      { value: 'playa-americas', label: 'Плайя де лас Америкас' },
      { value: 'santa-cruz', label: 'Санта-Крус' },
      { value: 'puerto-cruz', label: 'Пуэрто де ла Крус' }
    ]
  }
];

// 🏞️ Фильтры для экскурсий согласно ТЗ
export const excursionFilters: FilterConfig[] = [
  // Основные фильтры
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
    id: 'category',
    type: 'multiselect',
    label: 'Тип развлечения',
    category: 'basic',
    options: [
      { value: 'boat_trip', label: 'Прогулка на катере' },
      { value: 'hiking', label: 'Пешая экскурсия' },
      { value: 'jeep_safari', label: 'Джип-сафари' },
      { value: 'museum', label: 'Музей' },
      { value: 'aquapark', label: 'Аквапарк' },
      { value: 'cultural', label: 'Культурные' },
      { value: 'nature', label: 'Природа' },
      { value: 'adventure', label: 'Приключения' },
      { value: 'family', label: 'Семейные' }
    ]
  },
  {
    id: 'duration',
    type: 'multiselect',
    label: 'Продолжительность',
    category: 'basic',
    options: [
      { value: '2h', label: '2 часа' },
      { value: '4h', label: '4 часа' },
      { value: '6h', label: '6 часов' },
      { value: '8h', label: 'Полный день (8 часов)' },
      { value: 'multiday', label: 'Несколько дней' }
    ]
  },

  // Дополнительные фильтры
  {
    id: 'location',
    type: 'multiselect',
    label: 'Локация',
    category: 'advanced',
    options: [
      { value: 'teide', label: 'Национальный парк Тейде' },
      { value: 'los-gigantes', label: 'Лос Хигантес' },
      { value: 'masca', label: 'Маска' },
      { value: 'anaga', label: 'Горы Анага' },
      { value: 'puerto-cruz', label: 'Пуэрто де ла Крус' },
      { value: 'santa-cruz', label: 'Санта-Крус' },
      { value: 'la-gomera', label: 'Ла Гомера' },
      { value: 'coast', label: 'Побережье' }
    ]
  },
  {
    id: 'language',
    type: 'multiselect',
    label: 'Язык гида',
    category: 'advanced',
    options: [
      { value: 'ru', label: 'Русский' },
      { value: 'en', label: 'Английский' },
      { value: 'es', label: 'Испанский' },
      { value: 'de', label: 'Немецкий' },
      { value: 'fr', label: 'Французский' },
      { value: 'pl', label: 'Польский' }
    ]
  },
  {
    id: 'difficulty',
    type: 'select',
    label: 'Уровень сложности',
    category: 'advanced',
    options: [
      { value: 'easy', label: 'Легкий' },
      { value: 'moderate', label: 'Средний' },
      { value: 'hard', label: 'Сложный' }
    ]
  },
  {
    id: 'groupSize',
    type: 'range',
    label: 'Размер группы',
    category: 'advanced',
    min: 1,
    max: 30,
    step: 1,
    marks: [
      { value: 1, label: '1' },
      { value: 8, label: '8' },
      { value: 15, label: '15' },
      { value: 25, label: '25' },
      { value: 30, label: '30' }
    ]
  },
  {
    id: 'included',
    type: 'multiselect',
    label: 'Включено',
    category: 'advanced',
    options: [
      { value: 'transport', label: 'Транспорт' },
      { value: 'food', label: 'Питание' },
      { value: 'tickets', label: 'Билеты' },
      { value: 'guide', label: 'Гид' },
      { value: 'equipment', label: 'Оборудование' }
    ]
  },
  {
    id: 'suitable_for',
    type: 'multiselect',
    label: 'Подходит для',
    category: 'advanced',
    options: [
      { value: 'children', label: 'Детей' },
      { value: 'families', label: 'Семей' },
      { value: 'couples', label: 'Пар' },
      { value: 'groups', label: 'Групп' },
      { value: 'solo', label: 'Индивидуально' }
    ]
  },
  {
    id: 'min_age',
    type: 'number',
    label: 'Минимальный возраст',
    category: 'advanced',
    min: 0,
    max: 18
  },
  {
    id: 'extreme',
    type: 'checkbox',
    label: 'Экстремальные',
    category: 'advanced'
  }
];