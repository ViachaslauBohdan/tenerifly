'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { ExcursionTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';

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

const mockTours = [
  {
    id: 1,
    title: "Teide National Park",
    description: "Visit Spain's highest peak and enjoy breathtaking views",
    images: [{ url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp" }],
    duration: "8 hours",
    price: { amount: 45 },
    language: 'EN' as const
  },
  {
    id: 2,
    title: "Whale Watching",
    description: "Watch whales and dolphins in their natural habitat",
    images: [{ url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif" }],
    duration: "4 hours",
    price: { amount: 35 },
    language: 'EN' as const
  },
  {
    id: 3,
    title: "Loro Parque",
    description: "Visit one of Europe's best zoological parks",
    images: [{ url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227219/G_1cf1604009.webp" }],
    duration: "6 hours",
    price: { amount: 40 },
    language: 'EN' as const
  }
];

interface ExcursionsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ExcursionsPage({ params }: ExcursionsPageProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 200],
    duration: '',
    language: '',
  });
  const [tours, setTours] = useState(mockTours);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

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

  const filteredTours = tours.filter((tour) => {
    if (filters.priceRange && tour.price?.amount > filters.priceRange[1]) {
      return false;
    }

    if (filters.duration && tour.duration !== filters.duration) {
      return false;
    }

    if (filters.language && tour.language !== filters.language) {
      return false;
    }

    return true;
  });

  if (!mounted) {
    return null;
  }

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">{t.sections.excursions.title}</Title>

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
          <Grid>
            {filteredTours.length === 0 ? (
              <Grid.Col>
                <Text ta="center" py="xl">{t.common.noResults}</Text>
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
                    onView={() => window.open(`/${currentLocale}/excursions/${tour.id}`, '_self')}
                    currentLocale={currentLocale}
                  />
                </Grid.Col>
              ))
            )}
          </Grid>
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}