'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { CarTile } from '@/components/tiles';
import { Car } from '@/types/strapi';

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

export default function CarsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [cars, setCars] = useState<Car[]>([
    {
      id: 1,
      attributes: {
        title: "Economy Car",
        description: "Perfect for city driving and small trips",
        images: [mockImages],
        brand: "Toyota",
        model: "Yaris",
        year: 2022,
        transmission: "Manual",
        seats: 5,
        features: "A/C, 5 Seats",
        price: 25,
        rating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 2,
      attributes: {
        title: "SUV",
        description: "Ideal for mountain trips and family travel",
        images: [mockImages],
        brand: "Volkswagen",
        model: "Tiguan",
        year: 2023,
        transmission: "Automatic",
        seats: 7,
        features: "A/C, 7 Seats, GPS",
        price: 45,
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 3,
      attributes: {
        title: "Convertible",
        description: "Enjoy the beautiful weather in style",
        images: [mockImages],
        brand: "Ford",
        model: "Mustang",
        year: 2023,
        transmission: "Automatic",
        seats: 4,
        features: "A/C, 4 Seats, GPS",
        price: 55,
        rating: 4.8,
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
                <CarTile
                  title={car.attributes.title}
                  description={car.attributes.description}
                  image={car.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                  brand={car.attributes.brand}
                  model={car.attributes.model}
                  year={car.attributes.year}
                  transmission={car.attributes.transmission}
                  seats={car.attributes.seats}
                  features={car.attributes.features}
                  price={`€${car.attributes.price}`}
                  rating={car.attributes.rating}
                  onRent={() => console.log('Rent car:', car.id)}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 