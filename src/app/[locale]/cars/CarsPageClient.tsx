'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay, Pagination, Group, Select, Box, Stack, Paper, rem, Center, Alert } from '@mantine/core';
import { IconAlertCircle, IconTrendingUp } from '@tabler/icons-react';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { CarTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { carFilters } from '@/config/filters';

interface CarsPageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function CarsPageClient({ params }: CarsPageClientProps) {
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
    <Box className="gradient-bg-page">
      <Container size="xl" py="xl">
        <BackToHome />
        
        {/* Заголовок страницы */}
        <Stack gap="xl" mb="xl">
          <Box ta="center">
            <Title 
              order={1} 
              size={rem(48)}
              fw={900}
              className="gradient-text"
              mb="md"
            >
              {t.sections.cars.title}
            </Title>
            <Text 
              size="xl" 
              c="gray.7"
              maw={600}
              mx="auto"
              ta="center"
              fw={500}
            >
              {t.sections.cars.subtitle}
            </Text>
          </Box>

          {/* Статистика */}
          <Paper
            radius="xl"
            p="xl"
          >
            <Group justify="center" gap="xl">
              <Stack gap="xs" align="center">
                <Text size="xs" tt="uppercase" fw={700} c="gray.6">
                  Найдено автомобилей
                </Text>
                <Text size="xl" fw={900} c="blue.6">
                  {cars.length}
                </Text>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" tt="uppercase" fw={700} c="gray.6">
                  Страница
                </Text>
                <Text size="xl" fw={900} c="cyan.6">
                  {page} из {totalPages}
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Stack>

        <Grid gutter="xl">
          {/* Фильтры */}
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
          
          {/* Основной контент */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack gap="xl">
              {/* Сортировка */}
              <Paper
                radius="xl"
                p="lg"
              >
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <IconTrendingUp size={20} color="#339af0" />
                    <Text fw={600} c="gray.8">Сортировка:</Text>
                  </Group>
                  <Select
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
                    w={250}
                    size="md"
                    radius="xl"
                  />
                </Group>
              </Paper>

              {/* Результаты */}
              <Box pos="relative" mih={400}>
                <LoadingOverlay
                  visible={loading}
                  overlayProps={{ 
                    radius: 'xl', 
                    backgroundOpacity: 0.1
                  }}
                  loaderProps={{ 
                    color: 'blue', 
                    type: 'dots',
                    size: 'xl'
                  }}
                />

                {error && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Ошибка загрузки"
                    color="red"
                    radius="xl"
                    mb="xl"
                  >
                    {error}
                  </Alert>
                )}

                {cars.length > 0 ? (
                  <Grid gutter="xl">
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
                ) : !loading && (
                  <Paper
                    radius="xl"
                    p="xl"
                    ta="center"
                  >
                    <Text size="lg" c="gray.6">
                      {t.common.noResults}
                    </Text>
                  </Paper>
                )}

                {/* Пагинация */}
                {totalPages > 1 && (
                  <Center mt="xl">
                    <Pagination
                      value={page}
                      onChange={setPage}
                      total={totalPages}
                      size="lg"
                      radius="xl"
                      color="blue"
                    />
                  </Center>
                )}
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}