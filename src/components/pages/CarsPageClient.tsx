'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';

interface CarsPageClientProps {
  params: Promise<{ locale: Locale }>;
  initialCars?: any[];
}

export function CarsPageClient({ params, initialCars = [] }: CarsPageClientProps) {
  const { t, locale } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [cars] = useState(initialCars);

  // Обработка монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  // Обработка изменения параметров локали
  useEffect(() => {
    params.then((resolvedParams) => {
      setCurrentLocale(resolvedParams.locale);
    });
  }, [params]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  // Простое отображение как в оригинальном файле с переводами
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Кнопка "Назад на главную" */}
      <div style={{ marginBottom: '30px' }}>
        <a href={`/${currentLocale}`} style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#228be6', 
          textDecoration: 'none',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          ← {t.common.backToHome}
        </a>
      </div>
      
      {/* Заголовок */}
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: '900', 
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #228be6, #15aabf)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {t.sections.cars.title}
      </h1>
      
      {/* Подзаголовок */}
      <p style={{ 
        fontSize: '18px', 
        color: '#666', 
        marginBottom: '40px',
        maxWidth: '600px'
      }}>
        {t.sections.cars.subtitle}
      </p>

      {/* Отображение автомобилей */}
      {cars.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            {t.common.noResults}
          </p>
        </div>
      )}

      {cars.length > 0 && (
        <div>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Найдено: {cars.length} автомобилей
          </p>
          
          {/* Простая сетка автомобилей */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {cars.map((car) => {
              const carData = car; // Car уже содержит данные напрямую
              const carId = car.documentId || car.id;
              const title = carData.title || 'Автомобиль';
              const description = carData.description || carData.short_description || '';
              const imageUrl = getImageUrl(car);
              const specs = carData.specifications || {};
              const price = carData.rental_prices || {};
              const carType = carData.type || 'rent';

              // Функция для безопасного извлечения текста
              const safeGetText = (value: any): string => {
                if (typeof value === 'string') return value;
                if (typeof value === 'number') return value.toString();
                if (value && typeof value === 'object' && value.toString) return value.toString();
                return 'Не указано';
              };

              return (
                <div key={carId} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  {/* Изображение */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={imageUrl}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {carType && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: carType === 'rent' ? '#28a745' : '#007bff',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {carType === 'rent' ? 'Аренда' : 'Продажа'}
                      </div>
                    )}
                  </div>

                  {/* Контент */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '20px', 
                      fontWeight: '700',
                      color: '#333'
                    }}>
                      {title}
                    </h3>

                    <p style={{ 
                      color: '#666', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      margin: '0 0 16px 0'
                    }}>
                      {description && description.length > 100 ? 
                        description.substring(0, 100) + '...' : description}
                    </p>

                    {/* Характеристики */}
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#888',
                      borderTop: '1px solid #eee',
                      paddingTop: '16px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px'
                    }}>
                      <div>🚗 Тип: {carType}</div>
                      <div>🆔 ID: {carId}</div>
                      {specs.make && <div>🏭 {t.filters.make}: {safeGetText(specs.make)}</div>}
                      {specs.year && <div>📅 {t.filters.year}: {safeGetText(specs.year)}</div>}
                      {price?.day_1 && (
                        <div style={{ 
                          gridColumn: '1 / -1',
                          color: '#228be6',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          marginTop: '8px'
                        }}>
                          💰 {t.common.from} {safeGetText(price?.day_1)}€{t.common.perDay}
                        </div>
                      )}
                    </div>

                    {/* Ссылка на детали */}
                    <a 
                      href={`/${currentLocale}/cars/${carId}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#228be6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {t.common.viewDetails}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Функция для получения URL изображения
function getImageUrl(car: any): string {
  try {
    const carData = car;
    const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:1337';
    
    if (carData.images && Array.isArray(carData.images) && carData.images.length > 0) {
      const image = carData.images[0];
      if (typeof image === 'string') return image.startsWith('http') ? image : `${STRAPI_URL}${image}`;
      if (image.url) return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
      if (image.attributes?.url) return image.attributes.url.startsWith('http') ? image.attributes.url : `${STRAPI_URL}${image.attributes.url}`;
    }
    
    if (carData.image) {
      if (typeof carData.image === 'string') return carData.image.startsWith('http') ? carData.image : `${STRAPI_URL}${carData.image}`;
      if (carData.image.url) return carData.image.url.startsWith('http') ? carData.image.url : `${STRAPI_URL}${carData.image.url}`;
      if (carData.image.attributes?.url) return carData.image.attributes.url.startsWith('http') ? carData.image.attributes.url : `${STRAPI_URL}${carData.image.attributes.url}`;
    }
    
    if (carData.main_image) {
      if (typeof carData.main_image === 'string') return carData.main_image.startsWith('http') ? carData.main_image : `${STRAPI_URL}${carData.main_image}`;
      if (carData.main_image.url) return carData.main_image.url.startsWith('http') ? carData.main_image.url : `${STRAPI_URL}${carData.main_image.url}`;
      if (carData.main_image.attributes?.url) return carData.main_image.attributes.url.startsWith('http') ? carData.main_image.attributes.url : `${STRAPI_URL}${carData.main_image.attributes.url}`;
    }
    
    return 'https://via.placeholder.com/350x200/f8f9fa/999?text=No+Image';
  } catch (error) {
    return 'https://via.placeholder.com/350x200/f8f9fa/999?text=No+Image';
  }
}