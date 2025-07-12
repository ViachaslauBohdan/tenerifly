export interface FilterConfig {
  key: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean' | 'text';
  label: string;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Фильтры для недвижимости
export const propertyFilters: FilterConfig[] = [
  {
    key: 'location.city',
    type: 'select',
    label: 'Город',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус-де-Тенерифе' },
      { value: 'puerto-cruz', label: 'Пуэрто-де-ла-Крус' },
      { value: 'la-laguna', label: 'Ла-Лагуна' },
      { value: 'adeje', label: 'Адехе' },
      { value: 'arona', label: 'Арона' },
      { value: 'los-cristianos', label: 'Лос-Кристианос' },
      { value: 'playa-americas', label: 'Плайя-де-лас-Америкас' },
      { value: 'costa-adeje', label: 'Коста-Адехе' }
    ]
  },
    {
    key: 'location.region',
    type: 'select',
    label: 'Район',
    options: [
      { value: 'norte', label: 'Север' },
      { value: 'sur', label: 'Юг' },
      { value: 'este', label: 'Восток' },
      { value: 'oeste', label: 'Запад' },
      { value: 'centro', label: 'Центр' }
    ]
  },
  {
    key: 'location.postal_code',
    type: 'select',
    label: 'Почтовый индекс',
    options: [
      { value: '38001', label: '38001 - Санта-Крус центр' },
      { value: '38400', label: '38400 - Пуэрто-де-ла-Крус' },
      { value: '38600', label: '38600 - Гранадилья' },
      { value: '38660', label: '38660 - Адехе' },
      { value: '38650', label: '38650 - Арона' }
    ]
  },
  {
    key: 'specifications.property_type',
    type: 'select', 
    label: 'Тип недвижимости',
    options: [
      { value: 'apartment', label: 'Квартира' },
      { value: 'house', label: 'Дом' },
      { value: 'villa', label: 'Вилла' },
      { value: 'studio', label: 'Студия' },
      { value: 'penthouse', label: 'Пентхаус' },
      { value: 'plot', label: 'Участок' }
    ]
  },
  {
    key: 'specifications.bedrooms',
    type: 'select',
    label: 'Количество комнат',
    options: [
      { value: 0, label: 'Студия' },
      { value: 1, label: '1 комната' },
      { value: 2, label: '2 комнаты' },
      { value: 3, label: '3 комнаты' },
      { value: 4, label: '4 комнаты' },
      { value: 5, label: '5+ комнат' }
    ]
  },
  {
    key: 'specifications.total_area',
    type: 'range',
    label: 'Площадь (м²)',
    min: 20,
    max: 500,
    step: 10
  },
    {
    key: 'specifications.floor',
    type: 'range',
    label: 'Этаж',
    min: 0,
    max: 30,
    step: 1
  },
  {
    key: 'specifications.year_built',
    type: 'range',
    label: 'Год постройки',
    min: 1980,
    max: 2025,
    step: 1
  },
  {
    key: 'specifications.condition',
    type: 'select',
    label: 'Состояние недвижимости',
    options: [
      { value: 'needs_renovation', label: 'Требует ремонта' },
      { value: 'ready_to_live', label: 'Готово к проживанию' },
      { value: 'new', label: 'Новое' },
      { value: 'excellent', label: 'Отличное' }
    ]
  },
  {
    key: 'price.amount',
    type: 'range',
    label: 'Цена (€)',
    min: 50000,
    max: 2000000,
    step: 10000
  },
  {
    key: 'specifications.floor',
    type: 'range',
    label: 'Этаж',
    min: 0,
    max: 30,
    step: 1
  },
  {
    key: 'specifications.year_built',
    type: 'range',
    label: 'Год постройки',
    min: 1980,
    max: 2025,
    step: 1
  },
  {
    key: 'specifications.condition',
    type: 'select',
    label: 'Состояние',
    options: [
      { value: 'needs_renovation', label: 'Требует ремонта' },
      { value: 'good', label: 'Хорошее' },
      { value: 'excellent', label: 'Отличное' },
      { value: 'new', label: 'Новое' }
    ]
  },
  {
    key: 'features.has_balcony',
    type: 'boolean',
    label: 'Балкон'
  },
  {
    key: 'features.has_terrace', 
    type: 'boolean',
    label: 'Терраса'
  },
  {
    key: 'features.has_garden',
    type: 'boolean',
    label: 'Сад'
  },
  {
    key: 'features.has_parking',
    type: 'boolean',
    label: 'Парковка'
  },
  {
    key: 'features.has_garage',
    type: 'boolean',
    label: 'Гараж'
  },
  {
    key: 'specifications.furnished',
    type: 'boolean',
    label: 'Меблированная'
  },
  {
    key: 'specifications.available_from',
    type: 'date',
    label: 'Доступна с'
  }
];

