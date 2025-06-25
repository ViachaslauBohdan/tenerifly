'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay, Pagination, Group, Select } from '@mantine/core';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { CarTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { carFilters } from '@/config/filters';

interface CarsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function CarsPage({ params }: CarsPageProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  // Состояние данных
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние фильтров и пагинации
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt:desc');
  
  const itemsPerPage = 9;

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  // Загрузка автомобилей
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Подготавливаем фильтры для API
      const apiFilters = {
        ...filters,
        page,
        pageSize: itemsPerPage,
        sort: sortBy,
      };
      
      const response = await carsAPI.getAll(currentLocale, apiFilters);
      
      if (response.data) {
        setCars(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        setCars([]);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Не удалось загрузить автомобили');
      
      // Используем мок-данные в случае ошибки
      const response = await carsAPI.getAll(currentLocale, {});
      setCars(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchCars();
    }
  }, [mounted, currentLocale, filters, page, sortBy]);

  const handleFilterChange = (id: string, value: any) => {
    setFilters(prev => ({ ...prev, [id]: value }));
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters({});
    setPage(1);
  };

  const handleApplyFilters = () => {
    fetchCars();
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Title order={1} mb="xl">{t.sections.cars.title}</Title>
      <Text size="lg" mb="xl" c="dimmed">
        {t.sections.cars.subtitle}
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <AdvancedFilterPanel
            config={carFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
            onApply={handleApplyFilters}
            loading={loading}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 9 }}>
          {/* Сортировка и результаты */}
          <Group justify="space-between" mb="md">
            <Text size="sm" c="dimmed">
              Найдено автомобилей: {cars.length}
            </Text>
            <Select
              placeholder="Сортировка"
              value={sortBy}
              onChange={(value) => setSortBy(value || 'createdAt:desc')}
              data={[
                { value: 'createdAt:desc', label: 'Сначала новые' },
                { value: 'createdAt:asc', label: 'Сначала старые' },
                { value: 'price.amount:asc', label: 'Сначала дешевые' },
                { value: 'price.amount:desc', label: 'Сначала дорогие' },
                { value: 'specifications.year:desc', label: 'Сначала новые по году' },
                { value: 'specifications.year:asc', label: 'Сначала старые по году' },
                { value: 'title:asc', label: 'По названию А-Я' },
              ]}
              w={220}
            />
          </Group>

          {error && (
            <Text c="red" ta="center" py="xl">{error}</Text>
          )}

          <div style={{ position: 'relative', minHeight: '200px' }}>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            
            {cars.length === 0 && !loading ? (
              <Text ta="center" py="xl" size="lg" c="dimmed">
                {t.common.noResults}
              </Text>
            ) : (
              <Grid>
                {cars.map((car) => (
                  <Grid.Col key={car.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <CarTile
                      title={car.title}
                      description={car.description || 'Описание отсутствует'}
                      image={car.images?.[0]?.url || '/placeholder.jpg'}
                      type={car.type}
                      status={car.car_status}
                      price={`€${car.price?.amount || 0}${car.price?.period === 'day' ? '/день' : ''}`}
                      specifications={{
                        brand: car.specifications?.make || 'Неизвестно',
                        model: car.specifications?.model || 'Неизвестно',
                        year: car.specifications?.year || 0,
                        fuel_type: car.specifications?.fuel || 'Неизвестно',
                        transmission: car.specifications?.transmission || 'Неизвестно',
                        seats: car.specifications?.seats || 0,
                      }}
                      onView={() => window.open(`/${currentLocale}/cars/${car.id}`, '_self')}
                      onViewDetails={() => window.open(`/${currentLocale}/cars/${car.id}`, '_self')}
                      currentLocale={currentLocale}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={page}
                onChange={setPage}
                total={totalPages}
                size="md"
                withEdges
              />
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}