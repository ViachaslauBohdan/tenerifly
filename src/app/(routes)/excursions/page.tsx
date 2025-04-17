'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text, Card, Image, Group, Badge, Button } from '@mantine/core';
import { IconClock, IconUsers, IconCurrencyEuro } from '@tabler/icons-react';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { Excursion } from '@/types/strapi';
import { api } from '@/lib/api/strapi';

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

export default function ExcursionsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

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
                <Card withBorder padding="lg" radius="md">
                  <Card.Section>
                    <Image
                      src={excursion.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                      height={200}
                      alt={excursion.attributes.title}
                    />
                  </Card.Section>

                  <Group justify="space-between" mt="md">
                    <Text size="lg" fw={500}>{excursion.attributes.title}</Text>
                    <Badge size="lg">€{excursion.attributes.price}</Badge>
                  </Group>

                  <Text size="sm" c="dimmed" mt="sm" lineClamp={2}>
                    {excursion.attributes.description}
                  </Text>

                  <Group mt="md" gap="xs">
                    <IconClock size={16} />
                    <Text size="sm">{excursion.attributes.duration}</Text>
                  </Group>

                  <Group mt="xs" gap="xs">
                    <IconUsers size={16} />
                    <Text size="sm">Max {excursion.attributes.maxGroupSize} people</Text>
                  </Group>

                  <Button fullWidth mt="xl">
                    Book Now
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