// Фильтры для автомобилей
export const carFilters: FilterConfig[] = [
  {
    key: 'specifications.make',
    type: 'select',
    label: 'Марка',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'ford', label: 'Ford' },
      { value: 'mercedes', label: 'Mercedes-Benz' },
      { value: 'bmw', label: 'BMW' },
      { value: 'audi', label: 'Audi' },
      { value: 'nissan', label: 'Nissan' },
      { value: 'hyundai', label: 'Hyundai' },
      { value: 'kia', label: 'Kia' },
      { value: 'peugeot', label: 'Peugeot' },
      { value: 'renault', label: 'Renault' },
      { value: 'seat', label: 'SEAT' }
    ]
  },
  {
    key: 'specifications.model',
    type: 'text',
    label: 'Модель',
    placeholder: 'Введите модель'
  },
  {
    key: 'specifications.year',
    type: 'range',
    label: 'Год выпуска',
    min: 2010,
    max: 2025,
    step: 1
  },
  {
    key: 'price.amount',
    type: 'range',
    label: 'Цена (€)',
    min: 15,
    max: 200,
    step: 5
  },
  {
    key: 'specifications.mileage',
    type: 'range',
    label: 'Пробег (км)',
    min: 0,
    max: 300000,
    step: 5000
  },
  {
    key: 'specifications.fuel',
    type: 'select',
    label: 'Тип топлива',
    options: [
      { value: 'petrol', label: 'Бензин' },
      { value: 'diesel', label: 'Дизель' },
      { value: 'hybrid', label: 'Гибрид' },
      { value: 'electric', label: 'Электро' },
      { value: 'lpg', label: 'ГБО' }
    ]
  },
  {
    key: 'specifications.transmission',
    type: 'select',
    label: 'КПП',
    options: [
      { value: 'manual', label: 'Механическая' },
      { value: 'automatic', label: 'Автоматическая' },
      { value: 'semi-automatic', label: 'Полуавтоматическая' }
    ]
  },
  {
    key: 'specifications.body_type',
    type: 'select',
    label: 'Тип кузова',
    options: [
      { value: 'sedan', label: 'Седан' },
      { value: 'hatchback', label: 'Хэтчбек' },
      { value: 'suv', label: 'Внедорожник' },
      { value: 'van', label: 'Фургон' },
      { value: 'coupe', label: 'Купе' },
      { value: 'convertible', label: 'Кабриолет' },
      { value: 'wagon', label: 'Универсал' },
      { value: 'pickup', label: 'Пикап' },
      { value: 'minivan', label: 'Минивэн' }
    ]
  },
  {
    key: 'specifications.color',
    type: 'select',
    label: 'Цвет',
    options: [
      { value: 'white', label: 'Белый' },
      { value: 'black', label: 'Черный' },
      { value: 'silver', label: 'Серебристый' },
      { value: 'gray', label: 'Серый' },
      { value: 'red', label: 'Красный' },
      { value: 'blue', label: 'Синий' },
      { value: 'green', label: 'Зеленый' },
      { value: 'yellow', label: 'Желтый' },
      { value: 'brown', label: 'Коричневый' }
    ]
  },
  {
    key: 'specifications.doors',
    type: 'select',
    label: 'Количество дверей',
    options: [
      { value: 2, label: '2 двери' },
      { value: 3, label: '3 двери' },
      { value: 4, label: '4 двери' },
      { value: 5, label: '5 дверей' }
    ]
  },
  {
    key: 'specifications.power',
    type: 'range',
    label: 'Мощность (л.с.)',
    min: 50,
    max: 500,
    step: 10
  },
  {
    key: 'location.city',
    type: 'select',
    label: 'Локация',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус-де-Тенерифе' },
      { value: 'puerto-cruz', label: 'Пуэрто-де-ла-Крус' },
      { value: 'la-laguna', label: 'Ла-Лагуна' },
      { value: 'adeje', label: 'Адехе' },
      { value: 'arona', label: 'Арона' }
    ]
  },
  {
    key: 'available_from',
    type: 'date',
    label: 'Доступна с'
  },
  {
    key: 'features.air_conditioning',
    type: 'boolean',
    label: 'Кондиционер'
  },
  {
    key: 'features.backup_camera',
    type: 'boolean',
    label: 'Камера заднего вида'
  },
  {
    key: 'features.multimedia_system',
    type: 'boolean',
    label: 'Мультимедийная система'
  },
  {
    key: 'specifications.make',
    type: 'select',
    label: 'Марка',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'ford', label: 'Ford' },
      { value: 'mercedes', label: 'Mercedes-Benz' },
      { value: 'bmw', label: 'BMW' },
      { value: 'audi', label: 'Audi' },
      // НОВЫЕ марки согласно ТЗ:
      { value: 'nissan', label: 'Nissan' },
      { value: 'hyundai', label: 'Hyundai' },
      { value: 'kia', label: 'Kia' },
      { value: 'opel', label: 'Opel' },
      { value: 'peugeot', label: 'Peugeot' },
      { value: 'renault', label: 'Renault' },
      { value: 'citroen', label: 'Citroën' },
      { value: 'seat', label: 'SEAT' },
      { value: 'skoda', label: 'Škoda' }
    ]
  },
   {
    key: 'specifications.model',
    type: 'select',
    label: 'Модель',
    options: [
      // Toyota
      { value: 'corolla', label: 'Corolla' },
      { value: 'yaris', label: 'Yaris' },
      { value: 'rav4', label: 'RAV4' },
      { value: 'camry', label: 'Camry' },
      // Volkswagen
      { value: 'golf', label: 'Golf' },
      { value: 'polo', label: 'Polo' },
      { value: 'passat', label: 'Passat' },
      { value: 'tiguan', label: 'Tiguan' },
      // Mercedes
      { value: 'c-class', label: 'C-Class' },
      { value: 'e-class', label: 'E-Class' },
      { value: 'a-class', label: 'A-Class' },
      { value: 'glc', label: 'GLC' }
    ]
  },
  {
    key: 'specifications.year',
    type: 'range',
    label: 'Год выпуска',
    min: 2010,
    max: 2025,
    step: 1
  },
  {
    key: 'rental_prices.day_1',
    type: 'range',
    label: 'Цена аренды за день (€)',
    min: 15,
    max: 200,
    step: 5
  },
  {
    key: 'specifications.mileage',
    type: 'range',
    label: 'Пробег (км)',
    min: 0,
    max: 300000,
    step: 5000
  },
  {
    key: 'specifications.fuel',
    type: 'select',
    label: 'Тип топлива',
    options: [
      { value: 'petrol', label: 'Бензин' },
      { value: 'diesel', label: 'Дизель' },
      { value: 'hybrid', label: 'Гибрид' },
      { value: 'electric', label: 'Электрический' }
    ]
  },
  {
    key: 'specifications.transmission',
    type: 'select',
    label: 'Коробка передач',
    options: [
      { value: 'manual', label: 'Механическая' },
      { value: 'automatic', label: 'Автоматическая' }
    ]
  },
  {
    key: 'specifications.body_type',
    type: 'select',
    label: 'Тип кузова',
    options: [
      { value: 'sedan', label: 'Седан' },
      { value: 'hatchback', label: 'Хэтчбек' },
      { value: 'wagon', label: 'Универсал' },
      { value: 'suv', label: 'Внедорожник' },
      { value: 'crossover', label: 'Кроссовер' },
      { value: 'coupe', label: 'Купе' },
      { value: 'convertible', label: 'Кабриолет' },
      { value: 'minivan', label: 'Минивэн' }
    ]
  },
  {
    key: 'specifications.color',
    type: 'select',
    label: 'Цвет',
    options: [
      { value: 'white', label: 'Белый' },
      { value: 'black', label: 'Черный' },
      { value: 'silver', label: 'Серебристый' },
      { value: 'gray', label: 'Серый' },
      { value: 'red', label: 'Красный' },
      { value: 'blue', label: 'Синий' },
      { value: 'green', label: 'Зеленый' },
      { value: 'yellow', label: 'Желтый' }
    ]
  },
  {
    key: 'specifications.doors',
    type: 'select',
    label: 'Количество дверей',
    options: [
      { value: 3, label: '3 двери' },
      { value: 4, label: '4 двери' },
      { value: 5, label: '5 дверей' }
    ]
  },
  {
    key: 'specifications.power',
    type: 'range',
    label: 'Мощность двигателя (л.с.)',
    min: 70,
    max: 500,
    step: 10
  },
  {
    key: 'location.city',
    type: 'select',
    label: 'Локация автомобиля',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус-де-Тенерифе' },
      { value: 'puerto-cruz', label: 'Пуэрто-де-ла-Крус' },
      { value: 'la-laguna', label: 'Ла-Лагуна' },
      { value: 'adeje', label: 'Адехе' },
      { value: 'arona', label: 'Арона' },
      { value: 'airport', label: 'Аэропорт Тенерифе' }
    ]
  },
  {
    key: 'specifications.available_from',
    type: 'date',
    label: 'Доступна с'
  },
  // Характеристики авто согласно ТЗ
  {
    key: 'features.air_conditioning',
    type: 'boolean',
    label: 'Кондиционер'
  },
  {
    key: 'features.backup_camera',
    type: 'boolean',
    label: 'Камера заднего вида'
  },
  {
    key: 'features.bluetooth',
    type: 'boolean',
    label: 'Мультимедийная система'
  },
  {
    key: 'features.navigation',
    type: 'boolean',
    label: 'Навигация'
  },
  {
    key: 'features.cruise_control',
    type: 'boolean',
    label: 'Круиз-контроль'
  }
];

