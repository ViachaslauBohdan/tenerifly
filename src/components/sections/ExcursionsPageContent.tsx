'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterConfig } from '@/components/filters/FilterPanel';
import { FiltersSection } from '@/components/filters/FiltersSection';
import { ExcursionsGrid } from '@/components/sections/ExcursionsGrid';
import { BackToHome } from '@/components/BackToHome';
import { Tour } from '@/types/strapi';

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

interface ExcursionsPageContentProps {
  tours: Tour[];
}

export function ExcursionsPageContent({ tours }: ExcursionsPageContentProps) {
  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <header>
        <Title order={1} mb="xl">Excursions in Tenerife</Title>
        <Text size="lg" mb="xl">
          Discover the best of Tenerife with our guided tours. From volcanic landscapes to marine life, experience the island&apos;s unique beauty.
        </Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FiltersSection
            config={excursionFilters}
            initialValues={{
              priceRange: [0, 200],
              duration: '',
              language: '',
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <ExcursionsGrid tours={tours} />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 