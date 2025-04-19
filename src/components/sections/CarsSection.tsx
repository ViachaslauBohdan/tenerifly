'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { CarTile } from '@/components/tiles/CarTile';
import { Car } from '@/types/strapi';

interface CarsSectionProps {
  cars: Car[];
}

export function CarsSection({ cars }: CarsSectionProps) {
  return (
    <Container size="xl" py="xl">
      <header>
        <Title order={2} mb="xl">Featured Cars</Title>
        <Text size="lg" mb="xl">
          Discover our selection of premium cars in Tenerife. From compact cars to luxury vehicles, find your perfect ride.
        </Text>
      </header>

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
    </Container>
  );
} 