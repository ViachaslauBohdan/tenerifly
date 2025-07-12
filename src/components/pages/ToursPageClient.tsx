'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay, Pagination, Group, Select, Box, Stack, Paper, rem, Center, Alert } from '@mantine/core';
import { IconAlertCircle, IconMapPin } from '@tabler/icons-react';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { TourTile } from '@/components/tiles/TourTile';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { toursAPI } from '@/services/api';
import { Tour } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { tourFilters } from '@/config/filters';

interface ToursPageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function ToursPageClient({ params }: ToursPageClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt:desc');
  
  const itemsPerPage = 9;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    params.then((resolvedParams) => {
      setCurrentLocale(resolvedParams.locale);
    });
  }, [params]);

  const buildApiFilters = useCallback((filters: Record<string, any>) => {
    const apiFilters: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      
      if (key.includes('.')) {
        const [parent, field] = key.split('.');
        if (!apiFilters[parent]) apiFilters[parent] = {};
        apiFilters[parent][field] = value;
      } else if (Array.isArray(value) && value.length === 2) {
        apiFilters[key] = {
          $gte: value[0],
          $lte: value[1]
        };
      } else if (Array.isArray(value)) {
        apiFilters[key] = { $in: value };
      } else if (typeof value === 'boolean') {
        apiFilters[key] = value;
      } else {
        apiFilters[key] = value;
      }
    });
    
    return apiFilters;
  }, []);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = buildApiFilters(filters);
      const response = await toursAPI.getAll(currentLocale, apiFilters);
      
      if (response?.data) {
        let sortedTours = [...response.data];
        
        if (sortBy === 'createdAt:desc') {
          sortedTours.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'createdAt:asc') {
          sortedTours.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (sortBy === 'price.amount:asc') {
          sortedTours.sort((a, b) => a.price.amount - b.price.amount);
        } else if (sortBy === 'price.amount:desc') {
          sortedTours.sort((a, b) => b.price.amount - a.price.amount);
        } else if (sortBy === 'rating:desc') {
          sortedTours.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        }
        
        const totalCount = sortedTours.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTours = sortedTours.slice(startIndex, endIndex);
        
        setTours(paginatedTours);
        setTotalItems(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setTours([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Ошибка загрузки экскурсий:', err);
      setError('Не удалось загрузить экскурсии. Попробуйте еще раз.');
      setTours([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy, currentLocale, buildApiFilters]);

  useEffect(() => {
    if (mounted && currentLocale) {
      fetchTours();
    }
  }, [mounted, currentLocale, fetchTours]);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: string | null) => {
    if (value) {
      setSortBy(value);
      setPage(1);
    }
  }, []);

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Сначала новые' },
    { value: 'createdAt:asc', label: 'Сначала старые' },
    { value: 'price.amount:asc', label: 'Цена по возрастанию' },
    { value: 'price.amount:desc', label: 'Цена по убыванию' },
    { value: 'rating:desc', label: 'По рейтингу' }
  ];

  if (!mounted) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box className="gradient-bg-page">
      <Container size="xl" py="xl">
        <BackToHome />
        
        <Stack gap="xl" mb="xl">
          <Box ta="center">
            <Title 
              order={1} 
              size={rem(48)}
              fw={900}
              className="gradient-text"
              mb="md"
            >
              Экскурсии на Тенерифе
            </Title>
            <Text 
              size="xl" 
              c="gray.7"
              maw={600}
              mx="auto"
              ta="center"
              fw={500}
            >
              Откройте для себя удивительные места острова с нашими экскурсиями
            </Text>
          </Box>

          <Paper radius="xl" p="xl">
            <Group justify="center" gap="xl">
              <Stack gap="xs" align="center">
                <Text size="xs" tt="uppercase" fw={700} c="gray.6">
                  Найдено экскурсий
                </Text>
                <Text size="xl" fw={900} c="blue.6">
                  {totalItems}
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
              <Stack gap="xs" align="center">
                <Text size="xs" tt="uppercase" fw={700} c="gray.6">
                  <IconMapPin size={16} style={{ display: 'inline', marginRight: 4 }} />
                  Для детей
                </Text>
                <Text size="xl" fw={900} c="green.6">
                  {tours.filter(tour => tour.suitable_for_children).length}
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Stack>

        <Stack gap="md" mb="xl">
          <Group justify="space-between" align="flex-end">
            <Box flex={1}>
              <AdvancedFilterPanel
                filters={tourFilters}
                values={filters}
                onChange={handleFiltersChange}
                onClear={handleClearFilters}
              />
            </Box>
            <Select
              placeholder="Сортировка"
              data={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              w={250}
            />
          </Group>
        </Stack>

        {loading ? (
          <Center h={400}>
            <LoadingOverlay visible />
          </Center>
        ) : error ? (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Ошибка загрузки" 
            color="red"
            mb="md"
          >
            {error}
          </Alert>
        ) : tours.length === 0 ? (
          <Center h={400}>
            <Stack align="center" gap="md">
              <IconMapPin size={64} color="gray" />
              <Text size="xl" c="gray.6" ta="center">
                Экскурсии не найдены
              </Text>
              <Text c="gray.5" ta="center">
                Попробуйте изменить параметры поиска
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <Grid>
              {tours.map((tour) => (
                <Grid.Col key={tour.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <TourTile
                    id={tour.id}
                    title={tour.title}
                    description={tour.description || tour.short_description || ''}
                    image={tour.images?.[0]?.url || '/placeholder.jpg'}
                    duration={tour.duration}
                    groupSize={`Макс ${tour.max_participants || 20} человек`}
                    price={`€${tour.price?.amount || 0}`}
                    rating={tour.rating || 5.0}
                    difficulty={tour.difficulty_level || 'easy'}
                    includes={{
                      transport: tour.includes_transport || false,
                      food: tour.includes_food || false,
                      tickets: tour.includes_tickets || false,
                    }}
                    suitable_for_children={tour.suitable_for_children || false}
                    onContact={(id: number) => console.log('Связаться по экскурсии:', id)}
                    currentLocale={currentLocale}
                  />
                </Grid.Col>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  size="md"
                />
              </Group>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}