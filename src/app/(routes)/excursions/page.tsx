'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { ExcursionTile } from '@/components/tiles';
import { Excursion } from '@/types/strapi';

const excursionFilters: FilterConfig[] = [
  {
    type: 'range',
    label: 'Price Range',
    key: 'price',
    min: 0,
    max: 200,
    step: 5,
  },
  {
    type: 'select',
    label: 'Duration',
    key: 'duration',
    options: [
      { value: 'half-day', label: 'Half Day' },
      { value: 'full-day', label: 'Full Day' },
      { value: 'multi-day', label: 'Multi Day' },
    ],
  },
  {
    type: 'range',
    label: 'Group Size',
    key: 'maxGroupSize',
    min: 1,
    max: 20,
    step: 1,
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
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [excursions, setExcursions] = useState<Excursion[]>([
    {
      id: 1,
      attributes: {
        title: "Teide National Park",
        description: "Visit Spain's highest peak and enjoy breathtaking views",
        images: [mockImages],
        duration: "8 hours",
        maxGroupSize: 8,
        price: 45,
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 2,
      attributes: {
        title: "Whale Watching",
        description: "Watch whales and dolphins in their natural habitat",
        images: [mockImages],
        duration: "4 hours",
        maxGroupSize: 12,
        price: 35,
        rating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 3,
      attributes: {
        title: "Loro Parque",
        description: "Visit one of Europe's best zoological parks",
        images: [mockImages],
        duration: "6 hours",
        maxGroupSize: 15,
        price: 40,
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Excursions in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            title="Filters"
            filters={excursionFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid>
            {excursions.map((excursion) => (
              <Grid.Col key={excursion.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <ExcursionTile
                  title={excursion.attributes.title}
                  description={excursion.attributes.description}
                  image={excursion.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                  duration={excursion.attributes.duration}
                  groupSize={`Max ${excursion.attributes.maxGroupSize} people`}
                  price={`€${excursion.attributes.price}`}
                  rating={excursion.attributes.rating}
                  onBook={() => console.log('Book excursion:', excursion.id)}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 