'use client';

import { useState, useEffect, useCallback } from 'react';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { openWhatsApp } from '@/utils/whatsapp';

interface ClassicCarsPageClientProps {
  params: Promise<{ locale: Locale }>;
}

const getLoadingText = (locale: Locale): string => {
  const texts = {
    en: 'Loading cars...',
    ru: 'Загрузка автомобилей...',
    pl: 'Ładowanie samochodów...',
    fr: 'Chargement des voitures...',
    uk: 'Завантаження автомобілів...',
     de: "Autos werden geladen...",
    es: "Cargando coches...",
  };
  return texts[locale] || texts.en;
};


const getResetFiltersText = (locale: Locale): string => {
  const texts = {
    en: 'Reset filters',
    ru: 'Сбросить фильтры',
    pl: 'Resetuj filtry',
    fr: 'Réinitialiser les filtres',
    uk: 'Скинути фільтри'
  };
  return texts[locale] || texts.en;
};

export function ClassicCarsPageClient({ params }: ClassicCarsPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние фильтров
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    priceRange: [0, 200] as [number, number],
    fuelType: '',
    transmission: '',
    bodyType: '',
    color: '',
    location: '',
    airConditioning: false,
    backupCamera: false,
    multimediaSystem: false
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  // Загрузка автомобилей
  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Упрощенный запрос без сложных фильтров
      const response = await carsAPI.getAll(currentLocale);

      if (response?.data) {
        // Применяем фильтры на фронтенде
        let filteredCars = response.data;

        // Фильтрация по марке
        if (filters.make) {
          filteredCars = filteredCars.filter(car =>
            car.specifications?.make?.toLowerCase().includes(filters.make.toLowerCase())
          );
        }

        // Фильтрация по модели
        if (filters.model) {
          filteredCars = filteredCars.filter(car =>
            car.specifications?.model?.toLowerCase().includes(filters.model.toLowerCase())
          );
        }

        // Фильтрация по году
        if (filters.year) {
          filteredCars = filteredCars.filter(car =>
            car.specifications?.year === parseInt(filters.year)
          );
        }

        // Фильтрация по цене
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
          filteredCars = filteredCars.filter(car => {
            const price = car.rental_prices?.day_1 || 0;
            return price >= filters.priceRange[0] && price <= filters.priceRange[1];
          });
        }

        // Фильтрация по топливу
        if (filters.fuelType) {
          filteredCars = filteredCars.filter(car => car.specifications?.fuel === filters.fuelType);
        }

        // Фильтрация по коробке передач
        if (filters.transmission) {
          filteredCars = filteredCars.filter(car => car.specifications?.transmission === filters.transmission);
        }

        // Фильтрация по типу кузова
        if (filters.bodyType) {
          filteredCars = filteredCars.filter(car => car.specifications?.body_type === filters.bodyType);
        }

        // Фильтрация по цвету
        if (filters.color) {
          filteredCars = filteredCars.filter(car =>
            car.specifications?.color?.toLowerCase().includes(filters.color.toLowerCase())
          );
        }

        // Фильтрация по локации
        if (filters.location) {
          filteredCars = filteredCars.filter(car => {
            if (!car.location) return false;
            const locationStr = car.location.city || car.location.address || car.location.region || '';
            return locationStr.toLowerCase().includes(filters.location.toLowerCase());
          });
        }

        // Фильтрация по кондиционеру
        if (filters.airConditioning) {
          filteredCars = filteredCars.filter(car => car.features?.air_conditioning === true);
        }

        // Фильтрация по камере заднего вида
        if (filters.backupCamera) {
          filteredCars = filteredCars.filter(car => car.features?.backup_camera === true);
        }

        // Фильтрация по Bluetooth
        if (filters.multimediaSystem) {
          filteredCars = filteredCars.filter(car => car.features?.bluetooth === true);
        }

        // Пагинация
        const totalCount = filteredCars.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCars = filteredCars.slice(startIndex, endIndex);

        setCars(paginatedCars);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setCars([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error loading cars:', err);
      const errorText = {
        en: 'Failed to load cars. Please try again later.',
        ru: 'Не удалось загрузить автомобили. Попробуйте позже.',
        pl: 'Nie udało się załadować samochodów. Spróbuj ponownie później.',
        fr: 'Impossible de charger les voitures. Veuillez réessayer plus tard.',
        uk: 'Не вдалося завантажити автомобілі. Спробуйте пізніше.'
      };
      setError(errorText[currentLocale] || errorText.en);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [currentLocale, filters, page]);

  // Функция для преобразования фильтров в формат API
  const buildApiFilters = useCallback((filterValues: typeof filters) => {
    const apiFilters: Record<string, any> = {};

    if (filterValues.make) {
      apiFilters['specifications.make'] = { $containsi: filterValues.make };
    }

    if (filterValues.model) {
      apiFilters['specifications.model'] = { $containsi: filterValues.model };
    }

    if (filterValues.year) {
      apiFilters['specifications.year'] = { $eq: parseInt(filterValues.year) };
    }

    if (filterValues.priceRange[0] > 0 || filterValues.priceRange[1] < 200) {
      apiFilters['rental_prices.day_1'] = {
        $gte: filterValues.priceRange[0],
        $lte: filterValues.priceRange[1]
      };
    }

    if (filterValues.fuelType) {
      apiFilters['specifications.fuel'] = { $eq: filterValues.fuelType };
    }

    if (filterValues.transmission) {
      apiFilters['specifications.transmission'] = { $eq: filterValues.transmission };
    }

    if (filterValues.bodyType) {
      apiFilters['specifications.body_type'] = { $eq: filterValues.bodyType };
    }

    if (filterValues.color) {
      apiFilters['specifications.color'] = { $containsi: filterValues.color };
    }

    if (filterValues.location) {
      apiFilters['location'] = { $containsi: filterValues.location };
    }

    if (filterValues.airConditioning) {
      apiFilters['features.air_conditioning'] = { $eq: true };
    }

    if (filterValues.backupCamera) {
      apiFilters['features.backup_camera'] = { $eq: true };
    }

    if (filterValues.multimediaSystem) {
      apiFilters['features.bluetooth'] = { $eq: true };
    }

    return apiFilters;
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchCars();
    }
  }, [mounted, fetchCars]);

  // Обработка изменения фильтров
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      priceRange: [0, 200],
      fuelType: '',
      transmission: '',
      bodyType: '',
      color: '',
      location: '',
      airConditioning: false,
      backupCamera: false,
      multimediaSystem: false
    });
    setPage(1);
  };

  // Обработка контакта
  const handleContact = (car: Car) => {
    const make = car.specifications?.make || '';
    const model = car.specifications?.model || '';
    const price = car.rental_prices?.day_1 ? `€${car.rental_prices.day_1}/день` : 'Цена по запросу';

    openWhatsApp('car', {
      title: car.title,
      brand: make,
      model: model,
      price: price
    }, currentLocale);
  };

  // Получение URL изображения
  const getImageUrl = (car: Car): string => {
    const STRAPI_URL = 'http://127.0.0.1:1337';

    if (car.images && car.images.length > 0) {
      const image = car.images[0];
      if (typeof image === 'object' && image.url) {
        return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
      }
    }

    return 'https://via.placeholder.com/350x200/f8f9fa/999?text=Автомобиль';
  };

  // Функции для переводов
  const getBackText = (locale: Locale): string => {
    const texts = {
      en: 'Back to Home',
      ru: 'Назад на главную',
      pl: 'Powrót do strony głównej',
      fr: 'Retour à l\'accueil',
      uk: 'Назад на головну'
    };
    return texts[locale] || texts.en;
  };

  const getTitle = (locale: Locale): string => {
    const texts = {
      en: 'Car Rental',
      ru: 'Аренда автомобилей',
      pl: 'Wynajem samochodów',
      fr: 'Location de voitures',
      uk: 'Оренда автомобілів'
    };
    return texts[locale] || texts.en;
  };

  const getSubtitle = (locale: Locale): string => {
    const texts = {
      en: 'Find the perfect car for your Tenerife adventure',
      ru: 'Найдите идеальный автомобиль для вашего приключения на Тенерифе',
      pl: 'Znajdź idealny samochód na swoją przygodę na Teneryfie',
      fr: 'Trouvez la voiture parfaite pour votre aventure à Tenerife',
      uk: 'Знайдіть ідеальний автомобіль для вашої пригоди на Тенерифе'
    };
    return texts[locale] || texts.en;
  };

  const getNoResultsText = (locale: Locale): string => {
    const texts = {
      en: 'No cars found',
      ru: 'Автомобили не найдены',
      pl: 'Nie znaleziono samochodów',
      fr: 'Aucune voiture trouvée',
      uk: 'Автомобілі не знайдено'
    };
    return texts[locale] || texts.en;
  };

  const getFoundText = (locale: Locale): string => {
    const texts = {
      en: 'Found',
      ru: 'Найдено',
      pl: 'Znaleziono',
      fr: 'Trouvé',
      uk: 'Знайдено'
    };
    return texts[locale] || texts.en;
  };

  const getCarsText = (locale: Locale): string => {
    const texts = {
      en: 'cars',
      ru: 'автомобилей',
      pl: 'samochodów',
      fr: 'voitures',
      uk: 'автомобілів'
    };
    return texts[locale] || texts.en;
  };

  const getContactText = (locale: Locale): string => {
    const texts = {
      en: 'Book',
      ru: 'Бронь',
      pl: 'Rezerwuj',
      fr: 'Réserver',
      uk: 'Бронь'
    };
    return texts[locale] || texts.en;
  };

  const getDetailsText = (locale: Locale): string => {
    const texts = {
      en: 'View Details',
      ru: 'Подробнее',
      pl: 'Zobacz szczegóły',
      fr: 'Voir les détails',
      uk: 'Детальніше'
    };
    return texts[locale] || texts.en;
  };

  const getPerDayText = (locale: Locale): string => {
    const texts = {
      en: '/day',
      ru: '/день',
      pl: '/dzień',
      fr: '/jour',
      uk: '/день'
    };
    return texts[locale] || texts.en;
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="classic-layout">
      {/* Шапка */}
      <div className="classic-header">
        <a href={`/${currentLocale}`} className="classic-back-link">
          ← {getBackText(currentLocale)}
        </a>
        <h1 className="classic-title">{getTitle(currentLocale)}</h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '0',
          maxWidth: '600px'
        }}>
          {getSubtitle(currentLocale)}
        </p>
      </div>

      <div className="classic-content">
        {/* Боковая панель фильтров */}
        <div className="classic-filters">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.73-4.8 5.75-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z" />
            </svg>
            Фильтры
          </h3>

          {/* Марка */}
          <div className="filter-group">
            <label>Марка</label>
            <select
              className="filter-select"
              value={filters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
            >
              <option value="">Все марки</option>
              <option value="Toyota">Toyota</option>
              <option value="Nissan">Nissan</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Ford">Ford</option>
              <option value="Renault">Renault</option>
              <option value="Peugeot">Peugeot</option>
              <option value="Opel">Opel</option>
              <option value="Seat">Seat</option>
            </select>
          </div>

          {/* Модель */}
          <div className="filter-group">
            <label>Модель</label>
            <input
              type="text"
              className="filter-input"
              value={filters.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
              placeholder="Введите модель"
            />
          </div>

          {/* Год выпуска */}
          <div className="filter-group">
            <label>Год выпуска</label>
            <select
              className="filter-select"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
            </select>
          </div>

          {/* Тип топлива */}
          <div className="filter-group">
            <label>Тип топлива</label>
            <select
              className="filter-select"
              value={filters.fuelType}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="petrol">Бензин</option>
              <option value="diesel">Дизель</option>
              <option value="hybrid">Гибрид</option>
              <option value="electric">Электро</option>
            </select>
          </div>

          {/* Коробка передач */}
          <div className="filter-group">
            <label>Коробка передач</label>
            <select
              className="filter-select"
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
            >
              <option value="">Любая</option>
              <option value="manual">Механическая</option>
              <option value="automatic">Автоматическая</option>
            </select>
          </div>

          {/* Тип кузова */}
          <div className="filter-group">
            <label>Тип кузова</label>
            <select
              className="filter-select"
              value={filters.bodyType}
              onChange={(e) => handleFilterChange('bodyType', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="sedan">Седан</option>
              <option value="hatchback">Хэтчбек</option>
              <option value="suv">Внедорожник</option>
              <option value="wagon">Универсал</option>
              <option value="coupe">Купе</option>
              <option value="convertible">Кабриолет</option>
            </select>
          </div>

          {/* Цвет */}
          <div className="filter-group">
            <label>Цвет</label>
            <select
              className="filter-select"
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="белый">Белый</option>
              <option value="черный">Черный</option>
              <option value="серый">Серый</option>
              <option value="синий">Синий</option>
              <option value="красный">Красный</option>
              <option value="зеленый">Зеленый</option>
              <option value="желтый">Желтый</option>
            </select>
          </div>

          {/* Локация */}
          <div className="filter-group">
            <label>Локация</label>
            <select
              className="filter-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Любая</option>
              <option value="santa-cruz">Санта-Крус</option>
              <option value="puerto-cruz">Пуэрто-де-ла-Крус</option>
              <option value="adeje">Адехе</option>
              <option value="arona">Арона</option>
              <option value="granadilla">Гранадилья</option>
              <option value="airport">Аэропорт</option>
            </select>
          </div>

          {/* Диапазон цен */}
          <div className="filter-group">
            <label>Цена в день (€): {filters.priceRange[0]} - {filters.priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="price-range-slider"
            />
          </div>

          {/* Дополнительные опции */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.airConditioning}
                onChange={(e) => handleFilterChange('airConditioning', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Кондиционер
            </label>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.backupCamera}
                onChange={(e) => handleFilterChange('backupCamera', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Камера заднего вида
            </label>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.multimediaSystem}
                onChange={(e) => handleFilterChange('multimediaSystem', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Мультимедийная система
            </label>
          </div>

          {/* Кнопка сброса */}
          <button
            className="reset-filters-btn"
            onClick={handleResetFilters}
          >
            {getResetFiltersText(currentLocale)}
          </button>
        </div>

        {/* Основной контент */}
        <div>
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              {getLoadingText(currentLocale)}
            </div>
          )}

          {error && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                {getNoResultsText(currentLocale)}
              </p>
            </div>
          )}

          {!loading && !error && cars.length > 0 && (
            <>
              <div style={{
                marginBottom: '20px',
                color: '#666',
                fontSize: '14px'
              }}>
                {getFoundText(currentLocale)}: {cars.length} {getCarsText(currentLocale)}
              </div>

              {/* Сетка автомобилей */}
              <div className="classic-grid">
                {cars.map((car) => (
                  <div key={car.id} className="classic-card">
                    <img
                      src={getImageUrl(car)}
                      alt={car.title}
                      className="classic-card-image"
                    />

                    <div className="classic-card-content">
                      {/* Цена */}
                      <div className="classic-badge classic-badge-price">
                        {car.rental_prices?.day_1 ? `€${car.rental_prices.day_1}${getPerDayText(currentLocale)}` : 'Цена по запросу'}
                      </div>

                      {/* Заголовок */}
                      <h3 className="classic-card-title">{car.title}</h3>

                      {/* Описание */}
                      <div className="classic-card-description">
                        {car.short_description || car.description || 'Удобный автомобиль для путешествий по острову'}
                      </div>

                      {/* Характеристики */}
                      <div className="classic-card-specs">
                        {car.specifications?.make && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z" />
                            </svg>
                            {car.specifications.make}
                          </div>
                        )}
                        {car.specifications?.year && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            {car.specifications.year}
                          </div>
                        )}
                        {car.specifications?.fuel && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" />
                            </svg>
                            {car.specifications.fuel === 'petrol' ? 'Бензин' :
                              car.specifications.fuel === 'diesel' ? 'Дизель' :
                                car.specifications.fuel === 'hybrid' ? 'Гибрид' :
                                  car.specifications.fuel === 'electric' ? 'Электро' :
                                    car.specifications.fuel}
                          </div>
                        )}
                        {car.specifications?.transmission && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            {car.specifications.transmission === 'manual' ? 'МКПП' :
                              car.specifications.transmission === 'automatic' ? 'АКПП' :
                                car.specifications.transmission}
                          </div>
                        )}
                      </div>

                      {/* Дополнительные опции */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {car.features?.air_conditioning && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Кондиционер
                          </span>
                        )}
                        {car.features?.backup_camera && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Камера
                          </span>
                        )}
                        {car.features?.bluetooth && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Bluetooth
                          </span>
                        )}
                      </div>

                      {/* Кнопки */}
                      <div className="classic-card-buttons">
                        <button
                          onClick={() => handleContact(car)}
                          className="classic-btn classic-btn-primary"
                          style={{ flex: '1', marginRight: '8px' }}
                        >
                          {getContactText(currentLocale)}
                        </button>
                        <a
                          href={`/${currentLocale}/cars/${car.id}`}
                          className="classic-btn classic-btn-secondary"
                        >
                          {getDetailsText(currentLocale)}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '30px'
                }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      backgroundColor: page === 1 ? '#f5f5f5' : 'white',
                      color: page === 1 ? '#999' : '#333',
                      borderRadius: '4px',
                      cursor: page === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Предыдущая
                  </button>

                  <span style={{
                    padding: '8px 16px',
                    color: '#666'
                  }}>
                    Страница {page} из {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      backgroundColor: page === totalPages ? '#f5f5f5' : 'white',
                      color: page === totalPages ? '#999' : '#333',
                      borderRadius: '4px',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Следующая →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
