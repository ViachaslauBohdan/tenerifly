'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text, Card, Image, Group, Badge, Button } from '@mantine/core';
import { IconCar, IconUsers, IconManualGearbox } from '@tabler/icons-react';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { Car } from '@/types/strapi';
import { api } from '@/lib/api/strapi';

const carFilters: FilterConfig[] = [
  {
    type: 'range',
    label: 'Price Range',
    key: 'price',
    min: 0,
    max: 100,
    step: 5,
  },
  {
    type: 'select',
    label: 'Transmission',
    key: 'transmission',
    options: [
      { value: 'automatic', label: 'Automatic' },
      { value: 'manual', label: 'Manual' },
    ],
  },
  {
    type: 'range',
    label: 'Seats',
    key: 'seats',
    min: 2,
    max: 9,
    step: 1,
  },
  {
    type: 'select',
    label: 'Brand',
    key: 'brand',
    options: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'volkswagen', label: 'Volkswagen' },
      { value: 'ford', label: 'Ford' },
      { value: 'renault', label: 'Renault' },
      { value: 'seat', label: 'SEAT' },
    ],
  },
];

export default function CarsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Car Rental in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            title="Filters"
            filters={carFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid>
            {cars.map((car) => (
              <Grid.Col key={car.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card withBorder padding="lg" radius="md">
                  <Card.Section>
                    <Image
                      src={car.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                      height={200}
                      alt={car.attributes.title}
                    />
                  </Card.Section>

                  <Group justify="space-between" mt="md">
                    <Text size="lg" fw={500}>{car.attributes.title}</Text>
                    <Badge size="lg">€{car.attributes.price}/day</Badge>
                  </Group>

                  <Text size="sm" c="dimmed" mt="sm">
                    {car.attributes.brand} {car.attributes.model} ({car.attributes.year})
                  </Text>

                  <Group mt="md" gap="xs">
                    <IconCar size={16} />
                    <Text size="sm">{car.attributes.brand} {car.attributes.model}</Text>
                  </Group>

                  <Group mt="xs" gap="xs">
                    <IconUsers size={16} />
                    <Text size="sm">{car.attributes.seats} seats</Text>
                  </Group>

                  <Group mt="xs" gap="xs">
                    <IconManualGearbox size={16} />
                    <Text size="sm">{car.attributes.transmission}</Text>
                  </Group>

                  <Button fullWidth mt="xl">
                    Rent Now
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