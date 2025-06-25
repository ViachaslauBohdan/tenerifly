'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Title, 
  Text, 
  LoadingOverlay, 
  Pagination, 
  Group, 
  Select,
  Box,
  Stack,
  Paper,
  rem,
  Center,
  Alert
} from '@mantine/core';
import { IconAlertCircle, IconTrendingUp } from '@tabler/icons-react';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { ExcursionTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { toursAPI } from '@/services/api';
import { Tour } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { excursionFilters } from '@/config/filters';
import { adaptStrapiPrice } from '@/utils/typeAdapters';

interface ExcursionsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ExcursionsPage({ params }: ExcursionsPageProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  // Состояние данных
  const [tours, setTours] = useState<Tour[]>([]);
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

  // Загрузка туров
  const fetchTours = async () => {
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
      
      const response = await toursAPI.getAll(currentLocale, apiFilters);
      
      if (response.data) {
        setTours(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Не удалось загрузить экскурсии');
      
      // Используем мок-данные в случае ошибки
      const response = await toursAPI.getAll(currentLocale, {});
      setTours(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchTours();
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
    fetchTours();
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
              Популярные экскурсии
            </Title>
            <Text 
              size="xl" 
              c="gray.7"
              maw={600}
              mx="auto"
              ta="center"
              fw={500}
            >
              Откройте для себя лучшие достопримечательности Тенерифе
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
                  Найдено экскурсий
                </Text>
                <Text size="xl" fw={900} c="blue.6">
                  {tours.length}
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
              config={excursionFilters}
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
                      { value: 'price:asc', label: 'По цене: по возрастанию' },
                      { value: 'price:desc', label: 'По цене: по убыванию' },
                      { value: 'duration:asc', label: 'По времени: короткие' },
                      { value: 'duration:desc', label: 'По времени: длинные' }
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

                {tours.length > 0 ? (
                  <Grid gutter="xl">
                    {tours.map((tour) => (
                      <Grid.Col 
                        key={tour.id} 
                        span={{ base: 12, sm: 6, lg: 4 }}
                      >
                        <ExcursionTile
                          title={tour.title}
                          description={tour.description}
                          image={tour.images?.[0]?.url || '/placeholder.jpg'}
                          duration={tour.duration}
                          price={tour.price ? `${tour.price.currency === 'EUR' ? '€' : '$'}${tour.price.amount}` : 'Цена не указана'}
                          language={tour.language || 'EN'}
                          onView={() => console.log('View tour:', tour.id)}
                          currentLocale={currentLocale}
                          strapiPrice={tour.price ? adaptStrapiPrice(tour.price) : null}
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
                      Экскурсии не найдены. Попробуйте изменить фильтры.
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