// Фильтры для экскурсий
export const tourFilters: FilterConfig[] = [
  // Существующие фильтры 
  {
    key: 'location.city',
    type: 'select',
    label: 'Город',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус-де-Тенерифе' },
      { value: 'puerto-cruz', label: 'Пуэрто-де-ла-Крус' },
      { value: 'la-laguna', label: 'Ла-Лагуна' },
      { value: 'adeje', label: 'Адехе' },
      { value: 'arona', label: 'Арона' },
      { value: 'teide', label: 'Национальный парк Тейде' },
      { value: 'masca', label: 'Маска' },
      { value: 'garachico', label: 'Гарачико' },
      { value: 'candelaria', label: 'Канделария' },
      { value: 'icod', label: 'Икод-де-лос-Винос' }
    ]
  },
  {
    key: 'location.region',
    type: 'select',
    label: 'Регион',
    options: [
      { value: 'norte', label: 'Север острова' },
      { value: 'sur', label: 'Юг острова' },
      { value: 'este', label: 'Восток острова' },
      { value: 'oeste', label: 'Запад острова' },
      { value: 'centro', label: 'Центр острова' }
    ]
  },
  {
    key: 'category',
    type: 'select',
    label: 'Тип развлечения',
    options: [
      { value: 'boat_trip', label: 'Прогулка на катере' },
      { value: 'walking_tour', label: 'Пешая экскурсия' },
      { value: 'jeep_safari', label: 'Джип-сафари' },
      { value: 'museum', label: 'Музей' },
      { value: 'aquapark', label: 'Аквапарк' },
      { value: 'whale_watching', label: 'Наблюдение за китами' },
      { value: 'diving', label: 'Дайвинг' },
      { value: 'hiking', label: 'Пешие походы' },
      { value: 'cultural', label: 'Культурные туры' },
      { value: 'adventure', label: 'Приключения' },
      { value: 'food_tour', label: 'Гастрономические туры' }
    ]
  },
  {
    key: 'price.amount',
    type: 'range',
    label: 'Цена (€)',
    min: 10,
    max: 500,
    step: 10
  },
  {
    key: 'duration_hours',
    type: 'range',
    label: 'Продолжительность (часы)',
    min: 1,
    max: 72,
    step: 1
  },
  {
    key: 'available_dates',
    type: 'date',
    label: 'Доступные даты'
  },
  {
    key: 'guide_languages',
    type: 'multiselect',
    label: 'Язык гида',
    options: [
      { value: 'ru', label: 'Русский' },
      { value: 'en', label: 'Английский' },
      { value: 'es', label: 'Испанский' },
      { value: 'de', label: 'Немецкий' },
      { value: 'fr', label: 'Французский' },
      { value: 'it', label: 'Итальянский' }
    ]
  },
  {
    key: 'suitable_for_children',
    type: 'boolean',
    label: 'Подходит для детей'
  },
  {
    key: 'family_friendly',
    type: 'boolean',
    label: 'Семейные'
  },
  {
    key: 'extreme',
    type: 'boolean',
    label: 'Экстремальные'
  },
  {
    key: 'group_type',
    type: 'select',
    label: 'Количество участников',
    options: [
      { value: 'individual', label: 'Индивидуально' },
      { value: 'small_group', label: 'Малая группа (2-6 чел.)' },
      { value: 'group', label: 'Группа (7-15 чел.)' },
      { value: 'large_group', label: 'Большая группа (16+ чел.)' }
    ]
  },
  {
    key: 'includes_transport',
    type: 'boolean',
    label: 'Включён транспорт'
  },
  {
    key: 'includes_food',
    type: 'boolean',
    label: 'Включено питание'
  },
  {
    key: 'includes_tickets',
    type: 'boolean',
    label: 'Включены билеты'
  },
  {
    key: 'difficulty_level',
    type: 'select',
    label: 'Уровень сложности',
    options: [
      { value: 'easy', label: 'Лёгкий' },
      { value: 'moderate', label: 'Средний' },
      { value: 'hard', label: 'Сложный' }
    ]
  },
  {
    key: 'rating',
    type: 'range',
    label: 'Минимальный рейтинг',
    min: 1,
    max: 5,
    step: 0.5
  }
];

