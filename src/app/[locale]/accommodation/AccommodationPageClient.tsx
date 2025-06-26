'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay, Pagination, Group, Select, Box, Stack, Paper, rem, Center, Alert } from '@mantine/core';
import { IconAlertCircle, IconTrendingUp } from '@tabler/icons-react';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { propertyFilters } from '@/config/filters';

interface AccommodationPageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function AccommodationPageClient({ params }: AccommodationPageClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  // Состояние данных
  const [properties, setProperties] = useState<Property[]>([]);
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

  // Загрузка недвижимости
  const fetchProperties = async () => {
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
      
      const response = await propertiesAPI.getAll(currentLocale, apiFilters);
      
      if (response.data) {
        setProperties(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Не удалось загрузить недвижимость');
      
      // Используем мок-данные в случае ошибки
      const response = await propertiesAPI.getAll(currentLocale, {});
      setProperties(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchProperties();
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
    fetchProperties();
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
              {t.sections.accommodation.title}
            </Title>
            <Text 
              size="xl" 
              c="gray.7"
              maw={600}
              mx="auto"
              ta="center"
              fw={500}
            >
              {t.sections.accommodation.subtitle}
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
                  Найдено объектов
                </Text>
                <Text size="xl" fw={900} c="blue.6">
                  {properties.length}
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
              config={propertyFilters}
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
                      { value: 'specifications.total_area:asc', label: 'По площади (возр.)' },
                      { value: 'specifications.total_area:desc', label: 'По площади (убыв.)' },
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

                {properties.length > 0 ? (
                  <Grid gutter="xl">
                    {properties.map((property) => (
                      <Grid.Col key={property.id} span={{ base: 12, sm: 6, lg: 4 }}>
                        <PropertyTile
                          property={property}
                          onBook={(id) => console.log('Забронировать недвижимость:', id)}
                          onViewDetails={(id) => window.open(`/${currentLocale}/accommodation/${id}`, '_self')}
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