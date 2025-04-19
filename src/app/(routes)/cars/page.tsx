'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { CarTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi';

const carFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Price Range',
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: 'type',
    type: 'select',
    label: 'Type',
    options: [
      { value: 'rent', label: 'For Rent' },
      { value: 'sale', label: 'For Sale' },
    ],
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'available', label: 'Available' },
      { value: 'reserved', label: 'Reserved' },
      { value: 'sold', label: 'Sold' },
      { value: 'maintenance', label: 'Maintenance' },
    ],
  },
];

export default function CarsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 200],
    type: '',
    status: '',
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carsAPI.getAll();
      console.log('API Response:', response);
      setCars(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      priceRange: [0, 200],
      type: '',
      status: '',
    });
  };

  // Apply filters to cars
  const filteredCars = cars.filter((car) => {
    // Price filter
    if (filters.priceRange && car.price?.amount > filters.priceRange[1]) {
      return false;
    }

    // Type filter
    if (filters.type && car.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status && car.car_status !== filters.status) {
      return false;
    }

    return true;
  });

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">Cars in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            config={carFilters}
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
              {filteredCars.length === 0 ? (
                <Grid.Col>
                  <Text ta="center" py="xl">No cars found</Text>
                </Grid.Col>
              ) : (
                filteredCars.map((car) => (
                  <Grid.Col key={car.id} span={{ base: 12, sm: 6 }}>
                    <CarTile
                      title={car.title}
                      description={car.description || 'No description available'}
                      image={car.images?.[0]?.url || '/placeholder.jpg'}
                      type={car.type}
                      status={car.car_status}
                      price={`€${car.price?.amount || 0}${car.price?.period === 'day' ? '/day' : ''}`}
                      specifications={{
                        brand: car.specifications?.make || 'Unknown',
                        model: car.specifications?.model || 'Unknown',
                        year: car.specifications?.year || 0,
                        fuel_type: car.specifications?.fuel || 'Unknown',
                        transmission: car.specifications?.transmission || 'Unknown',
                        seats: car.specifications?.seats || 0,
                      }}
                      onView={() => console.log('View car:', car.id)}
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