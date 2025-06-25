'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { ExcursionTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { toursAPI } from '@/services/api';
import { Tour, StrapiResponse } from '@/types/strapi';

const excursionFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Price Range',
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: 'duration',
    type: 'select',
    label: 'Duration',
    options: [
      { value: '4h', label: '4 hours' },
      { value: '6h', label: '6 hours' },
      { value: '8h', label: '8 hours' },
    ],
  },
  {
    id: 'language',
    type: 'select',
    label: 'Language',
    options: [
      { value: 'RU', label: 'Russian' },
      { value: 'EN', label: 'English' },
      { value: 'ES', label: 'Spanish' },
    ],
  },
];

const mockImages = {
  data: {
    attributes: {
      url: "/placeholder.jpg",
      formats: {
        thumbnail: { url: "/placeholder-thumb.jpg" },
        small: { url: "/placeholder-small.jpg" },
        medium: { url: "/placeholder-medium.jpg" },
        large: { url: "/placeholder-large.jpg" }
      }
    }
  }
};

export default function ExcursionsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 200],
    duration: '',
    language: '',
  });
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getAll();
      console.log('API Response:', response);
      setTours(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tours');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      priceRange: [0, 200],
      duration: '',
      language: '',
    });
  };

  // Apply filters to tours
  const filteredTours = tours.filter((tour) => {
    // Price filter
    if (filters.priceRange && tour.price?.amount > filters.priceRange[1]) {
      return false;
    }

    // Duration filter
    if (filters.duration && tour.duration !== filters.duration) {
      return false;
    }

    // Language filter
    if (filters.language && tour.language !== filters.language) {
      return false;
    }

    return true;
  });

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">Excursions in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            config={excursionFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {error ? (
            <Text c="red" ta="center" py="xl">{error}</Text>
          ) : (
            <Grid>
              {filteredTours.length === 0 ? (
                <Grid.Col>
                  <Text ta="center" py="xl">No tours found</Text>
                </Grid.Col>
              ) : (
                filteredTours.map((tour) => (
                  <Grid.Col key={tour.id} span={{ base: 12, sm: 6 }}>
                    <ExcursionTile
                      title={tour.title}
                      description={tour.description}
                      image={tour.images?.[0]?.url || '/placeholder.jpg'}
                      duration={tour.duration}
                      price={`€${tour.price?.amount || 0}`}
                      language={tour.language || 'EN'}
                      onView={() => console.log('View tour:', tour.id)}
                    />
                  </Grid.Col>
                ))
              )}
            </Grid>
          )}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 