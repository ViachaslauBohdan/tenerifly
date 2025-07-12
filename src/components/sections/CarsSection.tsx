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
                id={car.id}
                title={car.title}
                description={car.description || 'No description available'}
                image={car.images?.[0]?.url || '/placeholder.jpg'}
                type={car.type}
                dailyPrice={car.price?.amount || 30} 
                specifications={{
                  make: car.specifications?.make || '', 
                  model: car.specifications?.model || '',
                  year: car.specifications?.year || new Date().getFullYear(),
                  fuel: car.specifications?.fuel || '',
                  transmission: car.specifications?.transmission || '',
                  seats: car.specifications?.seats || 0,
                }}
                features={{
                  air_conditioning: car.features?.air_conditioning || false,
                  navigation: car.features?.navigation || false,
                  bluetooth: car.features?.bluetooth || false,
                  backup_camera: car.features?.backup_camera || false,
                }}
                onContact={(id: number) => console.log('Связаться по автомобилю:', id)} 
                currentLocale="ru"
              />
            </article>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 