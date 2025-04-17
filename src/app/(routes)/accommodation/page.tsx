'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text, Card, Image, Group, Badge, Button } from '@mantine/core';
import { IconBed, IconBath, IconUsers } from '@tabler/icons-react';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { Accommodation } from '@/types/strapi';
import { api } from '@/lib/api/strapi';

const accommodationFilters: FilterConfig[] = [
  {
    type: 'range',
    label: 'Price Range',
    key: 'price',
    min: 0,
    max: 1000,
    step: 10,
  },
  {
    type: 'select',
    label: 'Location',
    key: 'location',
    options: [
      { value: 'costa-adeje', label: 'Costa Adeje' },
      { value: 'playa-de-las-americas', label: 'Playa de las Americas' },
      { value: 'los-cristianos', label: 'Los Cristianos' },
    ],
  },
  {
    type: 'range',
    label: 'Bedrooms',
    key: 'bedrooms',
    min: 1,
    max: 5,
    step: 1,
  },
  {
    type: 'range',
    label: 'Bathrooms',
    key: 'bathrooms',
    min: 1,
    max: 4,
    step: 1,
  },
];

export default function AccommodationPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Accommodation in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            title="Filters"
            filters={accommodationFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid>
            {accommodations.map((accommodation) => (
              <Grid.Col key={accommodation.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card withBorder padding="lg" radius="md">
                  <Card.Section>
                    <Image
                      src={accommodation.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                      height={200}
                      alt={accommodation.attributes.title}
                    />
                  </Card.Section>

                  <Group justify="space-between" mt="md">
                    <Text size="lg" fw={500}>{accommodation.attributes.title}</Text>
                    <Badge size="lg">€{accommodation.attributes.price}/night</Badge>
                  </Group>

                  <Text size="sm" c="dimmed" mt="sm">
                    {accommodation.attributes.location}
                  </Text>

                  <Group mt="md" gap="xs">
                    <IconBed size={16} />
                    <Text size="sm">{accommodation.attributes.bedrooms} beds</Text>
                  </Group>

                  <Group mt="xs" gap="xs">
                    <IconBath size={16} />
                    <Text size="sm">{accommodation.attributes.bathrooms} baths</Text>
                  </Group>

                  <Group mt="xs" gap="xs">
                    <IconUsers size={16} />
                    <Text size="sm">Up to {accommodation.attributes.maxGuests} guests</Text>
                  </Group>

                  <Button fullWidth mt="xl">
                    View Details
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 