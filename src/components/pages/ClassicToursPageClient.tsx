'use client';

import { useState, useEffect, useCallback } from 'react';
import { toursAPI } from '@/services/api';
import { Tour } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { openWhatsApp } from '@/utils/whatsapp';

interface ClassicToursPageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function ClassicToursPageClient({ params }: ClassicToursPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние фильтров
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    priceRange: [0, 1000] as [number, number],
    duration: '',
    difficulty: '',
    forChildren: false,
    includesTransport: false,
    includesFood: false
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

  // Загрузка экскурсий
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Максимально упрощенный запрос - только базовые данные
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337/api';
      const url = `${API_URL}/tours?locale=${currentLocale}&populate=*`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data?.data) {
        // Применяем фильтры на фронтенде
        let filteredTours = data.data;

        // Фильтрация по локации
        if (filters.location) {
          filteredTours = filteredTours.filter((tour: any) => {
            if (!tour.location) return false;
            const locationStr = tour.location.city || tour.location.address || tour.location.region || '';
            return locationStr.toLowerCase().includes(filters.location.toLowerCase());
          });
        }

        // Фильтрация по категории
        if (filters.category) {
          filteredTours = filteredTours.filter((tour: any) => tour.category === filters.category);
        }

        // Фильтрация по цене
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
          filteredTours = filteredTours.filter((tour: any) => {
            const price = tour.price?.amount || 0;
            return price >= filters.priceRange[0] && price <= filters.priceRange[1];
          });
        }

        // Фильтрация по продолжительности
        if (filters.duration) {
          filteredTours = filteredTours.filter((tour: any) =>
            tour.duration?.toLowerCase().includes(filters.duration.toLowerCase())
          );
        }

        // Фильтрация по сложности
        if (filters.difficulty) {
          filteredTours = filteredTours.filter((tour: any) => tour.difficulty_level === filters.difficulty);
        }

        // Фильтрация для детей
        if (filters.forChildren) {
          filteredTours = filteredTours.filter((tour: any) => tour.suitable_for_children === true);
        }

        // Фильтрация по транспорту
        if (filters.includesTransport) {
          filteredTours = filteredTours.filter((tour: any) => tour.includes_transport === true);
        }

        // Фильтрация по питанию
        if (filters.includesFood) {
          filteredTours = filteredTours.filter((tour: any) => tour.includes_food === true);
        }

        // Пагинация
        const totalCount = filteredTours.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTours = filteredTours.slice(startIndex, endIndex);

        setTours(paginatedTours);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setTours([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Ошибка загрузки экскурсий:', err);
      setError('Не удалось загрузить экскурсии. Попробуйте позже.');
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [currentLocale, filters, page]);

  // Функция для преобразования фильтров в формат API
  const buildApiFilters = useCallback((filterValues: typeof filters) => {
    const apiFilters: Record<string, any> = {};

    if (filterValues.location) {
      apiFilters['location.city'] = { $containsi: filterValues.location };
    }

    if (filterValues.category) {
      apiFilters.category = { $eq: filterValues.category };
    }

    if (filterValues.priceRange[0] > 0 || filterValues.priceRange[1] < 1000) {
      apiFilters['price.amount'] = {
        $gte: filterValues.priceRange[0],
        $lte: filterValues.priceRange[1]
      };
    }

    if (filterValues.duration) {
      apiFilters.duration = { $containsi: filterValues.duration };
    }

    if (filterValues.difficulty) {
      apiFilters.difficulty_level = { $eq: filterValues.difficulty };
    }

    if (filterValues.forChildren) {
      apiFilters.suitable_for_children = { $eq: true };
    }

    if (filterValues.includesTransport) {
      apiFilters.includes_transport = { $eq: true };
    }

    if (filterValues.includesFood) {
      apiFilters.includes_food = { $eq: true };
    }

    return apiFilters;
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchTours();
    }
  }, [mounted, fetchTours]);

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
      location: '',
      category: '',
      priceRange: [0, 1000],
      duration: '',
      difficulty: '',
      forChildren: false,
      includesTransport: false,
      includesFood: false
    });
    setPage(1);
  };

  // Обработка контакта
  const handleContact = (tour: Tour) => {
    openWhatsApp('excursion', {
      title: tour.title,
      price: tour.price?.amount ? `€${tour.price.amount}` : 'Цена по запросу',
      duration: tour.duration || 'Весь день',
      language: 'Русский'
    }, currentLocale);
  };

  // Получение URL изображения
  const getImageUrl = (tour: Tour): string => {
    const STRAPI_URL = 'http://127.0.0.1:1337';

    if (tour.images && tour.images.length > 0) {
      const image = tour.images[0];
      if (typeof image === 'object' && image.url) {
        return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
      }
    }

    return 'https://via.placeholder.com/350x200/e3f2fd/1976d2?text=Экскурсия';
  };

  // Функции для переводов
  const getBackText = (locale: Locale): string => {
    const texts = {
      en: 'Back to Home',
      ru: 'Назад на главную',
      pl: 'Powrót do strony głównej',
      fr: 'Retour à l\'accueil',
      uk: 'Назад на головну',      ua: 'Назад на головну',
      de: "Zurück zur Startseite",
      es: "Volver a la página principal"
    };
    return texts[locale] || texts.en;
  };

  const getTitle = (locale: Locale): string => {
    const texts = {
      en: 'Tours & Excursions',
      ru: 'Экскурсии и туры',
      pl: 'Wycieczki i ekskursje',
      fr: 'Tours et excursions',
      uk: 'Екскурсії та тури',      ua: 'Екскурсії та тури',
      de: "Touren und Exkursionen",
      es: "Excursiones y tours"
    };
    return texts[locale] || texts.en;
  };

  const getSubtitle = (locale: Locale): string => {
    const texts = {
      en: 'Discover the beauty of Tenerife with our exciting tours',
      ru: 'Откройте для себя красоту Тенерифе с нашими увлекательными турами',
      pl: 'Odkryj piękno Tenerife dzięki naszym ekscytującym wycieczkom',
      fr: 'Découvrez la beauté de Tenerife avec nos tours passionnants',
      uk: 'Відкрийте для себе красу Тенерифе з нашими захоплюючими турами',      ua: 'Відкрийте для себе красу Тенерифе з нашими захоплюючими турами',
      de: "Entdecken Sie die Schönheit von Tenerife mit unseren spannenden Touren",
      es: "Descubre la belleza de Tenerife con nuestras emocionantes excursiones"
    };
    return texts[locale] || texts.en;
  };

  const getNoResultsText = (locale: Locale): string => {
    const texts = {
      en: 'No tours found',
      ru: 'Экскурсии не найдены',
      pl: 'Nie znaleziono wycieczek',
      fr: 'Aucun tour trouvé',
      uk: 'Екскурсії не знайдено',      ua: 'Екскурсії не знайдено',
      de: "Keine Touren gefunden",
      es: "No se encontraron excursiones"
    };
    return texts[locale] || texts.en;
  };

  const getFoundText = (locale: Locale): string => {
    const texts = {
      en: 'Found',
      ru: 'Найдено',
      pl: 'Znaleziono',
      fr: 'Trouvé',
      uk: 'Знайдено',      ua: 'Знайдено',
      de: "Gefunden",
      es: "Encontrado"
    };
    return texts[locale] || texts.en;
  };

  const getToursText = (locale: Locale): string => {
    const texts = {
      en: 'tours',
      ru: 'экскурсий',
      pl: 'wycieczek',
      fr: 'tours',
      uk: 'екскурсій',      ua: 'екскурсій',
      de: "Touren",
      es: "Excursiones"
    };
    return texts[locale] || texts.en;
  };

  const getContactText = (locale: Locale): string => {
    const texts = {
      en: 'Book',
      ru: 'Бронь',
      pl: 'Rezerwuj',
      fr: 'Réserver',
      uk: 'Бронь',      ua: 'Бронь',
      de: "Buchen",
      es: "Reservar"
    };
    return texts[locale] || texts.en;
  };

  const getDetailsText = (locale: Locale): string => {
    const texts = {
      en: 'View Details',
      ru: 'Подробнее',
      pl: 'Zobacz szczegóły',
      fr: 'Voir les détails',
      uk: 'Детальніше',      ua: 'Детальніше',
      de: "Details ansehen",
      es: "Ver detalles"

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

          {/* Локация */}
          <div className="filter-group">
            <label>Локация</label>
            <select
              className="filter-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Все локации</option>
              <option value="santa-cruz">Санта-Крус</option>
              <option value="puerto-cruz">Пуэрто-де-ла-Крус</option>
              <option value="teide">Национальный парк Тейде</option>
              <option value="masca">Маска</option>
              <option value="garachico">Гарачико</option>
              <option value="candelaria">Канделария</option>
            </select>
          </div>

          {/* Категория */}
          <div className="filter-group">
            <label>Тип экскурсии</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Все типы</option>
              <option value="boat_trip">Прогулка на катере</option>
              <option value="walking_tour">Пешая экскурсия</option>
              <option value="jeep_safari">Джип-сафари</option>
              <option value="museum">Музей</option>
              <option value="aquapark">Аквапарк</option>
              <option value="adventure">Приключения</option>
              <option value="cultural">Культурные туры</option>
              <option value="nature">Природа</option>
            </select>
          </div>

          {/* Продолжительность */}
          <div className="filter-group">
            <label>Продолжительность</label>
            <select
              className="filter-select"
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">Любая</option>
              <option value="2-3">2-3 часа</option>
              <option value="4-6">4-6 часов</option>
              <option value="полный">Полный день</option>
              <option value="2 дня">2 дня</option>
            </select>
          </div>

          {/* Сложность */}
          <div className="filter-group">
            <label>Сложность</label>
            <select
              className="filter-select"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">Любая</option>
              <option value="easy">Легкая</option>
              <option value="moderate">Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </div>

          {/* Диапазон цен */}
          <div className="filter-group">
            <label>Цена (€): {filters.priceRange[0]} - {filters.priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="price-range-slider"
            />
          </div>

          {/* Чекбоксы */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.forChildren}
                onChange={(e) => handleFilterChange('forChildren', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Подходит для детей
            </label>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.includesTransport}
                onChange={(e) => handleFilterChange('includesTransport', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Включён транспорт
            </label>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.includesFood}
                onChange={(e) => handleFilterChange('includesFood', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Включено питание
            </label>
          </div>

          {/* Кнопка сброса */}
          <button
            className="reset-filters-btn"
            onClick={handleResetFilters}
          >
            Сбросить фильтры
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
              Загрузка экскурсий...
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

          {!loading && !error && tours.length === 0 && (
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

          {!loading && !error && tours.length > 0 && (
            <>
              <div style={{
                marginBottom: '20px',
                color: '#666',
                fontSize: '14px'
              }}>
                {getFoundText(currentLocale)}: {tours.length} {getToursText(currentLocale)}
              </div>

              {/* Сетка экскурсий */}
              <div className="classic-grid">
                {tours.map((tour) => (
                  <div key={tour.id} className="classic-card">
                    <img
                      src={getImageUrl(tour)}
                      alt={tour.title}
                      className="classic-card-image"
                    />

                    <div className="classic-card-content">
                      {/* Цена */}
                      <div className="classic-badge classic-badge-price">
                        {tour.price?.amount ? `€${tour.price.amount}` : 'Цена по запросу'}
                      </div>

                      {/* Заголовок */}
                      <h3 className="classic-card-title">
                        {typeof tour.title === 'string' ? tour.title : 'Экскурсия'}
                      </h3>

                      {/* Локация */}
                      {tour.location?.city && (
                        <div className="classic-card-location">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {tour.location.city}
                        </div>
                      )}

                      {/* Описание */}
                      <div className="classic-card-description">
                        {typeof tour.short_description === 'string'
                          ? tour.short_description
                          : typeof tour.description === 'string'
                            ? tour.description
                            : 'Увлекательная экскурсия по острову'}
                      </div>

                      {/* Характеристики */}
                      <div className="classic-card-specs">
                        {tour.duration && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            {tour.duration}
                          </div>
                        )}
                        {tour.max_participants && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            До {tour.max_participants} чел
                          </div>
                        )}
                        {tour.difficulty_level && (
                          <div className="classic-card-spec">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {tour.difficulty_level === 'easy' ? 'Легкая' :
                              tour.difficulty_level === 'moderate' ? 'Средняя' : 'Сложная'}
                          </div>
                        )}
                      </div>

                      {/* Дополнительные метки */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {tour.suitable_for_children && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Для детей
                          </span>
                        )}
                        {tour.includes_transport && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Транспорт
                          </span>
                        )}
                        {tour.includes_food && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#e7f3ff',
                            color: '#0056b3',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: '500'
                          }}>
                            Питание
                          </span>
                        )}
                      </div>

                      {/* Кнопки */}
                      <div className="classic-card-buttons">
                        <button
                          onClick={() => handleContact(tour)}
                          className="classic-btn classic-btn-primary"
                          style={{ flex: '1', marginRight: '8px' }}
                        >
                          {getContactText(currentLocale)}
                        </button>
                        <a
                          href={`/${currentLocale}/tours/${tour.id}`}
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
