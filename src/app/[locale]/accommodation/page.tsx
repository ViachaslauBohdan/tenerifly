'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay, Pagination, Group, Select } from '@mantine/core';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { propertyFilters } from '@/config/filters';

interface AccommodationPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AccommodationPage({ params }: AccommodationPageProps) {
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
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Title order={1} mb="xl">{t.sections.accommodation.title}</Title>
      <Text size="lg" mb="xl" c="dimmed">
        {t.sections.accommodation.subtitle}
      </Text>

      <Grid>
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
        
        <Grid.Col span={{ base: 12, md: 9 }}>
          {/* Сортировка и результаты */}
          <Group justify="space-between" mb="md">
            <Text size="sm" c="dimmed">
              Найдено объектов: {properties.length}
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
                { value: 'specifications.total_area:asc', label: 'По площади (возр.)' },
                { value: 'specifications.total_area:desc', label: 'По площади (убыв.)' },
                { value: 'title:asc', label: 'По названию А-Я' },
              ]}
              w={200}
            />
          </Group>

          {error && (
            <Text c="red" ta="center" py="xl">{error}</Text>
          )}

          <div style={{ position: 'relative', minHeight: '200px' }}>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            
            {properties.length === 0 && !loading ? (
              <Text ta="center" py="xl" size="lg" c="dimmed">
                {t.common.noResults}
              </Text>
            ) : (
              <Grid>
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