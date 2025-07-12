'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { CarTile } from '@/components/tiles/CarTile';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Car } from '@/types/strapi';
import { carFilters } from '@/config/filters';

interface CarsPageContentProps {
  cars: Car[];
}
 
export function CarsPageContent({ cars }: CarsPageContentProps) {
  const { t, locale } = useTranslation();

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <header>
        <Title order={1} mb="xl" ta="center">
          {t.sections.cars.title}
        </Title>
        <Text size="lg" mb="xl" ta="center" c="dimmed">
          {t.sections.cars.subtitle}
        </Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <AdvancedFilterPanel
            filters={carFilters}
            values={{}}
            onChange={(values) => console.log('Filters changed:', values)} 
            onClear={() => console.log('Clear filters')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {cars.length === 0 ? (
            <Text ta="center" py="xl">{t.common.noResults}</Text>
          ) : (
            <Grid>
              {cars.map((car) => (
                <Grid.Col key={car.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <CarTile
                    id={car.id}
                    title={car.title}
                    description={car.description || 'Описание отсутствует'}
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
                    currentLocale={locale}
                  />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}