// Объединенные фильтры для главной страницы (максимальное количество параметров)
export const mainPageFilters: FilterConfig[] = [
  // Общие фильтры
  {
    key: 'type',
    type: 'select',
    label: 'Категория',
    options: [
      { value: 'property', label: 'Недвижимость' },
      { value: 'car', label: 'Автомобили' },
      { value: 'tour', label: 'Экскурсии' }
    ]
  },
  {
    key: 'location.city',
    type: 'select',
    label: 'Город',
    options: [
      { value: 'santa-cruz', label: 'Санта-Крус-де-Тенерифе' },
      { value: 'puerto-cruz', label: 'Пуэрто-де-ла-Крус' },
      { value: 'la-laguna', label: 'Ла-Лагуна' },
      { value: 'adeje', label: 'Адехе' },
      { value: 'arona', label: 'Арона' },
      { value: 'los-cristianos', label: 'Лос-Кристианос' },
      { value: 'playa-americas', label: 'Плайя-де-лас-Америкас' },
      { value: 'costa-adeje', label: 'Коста-Адехе' },
      { value: 'teide', label: 'Национальный парк Тейде' },
      { value: 'masca', label: 'Маска' },
      { value: 'garachico', label: 'Гарачико' },
      { value: 'candelaria', label: 'Канделария' },
      { value: 'icod', label: 'Икод-де-лос-Винос' }
    ]
  },
  {
    key: 'price.amount',
    type: 'range',
    label: 'Цена (€)',
    min: 10,
    max: 2000000,
    step: 10
  },
  {
    key: 'featured',
    type: 'boolean',
    label: 'Только рекомендуемые'
  },
  
  // Фильтры для недвижимости
  {
    key: 'property.specifications.property_type',
    type: 'select',
    label: 'Тип недвижимости',
    options: [
      { value: 'apartment', label: 'Квартира' },
      { value: 'house', label: 'Дом' },
      { value: 'villa', label: 'Вилла' },
      { value: 'studio', label: 'Студия' },
      { value: 'penthouse', label: 'Пентхаус' },
      { value: 'plot', label: 'Участок' }
    ]
  },
  {
    key: 'property.specifications.bedrooms',
    type: 'select',
    label: 'Комнаты',
    options: [
      { value: 0, label: 'Студия' },
      { value: 1, label: '1 комната' },
      { value: 2, label: '2 комнаты' },
      { value: 3, label: '3 комнаты' },
      { value: 4, label: '4+ комнат' }
    ]
  },
  {
    key: 'property.specifications.total_area',
    type: 'range',
    label: 'Площадь (м²)',
    min: 20,
    max: 500,
    step: 10
  },
  
  // Фильтры для автомобилей  
  {
    key: 'car.specifications.make',
    type: 'select',
    label: 'Марка авто',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'ford', label: 'Ford' },
      { value: 'mercedes', label: 'Mercedes-Benz' },
      { value: 'bmw', label: 'BMW' },
      { value: 'audi', label: 'Audi' }
    ]
  },
  {
    key: 'car.specifications.fuel',
    type: 'select',
    label: 'Топливо',
    options: [
      { value: 'petrol', label: 'Бензин' },
      { value: 'diesel', label: 'Дизель' },
      { value: 'hybrid', label: 'Гибрид' },
      { value: 'electric', label: 'Электро' }
    ]
  },
  {
    key: 'car.specifications.transmission',
    type: 'select',
    label: 'КПП',
    options: [
      { value: 'manual', label: 'Механическая' },
      { value: 'automatic', label: 'Автоматическая' }
    ]
  },
  
  // Фильтры для экскурсий
  {
    key: 'tour.category',
    type: 'select',
    label: 'Тип экскурсии',
    options: [
      { value: 'boat_trip', label: 'Прогулка на катере' },
      { value: 'walking_tour', label: 'Пешая экскурсия' },
      { value: 'jeep_safari', label: 'Джип-сафари' },
      { value: 'museum', label: 'Музей' },
      { value: 'aquapark', label: 'Аквапарк' },
      { value: 'adventure', label: 'Приключения' },
      { value: 'cultural', label: 'Культурные туры' }
    ]
  },
  {
    key: 'tour.difficulty_level',
    type: 'select',
    label: 'Сложность',
    options: [
      { value: 'easy', label: 'Лёгкий' },
      { value: 'moderate', label: 'Средний' },
      { value: 'hard', label: 'Сложный' }
    ]
  },
  {
    key: 'tour.suitable_for_children',
    type: 'boolean',
    label: 'Для детей'
  },
  {
    key: 'tour.includes_transport',
    type: 'boolean',
    label: 'С транспортом'
  }
];

