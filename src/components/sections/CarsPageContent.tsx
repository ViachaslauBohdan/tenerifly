'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterConfig } from '@/components/filters/FilterPanel';
import { FiltersSection } from '@/components/filters/FiltersSection';
import { CarTile } from '@/components/tiles/CarTile';
import { BackToHome } from '@/components/BackToHome';
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

interface CarsPageContentProps {
  cars: Car[];
}

export function CarsPageContent({ cars }: CarsPageContentProps) {
  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <header>
        <Title order={1} mb="xl">Cars in Tenerife</Title>
        <Text size="lg" mb="xl">
          Find the perfect vehicle for your Tenerife adventure. From compact cars to luxury SUVs, we have a wide selection to choose from.
        </Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FiltersSection
            config={carFilters}
            initialValues={{
              priceRange: [0, 200],
              type: '',
              status: '',
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {cars.length === 0 ? (
            <Text ta="center" py="xl">No cars found</Text>
          ) : (
            <section aria-label="Car listings">
              <Grid>
                {cars.map((car) => (
                  <Grid.Col key={car.id} span={{ base: 12, sm: 6 }}>
                    <article>
                      <CarTile
                        title={car.title}
                        description={car.description || 'No description available'}
                        image={car.images?.[0]?.url || '/placeholder.jpg'}
                        type={car.type}
                        status={car.car_status}
                        price={`€${car.price?.amount || 0}${car.price?.period === 'day' ? '/day' : ''}`}
                        specifications={{
                          brand: car.specifications?.make || '',
                          model: car.specifications?.model || '',
                          year: car.specifications?.year || new Date().getFullYear(),
                          fuel_type: car.specifications?.fuel || '',
                          transmission: car.specifications?.transmission || '',
                          seats: car.specifications?.seats || 0,
                        }}
                        onView={() => console.log('View car:', car.id)}
                      />
                    </article>
                  </Grid.Col>
                ))}
              </Grid>
            </section>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
} 