// Функция для получения фильтров по типу контента
export function getFiltersByType(type: 'property' | 'car' | 'tour' | 'main'): FilterConfig[] {
  switch (type) {
    case 'property':
      return propertyFilters;
    case 'car':
      return carFilters;
    case 'tour':
      return tourFilters;
    case 'main':
      return mainPageFilters;
    default:
      return [];
  }
}

// Функция для валидации значения фильтра
export function validateFilterValue(filter: FilterConfig, value: any): boolean {
  if (value === null || value === undefined) return true;
  
  switch (filter.type) {
    case 'range':
      return Array.isArray(value) && value.length === 2 && 
             typeof value[0] === 'number' && typeof value[1] === 'number';
    case 'multiselect':
      return Array.isArray(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'date':
      return typeof value === 'string' || value instanceof Date;
    case 'select':
    case 'text':
      return typeof value === 'string' || typeof value === 'number';
    default:
      return true;
  }
}

// Функция для очистки недопустимых значений фильтров
export function sanitizeFilters(filters: FilterConfig[], values: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  Object.entries(values).forEach(([key, value]) => {
    const filter = filters.find(f => f.key === key);
    if (filter && validateFilterValue(filter, value)) {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
}

// Экспорт по умолчанию
export default {
  propertyFilters,
  carFilters,
  tourFilters,
  mainPageFilters,
  getFiltersByType,
  validateFilterValue,
  sanitizeFilters
};